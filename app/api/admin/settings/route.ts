import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { defaultHours } from "@/lib/default-hours";

export async function GET() {
  try {
    const [hours, closures] = await Promise.all([
      prisma.operatingHours.findMany({
        orderBy: [{ dayOfWeek: "asc" }, { mealPeriod: "asc" }],
      }),
      prisma.specialClosure.findMany({
        orderBy: { date: "asc" },
      }),
    ]);

    return NextResponse.json({ hours, closures });
  } catch (error) {
    console.error("GET /api/admin/settings error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Failed to fetch settings", message },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
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
  } catch (error) {
    console.error("PUT /api/admin/settings error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Failed to update operating hours", message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (body.type === "seedDefaults") {
      const results = [];
      for (const h of defaultHours) {
        const upserted = await prisma.operatingHours.upsert({
          where: {
            dayOfWeek_mealPeriod: {
              dayOfWeek: h.dayOfWeek,
              mealPeriod: h.mealPeriod,
            },
          },
          update: {
            openTime: h.openTime,
            closeTime: h.closeTime,
            maxCovers: h.maxCovers,
            isActive: true,
          },
          create: {
            dayOfWeek: h.dayOfWeek,
            mealPeriod: h.mealPeriod,
            openTime: h.openTime,
            closeTime: h.closeTime,
            maxCovers: h.maxCovers,
            isActive: true,
          },
        });
        results.push(upserted);
      }
      return NextResponse.json({ hours: results });
    }

    if (body.type === "operatingHour") {
      const created = await prisma.operatingHours.create({
        data: {
          dayOfWeek: body.dayOfWeek,
          mealPeriod: body.mealPeriod,
          openTime: body.openTime,
          closeTime: body.closeTime,
          maxCovers: body.maxCovers,
          isActive: true,
        },
      });
      return NextResponse.json(created);
    }

    // Default: create closure
    const closure = body.closure;
    const created = await prisma.specialClosure.create({
      data: {
        date: new Date(closure.date),
        reason: closure.reason || null,
        isRecurring: closure.isRecurring || false,
        recurrenceFrequency: closure.recurrenceFrequency || null,
      },
    });

    return NextResponse.json({ id: created.id });
  } catch (error) {
    console.error("POST /api/admin/settings error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Failed to create setting", message },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");

    if (type === "operatingHour") {
      const id = searchParams.get("id");
      if (!id) {
        return NextResponse.json({ error: "Missing id" }, { status: 400 });
      }
      await prisma.operatingHours.delete({ where: { id } });
      return NextResponse.json({ success: true });
    }

    // Default: delete closure
    const closureId = searchParams.get("closureId");
    if (!closureId) {
      return NextResponse.json(
        { error: "Missing closureId" },
        { status: 400 }
      );
    }

    await prisma.specialClosure.delete({ where: { id: closureId } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/admin/settings error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Failed to delete setting", message },
      { status: 500 }
    );
  }
}
