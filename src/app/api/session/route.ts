import { NextRequest, NextResponse } from "next/server";

const SESSION_COOKIE = "session";

export async function GET(_req: NextRequest) {
  const authenticated = _req.cookies.get(SESSION_COOKIE)?.value === "valid";
  return NextResponse.json({ authenticated });
}
