import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { formatDate, formatTime } from "@/lib/booking-utils";

export async function POST(request: NextRequest) {
  // Verify cron secret (for Vercel Cron or external cron services)
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);

  const dayAfter = new Date(tomorrow);
  dayAfter.setDate(dayAfter.getDate() + 1);

  // Find confirmed bookings for tomorrow that haven't received a reminder
  const bookings = await prisma.booking.findMany({
    where: {
      date: { gte: tomorrow, lt: dayAfter },
      status: "CONFIRMED",
      notifications: {
        none: { type: "REMINDER" },
      },
    },
  });

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey || apiKey.startsWith("re_[")) {
    return NextResponse.json({
      message: "Resend not configured",
      pending: bookings.length,
    });
  }

  const { Resend } = await import("resend");
  const resend = new Resend(apiKey);
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  let sent = 0;
  let failed = 0;

  for (const booking of bookings) {
    const cancelUrl = `${appUrl}/book/cancel/${booking.cancelToken}`;

    try {
      await resend.emails.send({
        from: process.env.EMAIL_FROM || "Tres Jolie <admin@accesshealthcare.co.zw>",
        to: booking.guestEmail,
        subject: `Reminder: Your table tomorrow at Tres Jolie — ${booking.reference}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #2d5a27;">Booking Reminder</h1>
            <p>Hi ${booking.guestName},</p>
            <p>This is a friendly reminder that you have a table booked at <strong>Tres Jolie</strong> tomorrow.</p>

            <div style="background: #f8f5f0; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 4px 0;"><strong>Reference:</strong> ${booking.reference}</p>
              <p style="margin: 4px 0;"><strong>Date:</strong> ${formatDate(booking.date)}</p>
              <p style="margin: 4px 0;"><strong>Time:</strong> ${formatTime(booking.time)}</p>
              <p style="margin: 4px 0;"><strong>Guests:</strong> ${booking.partySize}</p>
            </div>

            <p><strong>Location:</strong> Plot 22 Peter Road, Ruimsig, Johannesburg<br/>
            <a href="https://maps.google.com/?q=Tres+Jolie+Restaurant+Ruimsig">View on Google Maps</a></p>

            <p>Can't make it? <a href="${cancelUrl}">Cancel your booking</a></p>

            <p>We look forward to seeing you!</p>

            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
            <p style="color: #888; font-size: 12px;">Tres Jolie Restaurant & Country Venue</p>
          </div>
        `,
      });

      await prisma.notificationLog.create({
        data: {
          bookingId: booking.id,
          type: "REMINDER",
          status: "SENT",
        },
      });
      sent++;
    } catch (error) {
      console.error(`Failed to send reminder to ${booking.guestEmail}:`, error);
      await prisma.notificationLog.create({
        data: {
          bookingId: booking.id,
          type: "REMINDER",
          status: "FAILED",
        },
      });
      failed++;
    }
  }

  return NextResponse.json({ sent, failed, total: bookings.length });
}
