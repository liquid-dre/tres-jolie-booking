import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  formatDate,
  formatTime,
  MEAL_PERIOD_LABELS,
} from "@/lib/booking-utils";
import {
  CalendarDays,
  Users,
  XCircle,
  AlertTriangle,
} from "lucide-react";

export const metadata: Metadata = { title: "Analytics" };
export const dynamic = "force-dynamic";

const PERIODS = [
  { value: "7", label: "7 days" },
  { value: "30", label: "30 days" },
  { value: "90", label: "90 days" },
];

const DAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const SECTION_LABELS: Record<string, string> = {
  INDOOR: "Indoor",
  OUTDOOR: "Outdoor",
  NO_PREFERENCE: "No Preference",
};

export default async function AnalyticsPage({
  searchParams,
}: {
  searchParams: Promise<{ period?: string }>;
}) {
  const params = await searchParams;
  const days = parseInt(params.period || "30", 10);
  const validDays = [7, 30, 90].includes(days) ? days : 30;

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - validDays);
  startDate.setHours(0, 0, 0, 0);

  // Fetch all bookings in the period
  const allBookings = await prisma.booking.findMany({
    where: { date: { gte: startDate } },
    select: {
      date: true,
      time: true,
      mealPeriod: true,
      partySize: true,
      status: true,
      sectionPreference: true,
    },
    orderBy: { date: "asc" },
  });

  // Overview stats
  const total = allBookings.length;
  const confirmed = allBookings.filter(
    (b) => b.status === "CONFIRMED" || b.status === "COMPLETED"
  );
  const cancelled = allBookings.filter((b) => b.status === "CANCELLED").length;
  const noShow = allBookings.filter((b) => b.status === "NO_SHOW").length;
  const totalCovers = confirmed.reduce((s, b) => s + b.partySize, 0);
  const avgPartySize =
    confirmed.length > 0 ? (totalCovers / confirmed.length).toFixed(1) : "—";
  const cancelRate = total > 0 ? ((cancelled / total) * 100).toFixed(1) : "0";
  const noShowRate = total > 0 ? ((noShow / total) * 100).toFixed(1) : "0";

  // Bookings by day of week
  const byDayOfWeek = Array.from({ length: 7 }, () => ({
    count: 0,
    covers: 0,
  }));
  for (const b of confirmed) {
    const day = new Date(b.date).getDay();
    byDayOfWeek[day].count++;
    byDayOfWeek[day].covers += b.partySize;
  }
  const maxDayCount = Math.max(...byDayOfWeek.map((d) => d.count), 1);

  // Bookings by meal period
  const byMealPeriod: Record<string, { count: number; covers: number }> = {
    BREAKFAST: { count: 0, covers: 0 },
    LUNCH: { count: 0, covers: 0 },
    DINNER: { count: 0, covers: 0 },
  };
  for (const b of confirmed) {
    const mp = b.mealPeriod as string;
    if (byMealPeriod[mp]) {
      byMealPeriod[mp].count++;
      byMealPeriod[mp].covers += b.partySize;
    }
  }

  // Seating preference distribution
  const bySeating: Record<string, number> = {
    INDOOR: 0,
    OUTDOOR: 0,
    NO_PREFERENCE: 0,
  };
  for (const b of confirmed) {
    const sp = b.sectionPreference as string;
    if (bySeating[sp] !== undefined) bySeating[sp]++;
  }
  const maxSeating = Math.max(...Object.values(bySeating), 1);

  // Popular time slots (top 5)
  const timeSlotMap = new Map<string, { count: number; mealPeriod: string }>();
  for (const b of confirmed) {
    const existing = timeSlotMap.get(b.time);
    if (existing) {
      existing.count++;
    } else {
      timeSlotMap.set(b.time, { count: 1, mealPeriod: b.mealPeriod as string });
    }
  }
  const topTimeSlots = [...timeSlotMap.entries()]
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 5);

  // Daily trend
  const dailyMap = new Map<
    string,
    { date: Date; bookings: number; covers: number; cancellations: number }
  >();
  for (const b of allBookings) {
    const key = new Date(b.date).toISOString().split("T")[0];
    if (!dailyMap.has(key)) {
      dailyMap.set(key, {
        date: new Date(b.date),
        bookings: 0,
        covers: 0,
        cancellations: 0,
      });
    }
    const entry = dailyMap.get(key)!;
    if (b.status === "CONFIRMED" || b.status === "COMPLETED") {
      entry.bookings++;
      entry.covers += b.partySize;
    }
    if (b.status === "CANCELLED") {
      entry.cancellations++;
    }
  }
  const dailyTrend = [...dailyMap.values()].sort(
    (a, b) => b.date.getTime() - a.date.getTime()
  );
  const maxDailyBookings = Math.max(...dailyTrend.map((d) => d.bookings), 1);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Analytics</h1>
        <div className="flex gap-1 rounded-md border border-input p-1">
          {PERIODS.map((p) => (
            <Link
              key={p.value}
              href={`/admin/analytics?period=${p.value}`}
              className={`rounded px-3 py-1 text-sm font-medium transition-colors ${
                String(validDays) === p.value
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-secondary"
              }`}
            >
              {p.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Overview stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="rounded-lg bg-primary/10 p-3">
              <CalendarDays className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Bookings</p>
              <p className="text-2xl font-bold">{confirmed.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="rounded-lg bg-primary/10 p-3">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Covers</p>
              <p className="text-2xl font-bold">{totalCovers}</p>
              <p className="text-xs text-muted-foreground">
                Avg {avgPartySize} per booking
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="rounded-lg bg-red-100 p-3">
              <XCircle className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Cancellation Rate</p>
              <p className="text-2xl font-bold">{cancelRate}%</p>
              <p className="text-xs text-muted-foreground">
                {cancelled} cancelled
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="rounded-lg bg-yellow-100 p-3">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">No-show Rate</p>
              <p className="text-2xl font-bold">{noShowRate}%</p>
              <p className="text-xs text-muted-foreground">
                {noShow} no-shows
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Bookings by day of week */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Bookings by Day of Week</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {/* Start from Monday (index 1) and wrap around */}
              {[1, 2, 3, 4, 5, 6, 0].map((dayIdx) => (
                <div key={dayIdx} className="flex items-center gap-3">
                  <span className="w-24 shrink-0 text-sm">
                    {DAY_NAMES[dayIdx]}
                  </span>
                  <div className="flex-1">
                    <div
                      className="h-6 rounded bg-primary/80 transition-all"
                      style={{
                        width: `${(byDayOfWeek[dayIdx].count / maxDayCount) * 100}%`,
                        minWidth: byDayOfWeek[dayIdx].count > 0 ? "2px" : "0",
                      }}
                    />
                  </div>
                  <span className="w-20 shrink-0 text-right text-sm tabular-nums">
                    {byDayOfWeek[dayIdx].count}b / {byDayOfWeek[dayIdx].covers}p
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Bookings by meal period */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Bookings by Meal Period</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-3">
              {(["BREAKFAST", "LUNCH", "DINNER"] as const).map((period) => {
                const data = byMealPeriod[period];
                const pct =
                  confirmed.length > 0
                    ? ((data.count / confirmed.length) * 100).toFixed(0)
                    : "0";
                return (
                  <div
                    key={period}
                    className="rounded-lg border p-4 text-center"
                  >
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      {MEAL_PERIOD_LABELS[period]}
                    </p>
                    <p className="mt-1 text-2xl font-bold">{data.count}</p>
                    <p className="text-sm text-muted-foreground">
                      {data.covers} covers
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {pct}% of total
                    </p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Seating preference */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Seating Preference</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(bySeating).map(([key, count]) => {
                const pct =
                  confirmed.length > 0
                    ? ((count / confirmed.length) * 100).toFixed(0)
                    : "0";
                return (
                  <div key={key}>
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <span>{SECTION_LABELS[key]}</span>
                      <span className="tabular-nums text-muted-foreground">
                        {count} ({pct}%)
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-muted">
                      <div
                        className="h-2 rounded-full bg-primary/70 transition-all"
                        style={{
                          width: `${(count / maxSeating) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Popular time slots */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              Popular Time Slots (Top 5)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {topTimeSlots.length === 0 ? (
              <p className="py-4 text-center text-sm text-muted-foreground">
                No data for this period.
              </p>
            ) : (
              <div className="space-y-2">
                {topTimeSlots.map(([time, data], i) => (
                  <div key={time} className="flex items-center gap-3">
                    <span className="w-5 text-sm font-bold text-muted-foreground">
                      {i + 1}.
                    </span>
                    <span className="w-20 shrink-0 text-sm font-medium">
                      {formatTime(time)}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {MEAL_PERIOD_LABELS[data.mealPeriod] || data.mealPeriod}
                    </span>
                    <span className="ml-auto text-sm font-semibold tabular-nums">
                      {data.count}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Daily trend */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            Daily Trend (Last {validDays} Days)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {dailyTrend.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No data for this period.
            </p>
          ) : (
            <div className="max-h-[400px] overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-background">
                  <tr className="border-b text-left">
                    <th className="py-2 pr-4 font-medium">Date</th>
                    <th className="py-2 pr-4 font-medium">Bookings</th>
                    <th className="py-2 pr-4 font-medium">Covers</th>
                    <th className="py-2 pr-4 font-medium">Cancelled</th>
                    <th className="py-2 font-medium">Trend</th>
                  </tr>
                </thead>
                <tbody>
                  {dailyTrend.map((day) => {
                    const key = day.date.toISOString().split("T")[0];
                    return (
                      <tr key={key} className="border-b border-border/50">
                        <td className="py-1.5 pr-4 text-muted-foreground">
                          {formatDate(day.date)}
                        </td>
                        <td className="py-1.5 pr-4 font-medium tabular-nums">
                          {day.bookings}
                        </td>
                        <td className="py-1.5 pr-4 tabular-nums">
                          {day.covers}
                        </td>
                        <td className="py-1.5 pr-4 tabular-nums">
                          {day.cancellations > 0 ? (
                            <span className="text-red-600">
                              {day.cancellations}
                            </span>
                          ) : (
                            <span className="text-muted-foreground">0</span>
                          )}
                        </td>
                        <td className="py-1.5">
                          <div className="h-3 w-full max-w-[200px] rounded-full bg-muted">
                            <div
                              className="h-3 rounded-full bg-primary/70"
                              style={{
                                width: `${(day.bookings / maxDailyBookings) * 100}%`,
                              }}
                            />
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
