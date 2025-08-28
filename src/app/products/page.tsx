import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Our Products & Services - Godavari Farms',
  description: 'Premium quality agricultural products including red onions, white onions, and comprehensive export services from Godavari Farms.',
  keywords: 'red onions, white onions, export services, quality assurance, processing services, market intelligence, agricultural products',
}

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-yellow-50">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-yellow-600 text-white">
        <div className="container-premium">
          <div className="text-center animate-fade-in-up">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/20 backdrop-blur-sm px-6 py-3 text-sm font-semibold mb-6">
              <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>
              <span>Premium Agricultural Solutions</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Our Products & <span className="text-yellow-200">Services</span>
            </h1>
            
            <p className="text-xl text-green-100 max-w-3xl mx-auto leading-relaxed mb-8">
              From premium onion varieties to comprehensive export services, we deliver excellence 
              across every aspect of agricultural trade and supply chain management.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/contact" 
                className="btn-base bg-white text-green-600 hover:bg-green-50 font-semibold px-8 py-4 text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
              >
                Get Quote Today
              </Link>
              <Link 
                href="/rates" 
                className="btn-base border-2 border-white text-white hover:bg-white hover:text-green-600 font-semibold px-8 py-4 text-lg transform hover:-translate-y-1 transition-all duration-300"
              >
                View Daily Rates
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-20">
        <div className="container-premium">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              Agricultural <span className="text-green-600">Products</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Premium quality products carefully selected and processed to meet international standards.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
            {/* Red Onions */}
            <div className="group relative bg-white rounded-3xl p-10 shadow-xl border border-red-100 hover:shadow-2xl hover:border-red-300 transition-all duration-500 transform hover:-translate-y-2">
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-yellow-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative z-10">
                <div className="w-24 h-24 bg-gradient-to-br from-red-500 to-red-600 rounded-3xl flex items-center justify-center mb-8 group-hover:rotate-12 transition-transform duration-500">
                  <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                </div>
                
                <h3 className="text-3xl font-bold text-gray-800 mb-6 group-hover:text-red-600 transition-colors duration-300">
                  Premium Red Onions
                </h3>
                
                <p className="text-gray-600 mb-8 leading-relaxed text-lg">
                  Premium quality red onions with excellent shelf life, perfect for both domestic consumption and international export markets. Carefully selected for consistent size, color, and quality.
                </p>
                
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-red-50 rounded-xl p-4">
                    <h4 className="font-semibold text-red-700 mb-2">Size Range</h4>
                    <p className="text-gray-600">40-70mm diameter</p>
                  </div>
                  <div className="bg-red-50 rounded-xl p-4">
                    <h4 className="font-semibold text-red-700 mb-2">Shelf Life</h4>
                    <p className="text-gray-600">6-8 months</p>
                  </div>
                  <div className="bg-red-50 rounded-xl p-4">
                    <h4 className="font-semibold text-red-700 mb-2">Grade</h4>
                    <p className="text-gray-600">Export quality</p>
                  </div>
                  <div className="bg-red-50 rounded-xl p-4">
                    <h4 className="font-semibold text-red-700 mb-2">Packaging</h4>
                    <p className="text-gray-600">Custom options</p>
                  </div>
                </div>
                
                <Link 
                  href="/contact" 
                  className="inline-flex items-center bg-red-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-red-700 transition-colors duration-300 group/link"
                >
                  <span>Get Quote</span>
                  <svg className="w-5 h-5 ml-2 group-hover/link:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </div>

            {/* White Onions */}
            <div className="group relative bg-white rounded-3xl p-10 shadow-xl border border-yellow-100 hover:shadow-2xl hover:border-yellow-300 transition-all duration-500 transform hover:-translate-y-2">
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-green-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative z-10">
                <div className="w-24 h-24 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-3xl flex items-center justify-center mb-8 group-hover:rotate-12 transition-transform duration-500">
                  <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707" />
                  </svg>
                </div>
                
                <h3 className="text-3xl font-bold text-gray-800 mb-6 group-hover:text-yellow-600 transition-colors duration-300">
                  Fresh White Onions
                </h3>
                
                <p className="text-gray-600 mb-8 leading-relaxed text-lg">
                  Fresh white onions with mild flavor and crisp texture, ideal for culinary applications and processing industries. Known for their sweet taste and versatility.
                </p>
                
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-yellow-50 rounded-xl p-4">
                    <h4 className="font-semibold text-yellow-700 mb-2">Size Range</h4>
                    <p className="text-gray-600">35-65mm diameter</p>
                  </div>
                  <div className="bg-yellow-50 rounded-xl p-4">
                    <h4 className="font-semibold text-yellow-700 mb-2">Flavor</h4>
                    <p className="text-gray-600">Mild & sweet</p>
                  </div>
                  <div className="bg-yellow-50 rounded-xl p-4">
                    <h4 className="font-semibold text-yellow-700 mb-2">Grade</h4>
                    <p className="text-gray-600">Processing grade</p>
                  </div>
                  <div className="bg-yellow-50 rounded-xl p-4">
                    <h4 className="font-semibold text-yellow-700 mb-2">Uses</h4>
                    <p className="text-gray-600">Culinary & processing</p>
                  </div>
                </div>
                
                <Link 
                  href="/contact" 
                  className="inline-flex items-center bg-yellow-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-yellow-700 transition-colors duration-300 group/link"
                >
                  <span>Get Quote</span>
                  <svg className="w-5 h-5 ml-2 group-hover/link:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>

          {/* Services Section */}
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              Professional <span className="text-green-600">Services</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Comprehensive services to support your agricultural business needs from farm to market.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Export Services */}
            <div className="group relative bg-white rounded-3xl p-8 shadow-lg border border-blue-100 hover:shadow-2xl hover:border-blue-300 transition-all duration-500 transform hover:-translate-y-2">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-green-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform duration-500">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                
                <h3 className="text-xl font-bold text-gray-800 mb-4 group-hover:text-blue-600 transition-colors duration-300">
                  Export Services
                </h3>
                
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Complete export solutions including documentation, logistics, and global market access.
                </p>
                
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    <span>15+ countries served</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    <span>Complete documentation</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    <span>Cold chain logistics</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Quality Assurance */}
            <div className="group relative bg-white rounded-3xl p-8 shadow-lg border border-purple-100 hover:shadow-2xl hover:border-purple-300 transition-all duration-500 transform hover:-translate-y-2">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-green-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform duration-500">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                
                <h3 className="text-xl font-bold text-gray-800 mb-4 group-hover:text-purple-600 transition-colors duration-300">
                  Quality Assurance
                </h3>
                
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Rigorous quality control processes and international certifications.
                </p>
                
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                    <span>Laboratory testing</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                    <span>Traceability systems</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                    <span>Export certifications</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Processing Services */}
            <div className="group relative bg-white rounded-3xl p-8 shadow-lg border border-orange-100 hover:shadow-2xl hover:border-orange-300 transition-all duration-500 transform hover:-translate-y-2">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-yellow-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform duration-500">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                
                <h3 className="text-xl font-bold text-gray-800 mb-4 group-hover:text-orange-600 transition-colors duration-300">
                  Processing Services
                </h3>
                
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Advanced processing facilities for sorting, grading, and packaging.
                </p>
                
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                    <span>Automated sorting</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                    <span>Custom packaging</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                    <span>Value-added products</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Market Intelligence */}
            <div className="group relative bg-white rounded-3xl p-8 shadow-lg border border-teal-100 hover:shadow-2xl hover:border-teal-300 transition-all duration-500 transform hover:-translate-y-2">
              <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 to-green-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform duration-500">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                
                <h3 className="text-xl font-bold text-gray-800 mb-4 group-hover:text-teal-600 transition-colors duration-300">
                  Market Intelligence
                </h3>
                
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Real-time market data and strategic insights for informed decisions.
                </p>
                
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-teal-500 rounded-full mr-3"></div>
                    <span>Live price tracking</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-teal-500 rounded-full mr-3"></div>
                    <span>Market trend analysis</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-teal-500 rounded-full mr-3"></div>
                    <span>Demand forecasting</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-yellow-600">
        <div className="container-premium">
          <div className="text-center text-white">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Partner With Us?
            </h2>
            <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
              Get competitive quotes for bulk orders and explore our comprehensive agricultural solutions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/contact" 
                className="btn-base bg-white text-green-600 hover:bg-green-50 font-semibold px-8 py-4 text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
              >
                Request Quote
              </Link>
              <Link 
                href="/rates" 
                className="btn-base border-2 border-white text-white hover:bg-white hover:text-green-600 font-semibold px-8 py-4 text-lg transform hover:-translate-y-1 transition-all duration-300"
              >
                View Current Rates
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
