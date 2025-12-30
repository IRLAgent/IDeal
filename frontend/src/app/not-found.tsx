import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="flex items-center justify-center min-h-[calc(100vh-200px)]">
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-4 text-indigo-950">404</h1>
        <p className="text-2xl text-gray-700 mb-8">Page Not Found</p>
        <p className="text-gray-600 mb-8">Sorry, the page you&apos;re looking for doesn&apos;t exist.</p>
        <Link
          href="/"
          className="inline-block bg-indigo-950 text-white px-6 py-3 rounded font-semibold hover:bg-indigo-950 transition"
        >
          Go Back Home
        </Link>
      </div>
    </main>
  );
}
