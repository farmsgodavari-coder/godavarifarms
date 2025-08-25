"use client";
import { usePathname } from "next/navigation";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";

export default function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) {
    // Admin area: no public NavBar/Footer
    return <>{children}</>;
  }

  return (
    <>
      <NavBar />
      <main>{children}</main>
      <Footer />
      {/* Floating WhatsApp Button */}
      <a
        href="https://wa.me/919370513599"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with us on WhatsApp"
        className="fixed bottom-6 right-6 inline-flex items-center justify-center w-14 h-14 rounded-full bg-[color:var(--color-accent)] text-white shadow-lg hover:brightness-95 focus:outline-none focus:ring-4 focus:ring-green-300 z-50"
      >
        {/* WhatsApp SVG icon */}
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="currentColor" className="w-7 h-7">
          <path d="M19.11 17.54c-.27-.14-1.6-.79-1.84-.87-.25-.09-.43-.14-.62.14-.18.27-.71.87-.87 1.05-.16.18-.32.2-.59.07-.27-.14-1.14-.42-2.17-1.35-.8-.7-1.34-1.56-1.49-1.82-.16-.27-.02-.41.12-.55.12-.12.27-.32.41-.48.14-.16.18-.27.27-.45.09-.18.05-.34-.02-.48-.07-.14-.62-1.5-.85-2.05-.22-.53-.44-.46-.62-.46h-.53c-.18 0-.48.07-.73.34-.25.27-.96.94-.96 2.3 0 1.36.99 2.67 1.13 2.85.14.18 1.95 2.98 4.74 4.19.66.28 1.17.45 1.57.58.66.21 1.27.18 1.75.11.53-.08 1.6-.65 1.84-1.28.23-.63.23-1.17.16-1.28-.07-.11-.25-.18-.52-.32z"/>
          <path d="M26.6 5.4C23.9 2.7 20.3 1.2 16.5 1.2 8.9 1.2 2.8 7.3 2.8 14.9c0 2.34.62 4.62 1.79 6.63L2 30.8l9.44-2.45c1.93 1.05 4.11 1.61 6.34 1.61 7.6 0 13.7-6.1 13.7-13.7 0-3.8-1.5-7.4-4.3-10.16zM17.78 27.02c-2.03 0-4.02-.54-5.77-1.55l-.41-.24-5.6 1.45 1.5-5.45-.25-.42c-1.1-1.83-1.67-3.92-1.67-6.08 0-6.56 5.34-11.9 11.9-11.9 3.18 0 6.17 1.24 8.41 3.48 2.24 2.24 3.48 5.23 3.48 8.41 0 6.56-5.34 11.9-11.9 11.9z"/>
        </svg>
      </a>
    </>
  );
}
