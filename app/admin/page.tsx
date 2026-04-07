import { prisma } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate, formatTime, MEAL_PERIOD_LABELS } from "@/lib/booking-utils";
import { CalendarDays, Users, Clock, TrendingUp } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const weekFromNow = new Date(today);
  weekFromNow.setDate(weekFromNow.getDate() + 7);

  const [todayBookings, upcomingBookings, todayStats] = await Promise.all([
    prisma.booking.findMany({
      where: {
        date: today,
        status: { in: ["CONFIRMED", "WAITLISTED"] },
      },
      orderBy: { time: "asc" },
    }),
    prisma.booking.findMany({
      where: {
        date: { gt: today, lte: weekFromNow },
        status: { in: ["CONFIRMED", "WAITLISTED"] },
      },
      orderBy: [{ date: "asc" }, { time: "asc" }],
      take: 10,
    }),
    prisma.booking.aggregate({
      where: {
        date: today,
        status: { in: ["CONFIRMED", "WAITLISTED"] },
      },
      _count: true,
      _sum: { partySize: true },
    }),
  ]);

  const totalCoversToday = todayStats._sum.partySize || 0;
  const totalBookingsToday = todayStats._count;

  const statusColors: Record<string, string> = {
    CONFIRMED: "bg-green-100 text-green-800",
    WAITLISTED: "bg-yellow-100 text-yellow-800",
    CANCELLED: "bg-red-100 text-red-800",
    NO_SHOW: "bg-gray-100 text-gray-800",
    COMPLETED: "bg-blue-100 text-blue-800",
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="rounded-lg bg-primary/10 p-3">
              <CalendarDays className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Today&apos;s Bookings</p>
              <p className="text-2xl font-bold">{totalBookingsToday}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="rounded-lg bg-primary/10 p-3">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Covers Today</p>
              <p className="text-2xl font-bold">{totalCoversToday}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="rounded-lg bg-primary/10 p-3">
              <Clock className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Next 7 Days</p>
              <p className="text-2xl font-bold">{upcomingBookings.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="rounded-lg bg-primary/10 p-3">
              <TrendingUp className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Avg Party Size</p>
              <p className="text-2xl font-bold">
                {totalBookingsToday > 0
                  ? (totalCoversToday / totalBookingsToday).toFixed(1)
                  : "—"}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Today's bookings */}
      <Card>
        <CardHeader>
          <CardTitle>Today&apos;s Bookings</CardTitle>
        </CardHeader>
        <CardContent>
          {todayBookings.length === 0 ? (
            <p className="py-8 text-center text-muted-foreground">
              No bookings for today.
            </p>
          ) : (
            <div className="space-y-3">
              {todayBookings.map((b) => (
                <Link
                  key={b.id}
                  href={`/admin/bookings/${b.id}`}
                  className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-secondary/50"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <p className="text-sm font-bold">
                        {formatTime(b.time)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {MEAL_PERIOD_LABELS[b.mealPeriod as string]}
                      </p>
                    </div>
                    <div>
                      <p className="font-medium">{b.guestName}</p>
                      <p className="text-sm text-muted-foreground">
                        {b.partySize} guests · {b.reference}
                      </p>
                    </div>
                  </div>
                  <Badge className={statusColors[b.status]}>
                    {b.status}
                  </Badge>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Upcoming */}
      {upcomingBookings.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Upcoming (Next 7 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingBookings.map((b) => (
                <Link
                  key={b.id}
                  href={`/admin/bookings/${b.id}`}
                  className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-secondary/50"
                >
                  <div>
                    <p className="font-medium">{b.guestName}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(b.date)} at {formatTime(b.time)} ·{" "}
                      {b.partySize} guests
                    </p>
                  </div>
                  <Badge variant="secondary" className="font-mono text-xs">
                    {b.reference}
                  </Badge>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
