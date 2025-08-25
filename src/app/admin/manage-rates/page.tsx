"use client";
import { useEffect, useMemo, useState } from "react";

type Rate = {
  id: number;
  date: string;
  rateType?: "DOMESTIC" | "EXPORT";
  country?: string | null;
  state?: { id: number; name: string } | null;
  mandi?: { id: number; name: string } | null;
  quality: "LOW" | "MEDIUM" | "HIGH";
  sizeMm: number;
  packing: "LOOSE" | "BAG" | "BOX";
  pricePerKg: string | number;
};

export default function ManageRatesPage() {
  const [items, setItems] = useState<Rate[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [lastFive, setLastFive] = useState<Rate[]>([]);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/rates?page=${page}&pageSize=${pageSize}`, {
        cache: "no-store",
        credentials: "include",
        headers: { "Accept": "application/json" },
      });
      const js = await res.json();
      if (!res.ok) throw new Error(js.error || "Failed to load");
      setItems(js.items);
      setTotal(js.total);
    } catch (e: any) {
      setError(e.message || "Error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, [page]);

  // last 5
  useEffect(() => {
    (async () => {
      try {
        const r = await fetch(`/api/admin/rates?page=1&pageSize=5`, { cache: "no-store" });
        const j = await r.json();
        if (r.ok) setLastFive(j.items || []);
      } catch {}
    })();
  }, []);

  const pages = useMemo(() => Math.max(1, Math.ceil(total / pageSize)), [total, pageSize]);

  async function onDelete(id: number) {
    if (!confirm("Delete this rate?")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/rates/${id}`, {
        method: "DELETE",
        credentials: "include",
        cache: "no-store",
        headers: { "Accept": "application/json" },
      });
      if (!res.ok) {
        const ct = res.headers.get("content-type") || "";
        if (ct.includes("application/json")) {
          const js = await res.json().catch(() => ({} as any));
          throw new Error(js?.error || `Failed to delete (status ${res.status})`);
        } else {
          const text = await res.text().catch(() => "");
          throw new Error(text || `Failed to delete (status ${res.status})`);
        }
      }
      // Optimistically update UI and then re-sync from server
      setItems((prev) => prev.filter((r) => r.id !== id));
      setTotal((t) => Math.max(0, t - 1));
      await load();
    } catch (e: any) {
      setError(e?.message || "Failed to delete, please try again");
    } finally {
      setDeletingId((x) => (x === id ? null : x));
    }
  }

  async function onInlineUpdate(id: number, payload: Partial<Rate>) {
    const res = await fetch(`/api/admin/rates/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (res.ok) load();
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Manage Rates</h1>
      {error && <div className="text-sm text-red-600">{error}</div>}
      
      <div className="overflow-auto border rounded">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-2">Type</th>
              <th className="text-left p-2">Date</th>
              <th className="text-left p-2">State</th>
              <th className="text-left p-2">Mandi</th>
              <th className="text-left p-2">Country</th>
              <th className="text-left p-2">Quality</th>
              <th className="text-left p-2">Size (mm)</th>
              <th className="text-left p-2">Packing</th>
              <th className="text-left p-2">Price/kg</th>
              <th className="text-left p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((r) => (
              <tr key={r.id} className="border-t">
                <td className="p-2"><span className={`px-2 py-0.5 rounded text-xs border ${r.rateType === 'EXPORT' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'}`}>{r.rateType || 'DOMESTIC'}</span></td>
                <td className="p-2">{new Date(r.date).toLocaleDateString()}</td>
                <td className="p-2">{r.state?.name}</td>
                <td className="p-2">{r.mandi?.name}</td>
                <td className="p-2">{r.country || ""}</td>
                <td className="p-2">
                  <select defaultValue={r.quality} onChange={(e) => onInlineUpdate(r.id, { quality: e.target.value as any })} className="border rounded px-2 py-1" disabled={r.rateType === 'EXPORT'}>
                    <option value="LOW">LOW</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="HIGH">HIGH</option>
                  </select>
                </td>
                <td className="p-2">
                  <input type="number" defaultValue={r.sizeMm} onBlur={(e) => onInlineUpdate(r.id, { sizeMm: Number(e.currentTarget.value) as any })} className="border rounded px-2 py-1 w-24" />
                </td>
                <td className="p-2">
                  <select defaultValue={r.packing} onChange={(e) => onInlineUpdate(r.id, { packing: e.target.value as any })} className="border rounded px-2 py-1">
                    <option value="LOOSE">LOOSE</option>
                    <option value="BAG">BAG</option>
                    <option value="BOX">BOX</option>
                  </select>
                </td>
                <td className="p-2">
                  <input type="number" step="0.01" defaultValue={Number(r.pricePerKg)} onBlur={(e) => onInlineUpdate(r.id, { pricePerKg: Number(e.currentTarget.value) as any })} className="border rounded px-2 py-1 w-28" />
                </td>
                <td className="p-2">
                  <button
                    type="button"
                    onClick={() => onDelete(r.id)}
                    disabled={deletingId === r.id}
                    className={`hover:underline ${deletingId === r.id ? "text-gray-400 cursor-not-allowed" : "text-red-600"}`}
                  >
                    {deletingId === r.id ? "Deleting..." : "Delete"}
                  </button>
                </td>
              </tr>
            ))}
            {items.length === 0 && !loading && (
              <tr><td className="p-4" colSpan={10}>No records</td></tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="flex items-center gap-2">
        <button type="button" disabled={page <= 1} onClick={() => setPage(p => Math.max(1, p - 1))} className="px-3 py-1 border rounded disabled:opacity-50">Prev</button>
        <div className="text-sm">Page {page} / {pages}</div>
        <button type="button" disabled={page >= pages} onClick={() => setPage(p => p + 1)} className="px-3 py-1 border rounded disabled:opacity-50">Next</button>
      </div>

      {/* Last 5 saved reference */}
      <div className="border rounded p-3">
        <div className="font-medium mb-2">Last 5 Saved Rates</div>
        <div className="overflow-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-2">Type</th>
                <th className="text-left p-2">Date</th>
                <th className="text-left p-2">State</th>
                <th className="text-left p-2">Mandi</th>
                <th className="text-left p-2">Country</th>
                <th className="text-left p-2">Quality</th>
                <th className="text-left p-2">Size</th>
                <th className="text-left p-2">Packing</th>
                <th className="text-left p-2">Price</th>
              </tr>
            </thead>
            <tbody>
              {lastFive.map((r) => (
                <tr key={r.id} className="border-t">
                  <td className="p-2"><span className={`px-2 py-0.5 rounded text-xs border ${r.rateType === 'EXPORT' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'}`}>{r.rateType || 'DOMESTIC'}</span></td>
                  <td className="p-2">{new Date(r.date).toLocaleDateString()}</td>
                  <td className="p-2">{r.state?.name}</td>
                  <td className="p-2">{r.mandi?.name}</td>
                  <td className="p-2">{r.country || ""}</td>
                  <td className="p-2">{r.quality}</td>
                  <td className="p-2">{r.sizeMm}</td>
                  <td className="p-2">{r.packing}</td>
                  <td className="p-2">{r.pricePerKg}</td>
                </tr>
              ))}
              {lastFive.length === 0 && (
                <tr><td className="p-2 text-sm text-zinc-600" colSpan={9}>No recent rates</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
