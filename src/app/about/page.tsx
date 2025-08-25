import type { Metadata } from "next";
import TradingNetworkSection from "@/components/TradingNetworkSection";
import SupplyChainAnimation from "@/components/SupplyChainAnimation";

export const metadata: Metadata = {
  title: "About Us – Godavarifarms APC",
  description:
    "Godavarifarms Associate Producer Company Limited: farmer-owned trading and marketing company for domestic and export onion trade.",
};

function Icon({ path, className = "w-6 h-6" }: { path: string; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d={path} />
    </svg>
  );
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section
        className="relative"
        style={{
          backgroundImage:
            "linear-gradient(180deg, rgba(255,255,255,0.86), rgba(255,255,255,0.96)), url(/globe.svg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="container-narrow py-12 sm:py-16">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div className="fade-in-up">
              <span className="inline-flex items-center gap-2 text-sm font-semibold text-[color:var(--color-accent-blue)]">
                <Icon className="w-4 h-4" path="M12 2a10 10 0 100 20 10 10 0 000-20z" />
                Godavarifarms Associate Producer Company Limited
              </span>
              <h1 className="mt-3 text-3xl sm:text-5xl font-extrabold leading-tight text-zinc-900">
                Building a Trusted Onion Trading Ecosystem
              </h1>
              <p className="mt-4 text-zinc-700 max-w-xl">
                A farmer-owned organization from Maharashtra enabling transparent, efficient, and quality-driven trade across domestic and
                international markets.
              </p>
            </div>
            <div className="relative fade-in-up-delayed">
              <div className="grid grid-cols-2 gap-4">
                <div className="aspect-[4/3] rounded-lg overflow-hidden shadow-sm border bg-[color:var(--color-muted)]" />
                <div className="aspect-[4/3] rounded-lg overflow-hidden shadow-sm border bg-white flex items-center justify-center">
                  <img src="/globe.svg" alt="Global trading network" className="w-28 h-28 opacity-80" />
                </div>
                <div className="col-span-2 aspect-[8/3] rounded-lg overflow-hidden shadow-sm border bg-gradient-to-r from-[color:var(--color-accent)]/10 to-[color:var(--color-accent-blue)]/10" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Intro + Mission/Vision two-column */}
      <section className="container-narrow py-10 sm:py-14">
        <div className="grid lg:grid-cols-2 gap-10">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">About Us</h2>
            <p className="text-zinc-700">
              Godavarifarms Associate Producer Company Limited (APC) is a farmer-owned organization established to strengthen the agricultural
              economy with a strong focus on onion trading and allied agri-business activities. Based in Maharashtra – India’s largest onion-producing
              region – we are committed to bridging the gap between farmers, traders, and global markets through transparency, efficiency, and quality.
            </p>
            <p className="text-zinc-700">
              As an Associate Producer Company, we bring farmers together to create collective strength, ensuring they get fair value for their produce
              while buyers receive consistent supply and world-class quality. Over the years, we have built a reliable trading ecosystem that serves
              domestic markets, wholesale mandis, food processing industries, and international buyers.
            </p>
          </div>
          <div className="grid gap-6 content-start">
            <div className="flex items-start gap-3">
              <div className="mt-1 text-[color:var(--color-accent)]">
                <Icon path="M12 2a10 10 0 100 20 10 10 0 000-20z" />
              </div>
              <div>
                <h3 className="font-semibold">Our Mission</h3>
                <ul className="mt-2 list-disc pl-5 text-zinc-700 space-y-1">
                  <li>Empower farmers with direct market access and reduce dependency on middlemen.</li>
                  <li>Provide buyers with quality-assured, graded, and competitively priced onions and agri-produce.</li>
                  <li>Establish a transparent and efficient trading platform that benefits all stakeholders.</li>
                </ul>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="mt-1 text-[color:var(--color-accent-blue)]">
                <Icon path="M12 2l3 7h7l-5.5 4 2.1 7L12 17l-6.6 3 2.1-7L2 9h7z" />
              </div>
              <div>
                <h3 className="font-semibold">Our Vision</h3>
                <p className="mt-2 text-zinc-700">
                  To be recognized as a global leader in onion trading and agri-supply chain solutions, making Maharashtra’s produce a symbol of trust,
                  quality, and reliability across the world.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What We Offer */}
      <section className="container-narrow py-6 sm:py-8">
        <div className="h-px w-full bg-zinc-200 mb-6" />
        <h2 className="text-2xl font-bold">What We Offer</h2>
        <p className="text-zinc-700 mt-2 max-w-3xl">
          End-to-end trading and marketing solutions for domestic and international markets.
        </p>
        <div className="mt-6 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            { title: "Daily Market Price Updates", desc: "Transparent onion price updates for informed decisions.", color: "text-green-700" },
            { title: "Domestic Trading", desc: "Bulk supply to mandis, retailers, and industries across India.", color: "text-blue-800" },
            { title: "Export Trading", desc: "Supply to Dubai, Malaysia, Sri Lanka, Bangladesh, and more.", color: "text-orange-700" },
            { title: "Sorting & Grading", desc: "Standardized processes to ensure size, quality, and uniformity.", color: "text-green-700" },
            { title: "Packaging", desc: "5kg, 10kg, 18kg, 25kg, 50kg – as per buyer requirements.", color: "text-blue-800" },
            { title: "Logistics & Documentation", desc: "Cold storage, warehousing, transportation, customs.", color: "text-orange-700" },
          ].map((c, i) => (
            <div key={i} className="card hoverable p-5">
              <div className={`mb-3 ${c.color}`}>
                <Icon className="w-7 h-7" path="M5 12l5 5L20 7" />
              </div>
              <h3 className="font-semibold">{c.title}</h3>
              <p className="mt-1.5 text-sm text-zinc-700">{c.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Quality & Compliance */}
      <section className="container-narrow py-8">
        <div className="h-px w-full bg-zinc-200 mb-6" />
        <h2 className="text-2xl font-bold">Quality & Compliance</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          <span className="badge badge-green">
            <Icon className="w-4 h-4" path="M5 12l5 5L20 7" /> Quality Check
          </span>
          <span className="badge badge-blue">
            <Icon className="w-4 h-4" path="M4 4h16v16H4z" /> APEDA
          </span>
          <span className="badge badge-indigo">
            <Icon className="w-4 h-4" path="M12 2a10 10 0 100 20 10 10 0 000-20z" /> FSSAI
          </span>
          <span className="badge">
            <Icon className="w-4 h-4" path="M3 12h18" /> International Standards
          </span>
          <span className="badge">
            <Icon className="w-4 h-4" path="M12 6v12M6 12h12" /> Certification
          </span>
        </div>
        <ul className="mt-4 list-disc pl-5 text-zinc-700 space-y-1">
          <li>Sorting, grading, and packing as per domestic & international norms.</li>
          <li>Compliance with APEDA, FSSAI, and global import/export regulations.</li>
          <li>Farm-to-market traceability and sustainability practices (GAP).</li>
        </ul>
      </section>

      {/* Export & Logistics */}
      <section className="container-narrow py-10">
        <div className="h-px w-full bg-zinc-200 mb-6" />
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-2xl font-bold">Export & Logistics</h2>
            <p className="mt-3 text-zinc-700 max-w-prose">
              Our end-to-end supply chain covers road transport from farms, port operations and containerization, ocean freight,
              and air cargo for priority shipments — connecting India to key global destinations.
            </p>
            <ul className="mt-4 list-disc pl-5 text-zinc-700 space-y-1">
              <li>Route-optimized domestic trucking with real-time coordination.</li>
              <li>Seaport handling: loading, documentation, and customs clearance.</li>
              <li>Ocean & air freight to the Middle East and Southeast Asia.</li>
            </ul>
          </div>
          <div>
            <SupplyChainAnimation className="w-full h-80" />
          </div>
        </div>
      </section>

      {/* Trading Network */}
      <section className="container-narrow py-8">
        <div className="h-px w-full bg-zinc-200 mb-6" />
        <h2 className="text-2xl font-bold">Trading Network</h2>
        <div className="mt-6 grid lg:grid-cols-2 gap-8 items-center">
          <div className="order-2 lg:order-1">
            <ul className="space-y-2 text-zinc-700">
              <li>
                <strong>Domestic Markets:</strong> major mandis, wholesale buyers, institutional clients, supermarkets.
              </li>
              <li>
                <strong>Export Markets:</strong> Middle East, South Asia, Southeast Asia.
              </li>
              <li>
                <strong>Farmer Network:</strong> Hundreds of associated farmers ensuring reliable volumes.
              </li>
            </ul>
          </div>
          <div className="order-1 lg:order-2">
            <div className="relative border rounded-xl p-6 bg-white shadow-sm">
              <img src="/globe.svg" alt="World map highlighting markets" className="mx-auto w-64 h-64 opacity-90" />
            </div>
          </div>
        </div>
      </section>

      {/* Trading Network (3D Globe) */}
      <TradingNetworkSection />

      {/* Why Choose Us */}
      <section className="container-narrow py-10">
        <div className="h-px w-full bg-zinc-200 mb-6" />
        <h2 className="text-2xl font-bold">Why Choose Us?</h2>
        <div className="mt-4 grid md:grid-cols-2 gap-6">
          {[
            "Farmer-Owned Company – Ensuring farmer welfare and fair pricing.",
            "Reliable Supply – Consistent and large-scale onion supply across seasons.",
            "Quality First – Graded, sorted, and packaged as per international standards.",
            "Transparency – Daily price updates and fair trading practices.",
            "Global Reach – Strong network in both domestic and export markets.",
          ].map((text, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="mt-1 text-[color:var(--color-accent)]">
                <Icon path="M5 12l5 5L20 7" />
              </div>
              <p className="text-zinc-700">{text}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
