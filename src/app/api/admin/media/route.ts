import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";
import { getSessionUser } from "@/lib/auth/session";

const createSchema = z.object({
  kind: z.enum(["IMAGE", "BANNER", "DOC"]).default("IMAGE"),
  title: z.string().min(1),
  url: z.string().url(),
  meta: z.any().optional(),
});

export async function GET() {
  const items = await prisma.mediaAsset.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(items);
}

export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await req.json();
    const data = createSchema.parse(body);
    const created = await prisma.mediaAsset.create({ data });
    return NextResponse.json(created);
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Invalid data" }, { status: 400 });
  }
}
