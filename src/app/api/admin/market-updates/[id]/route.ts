import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";
import { getSessionUser } from "@/lib/auth/session";

const updateSchema = z.object({
  date: z.string().datetime().optional(),
  text: z.string().min(1).optional(),
});

export async function PUT(req: Request, { params }: { params: { id: string | string[] } }) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const idRaw = params?.id;
    const id = Array.isArray(idRaw) ? idRaw[0] : idRaw;
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
    const idNum = Number.parseInt(id, 10);
    const body = await req.json();
    const data = updateSchema.parse(body);
    const updated = await prisma.marketUpdate.update({
      where: { id: idNum },
      data: {
        ...(data.text !== undefined ? { text: data.text } : {}),
        ...(data.date !== undefined ? { date: new Date(data.date) } : {}),
      },
    });
    return NextResponse.json(updated);
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Update failed" }, { status: 400 });
  }
}

export async function DELETE(_req: Request, { params }: { params: { id: string | string[] } }) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const idRaw = params?.id;
    const id = Array.isArray(idRaw) ? idRaw[0] : idRaw;
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
    const idNum = Number.parseInt(id, 10);
    await prisma.marketUpdate.delete({ where: { id: idNum } });
    return NextResponse.json({ ok: true, id: idNum });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Delete failed" }, { status: 400 });
  }
}
