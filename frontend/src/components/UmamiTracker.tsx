'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

/**
 * Component to track page views in Single Page Applications
 * Umami automatically tracks the initial page load, but we need to manually
 * track route changes in Next.js App Router
 */
export default function UmamiTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Track page view on route change using Umami's pageview tracking
    // The script automatically tracks initial page loads, this handles SPA navigation
    if (typeof window !== 'undefined' && (window as any).umami) {
      const url = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : '');
      // Use umami.track for page views in SPA mode
      (window as any).umami.track('pageview', { url });
    }
  }, [pathname, searchParams]);

  return null;
}
