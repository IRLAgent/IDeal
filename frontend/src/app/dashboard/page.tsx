'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { apiCallAuth } from '@/lib/api';
import { getAuthToken, getUser, isAuthenticated } from '@/lib/auth';

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

interface Message {
  id: string;
  senderName: string;
  senderEmail: string;
  carTitle: string;
  content: string;
  createdAt: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('listings');
  const [cars, setCars] = useState<Car[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [stats, setStats] = useState({
    totalViews: 0,
    totalMessages: 0,
    totalListings: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const user = getUser();

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isAuthenticated()) {
      router.push('/auth/login');
      return;
    }

    fetchDashboardData();
  }, [router]);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError('');

    try {
      const token = getAuthToken();
      if (!token) throw new Error('No auth token found');

      // Fetch user's car listings
      const carsResponse = await apiCallAuth<{ cars: Car[] }>('/cars/user/listings', { method: 'GET' }, token);
      setCars(carsResponse.cars || []);

      // Fetch user's messages
      const messagesResponse = await apiCallAuth<{ messages: Message[] }>('/messages', { method: 'GET' }, token);
      setMessages(messagesResponse.messages || []);

      // Calculate stats
      setStats({
        totalListings: carsResponse.cars?.length || 0,
        totalViews: 0, // TODO: Add view tracking to backend
        totalMessages: messagesResponse.messages?.length || 0,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load dashboard';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteListing = async (carId: string) => {
    if (!confirm('Are you sure you want to delete this listing?')) return;

    try {
      const token = getAuthToken();
      if (!token) throw new Error('No auth token found');

      await apiCallAuth(`/cars/${carId}`, { method: 'DELETE' }, token);
      setCars(cars.filter((car) => car.id !== carId));
    } catch (err) {
      alert('Failed to delete listing');
    }
  };

  return (
    <main>
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Seller Dashboard</h1>
        <p className="text-gray-600">Welcome, {user?.name || 'Seller'}! Manage your car listings and messages</p>
      </div>

      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded mb-6">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      ) : (
        <>
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6 border-l-4 border-indigo-950">
              <p className="text-gray-600 mb-2">Total Listings</p>
              <p className="text-4xl font-bold text-indigo-950">{stats.totalListings}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6 border-l-4 border-indigo-950">
              <p className="text-gray-600 mb-2">Total Views</p>
              <p className="text-4xl font-bold text-indigo-950">{stats.totalViews}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6 border-l-4 border-indigo-950">
              <p className="text-gray-600 mb-2">New Messages</p>
              <p className="text-4xl font-bold text-indigo-950">{stats.totalMessages}</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="mb-6 border-b">
            <div className="flex gap-8">
              <button
                onClick={() => setActiveTab('listings')}
                className={`py-3 font-bold border-b-2 transition ${
                  activeTab === 'listings'
                    ? 'border-indigo-950 text-indigo-950'
                    : 'border-transparent text-gray-600'
                }`}
              >
                My Listings
              </button>
              <button
                onClick={() => setActiveTab('messages')}
                className={`py-3 font-bold border-b-2 transition ${
                  activeTab === 'messages'
                    ? 'border-indigo-950 text-indigo-950'
                    : 'border-transparent text-gray-600'
                }`}
              >
                Messages
              </button>
              <button
                onClick={() => setActiveTab('account')}
                className={`py-3 font-bold border-b-2 transition ${
                  activeTab === 'account'
                    ? 'border-indigo-950 text-indigo-950'
                    : 'border-transparent text-gray-600'
                }`}
              >
                Account Settings
              </button>
            </div>
          </div>

          {/* Content */}
          {activeTab === 'listings' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Your Listings</h2>
                <Link
                  href="/listing/create"
                  className="bg-indigo-950 text-white px-4 py-2 rounded font-bold hover:bg-indigo-950"
                >
                  + New Listing
                </Link>
              </div>

              {cars.length === 0 ? (
                <div className="bg-white rounded-lg shadow p-12 text-center">
                  <p className="text-gray-600 mb-4">You haven&apos;t created any listings yet</p>
                  <Link href="/listing/create" className="text-indigo-950 font-bold hover:underline">
                    Create Your First Listing
                  </Link>
                </div>
              ) : (
                <div className="grid gap-4">
                  {cars.map((car) => (
                    <div key={car.id} className="bg-white rounded-lg shadow p-4 flex gap-4 hover:shadow-lg transition">
                      <Link href={`/listing/${car.id}`} className="w-24 h-24 bg-gray-300 rounded flex-shrink-0 overflow-hidden">
                        {car.photoUrls && car.photoUrls.length > 0 ? (
                          <img src={car.photoUrls[0]} alt={`${car.make} ${car.model}`} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-200">
                            <span className="text-gray-400 text-sm">No image</span>
                          </div>
                        )}
                      </Link>
                      <div className="flex-grow">
                        <Link href={`/listing/${car.id}`}>
                          <h3 className="font-bold text-lg hover:text-indigo-950">
                            {car.year} {car.make} {car.model}
                          </h3>
                        </Link>
                        <p className="text-gray-600">{car.mileage.toLocaleString()} km • {car.location}</p>
                        <p className="font-bold text-indigo-950 mt-2">€{car.price.toLocaleString()}</p>
                      </div>
                      <div className="flex gap-2 items-center">
                        <Link
                          href={`/listing/${car.id}`}
                          className="p-2.5 bg-indigo-950 text-white rounded-lg hover:bg-indigo-900 transition"
                          title="View listing"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </Link>
                        <Link
                          href={`/listing/${car.id}/edit`}
                          className="p-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                          title="Edit listing"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </Link>
                        <button
                          onClick={() => handleDeleteListing(car.id)}
                          className="p-2.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition"
                          title="Delete listing"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'messages' && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Messages</h2>
              {messages.length === 0 ? (
                <div className="bg-white rounded-lg shadow p-12 text-center">
                  <p className="text-gray-600">No messages yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((msg) => (
                    <div key={msg.id} className="bg-white rounded-lg shadow p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-bold">{msg.senderName}</h3>
                          <p className="text-sm text-gray-600">{msg.senderEmail}</p>
                        </div>
                        <p className="text-sm text-gray-500">{new Date(msg.createdAt).toLocaleDateString()}</p>
                      </div>
                      <p className="text-sm text-gray-700 mb-2">Re: {msg.carTitle}</p>
                      <p className="text-gray-600">{msg.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'account' && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Account Settings</h2>
              <div className="bg-white rounded-lg shadow p-6 max-w-2xl">
                <form className="space-y-4">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Full Name</label>
                    <input type="text" placeholder={user?.name} defaultValue={user?.name} className="w-full p-3 border rounded" />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Email</label>
                    <input type="email" placeholder={user?.email} defaultValue={user?.email} disabled className="w-full p-3 border rounded bg-gray-100" />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Account Type</label>
                    <p className="text-gray-600">{user?.userType === 'seller' ? 'Private Seller' : 'Buyer'}</p>
                  </div>
                  <button type="submit" className="bg-indigo-950 text-white px-6 py-3 rounded font-bold hover:bg-indigo-950">
                    Save Changes
                  </button>
                </form>
              </div>
            </div>
          )}
        </>
      )}
    </main>
  );
}
