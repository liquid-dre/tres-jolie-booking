import { NextRequest, NextResponse } from "next/server";
import { parseISO } from "date-fns";
import { prisma } from "@/lib/db";
import { getDayOfWeek, getMealPeriod } from "@/lib/booking-utils";
import { BookingStatus } from "@prisma/client";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date");
  const partySize = parseInt(searchParams.get("partySize") || "2", 10);

  if (!date) {
    return NextResponse.json({ error: "Date is required" }, { status: 400 });
  }

  const bookingDate = parseISO(date);
  const dayOfWeek = getDayOfWeek(bookingDate);

  // Get operating hours for this day
  const operatingHours = await prisma.operatingHours.findMany({
    where: { dayOfWeek, isActive: true },
    orderBy: { openTime: "asc" },
  });

  if (operatingHours.length === 0) {
    return NextResponse.json({ slots: [] });
  }

  // Check for special closure
  const closure = await prisma.specialClosure.findFirst({
    where: {
      date: bookingDate,
    },
  });

  if (closure) {
    return NextResponse.json({ slots: [], closed: true, reason: closure.reason });
  }

  // Get existing bookings for this date (only confirmed/waitlisted)
  const existingBookings = await prisma.booking.findMany({
    where: {
      date: bookingDate,
      status: { in: [BookingStatus.CONFIRMED, BookingStatus.WAITLISTED] },
    },
    select: { time: true, partySize: true, mealPeriod: true },
  });

  // Generate 30-minute time slots for each meal period
  const slots = [];

  for (const hours of operatingHours) {
    const [openH, openM] = hours.openTime.split(":").map(Number);
    const [closeH, closeM] = hours.closeTime.split(":").map(Number);
    const openMinutes = openH * 60 + openM;
    // Last booking slot is 1 hour before close
    const closeMinutes = closeH * 60 + closeM - 60;

    for (let mins = openMinutes; mins <= closeMinutes; mins += 30) {
      const h = Math.floor(mins / 60);
      const m = mins % 60;
      const time = `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
      const mealPeriod = getMealPeriod(time);

      // Calculate booked covers for this time slot (within 1.5 hour window)
      const bookedCovers = existingBookings
        .filter((b) => {
          const [bh, bm] = b.time.split(":").map(Number);
          const bMins = bh * 60 + bm;
          const slotMins = h * 60 + m;
          return Math.abs(bMins - slotMins) < 90; // overlapping within 1.5hrs
        })
        .reduce((sum, b) => sum + b.partySize, 0);

      const remainingCapacity = hours.maxCovers - bookedCovers;

      slots.push({
        time,
        mealPeriod: mealPeriod.toString(),
        available: remainingCapacity >= partySize,
        remainingCapacity: Math.max(0, remainingCapacity),
      });
    }
  }

  return NextResponse.json({ slots });
}
