import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { formatDate, formatTime, MEAL_PERIOD_LABELS } from "@/lib/booking-utils";
import { BookingStatusActions } from "@/components/admin/booking-status-actions";
import {
  CalendarDays,
  Clock,
  Users,
  User,
  Mail,
  Phone,
  MapPin,
  Baby,
  MessageSquare,
} from "lucide-react";

export const dynamic = "force-dynamic";

const statusColors: Record<string, string> = {
  CONFIRMED: "bg-green-100 text-green-800",
  WAITLISTED: "bg-yellow-100 text-yellow-800",
  CANCELLED: "bg-red-100 text-red-800",
  NO_SHOW: "bg-gray-100 text-gray-800",
  COMPLETED: "bg-blue-100 text-blue-800",
};

const sectionLabels: Record<string, string> = {
  INDOOR: "Indoor",
  OUTDOOR: "Outdoor / Garden",
  NO_PREFERENCE: "No preference",
};

export default async function BookingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const booking = await prisma.booking.findUnique({
    where: { id },
    include: { notifications: { orderBy: { sentAt: "desc" } } },
  });

  if (!booking) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Booking Details</h1>
        <Badge className={`text-sm ${statusColors[booking.status]}`}>
          {booking.status}
        </Badge>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>
              {booking.guestName}
            </CardTitle>
            <span className="font-mono text-sm text-muted-foreground">
              {booking.reference}
            </span>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="flex items-center gap-3">
              <CalendarDays className="h-4 w-4 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Date</p>
                <p className="text-sm font-medium">{formatDate(booking.date)}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="h-4 w-4 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Time</p>
                <p className="text-sm font-medium">
                  {formatTime(booking.time)} ({MEAL_PERIOD_LABELS[booking.mealPeriod as string]})
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Users className="h-4 w-4 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Party Size</p>
                <p className="text-sm font-medium">{booking.partySize} guests</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="h-4 w-4 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Seating</p>
                <p className="text-sm font-medium">
                  {sectionLabels[booking.sectionPreference]}
                </p>
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{booking.guestName}</span>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <a href={`mailto:${booking.guestEmail}`} className="text-sm text-primary hover:underline">
                {booking.guestEmail}
              </a>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <a href={`tel:${booking.guestPhone}`} className="text-sm text-primary hover:underline">
                {booking.guestPhone}
              </a>
            </div>
            {booking.childrenCount > 0 && (
              <div className="flex items-center gap-3">
                <Baby className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{booking.childrenCount} children</span>
              </div>
            )}
            {booking.specialRequests && (
              <div className="flex items-start gap-3">
                <MessageSquare className="mt-0.5 h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{booking.specialRequests}</span>
              </div>
            )}
          </div>

          {booking.adminNotes && (
            <>
              <Separator />
              <div>
                <p className="text-xs font-medium text-muted-foreground">Admin Notes</p>
                <p className="mt-1 text-sm">{booking.adminNotes}</p>
              </div>
            </>
          )}

          <Separator />

          <BookingStatusActions
            bookingId={booking.id}
            currentStatus={booking.status}
          />
        </CardContent>
      </Card>

      {/* Notification log */}
      {booking.notifications.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Notification History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {booking.notifications.map((n) => (
                <div
                  key={n.id}
                  className="flex items-center justify-between text-sm"
                >
                  <span>{n.type}</span>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={n.status === "SENT" ? "secondary" : "destructive"}
                      className="text-xs"
                    >
                      {n.status}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {n.sentAt.toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
