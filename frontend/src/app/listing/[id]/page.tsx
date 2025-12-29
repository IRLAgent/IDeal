'use client';

import { useState, useEffect } from 'react';
import { apiCall, apiCallAuth } from '@/lib/api';
import { getAuthToken, getUser } from '@/lib/auth';

interface Car {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  fuelType: string;
  transmission?: string;
  location: string;
  description: string;
  photoUrls: string[];
  createdAt: string;
  userId: string;
}

interface User {
  id: string;
  name: string;
  email: string;
}

export default function ListingPage({ params }: { params: { id: string } }) {
  const [listing, setListing] = useState<Car | null>(null);
  const [seller, setSeller] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [messageText, setMessageText] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);
  const [messageError, setMessageError] = useState('');
  const [messageSuccess, setMessageSuccess] = useState(false);
  const currentUser = getUser();

  useEffect(() => {
    fetchListing();
  }, [params.id]);

  const fetchListing = async () => {
    setLoading(true);
    try {
      const response = await apiCall<Car>(`/cars/${params.id}`, { method: 'GET' });
      setListing(response);
      // TODO: Fetch seller details from API
      setSeller({ id: response.userId, name: 'John Doe', email: 'john@example.com' });
    } catch (err) {
      console.error('Failed to load listing');
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) return;

    setSendingMessage(true);
    setMessageError('');
    setMessageSuccess(false);

    try {
      const token = getAuthToken();
      if (!token) {
        setMessageError('Please log in to send a message');
        return;
      }

      await apiCallAuth(
        '/messages',
        {
          method: 'POST',
          body: JSON.stringify({
            carId: params.id,
            recipientId: listing?.userId,
            content: messageText,
          }),
        },
        token
      );

      setMessageSuccess(true);
      setMessageText('');
      setTimeout(() => setMessageSuccess(false), 3000);
    } catch (err) {
      setMessageError(err instanceof Error ? err.message : 'Failed to send message');
    } finally {
      setSendingMessage(false);
    }
  };

  if (loading) {
    return (
      <main>
        <div className="text-center py-12">
          <p className="text-gray-600">Loading listing...</p>
        </div>
      </main>
    );
  }

  if (!listing) {
    return (
      <main>
        <div className="text-center py-12">
          <p className="text-red-600">Listing not found</p>
        </div>
      </main>
    );
  }

  return (
    <main>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Gallery */}
          <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
            <div className="w-full h-96 bg-gray-300 flex items-center justify-center mb-4 overflow-hidden">
              {listing.photoUrls && listing.photoUrls.length > 0 ? (
                <img src={listing.photoUrls[0]} alt={`${listing.make} ${listing.model}`} className="w-full h-full object-cover" />
              ) : (
                <svg className="w-16 h-16 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            {listing.photoUrls && listing.photoUrls.length > 0 && (
              <div className="flex gap-2 p-4 overflow-x-auto">
                {listing.photoUrls.map((url, i) => (
                  <div key={i} className="w-20 h-20 bg-gray-300 rounded flex-shrink-0 cursor-pointer hover:opacity-70 overflow-hidden">
                    <img src={url} alt={`Gallery ${i}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Specs */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h1 className="text-3xl font-bold mb-2">
              {listing.year} {listing.make} {listing.model}
            </h1>
            <p className="text-gray-600 mb-6">
              {listing.mileage.toLocaleString()} km • {listing.fuelType} • {listing.transmission || 'Manual'} • {listing.location}
            </p>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-gray-600">Year</p>
                <p className="font-bold text-lg">2020</p>
              </div>
              <div>
                <p className="text-gray-600">Mileage</p>
                <p className="font-bold text-lg">45,000 km</p>
              </div>
              <div>
                <p className="text-gray-600">Fuel Type</p>
                <p className="font-bold text-lg">Petrol</p>
              </div>
              <div>
                <p className="text-gray-600">Transmission</p>
                <p className="font-bold text-lg">Manual</p>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-2">Description</h3>
              <p className="text-gray-700">
                Excellent condition BMW 3 Series with full service history. Recently serviced, new brakes, and new tires. All paperwork available. No accidents or damage.
              </p>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          {/* Price Card */}
          <div className="bg-white rounded-lg shadow p-6 mb-6 sticky top-24">
            <p className="text-4xl font-bold text-purple-900 mb-4">€{listing.price.toLocaleString()}</p>

            <button className="w-full bg-purple-900 text-white p-3 rounded font-bold hover:bg-purple-950 mb-3">
              Call Seller
            </button>
            <button className="w-full bg-gray-200 text-gray-800 p-3 rounded font-bold hover:bg-gray-300 mb-6">
              Save Listing
            </button>

            {/* Seller Info */}
            <div className="border-t pt-6">
              <h3 className="font-bold text-lg mb-4">Seller Details</h3>
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-purple-900 text-white rounded-full flex items-center justify-center font-bold">
                  {seller?.name.charAt(0) || 'J'}
                </div>
                <div className="ml-3">
                  <p className="font-bold">{seller?.name || 'Seller'}</p>
                  <p className="text-sm text-gray-600">Private Seller</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                <span className="text-yellow-500">★★★★★</span> 5.0 (12 reviews)
              </p>
              <button className="w-full border border-purple-900 text-purple-900 p-2 rounded hover:bg-purple-50 text-sm">
                View Other Listings
              </button>
            </div>

            {/* Message Form */}
            <div className="border-t pt-6 mt-6">
              <h3 className="font-bold text-lg mb-4">Send Message</h3>
              
              {messageSuccess && (
                <div className="bg-green-100 text-green-700 p-3 rounded mb-3 text-sm">
                  Message sent successfully!
                </div>
              )}

              {messageError && (
                <div className="bg-red-100 text-red-700 p-3 rounded mb-3 text-sm">
                  {messageError}
                </div>
              )}

              {!currentUser ? (
                <p className="text-gray-600 text-sm mb-3">
                  <a href="/auth/login" className="text-purple-900 font-bold">Log in</a> to send a message
                </p>
              ) : (
                <form onSubmit={handleSendMessage} className="space-y-3">
                  <textarea
                    placeholder="Hi, I'm interested in this car..."
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-purple-900 resize-none h-24"
                    required
                  />
                  <button
                    type="submit"
                    disabled={sendingMessage}
                    className="w-full bg-green-600 text-white p-3 rounded font-bold hover:bg-green-700 disabled:bg-gray-400"
                  >
                    {sendingMessage ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              )}
            </div>

            {/* Report Listing */}
            <div className="mt-6">
              <button className="w-full text-red-600 text-sm hover:underline">
                Report This Listing
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Similar Listings */}
      <section className="mt-12">
        <h2 className="text-3xl font-bold mb-8">Similar Listings</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden cursor-pointer">
              <div className="w-full h-40 bg-gray-300 flex items-center justify-center">
                <svg className="w-10 h-10 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-lg mb-1">BMW 3 Series</h3>
                <p className="text-gray-600 mb-2">2019 • Dublin</p>
                <p className="text-xl font-bold text-purple-900">€19,990</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
