"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";

// Fallback lightweight SVG animation
const TruckAnimation = dynamic(() => import("./TruckAnimation"), { ssr: false });

export default function RealisticTruck({
  className = "w-full h-64",
  src = "/animations/truck.json",
  loop = true,
  autoplay = true,
}: {
  className?: string;
  src?: string;
  loop?: boolean;
  autoplay?: boolean;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [canUseLottie, setCanUseLottie] = useState(true);

  useEffect(() => {
    let anim: any;
    let destroyed = false;

    async function load() {
      try {
        const [{ default: lottie }, res] = await Promise.all([
          import("lottie-web"),
          fetch(src, { cache: "force-cache" }),
        ]);
        if (!res.ok) throw new Error(`Failed to load Lottie JSON: ${res.status}`);
        const json = await res.json();
        if (!containerRef.current) return;
        anim = lottie.loadAnimation({
          container: containerRef.current,
          renderer: "svg",
          loop,
          autoplay,
          animationData: json,
          rendererSettings: { preserveAspectRatio: "xMidYMid meet" },
        });
      } catch (e) {
        console.warn("Lottie fallback to SVG animation:", e);
        if (!destroyed) setCanUseLottie(false);
      }
    }

    load();

    return () => {
      destroyed = true;
      try { (anim as any)?.destroy?.(); } catch {}
    };
  }, [src, loop, autoplay]);

  if (!canUseLottie) {
    return <TruckAnimation className={className} />;
  }

  return <div ref={containerRef} className={className} aria-label="Export & Logistics animation" />;
}
