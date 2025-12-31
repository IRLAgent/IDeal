'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { IRISH_COUNTIES } from '@/constants/counties';
import { apiCall } from '@/lib/api';

export default function Home() {
  const router = useRouter();
  const [searchParams, setSearchParams] = useState({
    make: '',
    model: '',
    minPrice: '',
    maxPrice: '',
    location: '',
  });
  const [availableMakes, setAvailableMakes] = useState<string[]>([]);
  const [availableModels, setAvailableModels] = useState<string[]>([]);

  useEffect(() => {
    fetchAvailableMakes();
  }, []);

  useEffect(() => {
    if (searchParams.make) {
      fetchAvailableModels(searchParams.make);
    } else {
      setAvailableModels([]);
    }
  }, [searchParams.make]);

  const fetchAvailableMakes = async () => {
    try {
      const response = await apiCall<{ makes: string[] }>('/cars/available/makes', {
        method: 'GET',
      });
      setAvailableMakes(response.makes);
    } catch (err) {
      console.error('Failed to fetch available makes:', err);
    }
  };

  const fetchAvailableModels = async (make: string) => {
    try {
      const response = await apiCall<{ models: string[] }>(`/cars/available/models?make=${make}`, {
        method: 'GET',
      });
      setAvailableModels(response.models);
    } catch (err) {
      console.error('Failed to fetch available models:', err);
    }
  };

  const handleMakeChange = (make: string) => {
    setSearchParams({ ...searchParams, make, model: '' });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Build query string from search parameters
    const params = new URLSearchParams();
    if (searchParams.make) params.append('make', searchParams.make);
    if (searchParams.model) params.append('model', searchParams.model);
    if (searchParams.minPrice) params.append('minPrice', searchParams.minPrice);
    if (searchParams.maxPrice) params.append('maxPrice', searchParams.maxPrice);
    if (searchParams.location) params.append('location', searchParams.location);
    
    // Navigate to search page with filters
    router.push(`/search?${params.toString()}`);
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <select
              value={searchParams.make}
              onChange={(e) => handleMakeChange(e.target.value)}
              className="input-field"
            >
              <option value="">Select Make</option>
              {availableMakes.map((make) => (
                <option key={make} value={make}>
                  {make}
                </option>
              ))}
            </select>
            <select
              value={searchParams.model}
              onChange={(e) => setSearchParams({ ...searchParams, model: e.target.value })}
              className="input-field"
              disabled={!searchParams.make}
            >
              <option value="">Select Model</option>
              {availableModels.map((model) => (
                <option key={model} value={model}>
                  {model}
                </option>
              ))}
            </select>
            <select
              value={searchParams.location}
              onChange={(e) => setSearchParams({ ...searchParams, location: e.target.value })}
              className="input-field md:col-span-2"
            >
              <option value="">Select County</option>
              {IRISH_COUNTIES.map((county) => (
                <option key={county} value={county}>
                  {county}
                </option>
              ))}
            </select>
          </div>

          {/* Price Range Slider */}
          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-3">
              Price Range: €{(parseInt(searchParams.minPrice) || 0).toLocaleString()} - €{(parseInt(searchParams.maxPrice) || 100000).toLocaleString()}
            </label>
            <div className="relative pt-1 pb-8">
              <div className="relative h-2 bg-gray-200 rounded-lg">
                {/* Range track between thumbs */}
                <div 
                  className="absolute h-2 bg-indigo-950 rounded-lg"
                  style={{
                    left: `${((parseInt(searchParams.minPrice) || 0) / 100000) * 100}%`,
                    right: `${100 - ((parseInt(searchParams.maxPrice) || 100000) / 100000) * 100}%`
                  }}
                />
                {/* Min slider */}
                <input
                  type="range"
                  min="0"
                  max="100000"
                  step="1000"
                  value={searchParams.minPrice || '0'}
                  onChange={(e) => {
                    const newMin = parseInt(e.target.value);
                    const currentMax = parseInt(searchParams.maxPrice) || 100000;
                    if (newMin <= currentMax) {
                      setSearchParams({ ...searchParams, minPrice: e.target.value });
                    }
                  }}
                  className="absolute w-full h-2 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-moz-range-thumb]:pointer-events-auto"
                />
                {/* Max slider */}
                <input
                  type="range"
                  min="0"
                  max="100000"
                  step="1000"
                  value={searchParams.maxPrice || '100000'}
                  onChange={(e) => {
                    const newMax = parseInt(e.target.value);
                    const currentMin = parseInt(searchParams.minPrice) || 0;
                    if (newMax >= currentMin) {
                      setSearchParams({ ...searchParams, maxPrice: e.target.value });
                    }
                  }}
                  className="absolute w-full h-2 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-moz-range-thumb]:pointer-events-auto"
                />
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>€0</span>
                <span>€25k</span>
                <span>€50k</span>
                <span>€75k</span>
                <span>€100k</span>
              </div>
            </div>
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
