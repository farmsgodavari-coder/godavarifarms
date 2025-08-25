"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminSidebar() {
  const pathname = usePathname();

  const item = (href: string, label: string) => (
    <Link
      href={href}
      className={`block px-4 py-2 rounded hover:bg-gray-100 ${pathname === href ? "bg-gray-100 font-medium" : ""}`}
    >
      {label}
    </Link>
  );

  return (
    <aside className="w-full sm:w-64 border-r border-gray-200 p-4 space-y-1">
      <div className="text-xl font-semibold mb-2">Onion Admin</div>
      {item("/admin", "Dashboard")}
      {item("/admin/add-rate", "Add Rate")}
      {item("/admin/manage-rates", "Manage Rates")}
      <div className="text-xs uppercase text-gray-400 mt-4 mb-1">Content</div>
      {item("/admin/announcements", "Announcements")}
      {item("/admin/market-updates", "Market Updates")}
      {item("/admin/media", "Media")}
      <div className="text-xs uppercase text-gray-400 mt-4 mb-1">Settings</div>
      {item("/admin/settings", "Site Settings")}
      {item("/admin/reports", "Reports & Analytics")}
    </aside>
  );
}
