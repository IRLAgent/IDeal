'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { isAuthenticated, clearAuth } from '@/lib/auth';

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    setAuthenticated(isAuthenticated());
  }, []);

  const handleLogout = () => {
    clearAuth();
    setAuthenticated(false);
    window.location.href = '/';
  };

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden text-white hover:text-gray-200 transition p-2"
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
        <nav className="absolute top-full left-0 right-0 bg-indigo-950 border-b-4 border-indigo-900 md:hidden">
          <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-4">
            <Link
              href="/"
              className="hover:text-gray-200 transition py-2"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/search"
              className="hover:text-gray-200 transition py-2"
              onClick={() => setIsOpen(false)}
            >
              Browse Cars
            </Link>
            {authenticated ? (
              <>
                <Link
                  href="/dashboard"
                  className="hover:text-gray-200 transition py-2"
                  onClick={() => setIsOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  href="/messages"
                  className="hover:text-gray-200 transition py-2"
                  onClick={() => setIsOpen(false)}
                >
                  Messages
                </Link>
                <Link
                  href="/listing/create"
                  className="font-semibold text-white bg-indigo-900 hover:bg-indigo-950 py-2 px-2 rounded transition"
                  onClick={() => setIsOpen(false)}
                >
                  + Create Listing
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="text-left hover:text-gray-200 transition py-2 text-gray-200 font-semibold"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="hover:text-gray-200 transition py-2"
                  onClick={() => setIsOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/signup"
                  className="font-semibold text-white bg-indigo-900 hover:bg-indigo-950 py-2 px-2 rounded transition"
                  onClick={() => setIsOpen(false)}
                >
                  Sell Your Car
                </Link>
              </>
            )}
          </div>
        </nav>
      )}
    </>
  );
}
