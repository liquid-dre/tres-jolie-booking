"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PhoneInput } from "@/components/ui/phone-input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function NewBookingPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    date: "",
    time: "",
    partySize: 2,
    guestName: "",
    guestEmail: "",
    guestPhone: "",
    specialRequests: "",
    sectionPreference: "NO_PREFERENCE",
    childrenCount: 0,
  });

  function update(field: string, value: string | number | null) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to create booking");
      }

      const result = await res.json();
      toast.success(`Booking created for ${form.guestName}. Ref: ${result.reference}`);
      router.push("/admin/bookings");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to create booking");
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="mb-6 text-2xl font-bold">New Booking</h1>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Manual Booking</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="date">Date *</Label>
                <Input
                  id="date"
                  type="date"
                  value={form.date}
                  onChange={(e) => update("date", e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="time">Time *</Label>
                <Input
                  id="time"
                  type="time"
                  value={form.time}
                  onChange={(e) => update("time", e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="partySize">Party Size *</Label>
                <Input
                  id="partySize"
                  type="number"
                  min={1}
                  max={100}
                  value={form.partySize}
                  onChange={(e) => update("partySize", parseInt(e.target.value) || 1)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="childrenCount">Children</Label>
                <Input
                  id="childrenCount"
                  type="number"
                  min={0}
                  value={form.childrenCount}
                  onChange={(e) => update("childrenCount", parseInt(e.target.value) || 0)}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="guestName">Guest Name *</Label>
              <Input
                id="guestName"
                value={form.guestName}
                onChange={(e) => update("guestName", e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="guestEmail">Email *</Label>
              <Input
                id="guestEmail"
                type="email"
                value={form.guestEmail}
                onChange={(e) => update("guestEmail", e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="guestPhone">Phone *</Label>
              <PhoneInput
                id="guestPhone"
                value={form.guestPhone}
                onChange={(value) => update("guestPhone", value)}
              />
            </div>

            <div>
              <Label htmlFor="sectionPref">Seating Preference</Label>
              <Select
                value={form.sectionPreference}
                onValueChange={(v) => update("sectionPreference", v)}
              >
                <SelectTrigger id="sectionPref">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="NO_PREFERENCE">No preference</SelectItem>
                  <SelectItem value="INDOOR">Indoor</SelectItem>
                  <SelectItem value="OUTDOOR">Outdoor / Garden</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="specialReqs">Special Requests / Admin Notes</Label>
              <Textarea
                id="specialReqs"
                value={form.specialRequests}
                onChange={(e) => update("specialRequests", e.target.value)}
                rows={3}
              />
            </div>

            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Booking"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
