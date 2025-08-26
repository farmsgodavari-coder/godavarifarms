import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

async function withRetry<T>(fn: () => Promise<T>, tries = 2): Promise<T> {
  let lastErr: any;
  for (let i = 0; i < tries; i++) {
    try {
      return await fn();
    } catch (e: any) {
      lastErr = e;
      if (e?.code === "P2024") {
        await new Promise((r) => setTimeout(r, 200 * (i + 1)));
        continue;
      }
      throw e;
    }
  }
  throw lastErr;
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const rateType = searchParams.get("rateType") as "DOMESTIC" | "EXPORT" | null;
    const country = searchParams.get("country");
    const stateId = searchParams.get("stateId");
    const mandiId = searchParams.get("mandiId");
    const quality = searchParams.get("quality") as "LOW" | "MEDIUM" | "HIGH" | null;
    const packing = searchParams.get("packing") as "LOOSE" | "BAG" | "BOX" | null;
    const sizeMin = searchParams.get("sizeMin");
    const sizeMax = searchParams.get("sizeMax");
    const dateFrom = searchParams.get("dateFrom");
    const dateTo = searchParams.get("dateTo");

    const page = Math.max(1, Number(searchParams.get("page") || 1));
    const pageSize = Math.min(100, Number(searchParams.get("pageSize") || 20));
    const skip = (page - 1) * pageSize;

    const where: any = {};
    if (rateType) where.rateType = rateType;
    if (country) where.country = country;
    if (stateId) where.stateId = Number(stateId);
    if (mandiId) where.mandiId = Number(mandiId);
    if (quality) where.quality = quality;
    if (packing) where.packing = packing;

    if (sizeMin || sizeMax) {
      where.sizeMm = {} as any;
      if (sizeMin) where.sizeMm.gte = Number(sizeMin);
      if (sizeMax) where.sizeMm.lte = Number(sizeMax);
    }

    if (dateFrom || dateTo) {
      where.date = {} as any;
      if (dateFrom) where.date.gte = new Date(dateFrom);
      if (dateTo) where.date.lte = new Date(dateTo);
    }

    // Minimal queries with retry
    const items = await withRetry(() => prisma.onionRate.findMany({
      where,
      orderBy: { date: "desc" },
      include: {
        state: { select: { id: true, name: true } },
        mandi: { select: { id: true, name: true } },
      },
      skip,
      take: pageSize,
    }));

    let total = (page - 1) * pageSize + items.length;
    let totalPages = Math.max(1, Math.ceil(total / pageSize));
    try {
      const exactTotal = await withRetry(() => prisma.onionRate.count({ where }));
      total = exactTotal;
      totalPages = Math.max(1, Math.ceil(exactTotal / pageSize));
    } catch (e) {
      // Fallback: keep approximate totals; still return data without 500
      console.warn("/api/rates: count failed, using fallback totals", e);
      // Improve fallback if a full page returned (assume there may be more pages)
      if (items.length === pageSize) totalPages = page + 1;
    }

    // Derive lastUpdated from page items to avoid an extra query
    const lastUpdated = items.reduce<Date | null>((acc, it: any) => {
      const d = it?.updatedAt as Date | undefined;
      return d && (!acc || d > acc) ? d : acc;
    }, null);

    const res = NextResponse.json({
      data: items,
      lastUpdated: lastUpdated ?? null,
      pagination: { total, page, pageSize, totalPages },
    });
    res.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    return res;
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to fetch rates" }, { status: 500 });
  }
}
