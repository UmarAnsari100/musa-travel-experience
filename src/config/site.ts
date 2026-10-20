/**
 * MUSA TRANSPORT — Centralized Site & Environment Configuration
 *
 * Primary Domain: https://umarhtransport.com
 * Central source of truth for site URLs, branding, and verification links.
 */

export const SITE_CONFIG = {
  name: 'MUSA TRANSPORT',
  tagline: 'Premium Umrah & Hajj Private Transportation in Saudi Arabia',
  domain: 'umarhtransport.com',
  baseUrl: (import.meta.env.VITE_SITE_URL || 'https://umarhtransport.com').replace(/\/+$/, ''),
  supportWhatsApp: import.meta.env.VITE_WHATSAPP_NUMBER || '966597100424',
  supportPhoneFormatted: '+966 59 710 0424',
  supportEmail: 'operations@musatransport.com',
  officialLicense: 'Ministry of Transport & Logistics Authorized Service #KSA-78219',
};

/**
 * Builds the canonical public verification URL for a booking voucher QR code.
 * Format: https://umarhtransport.com/verify/MT-2026-00125?token=vtok_...
 */
export const buildVerificationUrl = (bookingReference: string, token?: string): string => {
  const cleanRef = encodeURIComponent(bookingReference.trim());
  const base = `${SITE_CONFIG.baseUrl}/verify/${cleanRef}`;
  if (token) {
    return `${base}?token=${encodeURIComponent(token.trim())}`;
  }
  return base;
};
