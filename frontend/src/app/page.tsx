'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { IRISH_COUNTIES } from '@/constants/counties';
import { apiCall } from '@/lib/api';

interface Car {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  location: string;
  fuelType: string;
  transmission: string;
  photoUrls: string;
}

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
  const [recentCars, setRecentCars] = useState<Car[]>([]);
  const [isLoadingCars, setIsLoadingCars] = useState(true);

  useEffect(() => {
    fetchAvailableMakes();
    fetchRecentCars();
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

  const fetchRecentCars = async () => {
    try {
      setIsLoadingCars(true);
      const response = await apiCall<Car[]>('/cars?take=8', {
        method: 'GET',
      });
      setRecentCars(response);
    } catch (err) {
      console.error('Failed to fetch recent cars:', err);
    } finally {
      setIsLoadingCars(false);
    }
  };

  const parsePhotoUrls = (photoUrls: string): string[] => {
    try {
      return JSON.parse(photoUrls);
    } catch {
      return [];
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
        
        {isLoadingCars ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
              <div key={item} className="card overflow-hidden animate-pulse">
                <div className="w-full h-48 bg-gray-300 rounded mb-4"></div>
                <div className="h-6 bg-gray-300 rounded mb-2 w-3/4"></div>
                <div className="h-4 bg-gray-300 rounded mb-4 w-full"></div>
                <div className="h-8 bg-gray-300 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : recentCars.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {recentCars.map((car) => {
              const photos = parsePhotoUrls(car.photoUrls);
              return (
                <Link 
                  key={car.id} 
                  href={`/listing/${car.id}`}
                  className="card overflow-hidden hover:shadow-xl transition cursor-pointer group"
                >
                  <div className="w-full h-48 bg-gray-200 rounded mb-4 overflow-hidden">
                    {photos[0] ? (
                      <img 
                        src={photos[0]} 
                        alt={`${car.make} ${car.model}`}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-300">
                        <svg className="w-12 h-12 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <h3 className="font-bold text-lg mb-2 text-gray-900 group-hover:text-indigo-950 transition">
                    {car.year} {car.make} {car.model}
                  </h3>
                  <p className="text-gray-600 mb-2 text-sm">
                    {car.mileage.toLocaleString()} km • {car.fuelType} • {car.transmission}
                  </p>
                  {car.location && (
                    <p className="text-gray-500 text-sm mb-3">📍 {car.location}</p>
                  )}
                  <p className="text-2xl font-bold text-indigo-950">
                    €{car.price.toLocaleString()}
                  </p>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <p className="text-xl mb-4">No listings available yet.</p>
            <Link 
              href="/listing/create"
              className="inline-block bg-indigo-950 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-900 transition"
            >
              Be the first to list a car
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}
