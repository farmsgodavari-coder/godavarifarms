import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  const started = Date.now();
  try {
    // Simple connectivity check
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json({
      ok: true,
      db: "connected",
      latencyMs: Date.now() - started,
      time: new Date().toISOString(),
    });
  } catch (e: any) {
    // eslint-disable-next-line no-console
    console.error("/api/health DB check failed:", e?.message || e);
    return NextResponse.json(
      {
        ok: false,
        db: "disconnected",
        error: e?.message || String(e),
        time: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
