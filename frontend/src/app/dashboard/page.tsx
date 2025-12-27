'use client';

import { useState, useEffect } from 'react';

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('listings');
  const [listings, setListings] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalViews: 0,
    totalMessages: 0,
    totalListings: 0,
  });

  useEffect(() => {
    // TODO: Fetch user listings and stats from API
    console.log('Fetching dashboard data');
  }, []);

  return (
    <main>
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Seller Dashboard</h1>
        <p className="text-gray-600">Manage your car listings and messages</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 mb-2">Total Listings</p>
          <p className="text-4xl font-bold text-blue-600">{stats.totalListings}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 mb-2">Total Views</p>
          <p className="text-4xl font-bold text-green-600">{stats.totalViews}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 mb-2">New Messages</p>
          <p className="text-4xl font-bold text-orange-600">{stats.totalMessages}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6 border-b">
        <div className="flex gap-8">
          <button
            onClick={() => setActiveTab('listings')}
            className={`py-3 font-bold border-b-2 transition ${
              activeTab === 'listings'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600'
            }`}
          >
            My Listings
          </button>
          <button
            onClick={() => setActiveTab('messages')}
            className={`py-3 font-bold border-b-2 transition ${
              activeTab === 'messages'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600'
            }`}
          >
            Messages
          </button>
          <button
            onClick={() => setActiveTab('account')}
            className={`py-3 font-bold border-b-2 transition ${
              activeTab === 'account'
                ? 'border-blue-600 text-blue-600'
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
            <a
              href="/sell"
              className="bg-blue-600 text-white px-4 py-2 rounded font-bold hover:bg-blue-700"
            >
              + New Listing
            </a>
          </div>

          {listings.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <p className="text-gray-600 mb-4">You haven't created any listings yet</p>
              <a href="/sell" className="text-blue-600 font-bold hover:underline">
                Create Your First Listing
              </a>
            </div>
          ) : (
            <div className="grid gap-4">
              {listings.map((listing) => (
                <div key={listing.id} className="bg-white rounded-lg shadow p-4 flex gap-4">
                  <div className="w-24 h-24 bg-gray-300 rounded flex-shrink-0"></div>
                  <div className="flex-grow">
                    <h3 className="font-bold text-lg">{listing.title}</h3>
                    <p className="text-gray-600">{listing.views} views • {listing.messages} messages</p>
                    <p className="font-bold text-blue-600 mt-2">{listing.price}</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100">
                      Edit
                    </button>
                    <button className="px-4 py-2 border border-red-300 text-red-600 rounded hover:bg-red-50">
                      Delete
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
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-600">No messages yet</p>
          </div>
        </div>
      )}

      {activeTab === 'account' && (
        <div>
          <h2 className="text-2xl font-bold mb-6">Account Settings</h2>
          <div className="bg-white rounded-lg shadow p-6 max-w-2xl">
            <form className="space-y-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Full Name</label>
                <input type="text" placeholder="Your Name" className="w-full p-3 border rounded" />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Email</label>
                <input type="email" placeholder="Your Email" className="w-full p-3 border rounded" />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Phone</label>
                <input type="tel" placeholder="Your Phone" className="w-full p-3 border rounded" />
              </div>
              <button type="submit" className="bg-blue-600 text-white px-6 py-3 rounded font-bold hover:bg-blue-700">
                Save Changes
              </button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
