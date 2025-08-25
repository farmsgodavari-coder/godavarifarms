import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const name = String(body?.name || "").trim();
    const mobile = String(body?.mobile || "").trim();
    const quantity = String(body?.quantity || "").trim();

    if (!name || !mobile) {
      return NextResponse.json({ error: "Name and mobile are required" }, { status: 400 });
    }

    const record = await prisma.contactInquiry.create({
      data: { name, mobile, quantity },
    });

    return NextResponse.json({ ok: true, id: record.id });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Failed" }, { status: 500 });
  }
}
