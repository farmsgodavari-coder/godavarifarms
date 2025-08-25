"use client";
import { useEffect, useState } from "react";

export default function SettingsPage() {
  const [settings, setSettings] = useState<any>({});
  const [saving, setSaving] = useState(false);

  const load = async () => {
    try {
      const r = await fetch("/api/admin/settings", { cache: "no-store" });
      const text = await r.text();
      const data = text ? JSON.parse(text) : {};
      setSettings(data || {});
    } catch {
      setSettings({});
    }
  };

  useEffect(() => { load(); }, []);

  const setSetting = async (key: string, value: any) => {
    setSaving(true);
    await fetch("/api/admin/settings", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ key, value }) });
    setSaving(false);
    await load();
  };

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Site Settings</h1>
      <div className="grid gap-2 max-w-xl">
        <label className="text-sm">Site Title</label>
        <input className="border rounded p-2" value={settings["site.title"]||""} onChange={e=>setSettings({...settings, ["site.title"]: e.target.value})} onBlur={e=>setSetting("site.title", e.target.value)} />

        <label className="text-sm">Footer Text</label>
        <input className="border rounded p-2" value={settings["site.footer"]||""} onChange={e=>setSettings({...settings, ["site.footer"]: e.target.value})} onBlur={e=>setSetting("site.footer", e.target.value)} />

        <label className="text-sm">Show News</label>
        <input type="checkbox" checked={!!settings["home.showNews"]} onChange={e=>setSetting("home.showNews", e.target.checked)} />

        <label className="text-sm">Show Graphs</label>
        <input type="checkbox" checked={!!settings["home.showGraphs"]} onChange={e=>setSetting("home.showGraphs", e.target.checked)} />
      </div>
      {saving ? <div className="text-sm text-gray-500">Saving...</div> : null}
    </div>
  );
}
