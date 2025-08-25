import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const stateId = searchParams.get("stateId");

    const where = stateId ? { stateId: Number(stateId) } : {};

    const mandis = await prisma.mandi.findMany({
      where,
      orderBy: { name: "asc" },
    });
    return NextResponse.json(mandis);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to fetch mandis" }, { status: 500 });
  }
}
