import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;

    const booking = await prisma.booking.findUnique({
      where: { cancelToken: token },
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    if (booking.status === "CANCELLED") {
      return NextResponse.json({ error: "Already cancelled" }, { status: 400 });
    }

    await prisma.booking.update({
      where: { id: booking.id },
      data: { status: "CANCELLED" },
    });

    // Send cancellation email
    sendCancellationEmail(booking).catch(console.error);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("POST /api/bookings/cancel error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Failed to cancel booking", message },
      { status: 500 }
    );
  }
}

async function sendCancellationEmail(booking: {
  id: string;
  reference: string;
  guestName: string;
  guestEmail: string;
  date: Date;
  time: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey || apiKey.startsWith("re_[")) return;

  const { formatDate, formatTime } = await import("@/lib/booking-utils");
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  try {
    const { Resend } = await import("resend");
    const resend = new Resend(apiKey);

    await resend.emails.send({
      from: process.env.EMAIL_FROM || "Tres Jolie <admin@accesshealthcare.co.zw>",
      to: booking.guestEmail,
      subject: `Booking Cancelled — ${booking.reference}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #c44;">Booking Cancelled</h1>
          <p>Hi ${booking.guestName},</p>
          <p>Your booking at Tres Jolie has been cancelled.</p>

          <div style="background: #f8f5f0; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 4px 0;"><strong>Reference:</strong> ${booking.reference}</p>
            <p style="margin: 4px 0;"><strong>Date:</strong> ${formatDate(booking.date)}</p>
            <p style="margin: 4px 0;"><strong>Time:</strong> ${formatTime(booking.time)}</p>
          </div>

          <p>Changed your mind? <a href="${appUrl}/book">Book a new table</a></p>

          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="color: #888; font-size: 12px;">Tres Jolie Restaurant & Country Venue</p>
        </div>
      `,
    });

    await prisma.notificationLog.create({
      data: {
        bookingId: booking.id,
        type: "CANCELLATION",
        status: "SENT",
      },
    });
  } catch (error) {
    console.error("Failed to send cancellation email:", error);
    await prisma.notificationLog.create({
      data: {
        bookingId: booking.id,
        type: "CANCELLATION",
        status: "FAILED",
      },
    });
  }
}
