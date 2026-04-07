"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import {
  ArrowLeft,
  CalendarDays,
  Clock,
  Users,
  User,
  Mail,
  Phone,
  MapPin,
  Baby,
  MessageSquare,
  Loader2,
} from "lucide-react";
import { formatDate, formatTime, MEAL_PERIOD_LABELS } from "@/lib/booking-utils";
import type { BookingData } from "@/app/book/page";

type Props = {
  data: BookingData;
  onBack: () => void;
};

const sectionLabels = {
  INDOOR: "Indoor",
  OUTDOOR: "Outdoor / Garden",
  NO_PREFERENCE: "No preference",
};

export function StepReview({ data, onBack }: Props) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit() {
    setSubmitting(true);
    const loadingToast = toast.loading("Confirming your booking...");
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to create booking");
      }

      const result = await res.json();
      toast.dismiss(loadingToast);
      toast.success("Booking confirmed! Check your email for details.");
      router.push(`/book/confirmation/${result.reference}`);
    } catch (err) {
      toast.dismiss(loadingToast);
      toast.error(
        err instanceof Error ? err.message : "Something went wrong. Please try again."
      );
      setSubmitting(false);
    }
  }

  const details = [
    { icon: CalendarDays, label: "Date", value: formatDate(data.date) },
    { icon: Clock, label: "Time", value: `${formatTime(data.time)} (${MEAL_PERIOD_LABELS[data.mealPeriod as string] || data.mealPeriod})` },
    {
      icon: Users,
      label: "Guests",
      value: `${data.partySize} guest${data.partySize !== 1 ? "s" : ""}`,
    },
    { icon: User, label: "Name", value: data.guestName },
    { icon: Mail, label: "Email", value: data.guestEmail },
    { icon: Phone, label: "Phone", value: data.guestPhone },
    { icon: MapPin, label: "Seating", value: sectionLabels[data.sectionPreference] },
  ];

  if (data.childrenCount > 0) {
    details.push({
      icon: Baby,
      label: "Children",
      value: `${data.childrenCount}`,
    });
  }

  if (data.specialRequests) {
    details.push({
      icon: MessageSquare,
      label: "Requests",
      value: data.specialRequests,
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Review Your Booking</CardTitle>
        <p className="text-sm text-muted-foreground">
          Please check the details below before confirming.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-lg border bg-secondary/30 p-4">
          {details.map((item, i) => (
            <div key={item.label}>
              <div className="flex items-start gap-3 py-2">
                <item.icon className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <div className="flex-1">
                  <p className="text-xs font-medium text-muted-foreground">
                    {item.label}
                  </p>
                  <p className="text-sm">{item.value}</p>
                </div>
              </div>
              {i < details.length - 1 && <Separator />}
            </div>
          ))}
        </div>

        <p className="text-xs text-muted-foreground text-center">
          A confirmation email will be sent to {data.guestEmail} with your
          booking reference and cancellation link.
        </p>

        <div className="flex gap-3 pt-2">
          <Button
            variant="outline"
            onClick={onBack}
            className="flex-1"
            disabled={submitting}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <Button
            onClick={handleSubmit}
            className="flex-1"
            size="lg"
            disabled={submitting}
          >
            {submitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Confirming...
              </>
            ) : (
              "Confirm Booking"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
