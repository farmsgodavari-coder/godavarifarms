import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";
import { getSessionUser } from "@/lib/auth/session";

export async function GET() {
  try {
    const rows = await prisma.siteSetting.findMany();
    const map: Record<string, unknown> = {};
    for (const r of rows) map[r.key] = r.value as unknown;
    return NextResponse.json(map);
  } catch (e: any) {
    // Return empty map to avoid client JSON parse crash when table not migrated yet
    const msg = e?.message || "Failed to read settings";
    console.warn("[GET /api/admin/settings] falling back to empty settings:", msg);
    return NextResponse.json({ __error: msg });
  }
}

const setSchema = z.object({
  key: z.string().min(1),
  value: z.any(),
});

export async function PUT(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await req.json();
    const { key, value } = setSchema.parse(body);
    const upserted = await prisma.siteSetting.upsert({
      where: { key },
      create: { key, value },
      update: { value },
    });
    return NextResponse.json(upserted);
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Set failed" }, { status: 400 });
  }
}
