import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";

// Convert internal quality enum to user-friendly label
function qualityLabel(q?: string | null) {
  if (!q) return "Standard";
  if (q === "HIGH") return "Premium";
  if (q === "MEDIUM") return "Grade A";
  return "Standard";
}

export async function GET() {
  const start = Date.now();
  try {
    // Fetch the most recent 50 entries
    const items = await prisma.onionRate.findMany({
      orderBy: { date: "desc" },
      take: 50,
      include: {
        state: { select: { id: true, name: true } },
        mandi: { select: { id: true, name: true } },
      },
    });

    const data = items.map((item: any) => {
      const avg = Number(item.pricePerKg ?? 0);
      // Derive a simple min/max band around avg when only avg is stored
      const minPrice = Math.max(0, Math.floor(avg - 200));
      const maxPrice = Math.max(avg, Math.ceil(avg + 300));

      return {
        id: String(item.id ?? `${item.mandiId ?? ""}-${item.date?.toISOString?.() ?? Date.now()}`),
        date: (item.date instanceof Date ? item.date : new Date(item.date)).toISOString(),
        variety: item.variety ?? "Red Onion",
        location: `${item.mandi?.name ?? "Unknown"}, ${item.state?.name ?? "India"}`,
        minPrice,
        maxPrice,
        avgPrice: avg,
        quality: qualityLabel(item.quality),
        unit: "per kg",
        packing: item.packing || "BAG",
        packingDescription: item.packingDescription || null,
        rateType: item.rateType || "DOMESTIC",
        country: item.country || null,
        sizeMm: item.sizeMm || null,
      };
    });

    const res = NextResponse.json({ success: true, data, count: data.length, timestamp: new Date().toISOString() });
    res.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    res.headers.set("Pragma", "no-cache");
    res.headers.set("Expires", "0");
    res.headers.set("X-Response-Time", `${Date.now() - start}ms`);
    return res;
  } catch (error: any) {
    console.error("/api/public/rates error:", { message: error?.message, code: error?.code });

    const fallback = [
      {
        id: "fallback-1",
        date: new Date().toISOString(),
        variety: "Red Onion",
        location: "Nashik, Maharashtra",
        minPrice: 2500,
        maxPrice: 3200,
        avgPrice: 2850,
        quality: "Premium",
        unit: "per quintal",
        packing: "BAG",
        packingDescription: "25 KG Jute Bag",
        rateType: "DOMESTIC",
        country: null,
        sizeMm: 55,
      },
    ];

    const res = NextResponse.json({ success: false, fallback, error: "Service unavailable" }, { status: 503 });
    res.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    res.headers.set("Pragma", "no-cache");
    res.headers.set("Expires", "0");
    return res;
  }
}
