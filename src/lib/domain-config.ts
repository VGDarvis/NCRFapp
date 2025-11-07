// Centralized domain configuration for all QR codes and shareable links
export const CUSTOM_DOMAIN = "https://expo.collegeexpoapp.org";

/**
 * Get the base URL for generating QR codes and shareable links
 * Uses custom domain in production, falls back to current origin in development
 */
export const getBaseUrl = (): string => {
  // In development (localhost), use current origin for testing
  if (window.location.hostname === "localhost" || 
      window.location.hostname.includes("lovable.app")) {
    return window.location.origin;
  }
  
  // In production, use custom domain
  return CUSTOM_DOMAIN;
};

/**
 * Generate guest access URL for QR codes
 * All QR codes lead to the same guest dashboard
 * Example: https://expo.collegeexpoapp.org/guest/college-expo?event=123
 */
export const generateGuestAccessUrl = (eventId?: string): string => {
  const baseUrl = getBaseUrl();
  let url = `${baseUrl}/guest/college-expo`;
  
  if (eventId) {
    return `${url}?event=${eventId}`;
  }
  
  return url;
};

/**
 * Generate event registration URL
 * Example: https://expo.collegeexpoapp.org/join-college-expo?event=123
 */
export const generateEventRegistrationUrl = (eventId: string): string => {
  const baseUrl = getBaseUrl();
  return `${baseUrl}/join-college-expo?event=${eventId}`;
};

/**
 * Generate check-in URL for QR codes in registration emails
 * Example: https://expo.collegeexpoapp.org/check-in/abc123xyz
 */
export const generateCheckInUrl = (qrCode: string): string => {
  return `${CUSTOM_DOMAIN}/check-in/${qrCode}`;
};
