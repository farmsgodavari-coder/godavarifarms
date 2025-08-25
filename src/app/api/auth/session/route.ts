import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    { error: "Deprecated. Use /api/login and /api/logout with 'session' cookie." },
    { status: 410 }
  );
}

export async function DELETE() {
  return NextResponse.json(
    { error: "Deprecated. Use /api/logout to clear 'session' cookie." },
    { status: 410 }
  );
}
