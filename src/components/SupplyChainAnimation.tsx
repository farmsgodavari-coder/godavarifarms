"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";

// Reuse existing lightweight truck as part of fallback sequence
const TruckAnimation = dynamic(() => import("./TruckAnimation"), { ssr: false });

export default function SupplyChainAnimation({
  className = "w-full h-80",
  src = "/animations/supply-chain.json",
  loop = true,
  autoplay = true,
}: {
  className?: string;
  src?: string;
  loop?: boolean;
  autoplay?: boolean;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [useFallback, setUseFallback] = useState(false);

  useEffect(() => {
    let anim: any;
    let disposed = false;

    async function run() {
      try {
        const [{ default: lottie }, res] = await Promise.all([
          import("lottie-web"),
          fetch(src, { cache: "force-cache" }),
        ]);
        if (!res.ok) throw new Error(`Failed to load supply-chain.json: ${res.status}`);
        const data = await res.json();
        if (!ref.current) return;
        anim = lottie.loadAnimation({
          container: ref.current,
          renderer: "svg",
          loop,
          autoplay,
          animationData: data,
          rendererSettings: {
            preserveAspectRatio: "xMidYMid meet",
            progressiveLoad: true,
          },
        });
      } catch (err) {
        console.warn("SupplyChainAnimation: falling back to SVG sequence", err);
        if (!disposed) setUseFallback(true);
      }
    }

    run();
    return () => {
      disposed = true;
      try { (anim as any)?.destroy?.(); } catch {}
    };
  }, [src, loop, autoplay]);

  if (useFallback) return <FallbackSequence className={className} />;
  return <div ref={ref} className={className} aria-label="Onion export supply chain animation" />;
}

function FallbackSequence({ className }: { className?: string }) {
  return (
    <div className={className}>
      <div className="relative w-full h-full overflow-hidden rounded-xl border bg-white">
        {/* Stage 1: Truck */}
        <div className="absolute inset-0 p-4 flex items-center">
          <div className="w-full">
            <TruckAnimation className="w-full h-40" />
          </div>
        </div>
        {/* Stage 2: Ship */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 320" xmlns="http://www.w3.org/2000/svg">
          {/* Sky gradient */}
          <defs>
            <linearGradient id="seaSky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#eff6ff" />
              <stop offset="100%" stopColor="#ffffff" />
            </linearGradient>
          </defs>
          <rect width="800" height="320" fill="url(#seaSky)" />
          {/* Sea */}
          <rect y="220" width="800" height="100" fill="#1e3a8a" opacity="0.12" />
          {/* Ship body */}
          <g className="ship-move">
            <rect x="-260" y="210" width="260" height="20" rx="6" fill="#1e3a8a" />
            <rect x="-240" y="170" width="140" height="40" rx="6" fill="#0b1a44" opacity="0.9" />
            {/* Containers */}
            {Array.from({ length: 6 }).map((_, i) => (
              <rect key={i} x={-90 + i * 28} y={176} width="24" height="22" rx="3" fill="#16a34a" opacity="0.9" />
            ))}
            {/* Crane line */}
            <line x1="-20" y1="110" x2="-20" y2="176" stroke="#64748b" strokeWidth="2" strokeDasharray="4 4" />
            {/* Crane hook */}
            <rect x="-26" y="172" width="12" height="8" fill="#64748b" rx="2" />
          </g>
        </svg>
        {/* Stage 3: Airplane */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 800 320" xmlns="http://www.w3.org/2000/svg">
          <g className="plane-takeoff" fill="#15803d">
            <path d="M120 260 l80 -20 60 30 100 -14 40 12 -30 10 -90 14 -70 -36 -80 20z" opacity="0.08" />
            <g>
              <path d="M-120 240 l80 -10 40 20 120 -12 24 8 -16 6 -110 12 -46 -24 -80 10z" opacity="0.0" />
            </g>
            <g transform="translate(-120,240)">
              <rect x="0" y="-6" width="80" height="12" rx="6" fill="#15803d" />
              <polygon points="80,-6 110,0 80,6" fill="#0f5f2b" />
            </g>
          </g>
        </svg>
        {/* Stage 4: World map arrows */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 320" xmlns="http://www.w3.org/2000/svg">
          {/* Simplified map line */}
          <path d="M120 160 C 200 100, 300 120, 380 140 S 520 180, 660 140" stroke="#e2e8f0" strokeWidth="2" fill="none" opacity="0.6" />
          {/* India origin */}
          <circle cx="360" cy="170" r="4" fill="#16a34a" />
          {/* Destinations */}
          <g className="arrows">
            <Arrow fromX={360} fromY={170} toX={580} toY={150} />
            <Arrow fromX={360} fromY={170} toX={620} toY={180} />
            <Arrow fromX={360} fromY={170} toX={540} toY={120} />
          </g>
        </svg>
      </div>
      <style jsx>{`
        @keyframes shipMove { 0% { transform: translateX(-5%); } 100% { transform: translateX(110%); } }
        @keyframes planeTakeoff { 0% { transform: translate(0,0); opacity: 0; } 10% { opacity: 1; } 100% { transform: translate(120%, -60%); opacity: 0.9; } }
        @keyframes arrowFlow { 0% { stroke-dashoffset: 120; } 100% { stroke-dashoffset: 0; } }
        .ship-move { animation: shipMove 9s ease-in-out infinite; }
        .plane-takeoff { animation: planeTakeoff 8s ease-in-out infinite; animation-delay: 4s; }
      `}</style>
    </div>
  );
}

function Arrow({ fromX, fromY, toX, toY }: { fromX: number; fromY: number; toX: number; toY: number }) {
  const id = `grad-${fromX}-${fromY}-${toX}-${toY}`;
  const dx = toX - fromX;
  const dy = toY - fromY;
  const angle = Math.atan2(dy, dx);
  const len = Math.hypot(dx, dy);
  return (
    <g transform={`translate(${fromX}, ${fromY}) rotate(${(angle * 180) / Math.PI})`}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#16a34a" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#1e3a8a" stopOpacity="0.9" />
        </linearGradient>
      </defs>
      <line x1="0" y1="0" x2={len - 10} y2="0" stroke={`url(#${id})`} strokeWidth="3" strokeDasharray="120" style={{ animation: "arrowFlow 2.8s linear infinite" }} />
      <polygon points={`0,-4 0,4 10,0`} fill="#1e3a8a" transform={`translate(${len - 10}, 0)`} />
    </g>
  );
}
