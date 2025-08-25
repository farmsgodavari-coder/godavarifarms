"use client";
import { useEffect, useMemo, useState } from "react";
import Filters, { type FilterValues } from "@/components/Filters";
import RatesCards from "@/components/RatesCards";
import dynamic from "next/dynamic";

const LazyChart = dynamic(() => import("@/components/MultiRatesChart"), { ssr: false });

export default function PublicRatesPage() {
  const [data, setData] = useState<any[]>([]);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const pageSize = 50;
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterValues>({});
  const [showChart, setShowChart] = useState(false);

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
    if (filters.size) {
      if (filters.size === "SMALL") { p.set("sizeMax", "40"); }
      else if (filters.size === "MEDIUM") { p.set("sizeMin", "41"); p.set("sizeMax", "60"); }
      else if (filters.size === "LARGE") { p.set("sizeMin", "61"); }
    }
    if (filters.dateFrom) p.set("dateFrom", filters.dateFrom);
    if (filters.dateTo) p.set("dateTo", filters.dateTo);
    return p.toString();
  }, [page, filters]);

  function fetchData(signal?: AbortSignal) {
    setLoading(true);
    setError(null);
    const url = `/api/rates?${qs}`;
    fetch(url, { signal })
      .then(async (r) => {
        if (!r.ok) {
          const txt = await r.text().catch(() => "");
          throw new Error(`HTTP ${r.status} ${r.statusText} from ${url} - ${txt}`);
        }
        return r.json();
      })
      .then(res => {
        setData(res.data || []);
        setLastUpdated(res.lastUpdated || null);
        setTotalPages(res.pagination?.totalPages ?? 1);
      })
      .catch((e) => { if (e.name !== "AbortError") { console.error("[Rates page] fetch failed", e); setError(e?.message || "Failed to load"); } })
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    const ctrl = new AbortController();
    fetchData(ctrl.signal);
    return () => ctrl.abort();
  }, [qs]);

  // Removed 30s polling; SSE below will refresh in real-time and user actions refetch via deps

  // Real-time updates via SSE
  useEffect(() => {
    const es = new EventSource(`/api/events`);
    es.onmessage = (ev) => {
      try {
        const data = JSON.parse(ev.data);
        if (data?.type && String(data.type).startsWith("rate:")) {
          fetchData();
        }
      } catch {}
    };
    es.onerror = () => {};
    return () => es.close();
  }, [qs]);

  return (
    <div className="min-h-screen px-6 py-8 sm:py-10 space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold">Daily Onion Market Rates</h1>
        <div className="text-sm text-zinc-600">Last Updated: {lastUpdated ? new Date(lastUpdated).toLocaleString() : "--"}</div>
      </div>

      <Filters value={filters} onChange={(v) => { setPage(1); setFilters(v); }} />

      <div className="flex items-center justify-between">
        <h2 className="font-semibold">Results</h2>
        <button onClick={() => setShowChart(v => !v)} className="text-sm px-3 py-1 border rounded hover:bg-zinc-50 transition">
          {showChart ? "Hide Chart" : "Show Chart"}
        </button>
      </div>
      {showChart && (
        <div className="border rounded-xl p-4 shadow-sm bg-white">
          <LazyChart />
        </div>
      )}

      {loading ? (
        <div className="text-sm text-zinc-600">Loading…</div>
      ) : error ? (
        <div className="text-sm text-red-600">{error}</div>
      ) : (
        (() => {
          const rows = data.map((r) => {
            const derivedType = (r.rateType as "DOMESTIC" | "EXPORT" | undefined) ?? (r.country ? "EXPORT" : "DOMESTIC");
            return {
              id: r.id,
              date: r.date,
              rateType: derivedType,
              country: r.country as string | null | undefined,
              state: r.state,
              mandi: r.mandi,
              quality: r.quality,
              sizeMm: r.sizeMm,
              packing: r.packing,
              pricePerKg: r.pricePerKg,
            };
          });
          const domestic = rows.filter(r => (r.rateType ?? "DOMESTIC") === "DOMESTIC");
          const exportRows = rows.filter(r => r.rateType === "EXPORT");
          const showDomestic = !filters.rateType || filters.rateType === "DOMESTIC";
          const showExport = !filters.rateType || filters.rateType === "EXPORT";
          return (
            <div className="space-y-6">
              {showDomestic && (
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">Domestic Rates</h3>
                  <RatesCards rows={domestic} />
                </div>
              )}
              {showExport && (
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">Export Rates</h3>
                  <RatesCards rows={exportRows} />
                </div>
              )}
            </div>
          );
        })()
      )}

      <div className="flex items-center gap-2">
        <button disabled={page <= 1} onClick={() => setPage(p => Math.max(1, p - 1))} className="px-3 py-1 border rounded disabled:opacity-50">Prev</button>
        <div className="text-sm">Page {page} / {totalPages}</div>
        <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)} className="px-3 py-1 border rounded disabled:opacity-50">Next</button>
      </div>
    </div>
  );
}
