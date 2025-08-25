type RateRow = {
  id: number;
  date: string;
  state: { id: number; name: string };
  mandi: { id: number; name: string };
  quality: "LOW" | "MEDIUM" | "HIGH";
  sizeMm: number;
  packing: "LOOSE" | "BAG" | "BOX";
  pricePerKg: number | string;
};

const packingDisplay = (p: RateRow["packing"]) => {
  switch (p) {
    case "BAG": return "50 kg";
    case "BOX": return "20 kg";
    default: return "Loose";
  }
};

export default function RatesTable({ rows }: { rows: RateRow[] }) {
  return (
    <div className="overflow-auto border rounded">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="text-left p-2">Date</th>
            <th className="text-left p-2">Location</th>
            <th className="text-left p-2">Size</th>
            <th className="text-left p-2">Packing</th>
            <th className="text-left p-2">Rate</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id} className="border-t">
              <td className="p-2">{new Date(r.date).toISOString().slice(0, 10)}</td>
              <td className="p-2">{r.mandi?.name}{r.state?.name ? `, ${r.state.name}` : ""}</td>
              <td className="p-2">{r.sizeMm} mm</td>
              <td className="p-2">{packingDisplay(r.packing)}</td>
              <td className="p-2">₹{Number(r.pricePerKg).toFixed(2)}</td>
            </tr>
          ))}
          {rows.length === 0 && (
            <tr><td className="p-4" colSpan={5}>No records</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
