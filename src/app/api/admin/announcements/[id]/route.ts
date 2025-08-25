import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";
import { getSessionUser } from "@/lib/auth/session";

const updateSchema = z.object({
  title: z.string().min(1).optional(),
  body: z.string().min(1).optional(),
  isTicker: z.boolean().optional(),
  published: z.boolean().optional(),
  startAt: z.string().datetime().nullable().optional(),
  endAt: z.string().datetime().nullable().optional(),
});

export async function PUT(req: Request, context: any) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const idRaw = context?.params?.id as string | string[] | undefined;
    const id = Array.isArray(idRaw) ? idRaw[0] : idRaw;
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
    const idNum = Number.parseInt(id, 10);
    const body = await req.json();
    const data = updateSchema.parse(body);
    const updated = await prisma.announcement.update({
      where: { id: idNum },
      data: {
        ...(data.title !== undefined ? { title: data.title } : {}),
        ...(data.body !== undefined ? { body: data.body } : {}),
        ...(data.isTicker !== undefined ? { isTicker: data.isTicker } : {}),
        ...(data.published !== undefined ? { published: data.published } : {}),
        ...(data.startAt !== undefined ? { startAt: data.startAt ? new Date(data.startAt) : null } : {}),
        ...(data.endAt !== undefined ? { endAt: data.endAt ? new Date(data.endAt) : null } : {}),
      },
    });
    return NextResponse.json(updated);
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Update failed" }, { status: 400 });
  }
}

export async function DELETE(_req: Request, context: any) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const idRaw = context?.params?.id as string | string[] | undefined;
    const id = Array.isArray(idRaw) ? idRaw[0] : idRaw;
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
    const idNum = Number.parseInt(id, 10);
    await prisma.announcement.delete({ where: { id: idNum } });
    return NextResponse.json({ ok: true, id: idNum });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Delete failed" }, { status: 400 });
  }
}
