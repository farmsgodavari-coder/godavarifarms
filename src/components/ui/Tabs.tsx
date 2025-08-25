"use client";

import { useId } from "react";

export type TabKey = string;
export interface TabItem {
  key: TabKey;
  label: string;
}

export function Tabs({
  items,
  value,
  onChange,
}: {
  items: TabItem[];
  value: TabKey;
  onChange: (k: TabKey) => void;
}) {
  const id = useId();
  return (
    <div className="w-full">
      <div role="tablist" aria-label="Sections" className="inline-flex rounded-lg border border-[color:var(--color-border)] bg-white p-1 shadow-sm">
        {items.map((it) => {
          const active = value === it.key;
          return (
            <button
              key={it.key}
              role="tab"
              aria-selected={active}
              aria-controls={`${id}-${it.key}`}
              className={
                "px-4 py-1.5 text-sm rounded-md transition-colors " +
                (active
                  ? "bg-[color:var(--color-accent)] text-white"
                  : "text-zinc-700 hover:bg-[color:var(--color-muted)])")
              }
              onClick={() => onChange(it.key)}
            >
              {it.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default Tabs;
