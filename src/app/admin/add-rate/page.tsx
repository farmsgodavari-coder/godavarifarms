"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type State = { id: number; name: string };
type Mandi = { id: number; name: string; stateId: number };

export default function AddRatePage() {
  const [states, setStates] = useState<State[]>([]);
  const [mandis, setMandis] = useState<Mandi[]>([]);

  const [stateId, setStateId] = useState<number | "">("");
  const [mandiId, setMandiId] = useState<number | "">("");
  const [date, setDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [rateType, setRateType] = useState<"DOMESTIC" | "EXPORT">("DOMESTIC");
  const [quality, setQuality] = useState("MEDIUM");
  const [sizeMm, setSizeMm] = useState<number | "">("");
  const [packing, setPacking] = useState("BAG");
  // UI-only packing label (e.g., "18 KG Packing", "15 KG Jute Bag"). We still submit packing enum as before.
  const [packingLabel, setPackingLabel] = useState<string>("");
  type Country = "Dubai" | "Malaysia" | "Sri Lanka" | "Bangladesh" | "Vietnam";
  const [country, setCountry] = useState<Country | "">("");
  const countryDefaults: Record<Country, { size: number; packingLabel: string; packingEnum: "BAG" | "LOOSE" | "BOX" }> = {
    Dubai: { size: 55, packingLabel: "18 KG Packing", packingEnum: "BAG" },
    Malaysia: { size: 45, packingLabel: "15 KG Packing", packingEnum: "BAG" },
    "Sri Lanka": { size: 45, packingLabel: "15 KG Jute Bag", packingEnum: "BAG" },
    Bangladesh: { size: 40, packingLabel: "15 KG Jute Bag", packingEnum: "BAG" },
    Vietnam: { size: 25, packingLabel: "10 KG Packing", packingEnum: "BAG" },
  };
  const [pricePerKg, setPricePerKg] = useState<number | "">("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/meta/states");
      const data = await res.json();
      setStates(data);
    })();
  }, []);

  useEffect(() => {
    if (!stateId) { setMandis([]); setMandiId(""); return; }
    (async () => {
      const res = await fetch(`/api/meta/mandis?stateId=${stateId}`);
      const data = await res.json();
      setMandis(data);
    })();
  }, [stateId]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);
    try {
      const isDomestic = rateType === "DOMESTIC";
      // Basic front-end validation per type
      if (isDomestic) {
        if (!stateId || !mandiId) throw new Error("State and Mandi are required for Domestic rates");
      } else {
        if (!country) throw new Error("Country is required for Export rates");
      }
      const payload: any = {
        rateType,
        date,
        sizeMm: Number(sizeMm),
        packing,
        pricePerKg: Number(pricePerKg),
      };
      if (isDomestic) {
        payload.stateId = Number(stateId);
        payload.mandiId = Number(mandiId);
        payload.quality = quality;
      } else {
        payload.country = country;
        payload.quality = quality || "MEDIUM";
      }
      const res = await fetch("/api/admin/rates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const js = await res.json();
      if (!res.ok) throw new Error(js.error || "Failed to add rate");
      setSuccess("Rate added successfully.");
      // Let SSE propagate and keep user here
      setTimeout(() => setSuccess(null), 3000);
    } catch (e: any) {
      setError(e.message || "Error");
    } finally {
      setLoading(false);
    }
  }

  async function addSample() {
    setError(null);
    setSuccess(null);
    setLoading(true);
    try {
      // Try to find Maharashtra -> Nashik
      let st = states.find(s => /maharashtra/i.test(s.name)) || states[0];
      let md: Mandi | undefined;
      if (st) {
        const res = await fetch(`/api/meta/mandis?stateId=${st.id}`);
        const list: Mandi[] = await res.json();
        md = list.find(m => /nashik/i.test(m.name)) || list[0];
      }

      if (!st || !md) throw new Error("No states/mandis found to insert sample");

      const payload = {
        date: new Date().toISOString().slice(0,10),
        stateId: st.id,
        mandiId: md.id,
        quality: "MEDIUM",
        sizeMm: 55,
        packing: "BAG",
        pricePerKg: 20,
      };
      const res = await fetch("/api/admin/rates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const js = await res.json();
      if (!res.ok) throw new Error(js.error || "Failed to add sample");
      setSuccess("Sample rate inserted. Public site should update instantly.");
      setTimeout(() => setSuccess(null), 3000);
    } catch (e: any) {
      setError(e.message || "Error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Add Rate</h1>
      <form onSubmit={onSubmit} className="grid gap-4 max-w-2xl">
        {error && <div className="text-sm text-red-600">{error}</div>}
        {success && <div className="text-sm text-green-700">{success}</div>}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm">Rate Type</label>
            <select className="w-full border rounded px-3 py-2" value={rateType}
              onChange={(e) => {
                const v = e.target.value as "DOMESTIC" | "EXPORT";
                setRateType(v);
              }}>
              <option value="DOMESTIC">Domestic</option>
              <option value="EXPORT">Export</option>
            </select>
          </div>
          <div>
            <label className="text-sm">State</label>
            <select className="w-full border rounded px-3 py-2" value={stateId as any} onChange={e => setStateId(e.target.value ? Number(e.target.value) : "")} required={rateType === "DOMESTIC"} disabled={rateType === "EXPORT"}>
              <option value="">Select state</option>
              {states.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm">Mandi/City</label>
            <select className="w-full border rounded px-3 py-2" value={mandiId as any} onChange={e => setMandiId(e.target.value ? Number(e.target.value) : "")} required={rateType === "DOMESTIC"} disabled={rateType === "EXPORT" || !stateId}>
              <option value="">Select mandi</option>
              {mandis.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm">Date</label>
            <input type="date" className="w-full border rounded px-3 py-2" value={date} onChange={e => setDate(e.target.value)} required />
          </div>
          <div>
            <label className="text-sm">Onion Quality</label>
            <select className="w-full border rounded px-3 py-2" value={quality} onChange={e => setQuality(e.target.value)} disabled={rateType === "EXPORT"}>
              <option value="LOW">LOW</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="HIGH">HIGH</option>
            </select>
          </div>
          <div>
            <label className="text-sm">Country {rateType === "EXPORT" ? "(required)" : "(optional)"}</label>
            <select
              className="w-full border rounded px-3 py-2"
              value={country as any}
              onChange={(e) => {
                const c = (e.target.value || "") as Country | "";
                setCountry(c);
                if (c && countryDefaults[c as Country]) {
                  const d = countryDefaults[c as Country];
                  setSizeMm(d.size);
                  setPackingLabel(d.packingLabel);
                  setPacking(d.packingEnum); // keep enum for backend
                }
              }}
              disabled={rateType === "DOMESTIC"}
            >
              <option value="">Select country</option>
              {( ["Dubai","Malaysia","Sri Lanka","Bangladesh","Vietnam"] as const).map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm">Size (mm)</label>
            <input type="number" className="w-full border rounded px-3 py-2" value={sizeMm as any} onChange={e => setSizeMm(e.target.value ? Number(e.target.value) : "")} required />
          </div>
          <div>
            <label className="text-sm">Packing Type</label>
            <input
              className="w-full border rounded px-3 py-2"
              placeholder="e.g., 18 KG Packing, 15 KG Jute Bag"
              value={packingLabel}
              onChange={(e) => setPackingLabel(e.target.value)}
            />
            <div className="text-xs text-zinc-500 mt-1">System will save packing enum as BAG; label is for admin reference.</div>
          </div>
          <div>
            <label className="text-sm">Price per kg</label>
            <input type="number" step="0.01" className="w-full border rounded px-3 py-2" value={pricePerKg as any} onChange={e => setPricePerKg(e.target.value ? Number(e.target.value) : "")} required />
          </div>
        </div>
        <div className="text-xs text-zinc-600">Auto-filled values can be changed manually if needed.</div>
        <button disabled={loading} className="w-full sm:w-auto bg-black text-white px-4 py-2 rounded disabled:opacity-60">{loading ? "Saving..." : "Save"}</button>
        <button type="button" onClick={addSample} disabled={loading} className="w-full sm:w-auto border border-black text-black px-4 py-2 rounded disabled:opacity-60">{loading ? "Please wait..." : "Add Sample Rate"}</button>
      </form>
    </div>
  );
}
