import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const now = new Date();
    const items = await prisma.announcement.findMany({
      where: {
        published: true,
        AND: [
          { OR: [{ startAt: null }, { startAt: { lte: now } }] },
          { OR: [{ endAt: null }, { endAt: { gte: now } }] },
        ],
      },
      orderBy: [{ isTicker: "asc" }, { id: "desc" }],
    });
    const ticker = items.filter(i => i.isTicker);
    return NextResponse.json({ items, ticker });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ items: [], ticker: [] });
  }
}
