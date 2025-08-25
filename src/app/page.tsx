"use client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import Filters, { type FilterValues } from "@/components/Filters";
import dynamic from "next/dynamic";
import Tabs from "@/components/ui/Tabs";
import DataTable from "@/components/ui/DataTable";
import Button from "@/components/ui/Button";

const LazyChart = dynamic(() => import("@/components/MultiRatesChart"), { ssr: false });

export default function Home() {
  const [data, setData] = useState<any[]>([]);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const pageSize = 50;
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterValues>({});
  const [showChart, setShowChart] = useState(false);
  const [siteSettings, setSiteSettings] = useState<Record<string, any>>({});
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [ticker, setTicker] = useState<any[]>([]);
  const [tab, setTab] = useState<"DOMESTIC" | "EXPORT">("DOMESTIC");

  const qs = useMemo(() => {
    const p = new URLSearchParams();
    p.set("page", String(page));
    p.set("pageSize", String(pageSize));
    if (filters.stateId) p.set("stateId", String(filters.stateId));
    if (filters.mandiId) p.set("mandiId", String(filters.mandiId));
    if (filters.rateType) p.set("rateType", String(filters.rateType));
    if (filters.country) p.set("country", String(filters.country));
    if (filters.quality) p.set("quality", String(filters.quality));
    if (filters.packing) p.set("packing", String(filters.packing));
    // Map size bucket to min/max mm
    if (filters.size) {
      if (filters.size === "SMALL") { p.set("sizeMax", "40"); }
      else if (filters.size === "MEDIUM") { p.set("sizeMin", "41"); p.set("sizeMax", "60"); }
      else if (filters.size === "LARGE") { p.set("sizeMin", "61"); }
    }
    if (filters.dateFrom) p.set("dateFrom", filters.dateFrom);
    if (filters.dateTo) p.set("dateTo", filters.dateTo);
    return p.toString();
  }, [page, filters]);

  // Load public settings and announcements
  useEffect(() => {
    (async () => {
      try {
        const [sRes, aRes] = await Promise.all([
          fetch("/api/public/settings"),
          fetch("/api/public/announcements"),
        ]);
        const sText = await sRes.text();
        let s: Record<string, any> = {};
        try { s = sText ? JSON.parse(sText) : {}; } catch { s = {}; }
        setSiteSettings(s || {});
        // Initialize chart toggle from settings home.showGraphs
        if (typeof s?.["home.showGraphs"] === "boolean") setShowChart(Boolean(s["home.showGraphs"]));

        let a: any = { items: [], ticker: [] };
        try { a = await aRes.json(); } catch { a = { items: [], ticker: [] }; }
        setAnnouncements(a.items || []);
        setTicker(a.ticker || []);
      } catch {
        // ignore
      }
    })();
  }, []);

  async function fetchData(signal?: AbortSignal) {
    setLoading(true);
    setError(null);
    const url = `/api/rates?${qs}`;
    let attempts = 0;
    while (attempts < 2) {
      try {
        const r = await fetch(url, { signal });
        if (!r.ok) {
          const txt = await r.text().catch(() => "");
          throw new Error(`HTTP ${r.status} ${r.statusText} from ${url} - ${txt}`);
        }
        const res = await r.json();
        setData(res.data || []);
        setLastUpdated(res.lastUpdated || null);
        setTotalPages(res.pagination?.totalPages ?? 1);
        return;
      } catch (e: any) {
        if (e?.name === "AbortError") break;
        // Retry once on transient network failures (TypeError: Failed to fetch)
        attempts += 1;
        if (attempts >= 2) {
          console.error("[Home] rates fetch failed", e);
          setError(e?.message || "Failed to load");
        }
      } finally {
        if (attempts >= 2) setLoading(false);
      }
    }
    if (attempts < 2) setLoading(false);
  }

  useEffect(() => {
    const ctrl = new AbortController();
    fetchData(ctrl.signal);
    return () => ctrl.abort();
  }, [qs]);

  // Removed 30s polling; SSE below keeps data fresh

  // Real-time: refetch table when a rate event is pushed via SSE
  useEffect(() => {
    const es = new EventSource(`/api/events`);
    es.onmessage = (ev) => {
      try {
        const msg = JSON.parse(ev.data);
        if (msg?.type && String(msg.type).startsWith("rate:")) {
          fetchData();
        }
      } catch (_) {
        // ignore parse errors
      }
    };
    es.onerror = () => {
      // Silent; browser will attempt reconnect
    };
    return () => es.close();
  }, [qs]);

  // Split rows by type for tabs
  const domesticRows = useMemo(() => data.filter(r => (r.rateType ?? (r.country ? "EXPORT" : "DOMESTIC")) === "DOMESTIC"), [data]);
  const exportRows = useMemo(() => data.filter(r => (r.rateType ?? (r.country ? "EXPORT" : "DOMESTIC")) === "EXPORT"), [data]);

  // Define table columns
  const commonCols = [
    { key: "date", header: "Date", render: (r: any) => new Date(r.date).toISOString().slice(0,10) },
    { key: "location", header: "Location", render: (r: any) => (r.rateType === "EXPORT" || r.country) ? (r.country || "") : `${r.mandi?.name ?? ""}${r.state?.name ? ", " + r.state.name : ""}` },
    { key: "sizeMm", header: "Size (mm)" },
    { key: "packing", header: "Packing" },
  ] as const;

  const domesticCols = [
    ...commonCols,
    { key: "quality", header: "Quality" },
    { key: "pricePerKg", header: "Price/Kg", render: (r: any) => `₹${Number(r.pricePerKg).toFixed(2)}`, className: "text-right" },
  ];

  const exportCols = [
    ...commonCols,
    { key: "pricePerKg", header: "Price/Kg", render: (r: any) => `₹${Number(r.pricePerKg).toFixed(2)}`, className: "text-right" },
  ];

  return (
    <div className="min-h-screen">
      {/* Ticker banner */}
      {Boolean(siteSettings["home.showNews"]) && ticker.length > 0 && (
        <div className="w-full bg-yellow-50 border-b border-yellow-200 text-yellow-900 text-sm">
          <div className="max-w-6xl mx-auto px-6 py-2 whitespace-nowrap overflow-hidden">
            <div className="inline-flex items-center gap-3 animate-[scroll_30s_linear_infinite]" style={{ minWidth: "100%" }}>
              {ticker.map((t: any) => (
                <span key={t.id} className="inline-flex items-center gap-2">
                  <span className="font-medium">{t.title}</span>
                  <span className="text-zinc-400">•</span>
                </span>
              ))}
            </div>
          </div>
          <style>{`@keyframes scroll { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }`}</style>
        </div>
      )}
      {/* Hero */}
      <section className="relative">
        <div className="absolute inset-0 bg-[url('/globe.svg')] bg-cover bg-center" />
        <div className="relative bg-gradient-to-b from-white/70 via-white/85 to-white">
          <div className="max-w-6xl mx-auto px-6 py-16 sm:py-24">
            <div className="text-sm uppercase tracking-wide text-green-700">Godavari Farms</div>
            <h1 className="text-4xl sm:text-6xl font-extrabold leading-tight mt-2">Daily Onion Market Rates</h1>
            <p className="mt-2 text-zinc-700 max-w-2xl">Updated live from markets across India</p>
            <div className="mt-1 text-sm text-zinc-600">Last Updated: {lastUpdated ? new Date(lastUpdated).toLocaleString() : "--"}</div>
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <Link href="/" className="btn-ghost btn-base">Home</Link>
              <Link href="/about" className="btn-ghost btn-base">About Us</Link>
              <Link href="/contact" className="btn-primary btn-base">Contact Us</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Filters + Rates */}
      <section className="max-w-6xl mx-auto px-6 pb-12 space-y-4">
        {/* Filters */}
        <Filters value={filters} onChange={(v) => { setPage(1); setFilters(v); if (v.rateType) setTab(v.rateType); }} />
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <h2 className="font-semibold">Daily Onion Rates</h2>
            <span className="text-xs text-zinc-500">Page {page} / {totalPages}</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" onClick={() => setShowChart(v => !v)}>
              {showChart ? "Hide Chart" : "Show Chart"}
            </Button>
            <Button variant="primary" onClick={() => setPage(1)}>Refresh</Button>
          </div>
        </div>
        {showChart && (
          <div className="border rounded-xl p-4 shadow-sm bg-white">
            <LazyChart />
          </div>
        )}
        {/* Tabs */}
        <Tabs
          items={[{ key: "DOMESTIC", label: "Domestic" }, { key: "EXPORT", label: "Export" }]}
          value={tab}
          onChange={(k) => { setTab(k as any); setFilters(f => ({ ...f, rateType: k as any })); setPage(1); }}
        />
        {/* Tables */}
        {loading ? (
          <div className="text-sm text-zinc-600">Loading…</div>
        ) : error ? (
          <div className="text-sm text-red-600">{error}</div>
        ) : tab === "DOMESTIC" ? (
          <DataTable
            columns={domesticCols as any}
            rows={domesticRows}
            initialSort={{ key: "date", dir: "desc" }}
          />
        ) : (
          <DataTable
            columns={exportCols as any}
            rows={exportRows}
            initialSort={{ key: "date", dir: "desc" }}
          />
        )}
        <div className="flex items-center gap-2">
          <Button variant="ghost" disabled={page <= 1} onClick={() => setPage(p => Math.max(1, p - 1))}>Prev</Button>
          <Button variant="ghost" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>Next</Button>
        </div>
      </section>
    </div>
  );
}
