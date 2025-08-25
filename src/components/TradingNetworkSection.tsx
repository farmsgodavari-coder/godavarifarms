"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import type { Region } from "./TradingNetworkGlobe";

const TradingNetworkGlobe = dynamic(() => import("./TradingNetworkGlobe"), { ssr: false });

export default function TradingNetworkSection({ className = "" }: { className?: string }) {
  const [highlight, setHighlight] = useState<Region>("none");
  return (
    <section className={`container-narrow py-10 ${className}`}>
      <div className="grid lg:grid-cols-2 gap-8 items-center">
        <div>
          <h2 className="text-2xl font-bold">Trading Network</h2>
          <p className="mt-3 text-zinc-700 max-w-prose">
            Our onion exports move from Nashik across the Middle East and Southeast Asia via optimized sea and air routes.
          </p>
          <div className="mt-5 space-y-2">
            <HoverItem
              label="Domestic"
              desc="Pan-India distribution network with reliable trucking and storage."
              onEnter={() => setHighlight("domestic")}
              onLeave={() => setHighlight("none")}
            />
            <HoverItem
              label="Export"
              desc="Dubai, Malaysia, Singapore and more — ocean and air freight corridors."
              onEnter={() => setHighlight("export")}
              onLeave={() => setHighlight("none")}
            />
            <HoverItem
              label="Farmer Network"
              desc="Direct partnerships with growers around Nashik for consistent supply."
              onEnter={() => setHighlight("farmer")}
              onLeave={() => setHighlight("none")}
            />
          </div>
        </div>
        <div>
          <TradingNetworkGlobe highlight={highlight} className="w-full h-96" />
        </div>
      </div>
    </section>
  );
}

function HoverItem({ label, desc, onEnter, onLeave }: { label: string; desc: string; onEnter: () => void; onLeave: () => void }) {
  return (
    <div
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      className="group rounded-lg border p-4 transition-colors hover:border-[color:var(--color-accent)] cursor-default"
    >
      <div className="flex items-center gap-2">
        <span className="inline-block w-2 h-2 rounded-full bg-[color:var(--color-accent)] group-hover:animate-pulse" />
        <span className="font-semibold text-zinc-900">{label}</span>
      </div>
      <p className="text-zinc-700 mt-1">{desc}</p>
    </div>
  );
}
