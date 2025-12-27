import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="flex items-center justify-center min-h-[calc(100vh-200px)]">
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-4 text-amber-400">404</h1>
        <p className="text-2xl text-gray-300 mb-8">Page Not Found</p>
        <p className="text-gray-400 mb-8">Sorry, the page you&apos;re looking for doesn&apos;t exist.</p>
        <Link
          href="/"
          className="inline-block bg-gradient-to-r from-amber-500 to-amber-600 text-white px-6 py-3 rounded font-semibold hover:from-amber-600 hover:to-amber-700 transition"
        >
          Go Back Home
        </Link>
      </div>
    </main>
  );
}
