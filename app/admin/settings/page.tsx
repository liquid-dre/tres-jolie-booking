"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Loader2, Plus, Trash2 } from "lucide-react";

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
};

const dayLabels = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const mealPeriods = ["BREAKFAST", "LUNCH", "DINNER"];

export default function SettingsPage() {
  const [hours, setHours] = useState<OperatingHour[]>([]);
  const [closures, setClosures] = useState<SpecialClosure[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newClosure, setNewClosure] = useState({ date: "", reason: "" });

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/admin/settings");
        const data = await res.json();
        setHours(data.hours || []);
        setClosures(
          (data.closures || []).map((c: { id: string; date: string; reason: string }) => ({
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
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ closure: newClosure }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setClosures((prev) => [...prev, { ...newClosure, id: data.id }]);
      setNewClosure({ date: "", reason: "" });
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

            if (dayHours.length === 0) return null;

            return (
              <div key={dayIndex}>
                <h3 className="mb-2 text-sm font-semibold">{dayLabel}</h3>
                <div className="space-y-2">
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
                    </div>
                  ))}
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
                  <div>
                    <span className="text-sm font-medium">{c.date}</span>
                    {c.reason && (
                      <span className="ml-2 text-sm text-muted-foreground">
                        — {c.reason}
                      </span>
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
        </CardContent>
      </Card>
    </div>
  );
}
