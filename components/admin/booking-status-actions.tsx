"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { CheckCircle, XCircle, Ban, Clock } from "lucide-react";

type Props = {
  bookingId: string;
  currentStatus: string;
};

const actions = [
  { status: "CONFIRMED", label: "Confirm", icon: CheckCircle, variant: "default" as const },
  { status: "COMPLETED", label: "Mark Completed", icon: Clock, variant: "secondary" as const },
  { status: "NO_SHOW", label: "No Show", icon: Ban, variant: "outline" as const },
  { status: "CANCELLED", label: "Cancel", icon: XCircle, variant: "destructive" as const },
];

export function BookingStatusActions({ bookingId, currentStatus }: Props) {
  const router = useRouter();

  async function updateStatus(newStatus: string) {
    try {
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error("Failed to update");

      toast.success(`Booking marked as ${newStatus.toLowerCase()}.`);
      router.refresh();
    } catch {
      toast.error("Failed to update booking status.");
    }
  }

  const available = actions.filter((a) => a.status !== currentStatus);

  return (
    <div className="flex flex-wrap gap-2">
      {available.map((action) => (
        <Button
          key={action.status}
          variant={action.variant}
          size="sm"
          onClick={() => updateStatus(action.status)}
        >
          <action.icon className="mr-1 h-3.5 w-3.5" />
          {action.label}
        </Button>
      ))}
    </div>
  );
}
