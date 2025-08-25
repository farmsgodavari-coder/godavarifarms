type RateRow = {
  id: number;
  date: string;
  rateType?: "DOMESTIC" | "EXPORT";
  country?: string | null;
  state?: { id: number; name: string } | null;
  mandi?: { id: number; name: string } | null;
  quality: "LOW" | "MEDIUM" | "HIGH";
  sizeMm: number;
  packing: "LOOSE" | "BAG" | "BOX";
  pricePerKg: number | string;
};

const packingDisplay = (p: RateRow["packing"]) => {
  switch (p) {
    case "BAG": return "Bag";
    case "BOX": return "Box";
    default: return "Loose";
  }
};

// Best-effort export packing label based on country defaults used in Admin
function exportPackingLabel(country: string | null | undefined, sizeMm: number, packing: RateRow["packing"]) {
  if (!country) return packingDisplay(packing);
  const map: Record<string, string> = {
    Dubai: "18 KG Packing",
    Malaysia: "15 KG Packing",
    "Sri Lanka": "15 KG Jute Bag",
    Bangladesh: "15 KG Jute Bag",
    Vietnam: "10 KG Packing",
  };
  // Prefer explicit mapping; otherwise fallback to enum label
  return map[country] ?? packingDisplay(packing);
}

export default function RatesCards({ rows }: { rows: RateRow[] }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {rows.map((r) => (
        <div
          key={r.id}
          className="rounded-xl border border-zinc-200 shadow-sm p-4 bg-white hover:shadow-md transition-shadow duration-200"
        >
          <div className="flex items-center justify-between">
            <div className="text-xs text-zinc-500">{new Date(r.date).toISOString().slice(0, 10)}</div>
            <div className={`text-xs px-2 py-0.5 rounded-full border ${r.rateType === 'EXPORT' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' : 'bg-green-50 text-green-700 border-green-200'}`}>
              {r.rateType || 'DOMESTIC'}
            </div>
          </div>
          <div className="mt-2 font-semibold text-zinc-900">
            {r.rateType === 'EXPORT' ? (r.country || '') : (
              <>
                {r.mandi?.name}{r.state?.name ? `, ${r.state.name}` : ""}
              </>
            )}
          </div>
          <div className="mt-1 text-sm text-zinc-600 flex items-center gap-3">
            <span>{r.sizeMm} mm</span>
            <span>•</span>
            <span>{r.rateType === 'EXPORT' ? exportPackingLabel(r.country, r.sizeMm, r.packing) : packingDisplay(r.packing)}</span>
          </div>
          {r.rateType !== 'EXPORT' && (
            <div className="mt-1 text-xs text-zinc-500">Quality: {r.quality}</div>
          )}
          <div className="mt-3 text-2xl font-bold text-green-700">₹{Number(r.pricePerKg).toFixed(2)}</div>
        </div>
      ))}
      {rows.length === 0 && (
        <div className="col-span-full text-sm text-zinc-600 border rounded-xl p-6 text-center bg-white">No records</div>
      )}
    </div>
  );
}
