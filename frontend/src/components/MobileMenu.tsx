'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden text-white hover:text-amber-400 transition p-2"
        aria-label="Toggle menu"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {isOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Mobile menu dropdown */}
      {isOpen && (
        <nav className="absolute top-full left-0 right-0 bg-gradient-to-b from-purple-900 to-purple-800 border-b-2 border-amber-500 md:hidden">
          <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-4">
            <Link
              href="/"
              className="hover:text-amber-400 transition py-2"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/search"
              className="hover:text-amber-400 transition py-2"
              onClick={() => setIsOpen(false)}
            >
              Browse Cars
            </Link>
            <Link
              href="/auth/login"
              className="hover:text-amber-400 transition py-2"
              onClick={() => setIsOpen(false)}
            >
              Sign In
            </Link>
            <Link
              href="/auth/signup"
              className="font-semibold text-amber-400 hover:text-amber-300 transition py-2"
              onClick={() => setIsOpen(false)}
            >
              Sell Your Car
            </Link>
          </div>
        </nav>
      )}
    </>
  );
}
