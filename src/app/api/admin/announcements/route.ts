import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";
import { getSessionUser } from "@/lib/auth/session";

const createSchema = z.object({
  title: z.string().min(1),
  body: z.string().min(1),
  isTicker: z.boolean().optional().default(false),
  published: z.boolean().optional().default(false),
  startAt: z.string().datetime().optional(),
  endAt: z.string().datetime().optional(),
});

export async function GET() {
  const items = await prisma.announcement.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(items);
}

export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await req.json();
    const data = createSchema.parse(body);
    const created = await prisma.announcement.create({
      data: {
        title: data.title,
        body: data.body,
        isTicker: data.isTicker,
        published: data.published,
        startAt: data.startAt ? new Date(data.startAt) : null,
        endAt: data.endAt ? new Date(data.endAt) : null,
      },
    });
    return NextResponse.json(created);
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Invalid data" }, { status: 400 });
  }
}
