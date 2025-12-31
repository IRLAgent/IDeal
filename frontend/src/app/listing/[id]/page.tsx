'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
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
  user?: User;
}

interface User {
  id: string;
  name: string;
  email: string;
  sellerType?: string;
}

export default function ListingPage({ params }: { params: { id: string } }) {
  const [listing, setListing] = useState<Car | null>(null);
  const [seller, setSeller] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [messageText, setMessageText] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);
  const [messageError, setMessageError] = useState('');
  const [messageSuccess, setMessageSuccess] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const currentUser = getUser();

  useEffect(() => {
    fetchListing();
  }, [params.id]);

  const fetchListing = async () => {
    setLoading(true);
    try {
      const response = await apiCall<Car>(`/cars/${params.id}`, { method: 'GET' });
      setListing(response);
      
      // Set seller from response
      if (response.user) {
        setSeller(response.user);
      }
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
        setSendingMessage(false);
        return;
      }

      await apiCallAuth(
        '/messages',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            toUserId: listing?.userId,
            carId: params.id,
            messageText: messageText.trim(),
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

  const handlePreviousImage = () => {
    if (listing && listing.photoUrls.length > 0) {
      setSelectedImageIndex((prev) => 
        prev === 0 ? listing.photoUrls.length - 1 : prev - 1
      );
    }
  };

  const handleNextImage = () => {
    if (listing && listing.photoUrls.length > 0) {
      setSelectedImageIndex((prev) => 
        prev === listing.photoUrls.length - 1 ? 0 : prev + 1
      );
    }
  };

  const handleThumbnailClick = (index: number) => {
    setSelectedImageIndex(index);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      handlePreviousImage();
    } else if (e.key === 'ArrowRight') {
      handleNextImage();
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    (e.currentTarget as any).touchStartX = touch.clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touch = e.changedTouches[0];
    const touchStartX = (e.currentTarget as any).touchStartX;
    const diff = touchStartX - touch.clientX;

    // Swipe threshold: 50px
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        handleNextImage(); // Swipe left
      } else {
        handlePreviousImage(); // Swipe right
      }
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
            {listing.photoUrls && listing.photoUrls.length > 0 ? (
              <>
                {/* Main Image */}
                <div 
                  className="relative w-full h-96 md:h-[500px] bg-gray-900 flex items-center justify-center group"
                  onKeyDown={handleKeyDown}
                  onTouchStart={handleTouchStart}
                  onTouchEnd={handleTouchEnd}
                  tabIndex={0}
                >
                  <img 
                    src={listing.photoUrls[selectedImageIndex]} 
                    alt={`${listing.make} ${listing.model} - Image ${selectedImageIndex + 1}`} 
                    className="w-full h-full object-contain"
                  />
                  
                  {/* Navigation Arrows */}
                  {listing.photoUrls.length > 1 && (
                    <>
                      <button
                        onClick={handlePreviousImage}
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label="Previous image"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      <button
                        onClick={handleNextImage}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label="Next image"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                      
                      {/* Image Counter */}
                      <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                        {selectedImageIndex + 1} / {listing.photoUrls.length}
                      </div>
                    </>
                  )}
                </div>
                
                {/* Thumbnails */}
                {listing.photoUrls.length > 1 && (
                  <div className="flex gap-2 p-4 overflow-x-auto">
                    {listing.photoUrls.map((url, i) => (
                      <button
                        key={i}
                        onClick={() => handleThumbnailClick(i)}
                        className={`w-20 h-20 flex-shrink-0 rounded overflow-hidden border-2 transition-all ${
                          i === selectedImageIndex 
                            ? 'border-indigo-950 ring-2 ring-indigo-950' 
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        <img 
                          src={url} 
                          alt={`Thumbnail ${i + 1}`} 
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="w-full h-96 bg-gray-300 flex items-center justify-center">
                <svg className="w-16 h-16 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                </svg>
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
                <p className="font-bold text-lg">{listing.year}</p>
              </div>
              <div>
                <p className="text-gray-600">Mileage</p>
                <p className="font-bold text-lg">{listing.mileage.toLocaleString()} km</p>
              </div>
              <div>
                <p className="text-gray-600">Fuel Type</p>
                <p className="font-bold text-lg">{listing.fuelType}</p>
              </div>
              <div>
                <p className="text-gray-600">Transmission</p>
                <p className="font-bold text-lg">{listing.transmission || 'Manual'}</p>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-2">Description</h3>
              <p className="text-gray-700 whitespace-pre-wrap">
                {listing.description || 'No description available.'}
              </p>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          {/* Price Card */}
          <div className="bg-white rounded-lg shadow p-6 mb-6 sticky top-24">
            <p className="text-4xl font-bold text-indigo-950 mb-4">€{listing.price.toLocaleString()}</p>

            <button className="w-full bg-indigo-950 text-white p-3 rounded font-bold hover:bg-indigo-950 mb-3">
              Call Seller
            </button>
            <button className="w-full bg-gray-200 text-gray-800 p-3 rounded font-bold hover:bg-gray-300 mb-6">
              Save Listing
            </button>

            {/* Seller Info */}
            <div className="border-t pt-6">
              <h3 className="font-bold text-lg mb-4">Seller Details</h3>
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-indigo-950 text-white rounded-full flex items-center justify-center font-bold text-xl">
                  {seller?.name.charAt(0).toUpperCase() || 'S'}
                </div>
                <div className="ml-3">
                  <p className="font-bold">{seller?.name || 'Seller'}</p>
                  <p className="text-sm text-gray-600 capitalize">
                    {seller?.sellerType === 'dealer' ? 'Dealer' : 'Private Seller'}
                  </p>
                </div>
              </div>
              {seller?.email && (
                <p className="text-gray-600 text-sm mb-4">
                  <a href={`mailto:${seller.email}`} className="text-indigo-950 hover:underline">
                    {seller.email}
                  </a>
                </p>
              )}
              <Link 
                href={`/search?seller=${listing.userId}`}
                className="w-full border border-indigo-950 text-indigo-950 p-2 rounded hover:bg-indigo-50 text-sm block text-center"
              >
                View Other Listings
              </Link>
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
                  <a href="/auth/login" className="text-indigo-950 font-bold">Log in</a> to send a message
                </p>
              ) : (
                <form onSubmit={handleSendMessage} className="space-y-3">
                  <textarea
                    placeholder="Hi, I'm interested in this car..."
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-indigo-950 resize-none h-24"
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
                <p className="text-xl font-bold text-indigo-950">€19,990</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
