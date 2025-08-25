"use client";

export type PriceRow = {
  id: number;
  date: string;
  state: { id: number; name: string };
  mandi: { id: number; name: string };
  size: "SMALL" | "MEDIUM" | "LARGE";
  quality: "LOW" | "MEDIUM" | "HIGH";
  packing: "LOOSE" | "BAG" | "BOX";
  minPrice: string;
  avgPrice: string;
  maxPrice: string;
};

export default function PricesTable({ rows }: { rows: PriceRow[] }) {
  if (!rows?.length) {
    return (
      <div className="border border-dashed rounded-lg p-6 text-sm text-zinc-600 dark:text-zinc-300">
        No data. Adjust filters or insert prices via POST /api/prices.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto border rounded-lg">
      <table className="min-w-full text-sm">
        <thead className="bg-zinc-50 dark:bg-zinc-900">
          <tr className="text-left">
            <Th>Date</Th>
            <Th>State</Th>
            <Th>Mandi</Th>
            <Th>Size</Th>
            <Th>Quality</Th>
            <Th>Packing</Th>
            <Th className="text-right">Min</Th>
            <Th className="text-right">Avg</Th>
            <Th className="text-right">Max</Th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id} className="border-t">
              <Td>{fmtDate(r.date)}</Td>
              <Td>{r.state?.name}</Td>
              <Td>{r.mandi?.name}</Td>
              <Td>{r.size}</Td>
              <Td>{r.quality}</Td>
              <Td>{r.packing}</Td>
              <Td className="text-right">{fmtMoney(r.minPrice)}</Td>
              <Td className="text-right">{fmtMoney(r.avgPrice)}</Td>
              <Td className="text-right">{fmtMoney(r.maxPrice)}</Td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Th({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <th className={`px-3 py-2 font-medium ${className}`}>{children}</th>;
}

function Td({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <td className={`px-3 py-2 ${className}`}>{children}</td>;
}

function fmtDate(d: string) {
  try {
    const dt = new Date(d);
    return dt.toISOString().slice(0, 10);
  } catch {
    return d;
  }
}

function fmtMoney(v: string) {
  const n = Number(v);
  if (Number.isNaN(n)) return v;
  return n.toLocaleString(undefined, { maximumFractionDigits: 2 });
}
