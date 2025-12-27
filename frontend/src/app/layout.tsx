import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import MobileMenu from "@/components/MobileMenu";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CarMarket.ie - Buy & Sell Cars in Ireland",
  description: "Ireland's new car marketplace for buying and selling vehicles",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <header className="bg-gradient-to-r from-purple-900 to-purple-800 text-white shadow-lg sticky top-0 z-50 border-b-2 border-amber-500">
          <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-400 to-amber-300 bg-clip-text text-transparent">
              <a href="/" className="hover:opacity-80 transition">IDeal</a>
            </h1>
            <nav className="hidden md:flex gap-6">
              <a href="/" className="hover:text-amber-400 transition">Home</a>
              <a href="/search" className="hover:text-amber-400 transition">Browse Cars</a>
              <a href="/auth/login" className="hover:text-amber-400 transition">Sign In</a>
              <a href="/auth/signup" className="hover:text-amber-400 transition font-semibold text-amber-400">Sell Your Car</a>
            </nav>
            {/* Mobile menu */}
            <MobileMenu />
          </div>
        </header>

        {children}

        <footer className="bg-gradient-to-r from-purple-900 to-gray-900 text-gray-300 py-12 mt-16 border-t-2 border-amber-500">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
              <div>
                <h3 className="font-bold text-amber-400 mb-4">About</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="hover:text-amber-400 transition">About Us</a></li>
                  <li><a href="#" className="hover:text-amber-400 transition">Contact</a></li>
                  <li><a href="#" className="hover:text-amber-400 transition">Blog</a></li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-amber-400 mb-4">Buying</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="hover:text-amber-400 transition">Browse Cars</a></li>
                  <li><a href="#" className="hover:text-amber-400 transition">Value My Car</a></li>
                  <li><a href="#" className="hover:text-amber-400 transition">History Check</a></li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-amber-400 mb-4">Selling</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="hover:text-amber-400 transition">Sell My Car</a></li>
                  <li><a href="#" className="hover:text-amber-400 transition">Pricing</a></li>
                  <li><a href="#" className="hover:text-amber-400 transition">Dealer Program</a></li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-amber-400 mb-4">Legal</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="hover:text-amber-400 transition">Privacy Policy</a></li>
                  <li><a href="#" className="hover:text-amber-400 transition">Terms of Service</a></li>
                  <li><a href="#" className="hover:text-amber-400 transition">Cookie Policy</a></li>
                </ul>
              </div>
            </div>
            <div className="border-t border-purple-700 pt-8">
              <p className="text-center text-gray-400">&copy; 2025 IDeal. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
