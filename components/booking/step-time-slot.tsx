"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { ArrowLeft, Loader2 } from "lucide-react";
import { formatDate, formatTime } from "@/lib/booking-utils";
import type { BookingData } from "@/app/book/page";

type Props = {
  data: BookingData;
  updateData: (partial: Partial<BookingData>) => void;
  onNext: () => void;
  onBack: () => void;
};

type TimeSlot = {
  time: string;
  mealPeriod: string;
  available: boolean;
  remainingCapacity: number;
};

type AvailabilityResponse = {
  slots: TimeSlot[];
};

export function StepTimeSlot({ data, updateData, onNext, onBack }: Props) {
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAvailability() {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/bookings/availability?date=${data.date}&partySize=${data.partySize}`
        );
        if (!res.ok) throw new Error("Failed to fetch availability");
        const json: AvailabilityResponse = await res.json();
        setSlots(json.slots);
        if (json.slots.length === 0) {
          toast.error("No availability for this date. Try another day.");
        }
      } catch {
        toast.error("Could not check availability. Please try again.");
      } finally {
        setLoading(false);
      }
    }
    fetchAvailability();
  }, [data.date, data.partySize]);

  function handleSelectTime(slot: TimeSlot) {
    updateData({ time: slot.time, mealPeriod: slot.mealPeriod });
  }

  function handleNext() {
    if (!data.time) {
      toast.error("Please select a time slot");
      return;
    }
    onNext();
  }

  // Group slots by meal period
  const grouped = slots.reduce(
    (acc, slot) => {
      if (!acc[slot.mealPeriod]) acc[slot.mealPeriod] = [];
      acc[slot.mealPeriod].push(slot);
      return acc;
    },
    {} as Record<string, TimeSlot[]>
  );

  const mealOrder = ["BREAKFAST", "LUNCH", "DINNER"];
  const mealLabels: Record<string, string> = {
    BREAKFAST: "Breakfast",
    LUNCH: "Lunch",
    DINNER: "Dinner",
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Choose your time</CardTitle>
        <p className="text-sm text-muted-foreground">
          {formatDate(data.date)} &middot; {data.partySize} guest
          {data.partySize !== 1 ? "s" : ""}
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <span className="ml-2 text-sm text-muted-foreground">
              Checking availability...
            </span>
          </div>
        ) : slots.length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-muted-foreground">
              No available times for this date and party size.
            </p>
            <Button variant="outline" onClick={onBack} className="mt-4">
              Try a different date
            </Button>
          </div>
        ) : (
          <>
            {mealOrder.map(
              (period) =>
                grouped[period] && (
                  <div key={period}>
                    <div className="mb-3 flex items-center gap-2">
                      <h3 className="text-sm font-semibold">
                        {mealLabels[period]}
                      </h3>
                      <Separator className="flex-1" />
                    </div>
                    <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                      {grouped[period].map((slot) => (
                        <Button
                          key={slot.time}
                          variant={
                            data.time === slot.time ? "default" : "outline"
                          }
                          disabled={!slot.available}
                          onClick={() => handleSelectTime(slot)}
                          className="relative h-auto flex-col py-2"
                        >
                          <span className="text-sm font-medium">
                            {formatTime(slot.time)}
                          </span>
                          {slot.available && slot.remainingCapacity <= 20 && (
                            <Badge
                              variant="secondary"
                              className="mt-0.5 text-[10px] px-1"
                            >
                              {slot.remainingCapacity} left
                            </Badge>
                          )}
                        </Button>
                      ))}
                    </div>
                  </div>
                )
            )}

            <div className="flex gap-3 pt-2">
              <Button variant="outline" onClick={onBack} className="flex-1">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <Button onClick={handleNext} className="flex-1" size="lg">
                Continue
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
