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

// Consumes /api/rates/series/multi
export default function MultiRatesChart() {
  const [labels, setLabels] = useState<string[]>([]);
  const [series, setSeries] = useState<{ key: string; name: string; values: (number | null)[] }[]>([]);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [chartType, setChartType] = useState<"line" | "bar">("line");

  const data = useMemo(() => {
    // Transform to array of objects: [{ date, key1, key2, ... }]
    return labels.map((d, idx) => {
      const row: any = { date: d };
      for (const s of series) row[s.key] = s.values[idx];
      return row;
    });
  }, [labels, series]);

  async function fetchSeries(signal?: AbortSignal) {
    setLoading(true);
    setError(null);
    const url = `/api/rates/series/multi`;
    let attempts = 0;
    while (attempts < 2) {
      try {
        const r = await fetch(url, { signal });
        if (!r.ok) {
          const txt = await r.text().catch(() => "");
          throw new Error(`HTTP ${r.status} ${r.statusText} from ${url} - ${txt}`);
        }
        const res = await r.json();
        setLabels(res.labels || []);
        setSeries(res.series || []);
        setLastUpdated(res.lastUpdated || null);
        return;
      } catch (e: any) {
        if (e?.name === "AbortError") break;
        attempts += 1;
        if (attempts >= 2) {
          console.error("[MultiRatesChart] fetch failed", { url, error: e });
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
    fetchSeries(ctrl.signal);
    return () => ctrl.abort();
  }, []);

  // Real-time updates via SSE
  useEffect(() => {
    const es = new EventSource(`/api/events`);
    es.onmessage = (ev) => {
      try {
        const data = JSON.parse(ev.data);
        if (data?.type && String(data.type).startsWith("rate:")) {
          fetchSeries();
        }
      } catch {}
    };
    es.onerror = () => {
      // Browser will retry automatically; no-op
    };
    return () => {
      es.close();
    };
  }, []);

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
              <LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                {series.map((s, i) => (
                  <Line key={s.key} type="monotone" dataKey={s.key} name={s.name} stroke={colors[i % colors.length]} dot={false} />
                ))}
              </LineChart>
            ) : (
              <BarChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                {series.map((s, i) => (
                  <Bar key={s.key} dataKey={s.key} name={s.name} fill={colors[i % colors.length]} />
                ))}
              </BarChart>
            )}
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

const colors = [
  "#2563eb", "#16a34a", "#f59e0b", "#ef4444", "#a855f7", "#0ea5e9", "#10b981", "#f97316",
];
