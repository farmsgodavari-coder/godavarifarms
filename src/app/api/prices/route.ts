import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { Packing, Quality, Size } from "@prisma/client";

const createPriceSchema = z.object({
  date: z.coerce.date(),
  stateId: z.number().int().positive(),
  mandiId: z.number().int().positive(),
  size: z.nativeEnum(Size),
  quality: z.nativeEnum(Quality),
  packing: z.nativeEnum(Packing),
  minPrice: z.number().nonnegative(),
  avgPrice: z.number().nonnegative(),
  maxPrice: z.number().nonnegative(),
});

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const stateId = searchParams.get("stateId");
    const mandiId = searchParams.get("mandiId");
    const size = searchParams.get("size") as keyof typeof Size | null;
    const quality = searchParams.get("quality") as keyof typeof Quality | null;
    const packing = searchParams.get("packing") as keyof typeof Packing | null;
    const dateFrom = searchParams.get("dateFrom");
    const dateTo = searchParams.get("dateTo");

    const page = Number(searchParams.get("page") || 1);
    const pageSize = Math.min(Number(searchParams.get("pageSize") || 20), 100);
    const skip = (page - 1) * pageSize;

    const where: any = {};
    if (stateId) where.stateId = Number(stateId);
    if (mandiId) where.mandiId = Number(mandiId);
    if (size) where.size = Size[size];
    if (quality) where.quality = Quality[quality];
    if (packing) where.packing = Packing[packing];

    if (dateFrom || dateTo) {
      where.date = {} as any;
      if (dateFrom) (where.date as any).gte = new Date(dateFrom);
      if (dateTo) (where.date as any).lte = new Date(dateTo);
    }

    const [data, total] = await Promise.all([
      prisma.dailyPrice.findMany({
        where,
        orderBy: { date: "desc" },
        skip,
        take: pageSize,
        include: { state: true, mandi: true },
      }),
      prisma.dailyPrice.count({ where }),
    ]);

    return NextResponse.json({
      data,
      pagination: { total, page, pageSize, totalPages: Math.ceil(total / pageSize) },
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to fetch prices" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const parsed = createPriceSchema.parse(json);

    const key = {
      date: new Date(parsed.date.getFullYear(), parsed.date.getMonth(), parsed.date.getDate()),
      stateId: parsed.stateId,
      mandiId: parsed.mandiId,
      size: parsed.size,
      quality: parsed.quality,
      packing: parsed.packing,
    } as const;

    const rec = await prisma.dailyPrice.upsert({
      where: { date_stateId_mandiId_size_quality_packing: key },
      update: {
        minPrice: parsed.minPrice,
        avgPrice: parsed.avgPrice,
        maxPrice: parsed.maxPrice,
      },
      create: { ...key, minPrice: parsed.minPrice, avgPrice: parsed.avgPrice, maxPrice: parsed.maxPrice },
      include: { state: true, mandi: true },
    });

    return NextResponse.json(rec, { status: 201 });
  } catch (e: any) {
    if (e?.name === "ZodError") {
      return NextResponse.json({ error: e.errors }, { status: 400 });
    }
    console.error(e);
    return NextResponse.json({ error: "Failed to insert price" }, { status: 500 });
  }
}
