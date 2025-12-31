// Umami analytics utility functions
// Provides type-safe wrappers for custom event tracking

declare global {
  interface Window {
    umami?: {
      track: (eventName: string, eventData?: Record<string, any>) => void;
    };
  }
}

/**
 * Track a custom event with Umami analytics
 * Only tracks if Umami is loaded and configured
 */
export const trackEvent = (eventName: string, eventData?: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.umami) {
    window.umami.track(eventName, eventData);
  }
};

/**
 * Track search events
 */
export const trackSearch = (filters: {
  make?: string;
  model?: string;
  minPrice?: number;
  maxPrice?: number;
  county?: string;
  seller?: string;
}) => {
  const cleanFilters = Object.fromEntries(
    Object.entries(filters).filter(([_, value]) => value !== undefined && value !== '')
  );
  
  trackEvent('search', {
    filterCount: Object.keys(cleanFilters).length,
    ...cleanFilters,
  });
};

/**
 * Track listing views
 */
export const trackListingView = (carId: string, make?: string, model?: string) => {
  trackEvent('view-listing', {
    carId,
    make,
    model,
  });
};

/**
 * Track message sent events
 */
export const trackMessageSent = (recipientId: string, listingId?: string) => {
  trackEvent('message-sent', {
    recipientId,
    listingId,
  });
};

/**
 * Track listing creation
 */
export const trackListingCreated = (make: string, model: string, price: number) => {
  trackEvent('create-listing', {
    make,
    model,
    priceRange: getPriceRange(price),
  });
};

/**
 * Track photo upload events
 */
export const trackPhotoUpload = (photoCount: number) => {
  trackEvent('photo-upload', {
    count: photoCount,
  });
};

/**
 * Track authentication events
 */
export const trackAuth = (action: 'login' | 'signup') => {
  trackEvent(`auth-${action}`);
};

/**
 * Helper to get price range bucket for analytics
 */
const getPriceRange = (price: number): string => {
  if (price < 5000) return 'under-5k';
  if (price < 10000) return '5k-10k';
  if (price < 20000) return '10k-20k';
  if (price < 30000) return '20k-30k';
  if (price < 50000) return '30k-50k';
  return 'over-50k';
};
