// Utility functions for multi-platform navigation

export interface NavigationDestination {
  address: string;
  city: string;
  state: string;
  zipCode?: string;
  latitude?: number;
  longitude?: number;
}

export const detectPlatform = (): 'ios' | 'android' | 'desktop' => {
  const userAgent = navigator.userAgent.toLowerCase();
  if (/iphone|ipad|ipod/.test(userAgent)) return 'ios';
  if (/android/.test(userAgent)) return 'android';
  return 'desktop';
};

export const getGoogleMapsUrl = (destination: NavigationDestination): string => {
  const query = destination.latitude && destination.longitude
    ? `${destination.latitude},${destination.longitude}`
    : `${destination.address}, ${destination.city}, ${destination.state} ${destination.zipCode || ''}`.trim();
  
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(query)}`;
};

export const getAppleMapsUrl = (destination: NavigationDestination): string => {
  const query = destination.latitude && destination.longitude
    ? `${destination.latitude},${destination.longitude}`
    : `${destination.address}, ${destination.city}, ${destination.state} ${destination.zipCode || ''}`.trim();
  
  return `https://maps.apple.com/?daddr=${encodeURIComponent(query)}`;
};

export const getWazeUrl = (destination: NavigationDestination): string => {
  if (destination.latitude && destination.longitude) {
    return `https://waze.com/ul?ll=${destination.latitude},${destination.longitude}&navigate=yes`;
  }
  
  const query = `${destination.address}, ${destination.city}, ${destination.state} ${destination.zipCode || ''}`.trim();
  return `https://waze.com/ul?q=${encodeURIComponent(query)}&navigate=yes`;
};

export const openNavigation = (destination: NavigationDestination, preferredApp?: 'google' | 'apple' | 'waze'): void => {
  const platform = detectPlatform();
  let url: string;

  if (preferredApp === 'waze') {
    url = getWazeUrl(destination);
  } else if (preferredApp === 'apple' || (platform === 'ios' && !preferredApp)) {
    url = getAppleMapsUrl(destination);
  } else {
    url = getGoogleMapsUrl(destination);
  }

  window.open(url, '_blank');
};
