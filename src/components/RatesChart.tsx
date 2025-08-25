"use client";
import { useEffect, useMemo, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import type { PublicFilters } from "@/components/RatesFiltersPublic";

export default function RatesChart({ filters }: { filters: PublicFilters }) {
  const [series, setSeries] = useState<{ date: string; avgPrice: number; count: number }[]>([]);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [chartType, setChartType] = useState<"line" | "bar">("line");

  const qs = useMemo(() => {
    const p = new URLSearchParams();
    if (filters.stateId) p.set("stateId", String(filters.stateId));
    if (filters.mandiId) p.set("mandiId", String(filters.mandiId));
    if (filters.quality) p.set("quality", filters.quality);
    if (filters.sizeMin) p.set("sizeMin", String(filters.sizeMin));
    if (filters.sizeMax) p.set("sizeMax", String(filters.sizeMax));
    if (filters.dateFrom) p.set("dateFrom", filters.dateFrom);
    if (filters.dateTo) p.set("dateTo", filters.dateTo);
    return p.toString();
  }, [filters]);

  function fetchSeries(signal?: AbortSignal) {
    setLoading(true);
    setError(null);
    const base = process.env.NEXT_PUBLIC_API_BASE_URL || "";
    const url = `${base}/api/rates/series?${qs}`;
    fetch(url, { signal })
      .then((r) => r.json())
      .then((res) => {
        setSeries(res.data || []);
        setLastUpdated(res.lastUpdated || null);
      })
      .catch((e) => { if (e.name !== "AbortError") setError(e?.message || "Failed to load"); })
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    const ctrl = new AbortController();
    fetchSeries(ctrl.signal);
    return () => ctrl.abort();
  }, [qs]);

  useEffect(() => {
    const id = setInterval(() => fetchSeries(), 15000);
    return () => clearInterval(id);
  }, [qs]);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <div className="text-sm text-zinc-600">Last Updated: {lastUpdated ? new Date(lastUpdated).toLocaleString() : "--"}</div>
        <div className="flex items-center gap-2">
          <button className={`px-3 py-1 border rounded ${chartType === "line" ? "bg-zinc-100" : ""}`} onClick={() => setChartType("line")}>Line</button>
          <button className={`px-3 py-1 border rounded ${chartType === "bar" ? "bg-zinc-100" : ""}`} onClick={() => setChartType("bar")}>Bar</button>
        </div>
      </div>

      <div className="w-full h-80">
        {loading ? (
          <div className="text-sm text-zinc-600">Loading chart…</div>
        ) : error ? (
          <div className="text-sm text-red-600">{error}</div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            {chartType === "line" ? (
              <LineChart data={series} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={["auto", "auto"]} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="avgPrice" name="Avg Price (INR/kg)" stroke="#2563eb" dot={false} />
                <Line type="monotone" dataKey="count" name="Entries" stroke="#16a34a" yAxisId={1} />
              </LineChart>
            ) : (
              <BarChart data={series} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="avgPrice" name="Avg Price (INR/kg)" fill="#2563eb" />
                <Bar dataKey="count" name="Entries" fill="#16a34a" />
              </BarChart>
            )}
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
