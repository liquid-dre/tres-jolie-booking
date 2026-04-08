"use client";

import { Button } from "@/components/ui/button";
import { FlipCalendar } from "@/components/ui/flip-calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Minus, Plus, Users } from "lucide-react";
import type { BookingData } from "@/app/book/page";

type Props = {
  data: BookingData;
  updateData: (partial: Partial<BookingData>) => void;
  onNext: () => void;
};

function isMonday(date: Date) {
  return date.getDay() === 1;
}

function isPast(date: Date) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date < today;
}

export function StepDatePartySize({ data, updateData, onNext }: Props) {
  const selectedDate = data.date ? new Date(data.date) : undefined;

  function handleSelect(date: Date) {
    updateData({
      date: date.toISOString().split("T")[0],
      time: "", // reset time when date changes
      mealPeriod: "",
    });
  }

  function handlePartySizeInput(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value;
    if (raw === "") {
      updateData({ partySize: 1 });
      return;
    }
    const n = parseInt(raw, 10);
    if (!isNaN(n)) {
      updateData({ partySize: Math.max(1, Math.min(20, n)) });
    }
  }

  function handleNext() {
    if (!data.date) {
      toast.error("Please select a date");
      return;
    }
    if (data.partySize < 1) {
      toast.error("Party size must be at least 1");
      return;
    }
    onNext();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>When are you joining us?</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Date picker */}
        <div>
          <Label className="mb-2 block text-sm font-medium">Select a date</Label>
          <div className="flex justify-center">
            <FlipCalendar
              selected={selectedDate}
              onSelect={handleSelect}
              disabled={(date) => isPast(date) || isMonday(date)}
            />
          </div>
        </div>

        {/* Party size */}
        <div>
          <Label className="mb-2 block text-sm font-medium">
            <Users className="mr-1 inline h-4 w-4" />
            Number of guests
          </Label>
          <div className="flex items-center gap-4">
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() =>
                updateData({ partySize: Math.max(1, data.partySize - 1) })
              }
              disabled={data.partySize <= 1}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <input
              type="number"
              min={1}
              max={20}
              value={data.partySize}
              onChange={handlePartySizeInput}
              className="h-10 w-14 rounded-md border border-input bg-background text-center text-2xl font-bold tabular-nums outline-none focus:border-ring focus:ring-2 focus:ring-ring/50 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() =>
                updateData({ partySize: Math.min(20, data.partySize + 1) })
              }
              disabled={data.partySize >= 20}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          {data.partySize >= 15 && (
            <p className="mt-2 text-sm text-muted-foreground">
              For parties larger than 20, please{" "}
              <a
                href="tel:+27117942473"
                className="font-medium text-primary underline"
              >
                call us
              </a>{" "}
              to arrange.
            </p>
          )}
        </div>

        <Button onClick={handleNext} className="w-full" size="lg">
          Choose a Time
        </Button>
      </CardContent>
    </Card>
  );
}
