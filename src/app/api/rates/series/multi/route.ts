import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// Groups OnionRate by day and by (size bucket x quality) into multiple series
// GET /api/rates/series/multi?dateFrom=&dateTo=
// Response: { labels: string[], series: { key: string, name: string, values: number[] }[], lastUpdated }
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const dateFrom = searchParams.get("dateFrom");
    const dateTo = searchParams.get("dateTo");

    const where: any = {};
    if (dateFrom || dateTo) {
      where.date = {};
      if (dateFrom) where.date.gte = new Date(dateFrom);
      if (dateTo) where.date.lte = new Date(dateTo);
    }

    // Pull last 60 days by default to keep chart tidy
    if (!dateFrom && !dateTo) {
      const d = new Date();
      d.setDate(d.getDate() - 60);
      where.date = { gte: d };
    }

    const rows = await prisma.onionRate.findMany({
      where,
      select: { date: true, sizeMm: true, quality: true, pricePerKg: true },
      orderBy: { date: "asc" },
    });

    // Build day labels
    const daySet = new Set<string>();
    for (const r of rows) daySet.add(r.date.toISOString().slice(0, 10));
    const labels = Array.from(daySet).sort();

    // Bucket helper
    const bucket = (mm: number) => (mm <= 35 ? "SMALL" : mm <= 55 ? "MEDIUM" : "LARGE");

    // Aggregate: map[day][seriesKey] => { sum, count }
    const agg: Record<string, Record<string, { sum: number; count: number }>> = {};
    for (const r of rows) {
      const day = r.date.toISOString().slice(0, 10);
      const key = `${bucket(r.sizeMm)}-${r.quality}`;
      agg[day] ||= {};
      agg[day][key] ||= { sum: 0, count: 0 };
      agg[day][key].sum += Number(r.pricePerKg);
      agg[day][key].count += 1;
    }

    // Collect keys encountered to build consistent series arrays
    const keySet = new Set<string>();
    for (const day of Object.keys(agg)) {
      for (const k of Object.keys(agg[day])) keySet.add(k);
    }
    const keys = Array.from(keySet).sort();

    const series = keys.map((key) => ({
      key,
      name: key.replace("-", " / "),
      values: labels.map((day) => {
        const stat = agg[day]?.[key];
        return stat ? +(stat.sum / stat.count).toFixed(2) : null;
      }),
    }));

    const lastRate = await prisma.onionRate.findFirst({ orderBy: { updatedAt: "desc" } });

    const res = NextResponse.json({ labels, series, lastUpdated: lastRate?.updatedAt ?? null });
    res.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    return res;
  } catch (e: any) {
    console.error("[/api/rates/series/multi] error", e);
    return NextResponse.json({ error: e?.message || "Failed" }, { status: 500 });
  }
}
