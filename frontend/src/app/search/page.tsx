'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { IRISH_COUNTIES } from '@/constants/counties';
import { apiCall } from '@/lib/api';
import { getThumbnailUrl } from '@/utils/image';

interface Car {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  fuelType: string;
  location: string;
  description: string;
  photoUrls: string[];
  createdAt: string;
}

function SearchContent() {
  const searchParams = useSearchParams();
  const sellerId = searchParams.get('seller');
  
  // Initialize filters from URL parameters
  const [filters, setFilters] = useState({
    make: searchParams.get('make') || '',
    model: searchParams.get('model') || '',
    priceMin: '',
    priceMax: searchParams.get('maxPrice') || '',
    location: searchParams.get('location') || '',
    fuelType: '',
  });
  const [cars, setCars] = useState<Car[]>([]);
  const [availableMakes, setAvailableMakes] = useState<string[]>([]);
  const [availableModels, setAvailableModels] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(true);

  const fetchCars = async () => {
    setLoading(true);
    setError('');

    try {
      // Build query string from filters
      const params = new URLSearchParams();
      if (filters.make) params.append('make', filters.make);
      if (filters.model) params.append('model', filters.model);
      if (filters.priceMin) params.append('minPrice', filters.priceMin);
      if (filters.priceMax) params.append('maxPrice', filters.priceMax);
      if (filters.location) params.append('location', filters.location);
      if (filters.fuelType) params.append('fuelType', filters.fuelType);
      if (sellerId) params.append('userId', sellerId);

      const response = await apiCall<{ cars: Car[] }>(`/cars?${params.toString()}`, {
        method: 'GET',
      });

      setCars(response.cars);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load cars';
      setError(errorMessage);
      setCars([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCars();
    fetchAvailableMakes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (filters.make) {
      fetchAvailableModels(filters.make);
    } else {
      setAvailableModels([]);
    }
  }, [filters.make]);

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

  const handleFilterChange = (field: string, value: string) => {
    if (field === 'make') {
      // Reset model when make changes
      setFilters({ ...filters, make: value, model: '' });
    } else {
      setFilters({ ...filters, [field]: value });
    }
  };

  const handleApplyFilters = () => {
    fetchCars();
    setFiltersOpen(false);
  };

  return (
    <main>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters Sidebar */}
        <aside className="lg:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow sticky top-24">
            <div 
              onClick={() => setFiltersOpen(!filtersOpen)}
              className="flex justify-between items-center mb-6 cursor-pointer lg:cursor-default lg:pointer-events-none hover:bg-gray-50 lg:hover:bg-transparent p-2 rounded transition lg:p-0"
            >
              <h2 className="text-2xl font-bold">Filters</h2>
              <button
                className="lg:hidden text-indigo-950 hover:text-indigo-950 transition"
                aria-label="Toggle filters"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {filtersOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  )}
                </svg>
              </button>
            </div>

            <div className={`space-y-4 ${filtersOpen ? 'block' : 'hidden lg:block'}`}>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Make</label>
                <select
                  value={filters.make}
                  onChange={(e) => handleFilterChange('make', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                >
                  <option value="">All Makes</option>
                  {availableMakes.map((make) => (
                    <option key={make} value={make}>
                      {make}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">Model</label>
                <select
                  value={filters.model}
                  onChange={(e) => handleFilterChange('model', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                  disabled={!filters.make}
                >
                  <option value="">All Models</option>
                  {availableModels.map((model) => (
                    <option key={model} value={model}>
                      {model}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">Price Range</label>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.priceMin}
                    onChange={(e) => handleFilterChange('priceMin', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded text-sm"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.priceMax}
                    onChange={(e) => handleFilterChange('priceMax', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">Fuel Type</label>
                <select
                  value={filters.fuelType}
                  onChange={(e) => handleFilterChange('fuelType', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                >
                  <option value="">All Types</option>
                  <option value="petrol">Petrol</option>
                  <option value="diesel">Diesel</option>
                  <option value="hybrid">Hybrid</option>
                  <option value="electric">Electric</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">Location</label>
                <select
                  value={filters.location}
                  onChange={(e) => handleFilterChange('location', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                >
                  <option value="">All Counties</option>
                  {IRISH_COUNTIES.map((county) => (
                    <option key={county} value={county}>
                      {county}
                    </option>
                  ))}
                </select>
              </div>

              <button onClick={handleApplyFilters} className="w-full bg-indigo-950 text-white p-2 rounded font-bold hover:bg-indigo-950">
                Apply Filters
              </button>
            </div>
          </div>
        </aside>

        {/* Results */}
        <div className="lg:col-span-3">
          {sellerId && (
            <div className="bg-indigo-50 border border-indigo-200 p-4 rounded-lg mb-6">
              <p className="text-indigo-950 font-semibold">
                Viewing listings from this seller
              </p>
            </div>
          )}
          
          <div className="mb-6 flex justify-between items-center">
            <h1 className="text-3xl font-bold">
              Search Results {cars.length > 0 && `(${cars.length})`}
            </h1>
          </div>

          {error && (
            <div className="bg-red-100 text-red-700 p-4 rounded mb-6">
              {error}
            </div>
          )}

          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Loading cars...</p>
            </div>
          ) : cars.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No cars found. Try adjusting your filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {cars.map((car) => (
                <Link 
                  key={car.id} 
                  href={`/listing/${car.id}`}
                  className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden block"
                >
                  <div className="w-full h-48 bg-gray-300 flex items-center justify-center">
                    {car.photoUrls && car.photoUrls.length > 0 ? (
                      <img 
                        src={getThumbnailUrl(car.photoUrls[0], 400, 300)} 
                        alt={`${car.make} ${car.model}`} 
                        className="w-full h-full object-cover" 
                        loading="lazy"
                      />
                    ) : (
                      <svg className="w-12 h-12 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-lg mb-2">
                      {car.year} {car.make} {car.model}
                    </h3>
                    <p className="text-gray-600 mb-2">
                      {car.mileage.toLocaleString()} km • {car.location}
                    </p>
                    <p className="text-2xl font-bold text-indigo-950 mb-4">€{car.price.toLocaleString()}</p>
                    <div className="w-full bg-indigo-950 text-white p-2 rounded hover:bg-indigo-900 transition text-center">
                      View Details
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <main>
        <div className="text-center py-12">
          <p className="text-gray-600">Loading search...</p>
        </div>
      </main>
    }>
      <SearchContent />
    </Suspense>
  );
}
