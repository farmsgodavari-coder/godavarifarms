import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth/session";
import { z } from "zod";
import events from "@/lib/events";
import { Packing, Quality, RateType } from "@prisma/client";

const updateSchema = z.object({
  date: z.string().optional(),
  rateType: z.enum(["DOMESTIC", "EXPORT"]).optional(),
  stateId: z.number().int().positive().nullable().optional(),
  mandiId: z.number().int().positive().nullable().optional(),
  quality: z.enum(["LOW", "MEDIUM", "HIGH"]).optional(),
  country: z.string().min(1).nullable().optional(),
  sizeMm: z.number().int().positive().optional(),
  packing: z.enum(["LOOSE", "BAG", "BOX"]).optional(),
  packingDescription: z.string().nullable().optional(),
  pricePerKg: z.number().positive().optional(),
});

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid rate ID" }, { status: 400 });
    }

    const json = await req.json();
    const parsed = updateSchema.parse(json);

    // Check if rate exists
    const existing = await prisma.onionRate.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json({ error: "Rate not found" }, { status: 404 });
    }

    // Update the rate
    const updated = await prisma.onionRate.update({
      where: { id },
      data: {
        ...(parsed.date && { date: new Date(parsed.date) }),
        ...(parsed.rateType && { rateType: parsed.rateType as RateType }),
        ...(parsed.stateId !== undefined && { stateId: parsed.stateId }),
        ...(parsed.mandiId !== undefined && { mandiId: parsed.mandiId }),
        ...(parsed.quality && { quality: parsed.quality as Quality }),
        ...(parsed.country !== undefined && { country: parsed.country }),
        ...(parsed.sizeMm && { sizeMm: parsed.sizeMm }),
        ...(parsed.packing && { packing: parsed.packing as Packing }),
        ...(parsed.packingDescription !== undefined && { packingDescription: parsed.packingDescription }),
        ...(parsed.pricePerKg && { pricePerKg: parsed.pricePerKg }),
      },
      include: { state: true, mandi: true },
    });

    events.emit("rate:updated", { type: "rate:updated", payload: { id: updated.id } });
    return NextResponse.json(updated);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Failed to update rate";
    console.error(e);
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid rate ID" }, { status: 400 });
    }

    // Check if rate exists
    const existing = await prisma.onionRate.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json({ error: "Rate not found" }, { status: 404 });
    }

    // Delete the rate
    await prisma.onionRate.delete({
      where: { id },
    });

    events.emit("rate:deleted", { type: "rate:deleted", payload: { id } });
    return NextResponse.json({ success: true, message: "Rate deleted successfully" });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Failed to delete rate";
    console.error(e);
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
