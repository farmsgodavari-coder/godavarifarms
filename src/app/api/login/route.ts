import { NextRequest, NextResponse } from "next/server";
import "@/lib/bootstrap";

const SESSION_COOKIE = "session";
const MAX_AGE = 7 * 24 * 60 * 60; // 7 days (seconds)

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const username = String(body?.username || "");
    const password = String(body?.password || "");

    const expectedUser = process.env.ADMIN_USERNAME || "";
    const expectedPass = process.env.ADMIN_PASSWORD || "";

    if (username !== expectedUser || password !== expectedPass) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const res = NextResponse.json({ ok: true, mode: "session" });
    res.cookies.set(SESSION_COOKIE, "valid", {
      httpOnly: true,
      path: "/",
      maxAge: MAX_AGE,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });
    return res;
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Login failed" }, { status: 500 });
  }
}
