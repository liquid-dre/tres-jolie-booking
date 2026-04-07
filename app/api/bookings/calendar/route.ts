import { NextRequest, NextResponse } from "next/server";
import { generateIcsContent } from "@/lib/calendar";

export async function POST(request: NextRequest) {
  const data = await request.json();

  const icsContent = generateIcsContent(data);

  return new NextResponse(icsContent, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="tres-jolie-${data.reference}.ics"`,
    },
  });
}
