"use client";
import { useState } from "react";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [quantity, setQuantity] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    setError(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, mobile, quantity }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed");
      setStatus("success");
      setName("");
      setMobile("");
      setQuantity("");
    } catch (e: any) {
      setStatus("error");
      setError(e?.message || "Failed to submit");
    }
  }

  return (
    <div className="min-h-screen max-w-xl mx-auto px-6 py-10 sm:py-14">
      <h1 className="text-3xl font-bold">Contact Us</h1>
      <p className="text-zinc-700 mt-2">Godavari Farms – Nashik, Maharashtra</p>
      <p className="text-zinc-700 mt-2">For bulk onion inquiries, please submit your details and we’ll get back to you.</p>

      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <div>
          <label className="block text-sm text-zinc-700 mb-1">Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} required className="w-full border rounded px-3 py-2" placeholder="Your name" />
        </div>
        <div>
          <label className="block text-sm text-zinc-700 mb-1">Mobile</label>
          <input value={mobile} onChange={(e) => setMobile(e.target.value)} required className="w-full border rounded px-3 py-2" placeholder="e.g. +91 9876543210" />
        </div>
        <div>
          <label className="block text-sm text-zinc-700 mb-1">Quantity Required</label>
          <input value={quantity} onChange={(e) => setQuantity(e.target.value)} className="w-full border rounded px-3 py-2" placeholder="e.g. 10 tons" />
        </div>
        <button disabled={status === "submitting"} className="bg-black text-white px-5 py-2 rounded disabled:opacity-50">
          {status === "submitting" ? "Submitting…" : "Submit Inquiry"}
        </button>
        {status === "success" && <div className="text-green-600 text-sm">Thank you! We’ll contact you shortly.</div>}
        {status === "error" && <div className="text-red-600 text-sm">{error}</div>}
      </form>
    </div>
  );
}
