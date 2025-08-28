"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function NavBar() {
  const pathname = usePathname();
  const link = (href: string, label: string) => (
    <Link
      href={href}
      className={`px-3 py-2 rounded-md transition-colors duration-200 hover:bg-green-50 hover:text-green-700 ${pathname === href ? "text-green-700 font-semibold" : "text-zinc-700"}`}
    >
      {label}
    </Link>
  );
  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b border-zinc-200">
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center transition-opacity hover:opacity-80">
          <Image
            src="/logo.png"
            alt="Godavari Farms Logo"
            width={100}
            height={40}
            priority
            className="h-10 w-auto"
          />
        </Link>
        <div className="flex items-center gap-1">
          {link("/", "Home")}
          {link("/rates", "Daily Rates")}
          {link("/about", "About Us")}
          {link("/contact", "Contact Us")}
        </div>
      </nav>
    </header>
  );
}
