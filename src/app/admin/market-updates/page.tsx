"use client";
import { useEffect, useState } from "react";

export default function MarketUpdatesPage() {
  const [items, setItems] = useState<any[]>([]);
  const [text, setText] = useState("");

  const load = async () => {
    const r = await fetch("/api/admin/market-updates", { cache: "no-store" });
    setItems(await r.json());
  };

  useEffect(() => { load(); }, []);

  const onCreate = async () => {
    if (!text.trim()) return;
    const r = await fetch("/api/admin/market-updates", { method: "POST", body: JSON.stringify({ text }) });
    if (r.ok) { setText(""); await load(); }
  };

  const onDelete = async (id: number) => {
    await fetch(`/api/admin/market-updates/${id}`, { method: "DELETE" });
    await load();
  };

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Market Updates</h1>
      <div className="grid gap-2">
        <textarea placeholder="Write update..." className="border rounded p-2" value={text} onChange={e=>setText(e.target.value)} />
        <button type="button" className="px-3 py-2 border rounded bg-black text-white w-fit" onClick={onCreate}>Post Update</button>
      </div>

      <div className="border rounded">
        {items.map((m)=> (
          <div key={m.id} className="p-3 border-b flex items-start justify-between gap-4">
            <div>
              <div className="text-xs text-gray-500">{new Date(m.date).toLocaleString()}</div>
              <div className="whitespace-pre-wrap">{m.text}</div>
            </div>
            <button className="text-red-600" onClick={()=>onDelete(m.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}
