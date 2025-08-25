import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { getSessionUser } from "@/lib/auth/session";

function toCsv(rows: any[]): string {
  const cols = ["id","date","state","mandi","quality","sizeMm","packing","pricePerKg"];
  const esc = (v: any) => {
    if (v === null || v === undefined) return "";
    const s = String(v);
    if (/[",\n]/.test(s)) return '"' + s.replace(/"/g, '""') + '"';
    return s;
  };
  const lines = [cols.join(",")];
  for (const r of rows) lines.push(cols.map((c) => esc(r[c])).join(","));
  return lines.join("\n");
}

export async function GET(req: NextRequest) {
  // Auth
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const kind = req.nextUrl.searchParams.get("kind") || "rates_7d";
  if (kind !== "rates_7d") {
    return NextResponse.json({ error: "Unknown kind" }, { status: 400 });
  }

  // Build internal URL to reuse /api/rates
  const h = headers();
  const host = h.get("x-forwarded-host") || h.get("host") || "localhost:3000";
  const proto = h.get("x-forwarded-proto") || (host.startsWith("localhost") ? "http" : "https");

  const today = new Date();
  const dateTo = today.toISOString().slice(0, 10);
  const from = new Date(today);
  from.setDate(today.getDate() - 6);
  const dateFrom = from.toISOString().slice(0, 10);

  const qs = new URLSearchParams({ page: "1", pageSize: "10000", dateFrom, dateTo }).toString();
  const url = `${proto}://${host}/api/rates?${qs}`;

  const r = await fetch(url, { cache: "no-store" });
  if (!r.ok) {
    const t = await r.text().catch(() => "");
    return NextResponse.json({ error: `Upstream failed: ${r.status} ${t}` }, { status: 500 });
  }
  const payload = await r.json();
  const rows = Array.isArray(payload.data) ? payload.data : [];
  const csv = toCsv(rows);

  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename=onion_rates_last7days_${dateFrom}_${dateTo}.csv`,
      "Cache-Control": "no-store",
    },
  });
}
