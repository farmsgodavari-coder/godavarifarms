"use client";
import { useEffect, useState } from "react";

export default function ReportsPage() {
  const [stats, setStats] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const r = await fetch("/api/admin/analytics", { cache: "no-store" });
        const j = await r.json();
        setStats(j);
      } catch (e: any) {
        setError(e?.message || "Failed to load analytics");
      }
    })();
  }, []);

  const exportCsv = () => {
    const url = "/api/admin/reports/export?kind=rates_7d";
    const a = document.createElement("a");
    a.href = url;
    a.download = "onion_rates_last7days.csv";
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Reports</h1>

      {error ? <div className="text-sm text-red-600">{error}</div> : null}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="border rounded p-4">
          <div className="font-medium mb-2">Quick Stats</div>
          {stats ? (
            <ul className="text-sm space-y-1">
              <li>Today Avg Rate: <b>{stats.todayAvg ?? "--"}</b></li>
              <li>Total Announcements: <b>{stats.totalAnnouncements ?? 0}</b></li>
              <li>7-Day Averages: <span className="text-zinc-600">{Array.isArray(stats.last7Days) ? stats.last7Days.map((d:any)=>`${d.date}:${d.avg ?? "--"}`).join(", ") : "--"}</span></li>
            </ul>
          ) : (
            <div className="text-sm text-zinc-600">Loading…</div>
          )}
        </div>

        <div className="border rounded p-4">
          <div className="font-medium mb-2">Exports</div>
          <button onClick={exportCsv} className="px-3 py-2 border rounded hover:bg-zinc-50">Download Rates (Last 7 Days) CSV</button>
        </div>
      </div>
    </div>
  );
}
