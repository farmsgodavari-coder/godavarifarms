import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth/session";
import { z } from "zod";
import events from "@/lib/events";
import { Packing, Quality, RateType } from "@prisma/client";

const createSchema = z.object({
  date: z.string(), // ISO date
  rateType: z.enum(["DOMESTIC", "EXPORT"]).default("DOMESTIC"),
  // DOMESTIC fields
  stateId: z.number().int().positive().nullable().optional(),
  mandiId: z.number().int().positive().nullable().optional(),
  quality: z.enum(["LOW", "MEDIUM", "HIGH"]).nullable().optional(),
  // EXPORT fields
  country: z.string().min(1).nullable().optional(),
  // Common
  sizeMm: z.number().int().positive(),
  packing: z.enum(["LOOSE", "BAG", "BOX"]),
  pricePerKg: z.number().positive(),
});

export async function GET(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { searchParams } = new URL(req.url);
    const page = Number(searchParams.get("page") || 1);
    const pageSize = Number(searchParams.get("pageSize") || 20);
    const skip = (page - 1) * pageSize;

    const [items, total] = await Promise.all([
      prisma.onionRate.findMany({
        orderBy: { date: "desc" },
        include: { state: true, mandi: true },
        skip,
        take: pageSize,
      }),
      prisma.onionRate.count(),
    ]);

    return NextResponse.json({ items, total, page, pageSize });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to fetch rates" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const json = await req.json();
    const parsed = createSchema.parse(json);
    // Validate per type
    if (parsed.rateType === "DOMESTIC") {
      if (!parsed.stateId || !parsed.mandiId || !parsed.quality) {
        return NextResponse.json({ error: "stateId, mandiId and quality are required for DOMESTIC" }, { status: 400 });
      }
    } else if (parsed.rateType === "EXPORT") {
      if (!parsed.country) {
        return NextResponse.json({ error: "country is required for EXPORT" }, { status: 400 });
      }
      // default quality to MEDIUM for export if not provided
      if (!parsed.quality) (parsed as any).quality = "MEDIUM";
      (parsed as any).stateId = parsed.stateId ?? null;
      (parsed as any).mandiId = parsed.mandiId ?? null;
    }

    const existing = await prisma.onionRate.findFirst({
      where: ({
        rateType: parsed.rateType as RateType,
        date: new Date(parsed.date),
        ...(parsed.stateId === undefined ? { stateId: { equals: null } } : { stateId: parsed.stateId }),
        ...(parsed.mandiId === undefined ? { mandiId: { equals: null } } : { mandiId: parsed.mandiId }),
        ...(parsed.country === undefined ? { country: { equals: null } } : { country: parsed.country }),
        quality: parsed.quality as Quality,
        sizeMm: parsed.sizeMm,
        packing: parsed.packing as Packing,
      } as any),
    });

    if (existing) {
      const updated = await prisma.onionRate.update({
        where: { id: existing.id },
        data: { pricePerKg: parsed.pricePerKg },
      });
      events.emit("rate:updated", { type: "rate:updated", payload: { id: updated.id } });
      return NextResponse.json(updated);
    }

    const created = await prisma.onionRate.create({
      data: {
        rateType: parsed.rateType as RateType,
        date: new Date(parsed.date),
        ...(parsed.rateType === "DOMESTIC" ? { stateId: parsed.stateId!, mandiId: parsed.mandiId! } : {}),
        ...(parsed.rateType === "EXPORT" ? { country: parsed.country! } : {}),
        quality: parsed.quality as Quality,
        sizeMm: parsed.sizeMm,
        packing: parsed.packing as Packing,
        pricePerKg: parsed.pricePerKg,
      },
    });
    // Emit real-time event
    events.emit("rate:created", { type: "rate:created", payload: { id: created.id } });
    return NextResponse.json(created);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Failed to create";
    console.error(e);
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
