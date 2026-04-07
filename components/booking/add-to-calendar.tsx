"use client";

import { Button } from "@/components/ui/button";
import { Calendar, Download } from "lucide-react";
import { generateGoogleCalendarUrl } from "@/lib/calendar";

type Props = {
  date: string;
  time: string;
  mealPeriod: string;
  partySize: number;
  reference: string;
  guestName: string;
  cancelToken?: string;
};

export function AddToCalendar(props: Props) {
  const googleUrl = generateGoogleCalendarUrl(props);

  async function downloadIcs() {
    const res = await fetch("/api/bookings/calendar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(props),
    });
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `tres-jolie-${props.reference}.ics`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="flex flex-col gap-2 sm:flex-row">
      <Button variant="outline" size="sm" asChild>
        <a href={googleUrl} target="_blank" rel="noopener noreferrer">
          <Calendar className="mr-2 h-4 w-4" />
          Google Calendar
        </a>
      </Button>
      <Button variant="outline" size="sm" onClick={downloadIcs}>
        <Download className="mr-2 h-4 w-4" />
        Apple / Outlook (.ics)
      </Button>
    </div>
  );
}
