'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { isAuthenticated } from '@/lib/auth';

export default function HeaderNav() {
  const [authenticated, setAuthenticated] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setAuthenticated(isAuthenticated());
    setMounted(true);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  // Don't render navigation until client-side (prevents hydration mismatch)
  if (!mounted) {
    return (
      <nav className="hidden md:flex gap-6 items-center">
        <Link href="/" className="hover:text-gray-200 transition">
          Home
        </Link>
        <Link href="/search" className="hover:text-gray-200 transition">
          Browse Cars
        </Link>
      </nav>
    );
  }

  return (
    <nav className="hidden md:flex gap-6 items-center">
      <Link href="/" className="hover:text-gray-200 transition">
        Home
      </Link>
      <Link href="/search" className="hover:text-gray-200 transition">
        Browse Cars
      </Link>
      {authenticated ? (
        <>
          <Link href="/dashboard" className="hover:text-gray-200 transition">
            Dashboard
          </Link>
          <Link href="/listing/create" className="font-semibold text-white bg-purple-700 hover:bg-purple-800 px-3 py-1 rounded transition">
            + Create Listing
          </Link>
          <button
            onClick={handleLogout}
            className="text-gray-200 hover:text-white transition font-semibold"
          >
            Logout
          </button>
        </>
      ) : (
        <>
          <Link href="/auth/login" className="hover:text-gray-200 transition">
            Sign In
          </Link>
          <Link href="/auth/signup" className="font-semibold text-white bg-purple-700 hover:bg-purple-800 px-3 py-1 rounded transition">
            Sell Your Car
          </Link>
        </>
      )}
    </nav>
  );
}
