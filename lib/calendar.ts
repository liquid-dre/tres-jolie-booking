import ical, { ICalCalendarMethod } from "ical-generator";
import { format } from "date-fns";
import { formatTime, MEAL_PERIOD_LABELS } from "./booking-utils";

type CalendarEventData = {
  date: string;
  time: string;
  mealPeriod: string;
  partySize: number;
  reference: string;
  guestName: string;
  cancelToken?: string;
};

export function generateIcsContent(data: CalendarEventData): string {
  const [year, month, day] = data.date.split("-").map(Number);
  const [hours, minutes] = data.time.split(":").map(Number);

  const start = new Date(year, month - 1, day, hours, minutes);
  const end = new Date(start.getTime() + 2 * 60 * 60 * 1000); // 2 hours

  const mealLabel =
    MEAL_PERIOD_LABELS[data.mealPeriod as string] || data.mealPeriod;

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  const cal = ical({
    method: ICalCalendarMethod.PUBLISH,
    name: "Tres Jolie Booking",
  });

  cal.createEvent({
    start,
    end,
    summary: `${mealLabel} at Tres Jolie`,
    description: [
      `Booking Reference: ${data.reference}`,
      `Party size: ${data.partySize}`,
      `Time: ${formatTime(data.time)}`,
      "",
      data.cancelToken
        ? `Cancel: ${appUrl}/book/cancel/${data.cancelToken}`
        : "",
      "",
      "Tres Jolie Restaurant",
      "Tel: 011 794 2473",
    ]
      .filter(Boolean)
      .join("\n"),
    location: "Tres Jolie Restaurant, Plot 22 Peter Road, Ruimsig, Johannesburg",
    url: `${appUrl}/book/confirmation/${data.reference}`,
  });

  return cal.toString();
}

export function generateGoogleCalendarUrl(data: CalendarEventData): string {
  const [year, month, day] = data.date.split("-").map(Number);
  const [hours, minutes] = data.time.split(":").map(Number);

  const start = new Date(year, month - 1, day, hours, minutes);
  const end = new Date(start.getTime() + 2 * 60 * 60 * 1000);

  const mealLabel =
    MEAL_PERIOD_LABELS[data.mealPeriod as string] || data.mealPeriod;

  const formatGoogleDate = (d: Date) => format(d, "yyyyMMdd'T'HHmmss");

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: `${mealLabel} at Tres Jolie`,
    dates: `${formatGoogleDate(start)}/${formatGoogleDate(end)}`,
    details: `Booking Ref: ${data.reference}\nParty size: ${data.partySize}\nTime: ${formatTime(data.time)}`,
    location:
      "Tres Jolie Restaurant, Plot 22 Peter Road, Ruimsig, Johannesburg",
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
