import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const [hours, closures] = await Promise.all([
    prisma.operatingHours.findMany({
      orderBy: [{ dayOfWeek: "asc" }, { mealPeriod: "asc" }],
    }),
    prisma.specialClosure.findMany({
      orderBy: { date: "asc" },
    }),
  ]);

  return NextResponse.json({ hours, closures });
}

export async function PUT(request: NextRequest) {
  const { hours } = await request.json();

  // Upsert each operating hour
  for (const h of hours) {
    if (h.id) {
      await prisma.operatingHours.update({
        where: { id: h.id },
        data: {
          openTime: h.openTime,
          closeTime: h.closeTime,
          maxCovers: h.maxCovers,
          isActive: h.isActive ?? true,
        },
      });
    } else {
      await prisma.operatingHours.create({
        data: {
          dayOfWeek: h.dayOfWeek,
          mealPeriod: h.mealPeriod,
          openTime: h.openTime,
          closeTime: h.closeTime,
          maxCovers: h.maxCovers,
          isActive: h.isActive ?? true,
        },
      });
    }
  }

  return NextResponse.json({ success: true });
}

export async function POST(request: NextRequest) {
  const { closure } = await request.json();

  const created = await prisma.specialClosure.create({
    data: {
      date: new Date(closure.date),
      reason: closure.reason || null,
    },
  });

  return NextResponse.json({ id: created.id });
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const closureId = searchParams.get("closureId");

  if (!closureId) {
    return NextResponse.json({ error: "Missing closureId" }, { status: 400 });
  }

  await prisma.specialClosure.delete({ where: { id: closureId } });

  return NextResponse.json({ success: true });
}
