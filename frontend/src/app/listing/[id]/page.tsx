'use client';

import { useState, useEffect } from 'react';

export default function ListingPage({ params }: { params: { id: string } }) {
  const [listing, setListing] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // TODO: Fetch listing from API
    console.log('Fetching listing:', params.id);
    setLoading(false);
  }, [params.id]);

  const handleMessage = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Send message via API
    console.log('Sending message:', message);
    setMessage('');
  };

  if (loading) {
    return <main><div className="text-center py-12">Loading...</div></main>;
  }

  return (
    <main>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Gallery */}
          <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
            <div className="w-full h-96 bg-gray-300 flex items-center justify-center mb-4">
              <svg className="w-16 h-16 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="flex gap-2 p-4 overflow-x-auto">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-20 h-20 bg-gray-300 rounded flex-shrink-0 cursor-pointer hover:opacity-70"></div>
              ))}
            </div>
          </div>

          {/* Specs */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h1 className="text-3xl font-bold mb-2">2020 BMW 3 Series</h1>
            <p className="text-gray-600 mb-6">45,000 km • Petrol • Manual • Dublin</p>

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
            <p className="text-4xl font-bold text-blue-600 mb-4">€22,990</p>

            <button className="w-full bg-blue-600 text-white p-3 rounded font-bold hover:bg-blue-700 mb-3">
              Call Seller
            </button>
            <button className="w-full bg-gray-200 text-gray-800 p-3 rounded font-bold hover:bg-gray-300 mb-6">
              Save Listing
            </button>

            {/* Seller Info */}
            <div className="border-t pt-6">
              <h3 className="font-bold text-lg mb-4">Seller Details</h3>
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                  JD
                </div>
                <div className="ml-3">
                  <p className="font-bold">John Doe</p>
                  <p className="text-sm text-gray-600">Private Seller</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                <span className="text-yellow-500">★★★★★</span> 5.0 (12 reviews)
              </p>
              <button className="w-full border border-blue-600 text-blue-600 p-2 rounded hover:bg-blue-50 text-sm">
                View Other Listings
              </button>
            </div>

            {/* Message Form */}
            <div className="border-t pt-6 mt-6">
              <h3 className="font-bold text-lg mb-4">Send Message</h3>
              <form onSubmit={handleMessage} className="space-y-3">
                <textarea
                  placeholder="Hi, I'm interested in this car..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500 resize-none h-24"
                  required
                />
                <button
                  type="submit"
                  className="w-full bg-green-600 text-white p-3 rounded font-bold hover:bg-green-700"
                >
                  Send Message
                </button>
              </form>
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
                <p className="text-xl font-bold text-blue-600">€19,990</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
