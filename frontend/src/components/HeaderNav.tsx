'use client';

import Link from 'next/link';
import { isAuthenticated } from '@/lib/auth';

export default function HeaderNav() {
  const authenticated = isAuthenticated();

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  return (
    <nav className="hidden md:flex gap-6 items-center">
      <Link href="/" className="hover:text-amber-400 transition">
        Home
      </Link>
      <Link href="/search" className="hover:text-amber-400 transition">
        Browse Cars
      </Link>
      {authenticated ? (
        <>
          <Link href="/dashboard" className="hover:text-amber-400 transition">
            Dashboard
          </Link>
          <Link href="/listing/create" className="font-semibold text-amber-400 hover:text-amber-300 transition">
            + Create Listing
          </Link>
          <button
            onClick={handleLogout}
            className="text-red-400 hover:text-red-300 transition font-semibold"
          >
            Logout
          </button>
        </>
      ) : (
        <>
          <Link href="/auth/login" className="hover:text-amber-400 transition">
            Sign In
          </Link>
          <Link href="/auth/signup" className="font-semibold text-amber-400 hover:text-amber-300 transition">
            Sell Your Car
          </Link>
        </>
      )}
    </nav>
  );
}
