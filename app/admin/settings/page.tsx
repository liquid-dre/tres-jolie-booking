"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Loader2, Plus, Trash2, Repeat } from "lucide-react";

type OperatingHour = {
  id?: string;
  dayOfWeek: number;
  mealPeriod: string;
  openTime: string;
  closeTime: string;
  maxCovers: number;
  isActive: boolean;
};

type SpecialClosure = {
  id?: string;
  date: string;
  reason: string;
  isRecurring: boolean;
  recurrenceFrequency: string | null;
};

const dayLabels = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const mealPeriods = ["BREAKFAST", "LUNCH", "DINNER"];

const defaultTimes: Record<string, { open: string; close: string }> = {
  BREAKFAST: { open: "09:00", close: "11:30" },
  LUNCH: { open: "12:00", close: "17:30" },
  DINNER: { open: "18:00", close: "22:00" },
};

export default function SettingsPage() {
  const [hours, setHours] = useState<OperatingHour[]>([]);
  const [closures, setClosures] = useState<SpecialClosure[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newClosure, setNewClosure] = useState({ date: "", reason: "", isRecurring: false, recurrenceFrequency: "" });
  const [addingSlotTo, setAddingSlotTo] = useState<number | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/admin/settings");
        const data = await res.json();
        setHours(data.hours || []);
        setClosures(
          (data.closures || []).map((c: { id: string; date: string; reason: string; isRecurring: boolean; recurrenceFrequency: string | null }) => ({
            ...c,
            date: c.date.split("T")[0],
          }))
        );
      } catch {
        toast.error("Failed to load settings");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  async function saveHours() {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hours }),
      });
      if (!res.ok) throw new Error();
      toast.success("Operating hours updated.");
    } catch {
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  }

  async function addClosure() {
    if (!newClosure.date) {
      toast.error("Please select a date");
      return;
    }
    if (newClosure.isRecurring && !newClosure.recurrenceFrequency) {
      toast.error("Please select a recurrence frequency");
      return;
    }
    try {
      const closureData = {
        date: newClosure.date,
        reason: newClosure.reason,
        isRecurring: newClosure.isRecurring,
        recurrenceFrequency: newClosure.isRecurring ? newClosure.recurrenceFrequency : null,
      };
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ closure: closureData }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setClosures((prev) => [...prev, { ...closureData, id: data.id }]);
      setNewClosure({ date: "", reason: "", isRecurring: false, recurrenceFrequency: "" });
      toast.success("Closure added.");
    } catch {
      toast.error("Failed to add closure");
    }
  }

  async function deleteClosure(id: string) {
    try {
      await fetch(`/api/admin/settings?closureId=${id}`, { method: "DELETE" });
      setClosures((prev) => prev.filter((c) => c.id !== id));
      toast.success("Closure removed.");
    } catch {
      toast.error("Failed to remove closure");
    }
  }

  async function addSlot(dayOfWeek: number, mealPeriod: string) {
    const times = defaultTimes[mealPeriod];
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "operatingHour",
          dayOfWeek,
          mealPeriod,
          openTime: times.open,
          closeTime: times.close,
          maxCovers: 200,
        }),
      });
      if (!res.ok) throw new Error();
      const created = await res.json();
      setHours((prev) => [...prev, created]);
      setAddingSlotTo(null);
      toast.success(`${mealPeriod} slot added.`);
    } catch {
      toast.error("Failed to add slot");
    }
  }

  async function deleteSlot(id: string) {
    try {
      await fetch(`/api/admin/settings?type=operatingHour&id=${id}`, { method: "DELETE" });
      setHours((prev) => prev.filter((h) => h.id !== id));
      toast.success("Slot removed.");
    } catch {
      toast.error("Failed to remove slot");
    }
  }

  function updateHour(index: number, field: keyof OperatingHour, value: string | number | boolean) {
    setHours((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <h1 className="text-2xl font-bold">Settings</h1>

      {/* Operating Hours */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Operating Hours & Capacity</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {hours.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No operating hours configured. They will be seeded when the database is initialized.
            </p>
          )}

          {dayLabels.map((dayLabel, dayIndex) => {
            const dayHours = hours
              .map((h, i) => ({ ...h, _index: i }))
              .filter((h) => h.dayOfWeek === dayIndex);

            const usedPeriods = dayHours.map((h) => h.mealPeriod);
            const availablePeriods = mealPeriods.filter((p) => !usedPeriods.includes(p));

            return (
              <div key={dayIndex}>
                <h3 className="mb-2 text-sm font-semibold">{dayLabel}</h3>
                <div className="space-y-2">
                  {dayHours.length === 0 && (
                    <p className="text-xs text-muted-foreground">No slots — closed</p>
                  )}
                  {dayHours.map((h) => (
                    <div
                      key={h._index}
                      className="flex flex-wrap items-center gap-2 rounded border p-2"
                    >
                      <Badge variant="secondary" className="text-xs">
                        {h.mealPeriod}
                      </Badge>
                      <Input
                        type="time"
                        value={h.openTime}
                        onChange={(e) =>
                          updateHour(h._index, "openTime", e.target.value)
                        }
                        className="w-[120px]"
                      />
                      <span className="text-xs text-muted-foreground">to</span>
                      <Input
                        type="time"
                        value={h.closeTime}
                        onChange={(e) =>
                          updateHour(h._index, "closeTime", e.target.value)
                        }
                        className="w-[120px]"
                      />
                      <div className="flex items-center gap-1">
                        <Label className="text-xs">Max:</Label>
                        <Input
                          type="number"
                          value={h.maxCovers}
                          onChange={(e) =>
                            updateHour(
                              h._index,
                              "maxCovers",
                              parseInt(e.target.value) || 0
                            )
                          }
                          className="w-[80px]"
                        />
                      </div>
                      {h.id && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => deleteSlot(h.id!)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      )}
                    </div>
                  ))}

                  {availablePeriods.length > 0 && (
                    addingSlotTo === dayIndex ? (
                      <div className="flex items-center gap-2">
                        {availablePeriods.map((period) => (
                          <Button
                            key={period}
                            variant="outline"
                            size="sm"
                            className="text-xs"
                            onClick={() => addSlot(dayIndex, period)}
                          >
                            {period}
                          </Button>
                        ))}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-xs"
                          onClick={() => setAddingSlotTo(null)}
                        >
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs"
                        onClick={() => setAddingSlotTo(dayIndex)}
                      >
                        <Plus className="mr-1 h-3 w-3" /> Add Slot
                      </Button>
                    )
                  )}
                </div>
              </div>
            );
          })}

          <Button onClick={saveHours} disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
              </>
            ) : (
              "Save Hours"
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Special Closures */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Special Closures</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {closures.length > 0 && (
            <div className="space-y-2">
              {closures.map((c) => (
                <div
                  key={c.id}
                  className="flex items-center justify-between rounded border p-2"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{c.date}</span>
                    {c.reason && (
                      <span className="text-sm text-muted-foreground">
                        — {c.reason}
                      </span>
                    )}
                    {c.isRecurring && c.recurrenceFrequency && (
                      <Badge variant="secondary" className="text-xs">
                        <Repeat className="mr-1 h-3 w-3" />
                        {c.recurrenceFrequency.charAt(0) + c.recurrenceFrequency.slice(1).toLowerCase()}
                      </Badge>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => c.id && deleteClosure(c.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          <Separator />

          <div className="space-y-2">
            <div className="flex flex-col gap-2 sm:flex-row">
              <Input
                type="date"
                value={newClosure.date}
                onChange={(e) =>
                  setNewClosure((prev) => ({ ...prev, date: e.target.value }))
                }
                className="sm:w-[180px]"
              />
              <Input
                placeholder="Reason (optional)"
                value={newClosure.reason}
                onChange={(e) =>
                  setNewClosure((prev) => ({ ...prev, reason: e.target.value }))
                }
              />
              <Button onClick={addClosure} variant="outline">
                <Plus className="mr-1 h-4 w-4" /> Add
              </Button>
            </div>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={newClosure.isRecurring}
                  onChange={(e) =>
                    setNewClosure((prev) => ({
                      ...prev,
                      isRecurring: e.target.checked,
                      recurrenceFrequency: e.target.checked ? prev.recurrenceFrequency : "",
                    }))
                  }
                  className="h-4 w-4 rounded border"
                />
                Recurring
              </label>
              {newClosure.isRecurring && (
                <select
                  value={newClosure.recurrenceFrequency}
                  onChange={(e) =>
                    setNewClosure((prev) => ({ ...prev, recurrenceFrequency: e.target.value }))
                  }
                  className="h-9 rounded-md border bg-background px-3 text-sm"
                >
                  <option value="">Select frequency</option>
                  <option value="WEEKLY">Weekly</option>
                  <option value="MONTHLY">Monthly</option>
                  <option value="YEARLY">Yearly</option>
                </select>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
