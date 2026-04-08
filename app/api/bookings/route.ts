import { NextRequest, NextResponse } from "next/server";
import { parseISO } from "date-fns";
import { prisma } from "@/lib/db";
import { bookingFormSchema } from "@/lib/validators/booking";
import { generateReference, getMealPeriod } from "@/lib/booking-utils";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = bookingFormSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid booking data", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const mealPeriod = getMealPeriod(data.time);

    // Generate unique reference
    let reference = generateReference();
    let exists = await prisma.booking.findUnique({ where: { reference } });
    while (exists) {
      reference = generateReference();
      exists = await prisma.booking.findUnique({ where: { reference } });
    }

    const booking = await prisma.booking.create({
      data: {
        reference,
        date: parseISO(data.date),
        time: data.time,
        mealPeriod,
        partySize: data.partySize,
        guestName: data.guestName,
        guestEmail: data.guestEmail,
        guestPhone: data.guestPhone.replace(/\s/g, ""),
        specialRequests: data.specialRequests || null,
        sectionPreference: data.sectionPreference,
        childrenCount: data.childrenCount,
      },
    });

    // Send confirmation email (async, don't block response)
    sendConfirmationEmail(booking).catch(console.error);

    return NextResponse.json({
      reference: booking.reference,
      id: booking.id,
    });
  } catch (error) {
    console.error("Booking creation error:", error);
    return NextResponse.json(
      { error: "Failed to create booking" },
      { status: 500 }
    );
  }
}

async function sendConfirmationEmail(booking: {
  id: string;
  reference: string;
  guestName: string;
  guestEmail: string;
  date: Date;
  time: string;
  partySize: number;
  cancelToken: string;
  mealPeriod: string;
  sectionPreference: string;
  specialRequests: string | null;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey || apiKey.startsWith("re_[")) return; // Skip if not configured

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const cancelUrl = `${appUrl}/book/cancel/${booking.cancelToken}`;

  const { formatDate, formatTime, MEAL_PERIOD_LABELS } = await import(
    "@/lib/booking-utils"
  );

  try {
    const { Resend } = await import("resend");
    const resend = new Resend(apiKey);

    await resend.emails.send({
      from: process.env.EMAIL_FROM || "Tres Jolie <noreply@tresjolie.co.za>",
      to: booking.guestEmail,
      subject: `Booking Confirmed — ${booking.reference}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #2d5a27;">Booking Confirmed</h1>
          <p>Hi ${booking.guestName},</p>
          <p>Your table at <strong>Tres Jolie</strong> has been reserved!</p>

          <div style="background: #f8f5f0; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 4px 0;"><strong>Reference:</strong> ${booking.reference}</p>
            <p style="margin: 4px 0;"><strong>Date:</strong> ${formatDate(booking.date)}</p>
            <p style="margin: 4px 0;"><strong>Time:</strong> ${formatTime(booking.time)} (${MEAL_PERIOD_LABELS[booking.mealPeriod as keyof typeof MEAL_PERIOD_LABELS] || booking.mealPeriod})</p>
            <p style="margin: 4px 0;"><strong>Guests:</strong> ${booking.partySize}</p>
            ${booking.specialRequests ? `<p style="margin: 4px 0;"><strong>Special Requests:</strong> ${booking.specialRequests}</p>` : ""}
          </div>

          <p><strong>Location:</strong> Plot 22 Peter Road, Ruimsig, Johannesburg<br/>
          <a href="https://maps.google.com/?q=Tres+Jolie+Restaurant+Ruimsig">View on Google Maps</a></p>

          <p>Need to cancel? <a href="${cancelUrl}">Click here to cancel your booking</a></p>

          <p>Questions? Call us at <a href="tel:+27117942473">011 794 2473</a> or email <a href="mailto:info@tresjolie.co.za">info@tresjolie.co.za</a></p>

          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="color: #888; font-size: 12px;">Tres Jolie Restaurant & Country Venue, Ruimsig, Johannesburg</p>
        </div>
      `,
    });

    // Log notification
    await prisma.notificationLog.create({
      data: {
        bookingId: booking.id,
        type: "CONFIRMATION",
        status: "SENT",
      },
    });
  } catch (error) {
    console.error("Failed to send confirmation email:", error);
    await prisma.notificationLog.create({
      data: {
        bookingId: booking.id,
        type: "CONFIRMATION",
        status: "FAILED",
      },
    });
  }

  // Send admin notification
  const adminEmail = process.env.ADMIN_EMAIL;
  if (adminEmail && apiKey && !apiKey.startsWith("re_[")) {
    try {
      const { Resend } = await import("resend");
      const resend = new Resend(apiKey);

      await resend.emails.send({
        from: process.env.EMAIL_FROM || "Tres Jolie <noreply@tresjolie.co.za>",
        to: adminEmail,
        subject: `New Booking: ${booking.guestName} — ${booking.reference}`,
        html: `
          <div style="font-family: sans-serif;">
            <h2>New Booking Received</h2>
            <p><strong>${booking.guestName}</strong> booked for <strong>${booking.partySize}</strong> on <strong>${formatDate(booking.date)}</strong> at <strong>${formatTime(booking.time)}</strong></p>
            <p>Reference: ${booking.reference}</p>
            <p><a href="${appUrl}/admin/bookings">View in Admin</a></p>
          </div>
        `,
      });
    } catch (error) {
      console.error("Failed to send admin notification:", error);
    }
  }
}
