'use client';

import { useState } from 'react';
import { IRISH_COUNTIES } from '@/constants/counties';

export default function Home() {
  const [searchParams, setSearchParams] = useState({
    make: '',
    model: '',
    maxPrice: '',
    location: '',
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement search
    console.log('Search:', searchParams);
  };

  return (
    <main>
      {/* Hero Section */}
      <section className="bg-indigo-950 text-white rounded-lg p-8 md:p-12 mb-12 border-2 border-indigo-900">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
          Find Your Perfect Car
        </h1>
        <p className="text-lg md:text-xl mb-8 opacity-90">
          Browse thousands of vehicles from trusted sellers across Ireland
        </p>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="bg-white text-gray-900 p-6 rounded-lg max-w-2xl border border-indigo-900">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              placeholder="Make (e.g., BMW, Ford)"
              value={searchParams.make}
              onChange={(e) => setSearchParams({ ...searchParams, make: e.target.value })}
              className="input-field"
            />
            <input
              type="text"
              placeholder="Model (e.g., 3 Series)"
              value={searchParams.model}
              onChange={(e) => setSearchParams({ ...searchParams, model: e.target.value })}
              className="input-field"
            />
            <input
              type="number"
              placeholder="Max Price (€)"
              value={searchParams.maxPrice}
              onChange={(e) => setSearchParams({ ...searchParams, maxPrice: e.target.value })}
              className="input-field"
            />
            <select
              value={searchParams.location}
              onChange={(e) => setSearchParams({ ...searchParams, location: e.target.value })}
              className="input-field"
            >
              <option value="">Select County</option>
              {IRISH_COUNTIES.map((county) => (
                <option key={county} value={county}>
                  {county}
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-950 text-white p-3 rounded font-bold hover:bg-indigo-950 transition shadow-lg"
          >
            Search Cars
          </button>
        </form>
      </section>

      {/* Quick Links Section */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-8 text-white">Browse by Category</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="card border-l-4 border-indigo-950 hover:shadow-xl hover:shadow-indigo-950/20 transition">
            <h3 className="font-bold text-lg mb-2 text-indigo-950">Used Cars</h3>
            <p className="text-gray-600">Browse used vehicles from private sellers</p>
            <a href="/search?type=used" className="text-indigo-950 font-semibold mt-4 inline-block hover:text-indigo-950 transition">
              View All →
            </a>
          </div>
          <div className="card border-l-4 border-indigo-950 hover:shadow-xl hover:shadow-indigo-950/20 transition">
            <h3 className="font-bold text-lg mb-2 text-indigo-950">Dealer Cars</h3>
            <p className="text-gray-600">New and certified dealer inventory</p>
            <a href="/search?type=dealer" className="text-indigo-950 font-semibold mt-4 inline-block hover:text-indigo-950 transition">
              View All →
            </a>
          </div>
          <div className="card">
            <h3 className="font-bold text-lg mb-2 text-indigo-950">Sell Your Car</h3>
            <p className="text-gray-600">Quick and easy listing process</p>
            <a href="/auth/signup" className="text-indigo-950 font-semibold mt-4 inline-block hover:text-indigo-950 transition">
              Get Started →
            </a>
          </div>
          <div className="card">
            <h3 className="font-bold text-lg mb-2 text-indigo-950">Value My Car</h3>
            <p className="text-gray-600">Get instant car valuation</p>
            <a href="#" className="text-indigo-950 font-semibold mt-4 inline-block hover:text-indigo-950 transition">
              Check Now →
            </a>
          </div>
        </div>
      </section>

      {/* Featured Listings Section */}
      <section>
        <h2 className="text-3xl font-bold mb-8">Recent Listings</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="card overflow-hidden hover:shadow-xl transition cursor-pointer">
              <div className="w-full h-48 bg-gray-300 rounded mb-4 flex items-center justify-center">
                <svg className="w-12 h-12 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="font-bold text-lg mb-2">Car Make & Model</h3>
              <p className="text-gray-600 mb-4">2020 | 50,000 km | Location</p>
              <p className="text-2xl font-bold text-indigo-950">€15,990</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
