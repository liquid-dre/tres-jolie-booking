"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export function CancelBookingButton({ token }: { token: string }) {
  const router = useRouter();
  const [cancelling, setCancelling] = useState(false);

  async function handleCancel() {
    setCancelling(true);
    try {
      const res = await fetch(`/api/bookings/cancel/${token}`, {
        method: "POST",
      });

      if (!res.ok) {
        throw new Error("Failed to cancel booking");
      }

      toast.success("Booking cancelled. A confirmation email has been sent.");
      router.refresh();
    } catch {
      toast.error("Something went wrong. Please try again or call us.");
      setCancelling(false);
    }
  }

  return (
    <div className="mt-4 flex flex-col gap-2">
      <Button
        variant="destructive"
        onClick={handleCancel}
        disabled={cancelling}
        className="w-full"
      >
        {cancelling ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Cancelling...
          </>
        ) : (
          "Yes, Cancel My Booking"
        )}
      </Button>
      <Button
        variant="outline"
        onClick={() => window.history.back()}
        disabled={cancelling}
        className="w-full"
      >
        Keep My Booking
      </Button>
    </div>
  );
}
