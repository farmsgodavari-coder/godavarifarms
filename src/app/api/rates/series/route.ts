import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// GET /api/rates/series?stateId=&mandiId=&quality=&sizeMin=&sizeMax=&dateFrom=&dateTo=
// Returns time series [{ date: string (YYYY-MM-DD), avgPrice: number, count: number }]
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const stateId = searchParams.get("stateId");
    const mandiId = searchParams.get("mandiId");
    const quality = searchParams.get("quality") as "LOW" | "MEDIUM" | "HIGH" | null;
    const sizeMin = searchParams.get("sizeMin");
    const sizeMax = searchParams.get("sizeMax");
    const dateFrom = searchParams.get("dateFrom");
    const dateTo = searchParams.get("dateTo");

    const where: Prisma.OnionRateWhereInput = {};
    if (stateId) where.stateId = Number(stateId);
    if (mandiId) where.mandiId = Number(mandiId);
    if (quality) where.quality = quality;
    if (sizeMin || sizeMax) {
      where.sizeMm = {};
      if (sizeMin) where.sizeMm.gte = Number(sizeMin);
      if (sizeMax) where.sizeMm.lte = Number(sizeMax);
    }
    if (dateFrom || dateTo) {
      where.date = {};
      if (dateFrom) where.date.gte = new Date(dateFrom);
      if (dateTo) where.date.lte = new Date(dateTo);
    }

    // Prisma groupBy by date
    const groups = await prisma.onionRate.groupBy({
      by: ["date"],
      where,
      _avg: { pricePerKg: true },
      _count: { _all: true },
      orderBy: { date: "asc" },
    });

    type GroupRow = {
      date: Date | string;
      _avg: { pricePerKg: number | null } | null;
      _count: { _all: number } | null;
    };

    const data = (groups as GroupRow[]).map((g) => {
      const asDate = typeof g.date === "string" ? new Date(g.date) : g.date;
      const price = g._avg?.pricePerKg ?? 0;
      const cnt = g._count?._all ?? 0;
      return {
        date: new Date(asDate).toISOString().slice(0, 10),
        avgPrice: Number(price),
        count: Number(cnt),
      };
    });

    const lastRate = await prisma.onionRate.findFirst({ orderBy: { updatedAt: "desc" } });

    const res = NextResponse.json({ data, lastUpdated: lastRate?.updatedAt ?? null });
    res.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    return res;
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Failed" }, { status: 500 });
  }
}
