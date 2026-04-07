import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { BookingStatus } from "@/generated/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const booking = await prisma.booking.findUnique({
    where: { id },
    include: { notifications: true },
  });

  if (!booking) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(booking);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();

  const validStatuses = Object.values(BookingStatus);
  if (body.status && !validStatuses.includes(body.status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const updated = await prisma.booking.update({
    where: { id },
    data: {
      ...(body.status && { status: body.status }),
      ...(body.adminNotes !== undefined && { adminNotes: body.adminNotes }),
    },
  });

  return NextResponse.json(updated);
}
