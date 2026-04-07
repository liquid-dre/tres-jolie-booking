import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { Header } from "@/components/shared/header";
import { Footer } from "@/components/shared/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  formatDate,
  formatTime,
  MEAL_PERIOD_LABELS,
} from "@/lib/booking-utils";
import { CancelBookingButton } from "@/components/booking/cancel-booking-button";
import { AlertTriangle, CalendarDays, Clock, Users, CheckCircle } from "lucide-react";

export default async function CancelPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  const booking = await prisma.booking.findUnique({
    where: { cancelToken: token },
  });

  if (!booking) {
    notFound();
  }

  const alreadyCancelled = booking.status === "CANCELLED";

  return (
    <>
      <Header />
      <main className="flex-1 px-4 py-10 sm:py-16">
        <div className="mx-auto max-w-lg">
          {alreadyCancelled ? (
            <div className="text-center">
              <CheckCircle className="mx-auto h-12 w-12 text-muted-foreground" />
              <h1 className="mt-3 text-2xl font-bold">Already Cancelled</h1>
              <p className="mt-2 text-muted-foreground">
                This booking ({booking.reference}) has already been cancelled.
              </p>
            </div>
          ) : (
            <>
              <div className="mb-6 text-center">
                <AlertTriangle className="mx-auto h-12 w-12 text-destructive" />
                <h1 className="mt-3 text-2xl font-bold">Cancel Booking</h1>
                <p className="mt-1 text-muted-foreground">
                  Are you sure you want to cancel this reservation?
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

                  <CancelBookingButton token={token} />
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
