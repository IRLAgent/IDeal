import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import MobileMenu from "@/components/MobileMenu";
import HeaderNav from "@/components/HeaderNav";
import UmamiTracker from "@/components/UmamiTracker";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "IDeal.ie - Buy & Sell Cars in Ireland",
  description: "Ireland's new car marketplace for buying and selling vehicles",
  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* Track route changes for SPA navigation */}
        <Suspense fallback={null}>
          <UmamiTracker />
        </Suspense>
        
        <header className="bg-indigo-950 text-white shadow-lg sticky top-0 z-50 border-b-4 border-indigo-900">
          <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
            <h1 className="text-3xl font-bold text-white">
              <a href="/" className="hover:opacity-80 transition">IDeal</a>
            </h1>
            <HeaderNav />
            {/* Mobile menu */}
            <MobileMenu />
          </div>
        </header>

        {children}

        <footer className="bg-indigo-950 text-gray-300 py-12 mt-16 border-t-4 border-indigo-900">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
              <div>
                <h3 className="font-bold text-white mb-4">About</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="hover:text-white transition">About Us</a></li>
                  <li><a href="#" className="hover:text-white transition">Contact</a></li>
                  <li><a href="#" className="hover:text-white transition">Blog</a></li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-white mb-4">Buying</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="hover:text-white transition">Browse Cars</a></li>
                  <li><a href="#" className="hover:text-white transition">Value My Car</a></li>
                  <li><a href="#" className="hover:text-white transition">History Check</a></li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-white mb-4">Selling</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="hover:text-white transition">Sell My Car</a></li>
                  <li><a href="#" className="hover:text-white transition">Pricing</a></li>
                  <li><a href="#" className="hover:text-white transition">Dealer Program</a></li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-white mb-4">Legal</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
                  <li><a href="#" className="hover:text-white transition">Terms of Service</a></li>
                  <li><a href="#" className="hover:text-white transition">Cookie Policy</a></li>
                </ul>
              </div>
            </div>
            <div className="border-t border-indigo-900 pt-8">
              <p className="text-center text-gray-400">&copy; 2025 IDeal.ie. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
