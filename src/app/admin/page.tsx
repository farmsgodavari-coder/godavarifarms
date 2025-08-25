import prisma from "@/lib/prisma";

export default async function AdminDashboard() {
  const [states, mandis, rates, announcementsTotal] = await Promise.all([
    prisma.state.count(),
    prisma.mandi.count(),
    prisma.onionRate.count(),
    prisma.announcement.count(),
  ]);

  // Compute last 7 days average by day
  const now = new Date();
  const startToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const start7 = new Date(startToday);
  start7.setDate(start7.getDate() - 6);
  const ratesRaw = await prisma.onionRate.findMany({
    where: { date: { gte: start7 } },
    select: { date: true, pricePerKg: true },
    orderBy: { date: "asc" },
  });
  const ymd = (d: Date) => d.toISOString().slice(0,10);
  const byDay: Record<string, { sum: number; count: number }> = {};
  for (const r of ratesRaw) {
    const k = ymd(new Date(r.date));
    if (!byDay[k]) byDay[k] = { sum: 0, count: 0 };
    byDay[k].sum += Number(r.pricePerKg);
    byDay[k].count += 1;
  }
  const last7 = Object.entries(byDay)
    .sort((a,b) => a[0].localeCompare(b[0]))
    .map(([date, v]) => ({ date, avg: v.count ? Number((v.sum / v.count).toFixed(2)) : 0 }));
  const todayKey = ymd(startToday);
  const todayAvg = last7.find(d => d.date === todayKey)?.avg ?? null;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="border rounded p-4"><div className="text-sm text-gray-600">States</div><div className="text-2xl font-bold">{states}</div></div>
        <div className="border rounded p-4"><div className="text-sm text-gray-600">Mandis</div><div className="text-2xl font-bold">{mandis}</div></div>
        <div className="border rounded p-4"><div className="text-sm text-gray-600">Onion Rates</div><div className="text-2xl font-bold">{rates}</div></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="border rounded p-4">
          <div className="text-sm text-gray-600">Today's Avg Rate</div>
          <div className="text-3xl font-bold">{todayAvg ?? "--"}</div>
        </div>
        <div className="border rounded p-4">
          <div className="text-sm text-gray-600">Total Announcements</div>
          <div className="text-3xl font-bold">{announcementsTotal}</div>
        </div>
        <div className="border rounded p-4">
          <div className="text-sm text-gray-600 mb-2">Last 7 Days Avg</div>
          <div className="space-y-1 max-h-40 overflow-auto pr-1">
            {last7.length === 0 ? (
              <div className="text-sm text-gray-500">No data</div>
            ) : last7.map(d => (
              <div key={d.date} className="flex items-center justify-between text-sm">
                <span className="text-gray-600">{d.date}</span>
                <span className="font-medium">{d.avg}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
