import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import LayoutShell from "@/components/LayoutShell";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Godavari Farms – Daily Onion Market Rates",
  description: "Live onion market rates updated in real-time across India.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${poppins.variable} font-sans antialiased bg-white text-zinc-900`}
      >
        <LayoutShell>{children}</LayoutShell>
      </body>
    </html>
  );
}
