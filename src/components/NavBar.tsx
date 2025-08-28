"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

export default function NavBar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const navigationItems: { href: string; label: string }[] = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About Us" },
    { href: "/products", label: "Our Products" },
    { href: "/rates", label: "Daily Rates" },
    { href: "/contact", label: "Contact Us" },
  ];

  const link = (href: string, label: string) => (
    <Link
      href={href}
      className={`
        relative px-6 py-3 font-semibold text-base transition-all duration-500 ease-out group
        ${pathname === href 
          ? "text-white" 
          : "text-gray-700 hover:text-yellow-600"
        }
      `}
      onClick={() => setIsMobileMenuOpen(false)}
    >
      <span className="relative z-10">{label}</span>
      
      {/* Active state background */}
      {pathname === href && (
        <div className="absolute inset-0 bg-gradient-to-r from-green-700 to-green-600 rounded-lg shadow-lg animate-pulse"></div>
      )}
      
      {/* Hover effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 to-green-500/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    </Link>
  );

  return (
    <>
      <header className={`
        fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out
        ${isScrolled 
          ? 'bg-white/95 backdrop-blur-lg shadow-xl border-b border-yellow-200/30' 
          : 'bg-white/90 backdrop-blur-md shadow-lg'
        }
      `}>
        <nav className="container-premium h-20 flex items-center justify-between">
          {/* Logo Section */}
          <Link 
            href="/" 
            className="flex items-center group transition-all duration-700 hover:scale-105"
          >
            <div className="relative flex items-center">
              {/* Logo Container with Enhanced Design */}
              <div className="relative mr-4">
                <Image
                  src="/logo.png"
                  alt="Godavari Farms - Premium Agricultural Solutions"
                  width={180}
                  height={72}
                  priority
                  className={`
                    transition-all duration-700 group-hover:brightness-110 drop-shadow-lg
                    ${isScrolled ? 'h-12 w-auto' : 'h-16 w-auto'}
                  `}
                />
                {/* Enhanced logo glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-green-500/30 to-yellow-500/30 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-700 -z-10 blur-2xl scale-125"></div>
                
                {/* Premium border effect */}
                <div className="absolute inset-0 border-2 border-transparent bg-gradient-to-r from-green-500/20 to-yellow-500/20 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
              </div>

              {/* Brand Text Enhancement */}
              <div className={`
                flex flex-col transition-all duration-500
                ${isScrolled ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'}
              `}>
                <div className="text-2xl font-bold bg-gradient-to-r from-green-700 via-green-600 to-yellow-600 bg-clip-text text-transparent leading-tight">
                  Godavari Farms
                </div>
                <div className="text-xs font-medium text-gray-600 tracking-wider uppercase">
                  Premium Agricultural Solutions
                </div>
              </div>

              {/* Animated dots */}
              <div className="absolute -bottom-1 left-0 flex space-x-1">
                <div className="w-1 h-1 bg-green-500 rounded-full animate-pulse"></div>
                <div className="w-1 h-1 bg-yellow-500 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                <div className="w-1 h-1 bg-green-500 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-2">
            {navigationItems.map((item) => (
              <div key={item.href}>
                {link(item.href, item.label)}
              </div>
            ))}
          </div>

          {/* CTA Button - Desktop */}
          <div className="hidden lg:block">
            <Link 
              href="/contact" 
              className="btn-base btn-gold px-8 py-3 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
            >
              Get Quote
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="lg:hidden p-3 rounded-xl text-gray-700 hover:text-green-600 hover:bg-green-50 transition-all duration-300 relative group"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            <div className="w-6 h-6 flex flex-col justify-center items-center">
              <span className={`
                block h-0.5 w-6 bg-current transition-all duration-300 ease-out
                ${isMobileMenuOpen ? 'rotate-45 translate-y-0.5' : '-translate-y-1'}
              `}></span>
              <span className={`
                block h-0.5 w-6 bg-current transition-all duration-300 ease-out
                ${isMobileMenuOpen ? 'opacity-0' : 'opacity-100'}
              `}></span>
              <span className={`
                block h-0.5 w-6 bg-current transition-all duration-300 ease-out
                ${isMobileMenuOpen ? '-rotate-45 -translate-y-0.5' : 'translate-y-1'}
              `}></span>
            </div>
          </button>
        </nav>

        {/* Mobile Menu */}
        <div className={`
          lg:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-lg border-b border-yellow-200/30 shadow-2xl
          transition-all duration-500 ease-out origin-top
          ${isMobileMenuOpen 
            ? 'opacity-100 scale-y-100 translate-y-0' 
            : 'opacity-0 scale-y-95 -translate-y-4 pointer-events-none'
          }
        `}>
          <div className="container-premium py-6">
            <div className="flex flex-col space-y-2">
              {navigationItems.map((item, index) => (
                <div 
                  key={item.href}
                  className={`
                    transform transition-all duration-500 ease-out
                    ${isMobileMenuOpen 
                      ? 'translate-x-0 opacity-100' 
                      : 'translate-x-8 opacity-0'
                    }
                  `}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  {link(item.href, item.label)}
                </div>
              ))}
              
              {/* Mobile CTA */}
              <div className={`
                pt-4 transform transition-all duration-500 ease-out
                ${isMobileMenuOpen 
                  ? 'translate-x-0 opacity-100' 
                  : 'translate-x-8 opacity-0'
                }
              `}
              style={{ transitionDelay: `${navigationItems.length * 100}ms` }}>
                <Link 
                  href="/contact" 
                  className="btn-base btn-gold w-full justify-center py-4 text-lg font-bold"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Get Quote Today
                </Link>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Spacer to prevent content from hiding behind fixed header */}
      <div className="h-20"></div>
    </>
  );
}
