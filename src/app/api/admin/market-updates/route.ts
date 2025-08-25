import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";
import { getSessionUser } from "@/lib/auth/session";

const createSchema = z.object({
  date: z.string().datetime().optional(),
  text: z.string().min(1),
});

export async function GET() {
  const items = await prisma.marketUpdate.findMany({ orderBy: { date: "desc" } });
  return NextResponse.json(items);
}

export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await req.json();
    const data = createSchema.parse(body);
    const created = await prisma.marketUpdate.create({
      data: {
        text: data.text,
        date: data.date ? new Date(data.date) : undefined,
      },
    });
    return NextResponse.json(created);
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Invalid data" }, { status: 400 });
  }
}
