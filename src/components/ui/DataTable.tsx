"use client";

import { useMemo, useState } from "react";

export interface Column<T> {
  key: keyof T | string;
  header: string;
  render?: (row: T) => React.ReactNode;
  className?: string;
}

export default function DataTable<T extends Record<string, any>>({
  columns,
  rows,
  initialSort,
}: {
  columns: Column<T>[];
  rows: T[];
  initialSort?: { key: string; dir: "asc" | "desc" };
}) {
  const [sort, setSort] = useState<{ key: string; dir: "asc" | "desc" } | null>(initialSort || null);

  const sorted = useMemo(() => {
    if (!sort) return rows;
    const cpy = [...rows];
    cpy.sort((a, b) => {
      const av = (a as any)[sort.key];
      const bv = (b as any)[sort.key];
      if (av == null && bv == null) return 0;
      if (av == null) return 1;
      if (bv == null) return -1;
      if (typeof av === "number" && typeof bv === "number") return sort.dir === "asc" ? av - bv : bv - av;
      return sort.dir === "asc" ? String(av).localeCompare(String(bv)) : String(bv).localeCompare(String(av));
    });
    return cpy;
  }, [rows, sort]);

  function toggleSort(key: string) {
    setSort((s) => {
      if (!s || s.key !== key) return { key, dir: "asc" };
      return { key, dir: s.dir === "asc" ? "desc" : "asc" };
    });
  }

  return (
    <div className="overflow-x-auto table-card">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-[color:var(--color-muted)]/60">
            {columns.map((c) => (
              <th
                key={String(c.key)}
                className={`text-left font-semibold px-3 py-2 border-b border-[color:var(--color-border)] ${c.className || ""}`}
              >
                <button className="inline-flex items-center gap-1 hover:underline" onClick={() => toggleSort(String(c.key))}>
                  <span>{c.header}</span>
                  {sort?.key === c.key && (
                    <span aria-hidden>{sort.dir === "asc" ? "▲" : "▼"}</span>
                  )}
                </button>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted.map((row, i) => (
            <tr key={i} className={i % 2 ? "bg-white hover:bg-zinc-50" : "bg-[color:var(--color-muted)]/20 hover:bg-zinc-50"}>
              {columns.map((c) => (
                <td key={String(c.key)} className={`px-3 py-2 border-b border-[color:var(--color-border)] ${c.className || ""}`}>
                  {c.render ? c.render(row) : String((row as any)[c.key])}
                </td>
              ))}
            </tr>
          ))}
          {rows.length === 0 && (
            <tr>
              <td colSpan={columns.length} className="px-3 py-6 text-center text-zinc-600">No records</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
