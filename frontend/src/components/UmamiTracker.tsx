'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

/**
 * Component to load Umami script and track page views
 */
export default function UmamiTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Load Umami script on mount
  useEffect(() => {
    const script = document.createElement('script');
    script.src = `${process.env.NEXT_PUBLIC_UMAMI_URL}/script.js`;
    script.setAttribute('data-website-id', process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID || '');
    script.async = true;
    script.defer = true;
    
    script.onload = () => {
      console.log('✅ Umami script loaded successfully');
      console.log('window.umami:', (window as any).umami);
    };
    
    script.onerror = () => {
      console.error('❌ Failed to load Umami script');
    };
    
    document.head.appendChild(script);

    return () => {
      // Cleanup on unmount
      const scripts = document.querySelectorAll(`script[src*="umami"]`);
      scripts.forEach(s => s.remove());
    };
  }, []);

  // Track route changes
  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).umami) {
      const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '');
      console.log('📊 Tracking page view:', url);
      (window as any).umami.track((props: any) => ({ ...props, url }));
    }
  }, [pathname, searchParams]);

  return null;
}
