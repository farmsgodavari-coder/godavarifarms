import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const states = await prisma.state.findMany({
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    });
    return NextResponse.json(states);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to fetch states" }, { status: 500 });
  }
}
