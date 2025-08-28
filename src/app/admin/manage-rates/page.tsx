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
  packingDescription?: string | null;
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
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Manage Rates</h1>
        <div className="text-sm text-gray-600">
          Total: {total} rates
        </div>
      </div>
      {error && <div className="text-sm text-red-600 bg-red-50 p-3 rounded border">{error}</div>}
      
      <div className="overflow-auto border rounded-lg">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-3 font-medium">Type</th>
              <th className="text-left p-3 font-medium">Date</th>
              <th className="text-left p-3 font-medium">State</th>
              <th className="text-left p-3 font-medium">Mandi</th>
              <th className="text-left p-3 font-medium">Country</th>
              <th className="text-left p-3 font-medium">Quality</th>
              <th className="text-left p-3 font-medium">Size (mm)</th>
              <th className="text-left p-3 font-medium">Packing</th>
              <th className="text-left p-3 font-medium">Price/kg</th>
              <th className="text-left p-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((r) => (
              <tr key={r.id} className="border-t hover:bg-gray-50">
                <td className="p-3">
                  <span className={`px-2 py-1 rounded text-xs font-medium border ${r.rateType === 'EXPORT' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'}`}>
                    {r.rateType || 'DOMESTIC'}
                  </span>
                </td>
                <td className="p-3">{new Date(r.date).toLocaleDateString()}</td>
                <td className="p-3">{r.state?.name || "-"}</td>
                <td className="p-3">{r.mandi?.name || "-"}</td>
                <td className="p-3">{r.country || "-"}</td>
                <td className="p-3">
                  <select 
                    defaultValue={r.quality} 
                    onChange={(e) => onInlineUpdate(r.id, { quality: e.target.value as any })} 
                    className="border rounded px-2 py-1 text-xs" 
                    disabled={r.rateType === 'EXPORT'}
                  >
                    <option value="LOW">LOW</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="HIGH">HIGH</option>
                  </select>
                </td>
                <td className="p-3">
                  <input 
                    type="number" 
                    defaultValue={r.sizeMm} 
                    onBlur={(e) => onInlineUpdate(r.id, { sizeMm: Number(e.currentTarget.value) as any })} 
                    className="border rounded px-2 py-1 w-20 text-xs" 
                  />
                </td>
                <td className="p-3">
                  <div className="space-y-1">
                    <select 
                      defaultValue={r.packing} 
                      onChange={(e) => onInlineUpdate(r.id, { packing: e.target.value as any })} 
                      className="border rounded px-2 py-1 text-xs w-full"
                    >
                      <option value="LOOSE">LOOSE</option>
                      <option value="BAG">BAG</option>
                      <option value="BOX">BOX</option>
                    </select>
                    <input
                      type="text"
                      placeholder="Packing description"
                      defaultValue={r.packingDescription || ""}
                      onBlur={(e) => onInlineUpdate(r.id, { packingDescription: e.currentTarget.value || null })}
                      className="border rounded px-2 py-1 text-xs w-full"
                    />
                  </div>
                </td>
                <td className="p-3">
                  <input 
                    type="number" 
                    step="0.01" 
                    defaultValue={Number(r.pricePerKg)} 
                    onBlur={(e) => onInlineUpdate(r.id, { pricePerKg: Number(e.currentTarget.value) as any })} 
                    className="border rounded px-2 py-1 w-24 text-xs" 
                  />
                </td>
                <td className="p-3">
                  <button
                    type="button"
                    onClick={() => onDelete(r.id)}
                    disabled={deletingId === r.id}
                    className={`text-xs px-2 py-1 rounded ${deletingId === r.id ? "text-gray-400 cursor-not-allowed" : "text-red-600 hover:bg-red-50"}`}
                  >
                    {deletingId === r.id ? "Deleting..." : "Delete"}
                  </button>
                </td>
              </tr>
            ))}
            {items.length === 0 && !loading && (
              <tr><td className="p-4 text-center text-gray-500" colSpan={10}>No records found</td></tr>
            )}
            {loading && (
              <tr><td className="p-4 text-center text-gray-500" colSpan={10}>Loading...</td></tr>
            )}
          </tbody>
        </table>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button 
            type="button" 
            disabled={page <= 1} 
            onClick={() => setPage(p => Math.max(1, p - 1))} 
            className="px-3 py-2 border rounded disabled:opacity-50 hover:bg-gray-50"
          >
            Previous
          </button>
          <span className="text-sm text-gray-600">Page {page} of {pages}</span>
          <button 
            type="button" 
            disabled={page >= pages} 
            onClick={() => setPage(p => p + 1)} 
            className="px-3 py-2 border rounded disabled:opacity-50 hover:bg-gray-50"
          >
            Next
          </button>
        </div>
        <button 
          onClick={load} 
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Refresh
        </button>
      </div>

      {/* Recent rates preview */}
      <div className="border rounded-lg p-4 bg-gray-50">
        <div className="font-medium mb-3 text-gray-800">Recent Rates (Last 5)</div>
        <div className="overflow-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-gray-600">
                <th className="text-left p-2">Type</th>
                <th className="text-left p-2">Date</th>
                <th className="text-left p-2">Location</th>
                <th className="text-left p-2">Quality</th>
                <th className="text-left p-2">Packing</th>
                <th className="text-left p-2">Price</th>
              </tr>
            </thead>
            <tbody>
              {lastFive.map((r) => (
                <tr key={r.id} className="border-t border-gray-200">
                  <td className="p-2">
                    <span className={`px-2 py-0.5 rounded text-xs border ${r.rateType === 'EXPORT' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'}`}>
                      {r.rateType || 'DOMESTIC'}
                    </span>
                  </td>
                  <td className="p-2">{new Date(r.date).toLocaleDateString()}</td>
                  <td className="p-2">
                    {r.rateType === 'EXPORT' ? r.country : `${r.state?.name}, ${r.mandi?.name}`}
                  </td>
                  <td className="p-2">{r.quality}</td>
                  <td className="p-2">
                    <div>
                      <div className="font-medium">{r.packing}</div>
                      {r.packingDescription && (
                        <div className="text-xs text-gray-500">{r.packingDescription}</div>
                      )}
                    </div>
                  </td>
                  <td className="p-2 font-medium">₹{Number(r.pricePerKg).toLocaleString()}</td>
                </tr>
              ))}
              {lastFive.length === 0 && (
                <tr><td className="p-2 text-sm text-gray-600" colSpan={6}>No recent rates</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
