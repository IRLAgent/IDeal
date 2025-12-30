'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { apiCallAuth } from '@/lib/api';
import { isAuthenticated, getAuthToken } from '@/lib/auth';
import { IRISH_COUNTIES } from '@/constants/counties';

export const dynamic = 'force-dynamic';

const CAR_MAKES = ['BMW', 'Ford', 'Mercedes', 'Audi', 'Volkswagen', 'Toyota', 'Hyundai', 'Peugeot', 'Renault', 'Nissan', 'Vauxhall', 'Citroën'];
const FUEL_TYPES = ['Petrol', 'Diesel', 'Hybrid', 'Electric'];
const TRANSMISSIONS = ['Manual', 'Automatic'];

export default function CreateListingPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState({
    make: '',
    model: '',
    year: new Date().getFullYear(),
    price: '',
    mileage: '',
    location: '',
    fuelType: '',
    transmission: '',
    description: '',
  });
  const [photoFiles, setPhotoFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Check authentication on client side only
  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/auth/login');
    } else {
      setMounted(true);
    }
  }, [router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'year' || name === 'price' || name === 'mileage' ? parseInt(value) || '' : value,
    });
  };

  const handlePhotoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setPhotoFiles(files);
  };

  const removePhotoFile = (index: number) => {
    setPhotoFiles(photoFiles.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Validate required fields
      if (!formData.make || !formData.model || !formData.year || !formData.price || !formData.location) {
        setError('Please fill in all required fields');
        setLoading(false);
        return;
      }

      if (photoFiles.length === 0) {
        setError('Please add at least one photo');
        setLoading(false);
        return;
      }

      const token = getAuthToken();
      if (!token) {
        setError('Authentication required');
        setLoading(false);
        return;
      }

      // Upload files to Cloudinary
      setLoading(true);
      const formDataForUpload = new FormData();
      photoFiles.forEach((file) => {
        formDataForUpload.append('files', file);
      });

      const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const uploadResponse = await fetch(`${apiBaseUrl}/upload`, {
        method: 'POST',
        body: formDataForUpload,
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!uploadResponse.ok) {
        const uploadError = await uploadResponse.json();
        throw new Error(uploadError.error || 'Failed to upload photos');
      }

      const uploadData = await uploadResponse.json();
      const photoUrls = uploadData.urls;

      // Create car listing with uploaded photo URLs
      await apiCallAuth('/cars', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          make: formData.make,
          model: formData.model,
          year: formData.year,
          price: formData.price,
          mileage: formData.mileage,
          location: formData.location,
          fuelType: formData.fuelType,
          transmission: formData.transmission,
          description: formData.description,
          photoUrls,
        }),
      }, token);

      // Redirect to dashboard
      router.push('/dashboard');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create listing';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {!mounted ? (
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-gray-600">Loading...</p>
        </div>
      ) : (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/dashboard" className="text-indigo-950 hover:text-indigo-950 font-semibold">
            ← Back to Dashboard
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-4xl font-bold mb-2 text-slate-900">Create New Listing</h1>
          <p className="text-gray-600 mb-8">Fill in the details about your car to create a new listing</p>
          
          {error && (
            <div className="bg-red-100 text-red-700 p-4 rounded mb-6 border border-red-300">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Car Make & Model Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Make <span className="text-red-500">*</span>
                </label>
                <select
                  name="make"
                  value={formData.make}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-950"
                  required
                >
                  <option value="">Select Make</option>
                  {CAR_MAKES.map((make) => (
                    <option key={make} value={make}>
                      {make}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Model <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="model"
                  value={formData.model}
                  onChange={handleInputChange}
                  placeholder="e.g., 3 Series, Focus, A4"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-950"
                  required
                />
              </div>
            </div>

            {/* Year & Price Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Year <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="year"
                  value={formData.year}
                  onChange={handleInputChange}
                  min="1990"
                  max={new Date().getFullYear()}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-950"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Price (€) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="e.g., 24900"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-950"
                  required
                />
              </div>
            </div>

            {/* Mileage & Location Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Mileage (km)
                </label>
                <input
                  type="number"
                  name="mileage"
                  value={formData.mileage}
                  onChange={handleInputChange}
                  placeholder="e.g., 45000"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-950"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Location <span className="text-red-500">*</span>
                </label>
                <select
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-950"
                  required
                >
                  <option value="">Select County</option>
                  {IRISH_COUNTIES.map((county) => (
                    <option key={county} value={county}>
                      {county}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Fuel Type & Transmission Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Fuel Type
                </label>
                <select
                  name="fuelType"
                  value={formData.fuelType}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-950"
                >
                  <option value="">Select Fuel Type</option>
                  {FUEL_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Transmission
                </label>
                <select
                  name="transmission"
                  value={formData.transmission}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-950"
                >
                  <option value="">Select Transmission</option>
                  {TRANSMISSIONS.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe the condition, features, and history of your car..."
                rows={5}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-950"
              />
            </div>

            {/* Photo Files */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Photos <span className="text-red-500">*</span>
              </label>
              <p className="text-xs text-gray-500 mb-4">
                Upload up to 10 photos of your car. Supported formats: JPG, PNG, WebP
              </p>
              
              <div className="mb-4">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handlePhotoFileChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-950 text-sm"
                />
              </div>

              {photoFiles.length > 0 && (
                <div className="space-y-2 mb-4">
                  <p className="text-sm font-semibold text-gray-700">Selected Photos ({photoFiles.length})</p>
                  {photoFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-200">
                      <span className="text-sm text-gray-700 truncate">{file.name}</span>
                      <button
                        type="button"
                        onClick={() => removePhotoFile(index)}
                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition text-sm font-semibold"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex gap-4 pt-6">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-indigo-950 text-white p-3 rounded-lg font-bold hover:bg-indigo-950 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating...' : 'Create Listing'}
              </button>
              <Link
                href="/dashboard"
                className="flex-1 bg-gray-300 text-gray-700 p-3 rounded-lg font-bold hover:bg-gray-400 transition text-center"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
      )}
    </main>
  );
}
