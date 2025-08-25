"use client";
import { useEffect, useState } from "react";

export default function MediaPage() {
  const [items, setItems] = useState<any[]>([]);
  const [form, setForm] = useState({ kind: "IMAGE", title: "", url: "", meta: {} as any });
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setError(null);
    const r = await fetch("/api/admin/media", { cache: "no-store" });
    if (!r.ok) {
      setError(`Failed to load: ${r.status}`);
      return;
    }
    setItems(await r.json());
  };

  useEffect(() => { load(); }, []);

  const onCreate = async () => {
    setError(null);
    try {
      if (!form.title.trim() || !form.url.trim()) return;
      const r = await fetch("/api/admin/media", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!r.ok) {
        const t = await r.text();
        setError(`Create failed: ${r.status} ${t}`);
        return;
      }
      setForm({ kind: "IMAGE", title: "", url: "", meta: {} });
      await load();
    } catch (e: any) {
      setError(e?.message || "Create failed");
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Media</h1>
      <div className="grid gap-2 max-w-xl">
        <label className="text-sm">Kind</label>
        <select className="border rounded p-2" value={form.kind} onChange={e=>setForm({...form, kind: e.target.value})}>
          <option value="IMAGE">IMAGE</option>
          <option value="BANNER">BANNER</option>
          <option value="DOC">DOC</option>
        </select>
        <label className="text-sm">Title</label>
        <input className="border rounded p-2" value={form.title} onChange={e=>setForm({...form, title: e.target.value})} />
        <label className="text-sm">URL</label>
        <input className="border rounded p-2" placeholder="https://... or /uploads/..." value={form.url} onChange={e=>setForm({...form, url: e.target.value})} />
        <button type="button" className="px-3 py-2 border rounded bg-black text-white w-fit" onClick={onCreate}>Add</button>
        {error ? <div className="text-sm text-red-600">{error}</div> : null}
      </div>

      <div className="border rounded grid gap-0">
        {items.map((m) => (
          <div key={m.id} className="p-3 border-b flex items-center justify-between gap-4">
            <div>
              <div className="text-sm text-gray-500">{m.kind}</div>
              <div className="font-medium">{m.title}</div>
              <div className="text-xs text-gray-500 break-all">{m.url}</div>
            </div>
            {m.kind !== "DOC" ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img alt={m.title} src={m.url} className="w-24 h-16 object-cover rounded border" />
            ) : null}
          </div>
        ))}
        {items.length === 0 ? <div className="p-3 text-sm text-gray-500">No media yet</div> : null}
      </div>
    </div>
  );
}
