import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

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
        <header className="bg-blue-600 text-white shadow-md sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold">
              <a href="/" className="hover:text-blue-100">CarMarket.ie</a>
            </h1>
            <nav className="hidden md:flex gap-6">
              <a href="/" className="hover:text-blue-100 transition">Home</a>
              <a href="/search" className="hover:text-blue-100 transition">Browse Cars</a>
              <a href="/auth/login" className="hover:text-blue-100 transition">Sign In</a>
              <a href="/auth/signup" className="hover:text-blue-100 transition font-semibold">Sell Your Car</a>
            </nav>
            {/* Mobile menu button */}
            <button className="md:hidden text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </header>

        {children}

        <footer className="bg-gray-800 text-gray-300 py-12 mt-16">
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
            <div className="border-t border-gray-700 pt-8">
              <p className="text-center">&copy; 2025 CarMarket.ie. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
