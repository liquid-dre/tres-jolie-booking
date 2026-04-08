"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PhoneInput } from "@/components/ui/phone-input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { ArrowLeft, Minus, Plus } from "lucide-react";
import { formatDate, formatTime } from "@/lib/booking-utils";
import type { BookingData } from "@/app/book/page";

type Props = {
  data: BookingData;
  updateData: (partial: Partial<BookingData>) => void;
  onNext: () => void;
  onBack: () => void;
};

export function StepGuestDetails({ data, updateData, onNext, onBack }: Props) {
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  function handleNext() {
    const newErrors: Record<string, boolean> = {};

    if (!data.guestName.trim()) {
      newErrors.guestName = true;
    }
    if (!data.guestEmail.trim() || !data.guestEmail.includes("@")) {
      newErrors.guestEmail = true;
    }
    const phoneRegex = /^\+\d{7,15}$/;
    if (!phoneRegex.test(data.guestPhone.replace(/\s/g, ""))) {
      newErrors.guestPhone = true;
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      const first = Object.keys(newErrors)[0];
      if (first === "guestName") toast.error("Please enter your name");
      else if (first === "guestEmail") toast.error("Please enter a valid email address");
      else if (first === "guestPhone") toast.error("Please enter a valid phone number");
      return;
    }

    onNext();
  }

  function clearError(field: string) {
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Details</CardTitle>
        <p className="text-sm text-muted-foreground">
          {formatDate(data.date)} at {formatTime(data.time)} &middot;{" "}
          {data.partySize} guest{data.partySize !== 1 ? "s" : ""}
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="guestName">Full Name *</Label>
          <Input
            id="guestName"
            value={data.guestName}
            onChange={(e) => { updateData({ guestName: e.target.value }); clearError("guestName"); }}
            placeholder="John Smith"
            aria-invalid={errors.guestName}
          />
        </div>

        <div>
          <Label htmlFor="guestEmail">Email *</Label>
          <Input
            id="guestEmail"
            type="email"
            value={data.guestEmail}
            onChange={(e) => { updateData({ guestEmail: e.target.value }); clearError("guestEmail"); }}
            placeholder="john@example.com"
            aria-invalid={errors.guestEmail}
          />
          <p className="mt-1 text-xs text-muted-foreground">
            We&apos;ll send your confirmation and reminder here.
          </p>
        </div>

        <div>
          <Label htmlFor="guestPhone">Phone *</Label>
          <PhoneInput
            id="guestPhone"
            value={data.guestPhone}
            onChange={(value) => { updateData({ guestPhone: value }); clearError("guestPhone"); }}
            aria-invalid={errors.guestPhone}
          />
        </div>

        <div>
          <Label htmlFor="sectionPreference">Seating Preference</Label>
          <Select
            value={data.sectionPreference}
            onValueChange={(v) =>
              updateData({
                sectionPreference: v as BookingData["sectionPreference"],
              })
            }
          >
            <SelectTrigger id="sectionPreference">
              <SelectValue placeholder="Select preference" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="NO_PREFERENCE">No preference</SelectItem>
              <SelectItem value="INDOOR">Indoor</SelectItem>
              <SelectItem value="OUTDOOR">Outdoor / Garden</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Children in party</Label>
          <div className="mt-1 flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() =>
                updateData({
                  childrenCount: Math.max(0, data.childrenCount - 1),
                })
              }
              disabled={data.childrenCount <= 0}
            >
              <Minus className="h-3 w-3" />
            </Button>
            <input
              type="number"
              min={0}
              value={data.childrenCount}
              onChange={(e) => {
                const raw = e.target.value;
                if (raw === "") {
                  updateData({ childrenCount: 0 });
                  return;
                }
                const n = parseInt(raw, 10);
                if (!isNaN(n)) {
                  updateData({ childrenCount: Math.max(0, n) });
                }
              }}
              className="h-8 w-10 rounded-md border border-input bg-background text-center font-medium tabular-nums outline-none focus:border-ring focus:ring-2 focus:ring-ring/50 number-hide-spinners"
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() =>
                updateData({ childrenCount: data.childrenCount + 1 })
              }
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
        </div>

        <div>
          <Label htmlFor="specialRequests">Special Requests</Label>
          <Textarea
            id="specialRequests"
            value={data.specialRequests}
            onChange={(e) => updateData({ specialRequests: e.target.value })}
            placeholder="Dietary requirements, birthdays, high chairs, etc."
            rows={3}
          />
        </div>

        <div className="flex gap-3 pt-2">
          <Button variant="outline" onClick={onBack} className="flex-1">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <Button onClick={handleNext} className="flex-1" size="lg">
            Review Booking
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
