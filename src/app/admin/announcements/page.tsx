"use client";
import { useEffect, useState } from "react";

export default function AnnouncementsPage() {
  const [items, setItems] = useState<any[]>([]);
  const [form, setForm] = useState({ title: "", body: "", isTicker: false, published: true });

  const load = async () => {
    const r = await fetch("/api/admin/announcements", { cache: "no-store" });
    const j = await r.json();
    setItems(j);
  };

  useEffect(() => { load(); }, []);

  const onCreate = async () => {
    const r = await fetch("/api/admin/announcements", { method: "POST", body: JSON.stringify(form) });
    if (r.ok) { setForm({ title: "", body: "", isTicker: false, published: true }); await load(); }
  };

  const onDelete = async (id: number) => {
    await fetch(`/api/admin/announcements/${id}`, { method: "DELETE" });
    await load();
  };

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Announcements</h1>
      <div className="grid gap-2">
        <input placeholder="Title" className="border rounded p-2" value={form.title} onChange={e=>setForm({...form, title: e.target.value})} />
        <textarea placeholder="Body" className="border rounded p-2" value={form.body} onChange={e=>setForm({...form, body: e.target.value})} />
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.isTicker} onChange={e=>setForm({...form, isTicker: e.target.checked})} />Ticker</label>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.published} onChange={e=>setForm({...form, published: e.target.checked})} />Published</label>
        <button type="button" className="px-3 py-2 border rounded bg-black text-white w-fit" onClick={onCreate}>Create</button>
      </div>

      <div className="border rounded">
        {items.map((a)=> (
          <div key={a.id} className="p-3 border-b flex items-start justify-between gap-4">
            <div>
              <div className="font-medium">{a.title} {a.isTicker ? <span className="text-xs text-purple-600">[Ticker]</span> : null} {a.published ? <span className="text-xs text-green-600">[Published]</span> : <span className="text-xs text-gray-500">[Draft]</span>}</div>
              <div className="text-sm text-gray-600 whitespace-pre-wrap">{a.body}</div>
            </div>
            <button className="text-red-600" onClick={()=>onDelete(a.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}
