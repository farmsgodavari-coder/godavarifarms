import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

function ymd(d: Date) {
  return d.toISOString().slice(0,10);
}

export async function GET() {
  const now = new Date();
  const startToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const start7 = new Date(startToday);
  start7.setDate(start7.getDate() - 6); // inclusive 7 days

  // Fetch last 7 days rates
  const rates = await prisma.onionRate.findMany({
    where: { date: { gte: start7 } },
    select: { date: true, pricePerKg: true },
    orderBy: { date: "asc" },
  });

  // Aggregate by date (YYYY-MM-DD)
  const byDay: Record<string, { sum: number; count: number }> = {};
  for (const r of rates) {
    const k = ymd(new Date(r.date));
    if (!byDay[k]) byDay[k] = { sum: 0, count: 0 };
    byDay[k].sum += Number(r.pricePerKg);
    byDay[k].count += 1;
  }
  const last7: Array<{ date: string; avg: number }> = Object.entries(byDay)
    .sort((a,b) => a[0].localeCompare(b[0]))
    .map(([date, v]) => ({ date, avg: v.count ? Number((v.sum / v.count).toFixed(2)) : 0 }));

  const todayKey = ymd(startToday);
  const todayAvg = last7.find(d => d.date === todayKey)?.avg ?? null;

  const [announcementsTotal, ratesTotal] = await Promise.all([
    prisma.announcement.count(),
    prisma.onionRate.count(),
  ]);

  return NextResponse.json({ todayAvg, last7, counts: { announcementsTotal, ratesTotal } });
}
