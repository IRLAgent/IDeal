'use client';

import { useState } from 'react';
import { apiCall } from '@/lib/api';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      await apiCall('/contact', {
        method: 'POST',
        body: JSON.stringify(formData),
      });

      setSuccess(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      });

      // Clear success message after 5 seconds
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-4xl font-bold mb-4 text-white">Contact Us</h1>
      <p className="text-gray-300 mb-8">
        Have a question or need assistance? Fill out the form below and we&apos;ll get back to you as soon as possible.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact Form */}
        <div className="lg:col-span-2">
          <div className="card">
            <h2 className="text-2xl font-bold mb-6 text-indigo-950">Send us a Message</h2>

            {success && (
              <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded mb-6">
                <p className="font-semibold">Message sent successfully!</p>
                <p className="text-sm">We&apos;ll get back to you within 24 hours.</p>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded mb-6">
                <p className="font-semibold">Error</p>
                <p className="text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-gray-700 font-semibold mb-2">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="input-field"
                    placeholder="Your full name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-gray-700 font-semibold mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="input-field"
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="phone" className="block text-gray-700 font-semibold mb-2">
                    Phone (Optional)
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="+353 XX XXX XXXX"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-gray-700 font-semibold mb-2">
                    Subject <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="input-field"
                  >
                    <option value="">Select a subject</option>
                    <option value="general">General Inquiry</option>
                    <option value="support">Technical Support</option>
                    <option value="buying">Buying a Car</option>
                    <option value="selling">Selling a Car</option>
                    <option value="account">Account Issues</option>
                    <option value="feedback">Feedback</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="message" className="block text-gray-700 font-semibold mb-2">
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="input-field resize-none"
                  placeholder="Please provide details about your inquiry..."
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full md:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>

        {/* Contact Information */}
        <div className="space-y-6">
          <div className="card bg-indigo-950 text-white">
            <h3 className="text-xl font-bold mb-4">Contact Information</h3>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <svg className="w-6 h-6 mr-3 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <div>
                  <p className="font-semibold">Email</p>
                  <a href="mailto:support@i-deal.ie" className="text-indigo-200 hover:text-white">
                    support@i-deal.ie
                  </a>
                </div>
              </div>

              <div className="flex items-start">
                <svg className="w-6 h-6 mr-3 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <div>
                  <p className="font-semibold">Phone</p>
                  <p className="text-indigo-200">+353 1 XXX XXXX</p>
                  <p className="text-sm text-gray-300 mt-1">Mon-Fri, 9am-5pm</p>
                </div>
              </div>

              <div className="flex items-start">
                <svg className="w-6 h-6 mr-3 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <div>
                  <p className="font-semibold">Location</p>
                  <p className="text-indigo-200">Dublin, Ireland</p>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="text-xl font-bold mb-4 text-indigo-950">Business Hours</h3>
            <div className="space-y-2 text-gray-700">
              <div className="flex justify-between">
                <span className="font-semibold">Monday - Friday</span>
                <span>9:00 AM - 6:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Saturday</span>
                <span>10:00 AM - 4:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Sunday</span>
                <span>Closed</span>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="text-xl font-bold mb-4 text-indigo-950">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="/search" className="text-indigo-950 hover:underline font-semibold">
                  Browse Cars
                </a>
              </li>
              <li>
                <a href="/listing/create" className="text-indigo-950 hover:underline font-semibold">
                  Sell Your Car
                </a>
              </li>
              <li>
                <a href="/dashboard" className="text-indigo-950 hover:underline font-semibold">
                  My Account
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="mt-12">
        <h2 className="text-3xl font-bold mb-6 text-white">Frequently Asked Questions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card">
            <h3 className="font-bold text-lg mb-2 text-indigo-950">How do I list my car?</h3>
            <p className="text-gray-700">
              Create an account, navigate to &quot;Sell Your Car&quot;, fill out the listing form with photos and details, and submit. Your listing will be live immediately.
            </p>
          </div>

          <div className="card">
            <h3 className="font-bold text-lg mb-2 text-indigo-950">Is it free to list?</h3>
            <p className="text-gray-700">
              Yes! Creating an account and listing your vehicle is completely free. We only succeed when you do.
            </p>
          </div>

          <div className="card">
            <h3 className="font-bold text-lg mb-2 text-indigo-950">How do I contact a seller?</h3>
            <p className="text-gray-700">
              Click on any listing to view details, then use the &quot;Contact Seller&quot; button. You&apos;ll need to be logged in to send messages.
            </p>
          </div>

          <div className="card">
            <h3 className="font-bold text-lg mb-2 text-indigo-950">Can I edit my listing?</h3>
            <p className="text-gray-700">
              Yes! Go to your dashboard, find your listing, and click &quot;Edit&quot; to update photos, price, or any other details.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
