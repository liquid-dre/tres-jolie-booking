import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { Header } from "@/components/shared/header";
import { Footer } from "@/components/shared/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { AddToCalendar } from "@/components/booking/add-to-calendar";
import {
  formatDate,
  formatTime,
  MEAL_PERIOD_LABELS,
} from "@/lib/booking-utils";
import {
  CheckCircle,
  CalendarDays,
  Clock,
  Users,
  MapPin,
} from "lucide-react";

export default async function ConfirmationPage({
  params,
}: {
  params: Promise<{ ref: string }>;
}) {
  const { ref } = await params;

  const booking = await prisma.booking.findUnique({
    where: { reference: ref },
  });

  if (!booking) {
    notFound();
  }

  return (
    <>
      <Header />
      <main className="flex-1 px-4 py-10 sm:py-16">
        <div className="mx-auto max-w-lg">
          <div className="mb-6 text-center">
            <CheckCircle className="mx-auto h-12 w-12 text-primary" />
            <h1 className="mt-3 text-2xl font-bold">Booking Confirmed!</h1>
            <p className="mt-1 text-muted-foreground">
              A confirmation email has been sent to {booking.guestEmail}
            </p>
          </div>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Booking Details</CardTitle>
                <Badge variant="secondary" className="font-mono">
                  {booking.reference}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <CalendarDays className="h-4 w-4 text-primary" />
                <span className="text-sm">{formatDate(booking.date)}</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-primary" />
                <span className="text-sm">
                  {formatTime(booking.time)} (
                  {MEAL_PERIOD_LABELS[booking.mealPeriod as string]})
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Users className="h-4 w-4 text-primary" />
                <span className="text-sm">
                  {booking.partySize} guest
                  {booking.partySize !== 1 ? "s" : ""}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-primary" />
                <span className="text-sm">
                  Plot 22 Peter Road, Ruimsig, Johannesburg
                </span>
              </div>

              <Separator />

              <div>
                <p className="mb-2 text-sm font-medium">Add to Calendar</p>
                <AddToCalendar
                  date={booking.date.toISOString().split("T")[0]}
                  time={booking.time}
                  mealPeriod={booking.mealPeriod}
                  partySize={booking.partySize}
                  reference={booking.reference}
                  guestName={booking.guestName}
                  cancelToken={booking.cancelToken}
                />
              </div>

              <Separator />

              <p className="text-center text-xs text-muted-foreground">
                Need to cancel? Check your confirmation email for the
                cancellation link, or call us at{" "}
                <a
                  href="tel:+27117942473"
                  className="text-primary underline"
                >
                  011 794 2473
                </a>
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </>
  );
}
