'use client';

import { useState } from 'react';
import { IRISH_COUNTIES } from '@/constants/counties';

export default function SearchPage() {
  const [filters, setFilters] = useState({
    make: '',
    model: '',
    priceMin: '',
    priceMax: '',
    location: '',
    fuelType: '',
  });

  const handleFilterChange = (field: string, value: string) => {
    setFilters({ ...filters, [field]: value });
  };

  return (
    <main>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters Sidebar */}
        <aside className="lg:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow sticky top-24">
            <h2 className="text-2xl font-bold mb-6">Filters</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Make</label>
                <select
                  value={filters.make}
                  onChange={(e) => handleFilterChange('make', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                >
                  <option value="">All Makes</option>
                  <option value="BMW">BMW</option>
                  <option value="Ford">Ford</option>
                  <option value="Mercedes">Mercedes</option>
                  <option value="Audi">Audi</option>
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

              <button className="w-full bg-blue-600 text-white p-2 rounded font-bold hover:bg-blue-700">
                Apply Filters
              </button>
            </div>
          </div>
        </aside>

        {/* Results */}
        <div className="lg:col-span-3">
          <div className="mb-6 flex justify-between items-center">
            <h1 className="text-3xl font-bold">Search Results</h1>
            <select className="p-2 border border-gray-300 rounded">
              <option>Newest First</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Mileage: Low to High</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div key={item} className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden cursor-pointer">
                <div className="w-full h-48 bg-gray-300 flex items-center justify-center">
                  <svg className="w-12 h-12 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-2">2020 BMW 3 Series</h3>
                  <p className="text-gray-600 mb-2">45,000 km • Dublin</p>
                  <p className="text-2xl font-bold text-blue-600 mb-4">€22,990</p>
                  <button className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="mt-8 flex justify-center gap-2">
            <button className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100">← Previous</button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded">1</button>
            <button className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100">2</button>
            <button className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100">3</button>
            <button className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100">Next →</button>
          </div>
        </div>
      </div>
    </main>
  );
}
