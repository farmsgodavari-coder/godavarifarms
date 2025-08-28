"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type State = { id: number; name: string };
type Mandi = { id: number; name: string; stateId: number };

export default function AddRatePage() {
  const [states, setStates] = useState<State[]>([]);
  const [mandis, setMandis] = useState<Mandi[]>([]);

  const [statesLoading, setStatesLoading] = useState(false);
  const [mandisLoading, setMandisLoading] = useState(false);

  const [stateId, setStateId] = useState<number | "">("");
  const [mandiId, setMandiId] = useState<number | "">("");
  const [date, setDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [rateType, setRateType] = useState<"DOMESTIC" | "EXPORT">("DOMESTIC");
  const [quality, setQuality] = useState("MEDIUM");
  const [sizeMm, setSizeMm] = useState<number | "">("");
  const [packing, setPacking] = useState("BAG");
  const [packingDescription, setPackingDescription] = useState<string>("");
  type Country = "Dubai" | "Malaysia" | "Sri Lanka" | "Bangladesh" | "Vietnam";
  const [country, setCountry] = useState<Country | "">("");
  const countryDefaults: Record<Country, { size: number; packingDescription: string; packingEnum: "BAG" | "LOOSE" | "BOX" }> = {
    Dubai: { size: 55, packingDescription: "18 KG Packing", packingEnum: "BAG" },
    Malaysia: { size: 45, packingDescription: "15 KG Packing", packingEnum: "BAG" },
    "Sri Lanka": { size: 45, packingDescription: "15 KG Jute Bag", packingEnum: "BAG" },
    Bangladesh: { size: 40, packingDescription: "15 KG Jute Bag", packingEnum: "BAG" },
    Vietnam: { size: 25, packingDescription: "10 KG Packing", packingEnum: "BAG" },
  };
  const [pricePerKg, setPricePerKg] = useState<number | "">("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function fetchJsonWithRetry<T = any>(url: string, tries = 3): Promise<T | null> {
    let lastErr: any;
    for (let i = 0; i < tries; i++) {
      try {
        const r = await fetch(url);
        const txt = await r.text().catch(() => "");
        const js = txt ? JSON.parse(txt) : null;
        if (!r.ok) throw new Error(js?.error || `HTTP ${r.status}`);
        return js as T;
      } catch (e) {
        lastErr = e;
        await new Promise(res => setTimeout(res, 250 * (i + 1)));
      }
    }
    console.error("[admin/add-rate] fetch failed:", url, lastErr);
    return null;
  }

  useEffect(() => {
    (async () => {
      setStatesLoading(true);
      try {
        const data = await fetchJsonWithRetry<{data: State[]} | State[]>("/api/meta/states", 3);
        const statesArray = Array.isArray(data) ? data : (data?.data || []);
        setStates(statesArray);
      } finally {
        setStatesLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (!stateId) { setMandis([]); setMandiId(""); return; }
    (async () => {
      setMandisLoading(true);
      try {
        const data = await fetchJsonWithRetry<{data: Mandi[]} | Mandi[]>(`/api/meta/mandis?stateId=${stateId}`, 3);
        const mandisArray = Array.isArray(data) ? data : (data?.data || []);
        setMandis(mandisArray);
      } finally {
        setMandisLoading(false);
      }
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
      
      if (!sizeMm || !pricePerKg) {
        throw new Error("Size and Price are required");
      }

      const payload: any = {
        rateType,
        date,
        sizeMm: Number(sizeMm),
        packing,
        packingDescription: packingDescription.trim() || null,
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
      setSuccess("Rate added successfully. Public site will update immediately.");
      // Reset form for next entry
      setPackingDescription("");
      setPricePerKg("");
      setTimeout(() => setSuccess(null), 4000);
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
        const list = await fetchJsonWithRetry<Mandi[]>(`/api/meta/mandis?stateId=${st.id}`, 3);
        const arr: Mandi[] = Array.isArray(list) ? list : [];
        md = arr.find(m => /nashik/i.test(m.name)) || arr[0];
      }

      if (!st || !md) throw new Error("No states/mandis found to insert sample");

      const payload = {
        date: new Date().toISOString().slice(0,10),
        stateId: st.id,
        mandiId: md.id,
        quality: "MEDIUM",
        sizeMm: 55,
        packing: "BAG",
        packingDescription: "25 KG Jute Bag",
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
        {error && <div className="text-sm text-red-600 bg-red-50 p-3 rounded border">{error}</div>}
        {success && <div className="text-sm text-green-700 bg-green-50 p-3 rounded border">{success}</div>}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Rate Type *</label>
            <select className="w-full border rounded px-3 py-2" value={rateType}
              onChange={(e) => {
                const v = e.target.value as "DOMESTIC" | "EXPORT";
                setRateType(v);
                // Reset fields when switching types
                if (v === "EXPORT") {
                  setStateId("");
                  setMandiId("");
                } else {
                  setCountry("");
                }
              }}>
              <option value="DOMESTIC">Domestic</option>
              <option value="EXPORT">Export</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium">Date *</label>
            <input type="date" className="w-full border rounded px-3 py-2" value={date} onChange={e => setDate(e.target.value)} required />
          </div>
          
          {rateType === "DOMESTIC" && (
            <>
              <div>
                <label className="text-sm font-medium">State *</label>
                <select className="w-full border rounded px-3 py-2" value={stateId as any}
                  onChange={e => setStateId(e.target.value ? Number(e.target.value) : "")}
                  required
                  disabled={statesLoading}
                >
                  <option value="">{statesLoading ? "Loading states..." : "Select state"}</option>
                  {states.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  {!statesLoading && states.length === 0 && <option value="" disabled>(No states found)</option>}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Mandi/City *</label>
                <select className="w-full border rounded px-3 py-2" value={mandiId as any}
                  onChange={e => setMandiId(e.target.value ? Number(e.target.value) : "")}
                  required
                  disabled={!stateId || mandisLoading}
                >
                  <option value="">{mandisLoading ? "Loading mandis..." : "Select mandi"}</option>
                  {mandis.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                  {!mandisLoading && stateId && mandis.length === 0 && <option value="" disabled>(No mandis found)</option>}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Onion Quality *</label>
                <select className="w-full border rounded px-3 py-2" value={quality} onChange={e => setQuality(e.target.value)}>
                  <option value="LOW">LOW</option>
                  <option value="MEDIUM">MEDIUM</option>
                  <option value="HIGH">HIGH</option>
                </select>
              </div>
            </>
          )}

          {rateType === "EXPORT" && (
            <>
              <div>
                <label className="text-sm font-medium">Country *</label>
                <select
                  className="w-full border rounded px-3 py-2"
                  value={country as any}
                  onChange={(e) => {
                    const c = (e.target.value || "") as Country | "";
                    setCountry(c);
                    if (c && countryDefaults[c as Country]) {
                      const d = countryDefaults[c as Country];
                      setSizeMm(d.size);
                      setPackingDescription(d.packingDescription);
                      setPacking(d.packingEnum);
                    }
                  }}
                  required
                >
                  <option value="">Select country</option>
                  {( ["Dubai","Malaysia","Sri Lanka","Bangladesh","Vietnam"] as const).map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Quality</label>
                <select className="w-full border rounded px-3 py-2" value={quality} onChange={e => setQuality(e.target.value)}>
                  <option value="LOW">LOW</option>
                  <option value="MEDIUM">MEDIUM</option>
                  <option value="HIGH">HIGH</option>
                </select>
                <div className="text-xs text-gray-500 mt-1">Auto-set to MEDIUM for exports</div>
              </div>
            </>
          )}

          <div>
            <label className="text-sm font-medium">Size (mm) *</label>
            <input type="number" className="w-full border rounded px-3 py-2" value={sizeMm as any} onChange={e => setSizeMm(e.target.value ? Number(e.target.value) : "")} required />
          </div>
          <div>
            <label className="text-sm font-medium">Packing Type</label>
            <select className="w-full border rounded px-3 py-2" value={packing} onChange={e => setPacking(e.target.value)}>
              <option value="LOOSE">LOOSE</option>
              <option value="BAG">BAG</option>
              <option value="BOX">BOX</option>
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className="text-sm font-medium">Packing Description</label>
            <input
              className="w-full border rounded px-3 py-2"
              placeholder="e.g., 18 KG Packing, 15 KG Jute Bag, 25 KG PP Bag"
              value={packingDescription}
              onChange={(e) => setPackingDescription(e.target.value)}
            />
            <div className="text-xs text-gray-500 mt-1">Detailed description of packing for buyers</div>
          </div>
          <div>
            <label className="text-sm font-medium">Price per kg *</label>
            <input type="number" step="0.01" className="w-full border rounded px-3 py-2" value={pricePerKg as any} onChange={e => setPricePerKg(e.target.value ? Number(e.target.value) : "")} required />
          </div>
        </div>
        <div className="flex gap-3">
          <button disabled={loading} className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 disabled:opacity-60">
            {loading ? "Saving..." : "Save Rate"}
          </button>
          <button type="button" onClick={addSample} disabled={loading} className="border border-gray-300 text-gray-700 px-6 py-2 rounded hover:bg-gray-50 disabled:opacity-60">
            {loading ? "Please wait..." : "Add Sample Rate"}
          </button>
        </div>
      </form>
    </div>
  );
}
