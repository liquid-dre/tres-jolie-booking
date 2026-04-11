import { NextResponse } from "next/server";

export async function GET() {
  const checks: Record<string, unknown> = {
    timestamp: new Date().toISOString(),
    DATABASE_URL: process.env.DATABASE_URL ? "set" : "MISSING",
  };

  // Try to connect to the database
  try {
    const { prisma } = await import("@/lib/db");
    await prisma.$queryRawUnsafe("SELECT 1");
    checks.database = "connected";
  } catch (error) {
    checks.database = "error";
    checks.databaseError = error instanceof Error ? error.message : String(error);
  }

  const ok = checks.DATABASE_URL === "set" && checks.database === "connected";
  return NextResponse.json(checks, { status: ok ? 200 : 500 });
}
