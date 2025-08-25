"use client";
import { useEffect, useMemo, useState } from "react";
import MultiRatesChart from "@/components/MultiRatesChart";
import RatesTable from "@/components/RatesTable";

export default function PublicDashboardPage() {
  const [data, setData] = useState<any[]>([]);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const pageSize = 50;
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const qs = useMemo(() => {
    const p = new URLSearchParams();
    p.set("page", String(page));
    p.set("pageSize", String(pageSize));
    return p.toString();
  }, [page]);

  function fetchData(signal?: AbortSignal) {
    setLoading(true);
    setError(null);
    const base = process.env.NEXT_PUBLIC_API_BASE_URL || "";
    const url = `${base}/api/rates?${qs}`;
    fetch(url, { signal })
      .then(r => r.json())
      .then(res => {
        setData(res.data || []);
        setLastUpdated(res.lastUpdated || null);
        setTotalPages(res.pagination?.totalPages ?? 1);
      })
      .catch((e) => { if (e.name !== "AbortError") setError(e?.message || "Failed to load"); })
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    const ctrl = new AbortController();
    fetchData(ctrl.signal);
    return () => ctrl.abort();
  }, [qs]);

  useEffect(() => {
    const id = setInterval(() => fetchData(), 30000);
    return () => clearInterval(id);
  }, [qs]);

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
    <div className="min-h-screen p-6 sm:p-10 space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold">Public Dashboard</h1>
        <div className="text-sm text-zinc-600">Last Updated: {lastUpdated ? new Date(lastUpdated).toLocaleString() : "--"}</div>
      </div>

      {/* Charts */}
      <div className="border rounded-lg p-4">
        <h2 className="font-semibold mb-2">Price Trend</h2>
        <MultiRatesChart />
      </div>

      {/* Table */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">Rates Table</h2>
          <div className="text-sm text-zinc-600">Showing {data.length} records</div>
        </div>
        {loading ? (
          <div className="text-sm text-zinc-600">Loading…</div>
        ) : error ? (
          <div className="text-sm text-red-600">{error}</div>
        ) : (
          <RatesTable rows={data.map((r) => ({
            id: r.id,
            date: r.date,
            state: r.state,
            mandi: r.mandi,
            quality: r.quality,
            sizeMm: r.sizeMm,
            packing: r.packing,
            pricePerKg: r.pricePerKg,
          }))} />
        )}

        <div className="flex items-center gap-2">
          <button disabled={page <= 1} onClick={() => setPage(p => Math.max(1, p - 1))} className="px-3 py-1 border rounded disabled:opacity-50">Prev</button>
          <div className="text-sm">Page {page} / {totalPages}</div>
          <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)} className="px-3 py-1 border rounded disabled:opacity-50">Next</button>
        </div>
      </div>
    </div>
  );
}
