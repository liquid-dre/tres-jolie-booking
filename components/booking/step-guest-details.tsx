"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
  function handleNext() {
    if (!data.guestName.trim()) {
      toast.error("Please enter your name");
      return;
    }
    if (!data.guestEmail.trim() || !data.guestEmail.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }
    const phoneRegex = /^(\+27|0)\d{9}$/;
    if (!phoneRegex.test(data.guestPhone.replace(/\s/g, ""))) {
      toast.error("Please enter a valid SA phone number (e.g. 0821234567)");
      return;
    }
    onNext();
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
            onChange={(e) => updateData({ guestName: e.target.value })}
            placeholder="John Smith"
          />
        </div>

        <div>
          <Label htmlFor="guestEmail">Email *</Label>
          <Input
            id="guestEmail"
            type="email"
            value={data.guestEmail}
            onChange={(e) => updateData({ guestEmail: e.target.value })}
            placeholder="john@example.com"
          />
          <p className="mt-1 text-xs text-muted-foreground">
            We&apos;ll send your confirmation and reminder here.
          </p>
        </div>

        <div>
          <Label htmlFor="guestPhone">Phone *</Label>
          <Input
            id="guestPhone"
            type="tel"
            value={data.guestPhone}
            onChange={(e) => updateData({ guestPhone: e.target.value })}
            placeholder="082 123 4567"
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
