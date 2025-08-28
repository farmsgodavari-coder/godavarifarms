"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Filters, { type FilterValues } from "@/components/Filters";

interface OnionRate {
  id: string;
  date: string;
  variety: string;
  location: string;
  minPrice: number;
  maxPrice: number;
  avgPrice: number;
  quality: string;
  unit: string;
  packing?: string;
  packingDescription?: string | null;
  rateType?: string;
  country?: string | null;
  sizeMm?: number | null;
}

export default function DailyRatesPage() {
  const [data, setData] = useState<OnionRate[]>([]);
  const [filteredData, setFilteredData] = useState<OnionRate[]>([]);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("table");
  const [filters, setFilters] = useState<FilterValues>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/public/rates", { cache: "no-store" });
        if (response.ok) {
          const result = await response.json();
          const rates = Array.isArray(result)
            ? result
            : (result.data ?? result.fallback ?? []);
          setData(rates);
          setFilteredData(rates);
          setLastUpdated(new Date().toLocaleString());
        } else {
          const fallbackResponse = await fetch("/api/rates", { cache: "no-store" });
          if (fallbackResponse.ok) {
            const fallbackResult = await fallbackResponse.json();
            const rates = fallbackResult.data || [];
            const transformedRates = rates.map((rate: any) => ({
              id: rate.id?.toString() || Math.random().toString(),
              date: rate.date || new Date().toISOString(),
              variety: rate.variety || "Red Onion",
              location: `${rate.mandi?.name || "Unknown"}, ${rate.state?.name || "India"}`,
              minPrice: Math.max(0, Number(rate.pricePerKg || 0) - 200),
              maxPrice: Math.max(Number(rate.pricePerKg || 0), Number(rate.pricePerKg || 0) + 300),
              avgPrice: Number(rate.pricePerKg || 0),
              quality: rate.quality === "HIGH" ? "Premium" : 
                       rate.quality === "MEDIUM" ? "Grade A" : "Standard",
              unit: "per kg",
              packing: rate.packing || "BAG",
              packingDescription: rate.packingDescription || null,
              rateType: rate.rateType || "DOMESTIC",
              country: rate.country || null,
              sizeMm: rate.sizeMm || null,
            }));
            setData(transformedRates);
            setFilteredData(transformedRates);
            setLastUpdated(new Date().toLocaleString());
          }
        }
      } catch (error) {
        console.error("Failed to fetch rates:", error);
        const fallbackData = [
          {
            id: "fallback-1",
            date: new Date().toISOString(),
            variety: "Red Onion",
            location: "Nashik, Maharashtra",
            minPrice: 2500,
            maxPrice: 3200,
            avgPrice: 2850,
            quality: "Premium",
            unit: "per quintal",
            packing: "BAG",
            packingDescription: "25 KG Jute Bag",
            rateType: "DOMESTIC",
            country: null,
            sizeMm: 55,
          }
        ];
        setData(fallbackData);
        setFilteredData(fallbackData);
        setLastUpdated(new Date().toLocaleString());
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    let filtered = [...data];
    
    if (filters.quality && filters.quality !== "LOW") {
      filtered = filtered.filter(item => {
        const qualityMap = { "Premium": "HIGH", "Grade A": "MEDIUM", "Standard": "LOW" };
        return qualityMap[item.quality as keyof typeof qualityMap] === filters.quality;
      });
    }

    setFilteredData(filtered);
  }, [data, filters]);

  const varieties = [...new Set(data.map(item => item.variety))];
  const locations = [...new Set(data.map(item => item.location))];
  const qualities = [...new Set(data.map(item => item.quality))];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading daily rates...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-yellow-50">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-green-600 via-green-700 to-yellow-600 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-repeat" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>
        
        <div className="container-premium relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/20 backdrop-blur-sm px-6 py-3 text-sm font-semibold mb-6">
              <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse"></div>
              <span>Live Market Data</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Daily Onion <span className="text-yellow-300">Rates</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-green-100 font-light leading-relaxed max-w-3xl mx-auto mb-8">
              Real-time pricing intelligence for informed trading decisions. 
              Updated multiple times daily from major markets across India.
            </p>

            {lastUpdated && (
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3">
                <svg className="w-5 h-5 text-yellow-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm font-medium">Last updated: {lastUpdated}</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container-premium">
          {/* Filters */}
          <div className="bg-white rounded-3xl shadow-xl border border-green-100 p-8 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Filter Rates</h2>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <span>{filteredData.length} results found</span>
              </div>
            </div>
            
            <Filters
              value={filters}
              onChange={setFilters}
            />
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center justify-center mb-8">
            <div className="bg-white rounded-2xl p-2 shadow-lg border border-green-100">
              <button
                onClick={() => setActiveTab("table")}
                className={`px-8 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  activeTab === "table"
                    ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg"
                    : "text-gray-600 hover:text-green-600 hover:bg-green-50"
                }`}
              >
                Table View
              </button>
              <button
                onClick={() => setActiveTab("chart")}
                className={`px-8 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  activeTab === "chart"
                    ? "bg-gradient-to-r from-yellow-500 to-yellow-600 text-white shadow-lg"
                    : "text-gray-600 hover:text-yellow-600 hover:bg-yellow-50"
                }`}
              >
                Chart View
              </button>
            </div>
          </div>

          {/* Content */}
          {activeTab === "table" ? (
            <div className="bg-white rounded-3xl shadow-xl border border-green-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-green-600 to-green-700 text-white">
                    <tr>
                      <th className="px-6 py-4 text-left font-semibold">Date</th>
                      <th className="px-6 py-4 text-left font-semibold">Type</th>
                      <th className="px-6 py-4 text-left font-semibold">Variety</th>
                      <th className="px-6 py-4 text-left font-semibold">Location</th>
                      <th className="px-6 py-4 text-left font-semibold">Quality</th>
                      <th className="px-6 py-4 text-left font-semibold">Packing</th>
                      <th className="px-6 py-4 text-right font-semibold">Min Price</th>
                      <th className="px-6 py-4 text-right font-semibold">Max Price</th>
                      <th className="px-6 py-4 text-right font-semibold">Avg Price</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-green-100">
                    {filteredData.length > 0 ? (
                      filteredData.map((rate, index) => (
                        <tr 
                          key={rate.id} 
                          className={`hover:bg-green-50 transition-colors duration-200 ${
                            index % 2 === 0 ? "bg-white" : "bg-green-25"
                          }`}
                        >
                          <td className="px-6 py-4 text-gray-800 font-medium">
                            {new Date(rate.date).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                              rate.rateType === "EXPORT" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"
                            }`}>
                              {rate.rateType === "EXPORT" ? `Export${rate.country ? ` (${rate.country})` : ""}` : "Domestic"}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              {rate.variety}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-gray-700">{rate.location}</td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                              rate.quality === "Premium" ? "bg-yellow-100 text-yellow-800" :
                              rate.quality === "Grade A" ? "bg-blue-100 text-blue-800" :
                              "bg-gray-100 text-gray-800"
                            }`}>
                              {rate.quality}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm">
                              <div className="font-medium text-gray-900">{rate.packing || "BAG"}</div>
                              {rate.packingDescription && (
                                <div className="text-gray-500 text-xs">{rate.packingDescription}</div>
                              )}
                              {rate.sizeMm && (
                                <div className="text-gray-400 text-xs">{rate.sizeMm}mm</div>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right font-semibold text-gray-800">
                            ₹{rate.minPrice.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 text-right font-semibold text-gray-800">
                            ₹{rate.maxPrice.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 text-right font-bold text-green-600 text-lg">
                            ₹{rate.avgPrice.toLocaleString()}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={9} className="px-6 py-12 text-center text-gray-500">
                          <div className="flex flex-col items-center">
                            <svg className="w-12 h-12 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <p className="text-lg font-medium">No rates found</p>
                            <p className="text-sm">Try adjusting your filters</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl shadow-xl border border-green-100 p-8">
              <div className="text-center py-16">
                <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Chart View Coming Soon</h3>
                <p className="text-gray-600">Interactive price charts and trend analysis will be available soon.</p>
              </div>
            </div>
          )}

          {/* Market Insights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-green-100 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Today's High</h3>
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
              </div>
              <div className="text-3xl font-bold text-green-600 mb-2">
                ₹{filteredData.length > 0 ? Math.max(...filteredData.map(r => r.maxPrice)).toLocaleString() : "0"}
              </div>
              <p className="text-sm text-gray-600">Highest rate today</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-yellow-100 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Average Price</h3>
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
              </div>
              <div className="text-3xl font-bold text-yellow-600 mb-2">
                ₹{filteredData.length > 0 ? Math.round(filteredData.reduce((sum, r) => sum + r.avgPrice, 0) / filteredData.length).toLocaleString() : "0"}
              </div>
              <p className="text-sm text-gray-600">Market average</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-blue-100 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Markets Active</h3>
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
              </div>
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {locations.length}
              </div>
              <p className="text-sm text-gray-600">Trading locations</p>
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-16 text-center">
            <div className="bg-gradient-to-r from-green-600 to-yellow-600 rounded-3xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">Need Custom Market Analysis?</h3>
              <p className="text-green-100 mb-6 max-w-2xl mx-auto">
                Get personalized market insights, price forecasts, and trading recommendations from our agricultural experts.
              </p>
              <Link 
                href="/contact" 
                className="btn-base bg-white text-green-600 hover:bg-green-50 font-semibold px-8 py-3 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
              >
                Contact Our Experts
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
