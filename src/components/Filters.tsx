"use client";

import { useEffect, useMemo, useState } from "react";

export type FilterValues = {
  rateType?: "DOMESTIC" | "EXPORT";
  country?: string;
  stateId?: number;
  mandiId?: number;
  size?: "SMALL" | "MEDIUM" | "LARGE";
  quality?: "LOW" | "MEDIUM" | "HIGH";
  packing?: "LOOSE" | "BAG" | "BOX";
  dateFrom?: string; // yyyy-mm-dd
  dateTo?: string;   // yyyy-mm-dd
};

export type Option = { id: number; name: string };

export default function Filters({
  value,
  onChange,
}: {
  value: FilterValues;
  onChange: (v: FilterValues) => void;
}) {
  const [states, setStates] = useState<Option[]>([]);
  const [mandis, setMandis] = useState<Option[]>([]);
  const sizes = useMemo(() => ["SMALL", "MEDIUM", "LARGE"] as const, []);
  const qualities = useMemo(() => ["LOW", "MEDIUM", "HIGH"] as const, []);
  const packings = useMemo(() => ["LOOSE", "BAG", "BOX"] as const, []);

  useEffect(() => {
    fetch("/api/meta/states")
      .then(async (r) => {
        const d = await r.json();
        return Array.isArray(d) ? d : [];
      })
      .then((arr) => setStates(arr))
      .catch(() => setStates([]));
  }, []);

  useEffect(() => {
    if (value.stateId) {
      fetch(`/api/meta/mandis?stateId=${value.stateId}`)
        .then(async (r) => {
          const d = await r.json();
          return Array.isArray(d) ? d : [];
        })
        .then((arr) => setMandis(arr))
        .catch(() => setMandis([]));
    } else {
      setMandis([]);
    }
  }, [value.stateId]);

  return (
    <div className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-md p-4 grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7">
      <div className="flex flex-col gap-1">
        <label className="text-sm text-zinc-600 dark:text-zinc-400">Type</label>
        <select
          className="border rounded px-2 py-1 bg-transparent"
          value={value.rateType ?? ""}
          onChange={(e) => onChange({ ...value, rateType: (e.target.value || undefined) as any, country: undefined, stateId: undefined, mandiId: undefined })}
        >
          <option value="">All</option>
          <option value="DOMESTIC">Domestic</option>
          <option value="EXPORT">Export</option>
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm text-zinc-600 dark:text-zinc-400">Country</label>
        <select
          className="border rounded px-2 py-1 bg-transparent"
          value={value.country ?? ""}
          onChange={(e) => onChange({ ...value, country: (e.target.value || undefined) as any })}
          disabled={value.rateType !== "EXPORT"}
        >
          <option value="">All</option>
          {(["Dubai","Malaysia","Sri Lanka","Bangladesh","Vietnam"] as const).map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm text-zinc-600 dark:text-zinc-400">State</label>
        <select
          className="border rounded px-2 py-1 bg-transparent"
          value={value.stateId ?? ""}
          onChange={(e) => onChange({ ...value, stateId: e.target.value ? Number(e.target.value) : undefined, mandiId: undefined })}
          disabled={value.rateType === "EXPORT"}
        >
          <option value="">All</option>
          {states.map((s) => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm text-zinc-600 dark:text-zinc-400">Mandi</label>
        <select
          className="border rounded px-2 py-1 bg-transparent"
          value={value.mandiId ?? ""}
          onChange={(e) => onChange({ ...value, mandiId: e.target.value ? Number(e.target.value) : undefined })}
          disabled={value.rateType === "EXPORT" || !value.stateId}
        >
          <option value="">All</option>
          {mandis.map((m) => (
            <option key={m.id} value={m.id}>{m.name}</option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm text-zinc-600 dark:text-zinc-400">Size</label>
        <select
          className="border rounded px-2 py-1 bg-transparent"
          value={value.size ?? ""}
          onChange={(e) => onChange({ ...value, size: (e.target.value || undefined) as any })}
        >
          <option value="">All</option>
          {sizes.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm text-zinc-600 dark:text-zinc-400">Quality</label>
        <select
          className="border rounded px-2 py-1 bg-transparent"
          value={value.quality ?? ""}
          onChange={(e) => onChange({ ...value, quality: (e.target.value || undefined) as any })}
        >
          <option value="">All</option>
          {qualities.map((q) => (
            <option key={q} value={q}>{q}</option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm text-zinc-600 dark:text-zinc-400">Packing</label>
        <select
          className="border rounded px-2 py-1 bg-transparent"
          value={value.packing ?? ""}
          onChange={(e) => onChange({ ...value, packing: (e.target.value || undefined) as any })}
        >
          <option value="">All</option>
          {packings.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm text-zinc-600 dark:text-zinc-400">Date From</label>
        <input
          type="date"
          className="border rounded px-2 py-1 bg-transparent"
          value={value.dateFrom ?? ""}
          onChange={(e) => onChange({ ...value, dateFrom: e.target.value || undefined })}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm text-zinc-600 dark:text-zinc-400">Date To</label>
        <input
          type="date"
          className="border rounded px-2 py-1 bg-transparent"
          value={value.dateTo ?? ""}
          onChange={(e) => onChange({ ...value, dateTo: e.target.value || undefined })}
        />
      </div>
    </div>
  );
}
