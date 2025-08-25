"use client";
import { useEffect, useState } from "react";

type Option = { id: number; name: string };

export type PublicFilters = {
  stateId?: number;
  mandiId?: number;
  quality?: "LOW" | "MEDIUM" | "HIGH";
  sizeMin?: number;
  sizeMax?: number;
  dateFrom?: string;
  dateTo?: string;
};

export default function RatesFiltersPublic({ value, onChange }: { value: PublicFilters; onChange: (v: PublicFilters) => void; }) {
  const [states, setStates] = useState<Option[]>([]);
  const [mandis, setMandis] = useState<Option[]>([]);

  useEffect(() => {
    fetch("/api/meta/states").then(r => r.json()).then(setStates).catch(() => setStates([]));
  }, []);

  useEffect(() => {
    if (!value.stateId) { setMandis([]); return; }
    fetch(`/api/meta/mandis?stateId=${value.stateId}`).then(r => r.json()).then(setMandis).catch(() => setMandis([]));
  }, [value.stateId]);

  return (
    <div className="w-full bg-white border border-zinc-200 rounded-lg p-4 grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
      <div className="flex flex-col gap-1">
        <label className="text-sm text-zinc-600">State</label>
        <select className="border rounded px-2 py-1" value={value.stateId ?? ""} onChange={(e) => onChange({ ...value, stateId: e.target.value ? Number(e.target.value) : undefined, mandiId: undefined })}>
          <option value="">All</option>
          {states.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-sm text-zinc-600">City/Mandi</label>
        <select className="border rounded px-2 py-1" value={value.mandiId ?? ""} onChange={(e) => onChange({ ...value, mandiId: e.target.value ? Number(e.target.value) : undefined })} disabled={!value.stateId}>
          <option value="">All</option>
          {mandis.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
        </select>
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-sm text-zinc-600">Quality</label>
        <select className="border rounded px-2 py-1" value={value.quality ?? ""} onChange={(e) => onChange({ ...value, quality: (e.target.value || undefined) as any })}>
          <option value="">All</option>
          <option value="LOW">LOW</option>
          <option value="MEDIUM">MEDIUM</option>
          <option value="HIGH">HIGH</option>
        </select>
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-sm text-zinc-600">Size Min (mm)</label>
        <input type="number" className="border rounded px-2 py-1" value={value.sizeMin ?? ""} onChange={(e) => onChange({ ...value, sizeMin: e.target.value ? Number(e.target.value) : undefined })} />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-sm text-zinc-600">Size Max (mm)</label>
        <input type="number" className="border rounded px-2 py-1" value={value.sizeMax ?? ""} onChange={(e) => onChange({ ...value, sizeMax: e.target.value ? Number(e.target.value) : undefined })} />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-sm text-zinc-600">Date From</label>
        <input type="date" className="border rounded px-2 py-1" value={value.dateFrom ?? ""} onChange={(e) => onChange({ ...value, dateFrom: e.target.value || undefined })} />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-sm text-zinc-600">Date To</label>
        <input type="date" className="border rounded px-2 py-1" value={value.dateTo ?? ""} onChange={(e) => onChange({ ...value, dateTo: e.target.value || undefined })} />
      </div>
    </div>
  );
}
