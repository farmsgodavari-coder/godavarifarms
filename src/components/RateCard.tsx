type Rate = {
  id: number;
  date: string;
  state: { id: number; name: string };
  mandi: { id: number; name: string };
  quality: "LOW" | "MEDIUM" | "HIGH";
  sizeMm: number;
  packing: "LOOSE" | "BAG" | "BOX";
  pricePerKg: number | string;
};

const packingWeight = (p: Rate["packing"]) => {
  switch (p) {
    case "BAG": return "(50 kg)";
    case "BOX": return "(20 kg)";
    default: return "";
  }
};

export default function RateCard({ rate }: { rate: Rate }) {
  const price = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 2 }).format(Number(rate.pricePerKg));
  return (
    <div className="border rounded-lg p-4 shadow-sm">
      <div className="text-sm text-zinc-600">{new Date(rate.date).toLocaleDateString()}</div>
      <div className="text-lg font-semibold">{rate.state?.name}, {rate.mandi?.name}, India</div>
      <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
        <div><span className="text-zinc-500">Quality:</span> {rate.quality}</div>
        <div><span className="text-zinc-500">Size:</span> {rate.sizeMm} mm</div>
        <div><span className="text-zinc-500">Packing:</span> {rate.packing} {packingWeight(rate.packing)}</div>
        <div><span className="text-zinc-500">Price/kg:</span> {price}</div>
      </div>
    </div>
  );
}
