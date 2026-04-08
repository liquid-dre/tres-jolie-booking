import { prisma } from "@/lib/db";
import { formatDate, formatTime, MEAL_PERIOD_LABELS } from "@/lib/booking-utils";
import { PrintButton } from "./print-button";

export const dynamic = "force-dynamic";

const SECTION_LABELS: Record<string, string> = {
  INDOOR: "Indoor",
  OUTDOOR: "Outdoor",
  NO_PREFERENCE: "—",
};

export default async function PrintBookingsPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  const params = await searchParams;

  const targetDate = params.date ? new Date(params.date) : new Date();
  targetDate.setHours(0, 0, 0, 0);

  const bookings = await prisma.booking.findMany({
    where: {
      date: targetDate,
      status: { in: ["CONFIRMED", "WAITLISTED"] },
    },
    orderBy: { time: "asc" },
  });

  const mealOrder = ["BREAKFAST", "LUNCH", "DINNER"] as const;

  const grouped = bookings.reduce(
    (acc, b) => {
      const period = b.mealPeriod as string;
      if (!acc[period]) acc[period] = [];
      acc[period].push(b);
      return acc;
    },
    {} as Record<string, typeof bookings>
  );

  const totalCovers = bookings.reduce((sum, b) => sum + b.partySize, 0);

  return (
    <div className="mx-auto max-w-[900px] p-6 print:p-4">
      {/* Header */}
      <div className="mb-6 border-b-2 border-black pb-4 print:mb-4 print:pb-2">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold print:text-xl">TRES JOLIE</h1>
            <p className="text-lg font-semibold print:text-base">
              {formatDate(targetDate)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold print:text-base">
              {bookings.length} booking{bookings.length !== 1 ? "s" : ""}
            </p>
            <p className="text-sm text-gray-600">
              {totalCovers} cover{totalCovers !== 1 ? "s" : ""} total
            </p>
          </div>
        </div>

        {/* Meal period summary */}
        <div className="mt-3 flex gap-6 text-sm">
          {mealOrder.map((period) => {
            const periodBookings = grouped[period] || [];
            const periodCovers = periodBookings.reduce((s, b) => s + b.partySize, 0);
            return (
              <span key={period} className="font-medium">
                {MEAL_PERIOD_LABELS[period]}: {periodBookings.length}b / {periodCovers}p
              </span>
            );
          })}
        </div>
      </div>

      {/* Meal period sections */}
      {mealOrder.map((period) => {
        const periodBookings = grouped[period];
        if (!periodBookings || periodBookings.length === 0) return null;

        return (
          <div key={period} className="mb-6 print:mb-4">
            <h2 className="mb-2 border-b border-gray-300 pb-1 text-base font-bold uppercase tracking-wide">
              {MEAL_PERIOD_LABELS[period]}
              <span className="ml-2 text-sm font-normal text-gray-600">
                ({periodBookings.length} booking{periodBookings.length !== 1 ? "s" : ""},{" "}
                {periodBookings.reduce((s, b) => s + b.partySize, 0)} covers)
              </span>
            </h2>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-xs font-semibold uppercase text-gray-500">
                  <th className="py-1 pr-3">Time</th>
                  <th className="py-1 pr-3">Guest</th>
                  <th className="py-1 pr-3 text-center">Pax</th>
                  <th className="py-1 pr-3 text-center">Kids</th>
                  <th className="py-1 pr-3">Seating</th>
                  <th className="py-1">Special Requests</th>
                </tr>
              </thead>
              <tbody>
                {periodBookings.map((b) => (
                  <tr key={b.id} className="border-b border-gray-200">
                    <td className="py-1.5 pr-3 font-medium tabular-nums">
                      {formatTime(b.time)}
                    </td>
                    <td className="py-1.5 pr-3">
                      <span className="font-medium">{b.guestName}</span>
                      {b.status === "WAITLISTED" && (
                        <span className="ml-1 text-xs font-semibold text-amber-600">
                          [WAIT]
                        </span>
                      )}
                    </td>
                    <td className="py-1.5 pr-3 text-center font-bold">
                      {b.partySize}
                    </td>
                    <td className="py-1.5 pr-3 text-center">
                      {b.childrenCount > 0 ? b.childrenCount : "—"}
                    </td>
                    <td className="py-1.5 pr-3">
                      {SECTION_LABELS[b.sectionPreference] || "—"}
                    </td>
                    <td className="py-1.5 text-xs text-gray-600">
                      {b.specialRequests || "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      })}

      {bookings.length === 0 && (
        <p className="py-12 text-center text-lg text-gray-400">
          No bookings for this date.
        </p>
      )}

      {/* Footer */}
      <div className="mt-8 border-t border-gray-300 pt-2 text-xs text-gray-400 print:mt-4">
        Printed from Tres Jolie Admin
      </div>

      {/* Print button — hidden in print */}
      <div className="fixed bottom-6 right-6 flex gap-2 print:hidden">
        <PrintButton />
      </div>
    </div>
  );
}
