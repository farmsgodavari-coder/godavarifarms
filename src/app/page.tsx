"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function Home() {
  const [siteSettings, setSiteSettings] = useState<Record<string, any>>({});
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [ticker, setTicker] = useState<any[]>([]);

  // Load public settings and announcements
  useEffect(() => {
    (async () => {
      try {
        const [sRes, aRes] = await Promise.all([
          fetch("/api/public/settings"),
          fetch("/api/public/announcements"),
        ]);
        const sText = await sRes.text();
        let s: Record<string, any> = {};
        try { s = sText ? JSON.parse(sText) : {}; } catch { s = {}; }
        setSiteSettings(s || {});

        let a: any = { items: [], ticker: [] };
        try { a = await aRes.json(); } catch { a = { items: [], ticker: [] }; }
        setAnnouncements(a.items || []);
        setTicker(a.ticker || []);
      } catch {
        // ignore
      }
    })();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Ticker banner */}
      {Boolean(siteSettings["home.showNews"]) && ticker.length > 0 && (
        <div className="w-full bg-gradient-to-r from-emerald-50 to-blue-50 border-b border-emerald-200/60">
          <div className="container-premium py-3 whitespace-nowrap overflow-hidden">
            <div className="inline-flex items-center gap-6 animate-[scroll_40s_linear_infinite]" style={{ minWidth: "100%" }}>
              {ticker.map((t: any) => (
                <span key={t.id} className="inline-flex items-center gap-3">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                  <span className="font-medium text-slate-700">{t.title}</span>
                  <span className="text-slate-400">•</span>
                </span>
              ))}
            </div>
          </div>
          <style>{`@keyframes scroll { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }`}</style>
        </div>
      )}

      {/* Hero Section */}
      <section className="section-hero section-padding">
        <div className="container-premium">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="fade-in-left">
              <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-100 to-blue-100 px-4 py-2 text-sm font-semibold text-emerald-700 mb-6">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Leading Agricultural Solutions
              </div>
              <h1 className="text-hero mb-6">
                Godavari Farms
              </h1>
              <p className="text-lead mb-8 max-w-xl">
                Your trusted partner in premium agricultural produce and market intelligence. 
                Connecting farmers with global markets through innovation and excellence.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/contact" className="btn-base btn-primary">
                  Get In Touch
                </Link>
                <Link href="/rates" className="btn-base btn-outline">
                  View Daily Rates
                </Link>
              </div>
            </div>
            <div className="fade-in-right">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/20 to-blue-400/20 rounded-3xl blur-3xl transform rotate-6"></div>
                <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/50">
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-slate-800 mb-4">Premium Quality Onions</h3>
                    <p className="text-slate-600 mb-6">Fresh from farm to your table with guaranteed quality and competitive pricing.</p>
                    <Link href="/rates" className="btn-base bg-emerald-600 text-white hover:bg-emerald-700 font-semibold">
                      View Today's Rates
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* End-to-End Features Section */}
      <section className="section-padding bg-slate-50">
        <div className="container-premium">
          <div className="text-center mb-16 fade-in-up">
            <h2 className="text-4xl font-bold mb-6">Complete Agricultural Solutions</h2>
            <p className="text-lead max-w-3xl mx-auto">
              From farm to market, we provide comprehensive end-to-end services that ensure quality, 
              transparency, and maximum value for all stakeholders in the agricultural supply chain.
            </p>
          </div>

          {/* Main Features Grid */}
          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            {/* Farm Management */}
            <div className="card-premium p-8 fade-in-delayed hoverable">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-4">Smart Farm Management</h3>
              <p className="text-slate-600 mb-6">
                Advanced agricultural techniques, soil analysis, crop planning, and sustainable farming practices 
                to maximize yield and quality.
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                  <span>Precision agriculture technology</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                  <span>Organic farming certification</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                  <span>Weather monitoring systems</span>
                </div>
              </div>
            </div>

            {/* Quality Control */}
            <div className="card-premium p-8 fade-in-delayed hoverable">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-4">Quality Assurance</h3>
              <p className="text-slate-600 mb-6">
                Rigorous quality control processes from harvest to packaging, ensuring every product 
                meets international standards and customer expectations.
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                  <span>Laboratory testing & analysis</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                  <span>Traceability systems</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                  <span>Export grade quality</span>
                </div>
              </div>
            </div>

            {/* Market Intelligence */}
            <div className="card-premium p-8 fade-in-delayed-2 hoverable">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-4">Market Intelligence</h3>
              <p className="text-slate-600 mb-6">
                Real-time market data, price analytics, and demand forecasting to help farmers and 
                buyers make informed decisions.
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                  <span>Live price tracking</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                  <span>Market trend analysis</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                  <span>Demand forecasting</span>
                </div>
              </div>
            </div>
          </div>

          {/* Supply Chain Process */}
          <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-200 fade-in-up">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold mb-4">Our End-to-End Process</h3>
              <p className="text-slate-600 max-w-2xl mx-auto">
                A seamless journey from seed to market, ensuring quality and transparency at every step
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Step 1 */}
              <div className="text-center relative">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-emerald-600">1</span>
                </div>
                <h4 className="font-semibold mb-2">Cultivation</h4>
                <p className="text-sm text-slate-600">Premium seed selection, organic farming, and sustainable practices</p>
                {/* Connector Line */}
                <div className="hidden lg:block absolute top-8 left-full w-8 h-0.5 bg-gradient-to-r from-emerald-300 to-blue-300"></div>
              </div>

              {/* Step 2 */}
              <div className="text-center relative">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-blue-600">2</span>
                </div>
                <h4 className="font-semibold mb-2">Processing</h4>
                <p className="text-sm text-slate-600">Quality control, sorting, grading, and packaging in certified facilities</p>
                <div className="hidden lg:block absolute top-8 left-full w-8 h-0.5 bg-gradient-to-r from-blue-300 to-orange-300"></div>
              </div>

              {/* Step 3 */}
              <div className="text-center relative">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-orange-600">3</span>
                </div>
                <h4 className="font-semibold mb-2">Logistics</h4>
                <p className="text-sm text-slate-600">Cold chain management, transportation, and inventory optimization</p>
                <div className="hidden lg:block absolute top-8 left-full w-8 h-0.5 bg-gradient-to-r from-orange-300 to-emerald-300"></div>
              </div>

              {/* Step 4 */}
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-emerald-600">4</span>
                </div>
                <h4 className="font-semibold mb-2">Delivery</h4>
                <p className="text-sm text-slate-600">Global distribution, market access, and customer satisfaction</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section className="py-24 bg-gradient-to-br from-gray-50 via-white to-green-50 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-green-400 to-yellow-400 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-20 w-80 h-80 bg-gradient-to-br from-yellow-400 to-green-400 rounded-full blur-3xl"></div>
        </div>

        <div className="container-premium relative z-10">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            {/* Content Column */}
            <div className="animate-fade-in-left">
              <div className="inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-green-100 to-yellow-100 px-6 py-3 text-sm font-semibold text-green-700 mb-8 shadow-sm">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <span>About Godavari Farms</span>
              </div>
              
              <h2 className="text-5xl md:text-6xl font-bold mb-8 leading-tight">
                <span className="text-gray-800">Cultivating</span>
                <span className="block bg-gradient-to-r from-green-600 via-green-700 to-yellow-600 bg-clip-text text-transparent">Excellence Since 2008</span>
              </h2>
              
              <div className="space-y-6 mb-10">
                <p className="text-xl text-gray-700 leading-relaxed font-light">
                  For over <span className="font-semibold text-green-600">15 years</span>, Godavari Farms has been at the forefront of agricultural excellence, 
                  transforming the way premium onions reach global markets through innovation, quality, and unwavering commitment.
                </p>

                <p className="text-lg text-gray-600 leading-relaxed">
                  From our state-of-the-art facilities to our network of trusted farmers, we ensure every onion meets 
                  international standards while supporting sustainable agricultural practices that benefit communities and the environment.
                </p>
              </div>

              {/* Key Highlights */}
              <div className="grid grid-cols-2 gap-6 mb-10">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-1">Quality Assured</h4>
                    <p className="text-sm text-gray-600">Premium export standards</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-1">Global Reach</h4>
                    <p className="text-sm text-gray-600">Serving 15+ countries worldwide</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-1">Innovation Driven</h4>
                    <p className="text-sm text-gray-600">Advanced processing technology</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-1">Community Focus</h4>
                    <p className="text-sm text-gray-600">Supporting local farmers</p>
                  </div>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  href="/about" 
                  className="btn-base btn-green px-8 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 group"
                >
                  <span>Discover Our Story</span>
                  <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
                <Link 
                  href="/contact" 
                  className="btn-base btn-outline-gold px-8 py-4 text-lg font-semibold border-2 hover:bg-yellow-500 hover:text-white transform hover:-translate-y-1 transition-all duration-300"
                >
                  Partner With Us
                </Link>
              </div>
            </div>

            {/* Visual Column */}
            <div className="relative animate-fade-in-right">
              {/* Main Stats Card */}
              <div className="relative bg-white rounded-3xl p-8 shadow-2xl border border-green-100">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-yellow-500/5 rounded-3xl"></div>
                
                <div className="relative z-10">
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">Our Impact</h3>
                    <p className="text-gray-600">Building agricultural excellence together</p>
                  </div>

                  {/* Animated Stats Grid */}
                  <div className="grid grid-cols-2 gap-6 mb-8">
                    <div className="text-center group">
                      <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                        <span className="text-2xl font-bold text-white counter animate-count-up" data-target="25">25+</span>
                      </div>
                      <div className="text-sm font-semibold text-gray-800">Years Experience</div>
                      <div className="text-xs text-gray-500">Since 2008</div>
                    </div>

                    <div className="text-center group">
                      <div className="w-20 h-20 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                        <span className="text-2xl font-bold text-white counter animate-count-up" data-target="500">500+</span>
                      </div>
                      <div className="text-sm font-semibold text-gray-800">Farmers Connected</div>
                      <div className="text-xs text-gray-500">Growing network</div>
                    </div>

                    <div className="text-center group">
                      <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                        <span className="text-2xl font-bold text-white counter animate-count-up" data-target="15">15+</span>
                      </div>
                      <div className="text-sm font-semibold text-gray-800">Countries Served</div>
                      <div className="text-xs text-gray-500">Global reach</div>
                    </div>

                    <div className="text-center group">
                      <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                        <span className="text-2xl font-bold text-white">100%</span>
                      </div>
                      <div className="text-sm font-semibold text-gray-800">Quality Assured</div>
                      <div className="text-xs text-gray-500">Premium standards</div>
                    </div>
                  </div>

                  {/* Progress Bars */}
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm font-medium text-gray-700 mb-2">
                        <span>Export Quality</span>
                        <span>98%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full animate-progress" style={{ width: '98%' }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-sm font-medium text-gray-700 mb-2">
                        <span>Customer Satisfaction</span>
                        <span>96%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 h-2 rounded-full animate-progress" style={{ width: '96%', animationDelay: '0.5s' }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-sm font-medium text-gray-700 mb-2">
                        <span>On-Time Delivery</span>
                        <span>99%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full animate-progress" style={{ width: '99%', animationDelay: '1s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Achievement Badge */}
              <div className="absolute -top-6 -right-6 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-2xl p-4 shadow-xl transform rotate-12 hover:rotate-0 transition-transform duration-300">
                <div className="text-center">
                  <svg className="w-8 h-8 text-white mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div className="text-white text-xs font-bold">Quality</div>
                  <div className="text-white text-xs">Focused</div>
                </div>
              </div>

              {/* Floating Trust Badge */}
              <div className="absolute -bottom-6 -left-6 bg-gradient-to-br from-green-400 to-green-500 rounded-2xl p-4 shadow-xl transform -rotate-12 hover:rotate-0 transition-transform duration-300">
                <div className="text-center">
                  <svg className="w-8 h-8 text-white mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  <div className="text-white text-xs font-bold">Trusted</div>
                  <div className="text-white text-xs">Partner</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products & Services Section */}
      <section className="py-20 bg-white">
        <div className="container-premium">
          <div className="text-center mb-16 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-green-100 to-yellow-100 px-6 py-3 text-sm font-semibold text-green-700 mb-6">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <span>Our Products & Services</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              Premium <span className="text-green-600">Agricultural Solutions</span>
            </h2>
            
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              From premium onion varieties to comprehensive export services, we deliver excellence 
              across every aspect of agricultural trade and supply chain management.
            </p>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {/* Red Onions */}
            <div className="group relative bg-gradient-to-br from-white to-green-50 rounded-3xl p-8 shadow-lg border border-green-100 hover:shadow-2xl hover:border-green-300 transition-all duration-500 transform hover:-translate-y-2 animate-fade-in-left">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-yellow-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative z-10">
                <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform duration-500">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                </div>
                
                <h3 className="text-2xl font-bold text-gray-800 mb-4 group-hover:text-green-600 transition-colors duration-300">
                  Red Onions
                </h3>
                
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Premium quality red onions with excellent shelf life, perfect for both domestic consumption and international export markets.
                </p>
                
                <div className="space-y-2 mb-6">
                  <div className="flex items-center text-sm text-gray-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    <span>Size: 40-70mm diameter</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    <span>Shelf life: 6-8 months</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    <span>Export grade quality</span>
                  </div>
                </div>
                
                <Link 
                  href="/products/red-onions" 
                  className="inline-flex items-center text-green-600 font-semibold hover:text-green-700 transition-colors duration-300 group/link"
                >
                  <span>Learn More</span>
                  <svg className="w-4 h-4 ml-2 group-hover/link:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </div>

            {/* White Onions */}
            <div className="group relative bg-gradient-to-br from-white to-yellow-50 rounded-3xl p-8 shadow-lg border border-yellow-100 hover:shadow-2xl hover:border-yellow-300 transition-all duration-500 transform hover:-translate-y-2 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-green-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative z-10">
                <div className="w-20 h-20 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform duration-500">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707" />
                  </svg>
                </div>
                
                <h3 className="text-2xl font-bold text-gray-800 mb-4 group-hover:text-yellow-600 transition-colors duration-300">
                  White Onions
                </h3>
                
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Fresh white onions with mild flavor and crisp texture, ideal for culinary applications and processing industries.
                </p>
                
                <div className="space-y-2 mb-6">
                  <div className="flex items-center text-sm text-gray-600">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></div>
                    <span>Size: 35-65mm diameter</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></div>
                    <span>Mild, sweet flavor</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></div>
                    <span>Processing grade</span>
                  </div>
                </div>
                
                <Link 
                  href="/products/white-onions" 
                  className="inline-flex items-center text-yellow-600 font-semibold hover:text-yellow-700 transition-colors duration-300 group/link"
                >
                  <span>Learn More</span>
                  <svg className="w-4 h-4 ml-2 group-hover/link:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </div>

            {/* Export Services */}
            <div className="group relative bg-gradient-to-br from-white to-blue-50 rounded-3xl p-8 shadow-lg border border-blue-100 hover:shadow-2xl hover:border-blue-300 transition-all duration-500 transform hover:-translate-y-2 animate-fade-in-right" style={{ animationDelay: '0.4s' }}>
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-green-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative z-10">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform duration-500">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                
                <h3 className="text-2xl font-bold text-gray-800 mb-4 group-hover:text-blue-600 transition-colors duration-300">
                  Export Services
                </h3>
                
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Comprehensive export solutions including documentation, logistics, quality certification, and global market access.
                </p>
                
                <div className="space-y-2 mb-6">
                  <div className="flex items-center text-sm text-gray-600">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    <span>15+ countries served</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    <span>Complete documentation</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    <span>Cold chain logistics</span>
                  </div>
                </div>
                
                <Link 
                  href="/services/export" 
                  className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-700 transition-colors duration-300 group/link"
                >
                  <span>Learn More</span>
                  <svg className="w-4 h-4 ml-2 group-hover/link:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </div>

            {/* Quality Assurance */}
            <div className="group relative bg-gradient-to-br from-white to-purple-50 rounded-3xl p-8 shadow-lg border border-purple-100 hover:shadow-2xl hover:border-purple-300 transition-all duration-500 transform hover:-translate-y-2 animate-fade-in-left" style={{ animationDelay: '0.6s' }}>
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-green-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative z-10">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform duration-500">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                
                <h3 className="text-2xl font-bold text-gray-800 mb-4 group-hover:text-purple-600 transition-colors duration-300">
                  Quality Assurance
                </h3>
                
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Rigorous quality control processes, laboratory testing, and international certifications to ensure premium standards.
                </p>
                
                <div className="space-y-2 mb-6">
                  <div className="flex items-center text-sm text-gray-600">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                    <span>Laboratory testing</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                    <span>Traceability systems</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                    <span>Export grade quality</span>
                  </div>
                </div>
                
                <Link 
                  href="/services/quality" 
                  className="inline-flex items-center text-purple-600 font-semibold hover:text-purple-700 transition-colors duration-300 group/link"
                >
                  <span>Learn More</span>
                  <svg className="w-4 h-4 ml-2 group-hover/link:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </div>

            {/* Processing Services */}
            <div className="group relative bg-gradient-to-br from-white to-orange-50 rounded-3xl p-8 shadow-lg border border-orange-100 hover:shadow-2xl hover:border-orange-300 transition-all duration-500 transform hover:-translate-y-2 animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-yellow-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative z-10">
                <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform duration-500">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                
                <h3 className="text-2xl font-bold text-gray-800 mb-4 group-hover:text-orange-600 transition-colors duration-300">
                  Processing Services
                </h3>
                
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Advanced processing facilities for sorting, grading, packaging, and value-added onion products for various markets.
                </p>
                
                <div className="space-y-2 mb-6">
                  <div className="flex items-center text-sm text-gray-600">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                    <span>Automated sorting</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                    <span>Custom packaging</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                    <span>Value-added products</span>
                  </div>
                </div>
                
                <Link 
                  href="/services/processing" 
                  className="inline-flex items-center text-orange-600 font-semibold hover:text-orange-700 transition-colors duration-300 group/link"
                >
                  <span>Learn More</span>
                  <svg className="w-4 h-4 ml-2 group-hover/link:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </div>

            {/* Market Intelligence */}
            <div className="group relative bg-gradient-to-br from-white to-teal-50 rounded-3xl p-8 shadow-lg border border-teal-100 hover:shadow-2xl hover:border-teal-300 transition-all duration-500 transform hover:-translate-y-2 animate-fade-in-right" style={{ animationDelay: '1s' }}>
              <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 to-green-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative z-10">
                <div className="w-20 h-20 bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform duration-500">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                
                <h3 className="text-2xl font-bold text-gray-800 mb-4 group-hover:text-teal-600 transition-colors duration-300">
                  Market Intelligence
                </h3>
                
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Real-time market data, price analytics, demand forecasting, and strategic insights for informed business decisions.
                </p>
                
                <div className="space-y-2 mb-6">
                  <div className="flex items-center text-sm text-gray-600">
                    <div className="w-2 h-2 bg-teal-500 rounded-full mr-3"></div>
                    <span>Live price tracking</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <div className="w-2 h-2 bg-teal-500 rounded-full mr-3"></div>
                    <span>Market trend analysis</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <div className="w-2 h-2 bg-teal-500 rounded-full mr-3"></div>
                    <span>Demand forecasting</span>
                  </div>
                </div>
                
                <Link 
                  href="/services/intelligence" 
                  className="inline-flex items-center text-teal-600 font-semibold hover:text-teal-700 transition-colors duration-300 group/link"
                >
                  <span>Learn More</span>
                  <svg className="w-4 h-4 ml-2 group-hover/link:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center animate-fade-in-up" style={{ animationDelay: '1.2s' }}>
            <div className="bg-gradient-to-r from-green-600 to-yellow-600 rounded-3xl p-8 md:p-12 text-white">
              <h3 className="text-3xl md:text-4xl font-bold mb-6">
                Ready to Experience Premium Quality?
              </h3>
              <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
                Partner with us for reliable, high-quality agricultural products and services. 
                Let's discuss how we can meet your specific requirements.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  href="/contact" 
                  className="btn-base bg-white text-green-600 hover:bg-green-50 font-semibold px-8 py-4 text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
                >
                  Get Quote Today
                </Link>
                <Link 
                  href="/products" 
                  className="btn-base border-2 border-white text-white hover:bg-white hover:text-green-600 font-semibold px-8 py-4 text-lg transform hover:-translate-y-1 transition-all duration-300"
                >
                  View All Products
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="section-padding bg-gradient-to-br from-emerald-600 to-blue-700">
        <div className="container-premium text-center">
          <div className="max-w-3xl mx-auto fade-in-up">
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Partner with Us?
            </h2>
            <p className="text-xl text-emerald-100 mb-8">
              Join thousands of satisfied customers who trust Godavari Farms for their agricultural needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact" className="btn-base bg-white text-emerald-600 hover:bg-emerald-50 font-semibold">
                Contact Us Today
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
