import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const rows = await prisma.siteSetting.findMany({ orderBy: { key: "asc" } });
    const obj: Record<string, any> = {};
    for (const r of rows) obj[r.key] = r.value;
    return NextResponse.json(obj);
  } catch (e) {
    console.error(e);
    return NextResponse.json({}, { status: 200 });
  }
}
