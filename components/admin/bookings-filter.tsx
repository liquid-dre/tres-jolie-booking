"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCallback } from "react";

const statuses = [
  { value: "ALL", label: "All Statuses" },
  { value: "CONFIRMED", label: "Confirmed" },
  { value: "WAITLISTED", label: "Waitlisted" },
  { value: "CANCELLED", label: "Cancelled" },
  { value: "NO_SHOW", label: "No Show" },
  { value: "COMPLETED", label: "Completed" },
];

type Props = {
  currentStatus?: string;
  currentDate?: string;
  currentSearch?: string;
};

export function BookingsFilter({ currentStatus, currentDate, currentSearch }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateParams = useCallback(
    (key: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value && value !== "ALL") {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      router.push(`/admin/bookings?${params.toString()}`);
    },
    [router, searchParams]
  );

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <Input
        placeholder="Search name, email, or reference..."
        defaultValue={currentSearch}
        onChange={(e) => {
          const timeout = setTimeout(
            () => updateParams("search", e.target.value),
            300
          );
          return () => clearTimeout(timeout);
        }}
        className="sm:max-w-xs"
      />
      <Select
        defaultValue={currentStatus || "ALL"}
        onValueChange={(v) => updateParams("status", v)}
      >
        <SelectTrigger className="sm:w-[160px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {statuses.map((s) => (
            <SelectItem key={s.value} value={s.value}>
              {s.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Input
        type="date"
        defaultValue={currentDate}
        onChange={(e) => updateParams("date", e.target.value)}
        className="sm:w-[180px]"
      />
    </div>
  );
}
