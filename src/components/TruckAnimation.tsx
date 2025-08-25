"use client";

export default function TruckAnimation({ className = "w-full h-56" }: { className?: string }) {
  return (
    <div className={className} aria-label="Export & Logistics animation">
      <svg viewBox="0 0 800 240" role="img" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f8fafc" />
            <stop offset="100%" stopColor="#ffffff" />
          </linearGradient>
          <linearGradient id="road" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0f172a" />
            <stop offset="100%" stopColor="#0b1227" />
          </linearGradient>
          <clipPath id="clip-road">
            <rect x="0" y="170" width="800" height="70" rx="8" />
          </clipPath>
        </defs>

        {/* Background sky */}
        <rect x="0" y="0" width="800" height="240" fill="url(#sky)" />

        {/* Distant horizon silhouettes (subtle) */}
        <g opacity="0.1" fill="#1e3a8a">
          <path d="M0 150 L60 140 L120 150 L180 135 L260 145 L320 140 L380 150 L440 138 L520 148 L600 142 L660 150 L740 138 L800 150 L800 170 L0 170 Z" />
        </g>

        {/* Road */}
        <g clipPath="url(#clip-road)">
          <rect x="0" y="170" width="800" height="70" fill="url(#road)" />
          {/* Lane markings */}
          <g className="road-scroll">
            {Array.from({ length: 16 }).map((_, i) => (
              <rect key={i} x={i * 60} y="204" width="40" height="6" rx="3" fill="#e5e7eb" opacity="0.9" />
            ))}
          </g>
        </g>

        {/* Moving Truck */}
        <g className="truck-drive">
          {/* Container */}
          <rect x="-240" y="92" width="240" height="66" rx="8" fill="#1e3a8a" />
          {/* ONION BAGS (stack) */}
          <g transform="translate(-230,98)">
            {Array.from({ length: 10 }).map((_, i) => (
              <rect key={i} x={(i % 5) * 44} y={Math.floor(i / 5) * 30} width="38" height="22" rx="4" fill="#16a34a" opacity="0.9" />
            ))}
          </g>

          {/* Cabin */}
          <g transform="translate(10,0)">
            <path d="M-40 150 h60 a10 10 0 0 0 10 -10 v-28 a8 8 0 0 0 -8 -8 h-32 l-20 20 z" fill="#16a34a" />
            <rect x="-8" y="116" width="26" height="16" rx="3" fill="#e2f6ea" />
          </g>

          {/* Wheels */}
          <g className="wheel-spin">
            <circle cx="-160" cy="160" r="16" fill="#0b0f14" />
            <circle cx="-160" cy="160" r="8" fill="#e5e7eb" />
          </g>
          <g className="wheel-spin">
            <circle cx="-60" cy="160" r="16" fill="#0b0f14" />
            <circle cx="-60" cy="160" r="8" fill="#e5e7eb" />
          </g>
          <g className="wheel-spin">
            <circle cx="20" cy="160" r="16" fill="#0b0f14" />
            <circle cx="20" cy="160" r="8" fill="#e5e7eb" />
          </g>
        </g>
      </svg>
      <style jsx>{`
        @keyframes truckDrive {
          0% { transform: translateX(-10%); }
          100% { transform: translateX(110%); }
        }
        @keyframes laneScroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-60px); }
        }
        @keyframes wheelSpin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .truck-drive { animation: truckDrive 8s linear infinite; }
        .road-scroll { animation: laneScroll 600ms linear infinite; }
        .wheel-spin { transform-origin: center; animation: wheelSpin 800ms linear infinite; }
      `}</style>
    </div>
  );
}
