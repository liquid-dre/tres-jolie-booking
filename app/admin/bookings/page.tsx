import { prisma } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate, formatTime, MEAL_PERIOD_LABELS } from "@/lib/booking-utils";
import Link from "next/link";
import { Eye, Printer } from "lucide-react";
import { BookingsFilter } from "@/components/admin/bookings-filter";

export const dynamic = "force-dynamic";

const statusColors: Record<string, string> = {
  CONFIRMED: "bg-green-100 text-green-800",
  WAITLISTED: "bg-yellow-100 text-yellow-800",
  CANCELLED: "bg-red-100 text-red-800",
  NO_SHOW: "bg-gray-100 text-gray-800",
  COMPLETED: "bg-blue-100 text-blue-800",
};

export default async function BookingsListPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; date?: string; search?: string }>;
}) {
  const params = await searchParams;

  const where: Record<string, unknown> = {};

  if (params.status && params.status !== "ALL") {
    where.status = params.status as string;
  }

  if (params.date) {
    where.date = new Date(params.date);
  }

  if (params.search) {
    where.OR = [
      { guestName: { contains: params.search, mode: "insensitive" } },
      { guestEmail: { contains: params.search, mode: "insensitive" } },
      { reference: { contains: params.search, mode: "insensitive" } },
    ];
  }

  const bookings = await prisma.booking.findMany({
    where,
    orderBy: [{ date: "desc" }, { time: "desc" }],
    take: 100,
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Bookings</h1>
        <div className="flex gap-2">
          <Link
            href={`/admin/bookings/print?date=${new Date().toISOString().split("T")[0]}`}
            className="inline-flex h-9 items-center gap-2 rounded-md border border-input bg-background px-4 text-sm font-medium hover:bg-secondary"
          >
            <Printer className="h-4 w-4" />
            Print Today
          </Link>
          <Link
            href="/admin/bookings/new"
            className="inline-flex h-9 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            + New Booking
          </Link>
        </div>
      </div>

      <BookingsFilter
        currentStatus={params.status}
        currentDate={params.date}
        currentSearch={params.search}
      />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            {bookings.length} booking{bookings.length !== 1 ? "s" : ""}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {bookings.length === 0 ? (
            <p className="py-8 text-center text-muted-foreground">
              No bookings found.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ref</TableHead>
                    <TableHead>Guest</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Guests</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-10"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bookings.map((b) => (
                    <TableRow key={b.id}>
                      <TableCell>
                        <Link
                          href={`/admin/bookings/${b.id}`}
                          className="font-mono text-xs font-medium text-primary hover:underline"
                        >
                          {b.reference}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{b.guestName}</p>
                          <p className="text-xs text-muted-foreground">
                            {b.guestEmail}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">
                        {formatDate(b.date)}
                      </TableCell>
                      <TableCell className="text-sm">
                        {formatTime(b.time)}{" "}
                        <span className="text-xs text-muted-foreground">
                          ({MEAL_PERIOD_LABELS[b.mealPeriod as string]})
                        </span>
                      </TableCell>
                      <TableCell className="text-sm">{b.partySize}</TableCell>
                      <TableCell>
                        <Badge className={statusColors[b.status]}>
                          {b.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Link
                          href={`/admin/bookings/${b.id}`}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
