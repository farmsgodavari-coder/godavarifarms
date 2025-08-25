import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import "@/lib/bootstrap";

export function middleware(_req: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
}


