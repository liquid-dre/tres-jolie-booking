import { prisma } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatTime, MEAL_PERIOD_LABELS } from "@/lib/booking-utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function CalendarPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string; year?: string; day?: string }>;
}) {
  const params = await searchParams;

  const now = new Date();
  const year = parseInt(params.year || String(now.getFullYear()));
  const month = parseInt(params.month || String(now.getMonth() + 1));

  // Get first and last day of month
  const firstDay = new Date(year, month - 1, 1);
  const lastDay = new Date(year, month, 0);

  // Get bookings for the month
  const bookings = await prisma.booking.findMany({
    where: {
      date: { gte: firstDay, lte: lastDay },
      status: { in: ["CONFIRMED", "WAITLISTED"] },
    },
    select: {
      id: true,
      date: true,
      time: true,
      partySize: true,
      guestName: true,
      reference: true,
      mealPeriod: true,
    },
    orderBy: { time: "asc" },
  });

  // Group bookings by day
  const byDay: Record<number, typeof bookings> = {};
  bookings.forEach((b) => {
    const day = b.date.getDate();
    if (!byDay[day]) byDay[day] = [];
    byDay[day].push(b);
  });

  // Calendar grid
  const startDow = (firstDay.getDay() + 6) % 7; // Monday = 0
  const daysInMonth = lastDay.getDate();
  const weeks: (number | null)[][] = [];
  let week: (number | null)[] = Array(startDow).fill(null);

  for (let d = 1; d <= daysInMonth; d++) {
    week.push(d);
    if (week.length === 7) {
      weeks.push(week);
      week = [];
    }
  }
  if (week.length > 0) {
    while (week.length < 7) week.push(null);
    weeks.push(week);
  }

  const prevMonth = month === 1 ? 12 : month - 1;
  const prevYear = month === 1 ? year - 1 : year;
  const nextMonth = month === 12 ? 1 : month + 1;
  const nextYear = month === 12 ? year + 1 : year;

  const monthName = firstDay.toLocaleDateString("en-ZA", {
    month: "long",
    year: "numeric",
  });

  const selectedDay = params.day ? parseInt(params.day) : null;
  const selectedBookings = selectedDay ? byDay[selectedDay] || [] : [];

  const mealColors: Record<string, string> = {
    BREAKFAST: "bg-amber-400",
    LUNCH: "bg-green-400",
    DINNER: "bg-indigo-400",
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Calendar</h1>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <Button variant="outline" size="sm" asChild>
              <Link href={`/admin/calendar?year=${prevYear}&month=${prevMonth}`}>
                <ChevronLeft className="h-4 w-4" />
              </Link>
            </Button>
            <CardTitle>{monthName}</CardTitle>
            <Button variant="outline" size="sm" asChild>
              <Link href={`/admin/calendar?year=${nextYear}&month=${nextMonth}`}>
                <ChevronRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-px overflow-hidden rounded-lg border bg-border">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
              <div
                key={d}
                className="bg-muted px-2 py-1.5 text-center text-xs font-medium text-muted-foreground"
              >
                {d}
              </div>
            ))}
            {weeks.flat().map((day, i) => {
              const count = day ? byDay[day]?.length || 0 : 0;
              const covers = day
                ? byDay[day]?.reduce((s, b) => s + b.partySize, 0) || 0
                : 0;
              const isToday =
                day === now.getDate() &&
                month === now.getMonth() + 1 &&
                year === now.getFullYear();
              const isSelected = day === selectedDay;

              return (
                <div
                  key={i}
                  className={`min-h-[70px] bg-background p-1.5 ${
                    !day ? "bg-muted/50" : ""
                  } ${isSelected ? "ring-2 ring-primary ring-inset" : ""}`}
                >
                  {day && (
                    <Link
                      href={`/admin/calendar?year=${year}&month=${month}&day=${day}`}
                      className="block h-full"
                    >
                      <span
                        className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs ${
                          isToday
                            ? "bg-primary text-primary-foreground font-bold"
                            : "text-foreground"
                        }`}
                      >
                        {day}
                      </span>
                      {count > 0 && (
                        <div className="mt-0.5">
                          <p className="text-[10px] font-medium text-primary">
                            {count}b · {covers}p
                          </p>
                        </div>
                      )}
                    </Link>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Selected day details */}
      {selectedDay && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              {new Date(year, month - 1, selectedDay).toLocaleDateString(
                "en-ZA",
                { weekday: "long", day: "numeric", month: "long" }
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedBookings.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No bookings for this day.
              </p>
            ) : (
              <div className="space-y-2">
                {selectedBookings.map((b) => (
                  <Link
                    key={b.id}
                    href={`/admin/bookings/${b.id}`}
                    className="flex items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-secondary/50"
                  >
                    <div
                      className={`h-2 w-2 rounded-full ${mealColors[b.mealPeriod] || "bg-gray-400"}`}
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{b.guestName}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatTime(b.time)} ·{" "}
                        {MEAL_PERIOD_LABELS[b.mealPeriod as string]} ·{" "}
                        {b.partySize} guests
                      </p>
                    </div>
                    <Badge variant="secondary" className="text-xs font-mono">
                      {b.reference}
                    </Badge>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
