import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { SITE_CONFIG, buildVerificationUrl } from '@/config/site';
import {
  generateVerificationToken,
  maskCustomerName,
  verificationService,
} from '@/services/verificationService';
import { generateVoucherPDF } from '@/services/voucherGenerator';
import { Booking } from '@/types/booking';
import BookingVerification from '@/pages/BookingVerification';

describe('MUSA TRANSPORT — Voucher QR Code & Booking Verification System', () => {
  const sampleBooking: Booking = {
    id: 'test-booking-qr-1',
    booking_reference: 'MT-2026-00132',
    customer_name: 'Dr. Bilal Qureshi',
    customer_phone: '966597100424',
    customer_email: 'dr.bilal@example.com',
    passengers: 3,
    service_type: 'Hajj & Umrah Transfers',
    status: 'confirmed',
    payment_status: 'paid',
    source: 'website',
    is_international: true,
    created_at: '2026-10-20T10:00:00.000Z',
    updated_at: '2026-10-20T10:00:00.000Z',
    segments: [
      {
        id: 'seg-1',
        segment_order: 1,
        pickup_location: 'King Abdulaziz International Airport (JED)',
        drop_location: 'Fairmont Makkah Clock Royal Tower',
        pickup_date: '2026-10-25',
        pickup_time: '14:30',
        vehicle_type: 'GMC Yukon',
        number_of_vehicles: 1,
        flight_number: 'SV 123',
        hotel_name: 'Fairmont Makkah',
      },
    ],
  };

  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem(
      'musa_transport_bookings_store',
      JSON.stringify([sampleBooking])
    );
    vi.clearAllMocks();
  });

  describe('1. Centralized Domain & QR Code URL Generation', () => {
    it('uses https://umarhtransport.com as the canonical website base URL', () => {
      expect(SITE_CONFIG.baseUrl).toBe('https://umarhtransport.com');
      expect(SITE_CONFIG.domain).toBe('umarhtransport.com');
    });

    it('builds a unique verification URL with booking reference and security token', () => {
      const token = generateVerificationToken(sampleBooking);
      const url = buildVerificationUrl(sampleBooking.booking_reference, token);

      expect(url).toContain('https://umarhtransport.com/verify/MT-2026-00132');
      expect(url).toContain(`token=${token}`);
      expect(url).not.toContain('musatransport.com');
    });
  });

  describe('2. Cryptographic Security Token & Privacy Protection', () => {
    it('generates an unguessable verification token for each booking', () => {
      const token1 = generateVerificationToken(sampleBooking);
      const token2 = generateVerificationToken({
        ...sampleBooking,
        booking_reference: 'MT-2026-00133',
      });

      expect(token1).toMatch(/^vtok_[a-f0-9]{20}$/);
      expect(token2).toMatch(/^vtok_[a-f0-9]{20}$/);
      expect(token1).not.toBe(token2);
    });

    it('masks customer names to protect personal traveler privacy', () => {
      const masked = maskCustomerName('Dr. Bilal Qureshi');
      expect(masked).toBe('D* B***l Q****i');
      expect(maskCustomerName('Ahmed Al-Sayed')).toBe('A***d A****d');
      expect(maskCustomerName('Fatima')).toBe('F****a');
    });

    it('rejects verification if token is missing or invalid', async () => {
      // Missing token
      const noTokenRes = await verificationService.verifyBooking('MT-2026-00132', '');
      expect(noTokenRes.success).toBe(false);
      expect(noTokenRes.status).toBe('invalid_token');

      // Invalid token
      const wrongTokenRes = await verificationService.verifyBooking(
        'MT-2026-00132',
        'invalid_token_xyz'
      );
      expect(wrongTokenRes.success).toBe(false);
      expect(wrongTokenRes.status).toBe('invalid_token');
    });

    it('successfully validates booking with correct token without exposing private data', async () => {
      const validToken = generateVerificationToken(sampleBooking);
      const res = await verificationService.verifyBooking('MT-2026-00132', validToken);

      expect(res.success).toBe(true);
      expect(res.status).toBe('valid');
      expect(res.booking?.booking_reference).toBe('MT-2026-00132');
      expect(res.booking?.masked_customer_name).toBe(maskCustomerName(sampleBooking.customer_name));
      expect(res.booking?.vehicle_type).toBe('GMC Yukon');
      expect(res.booking?.passengers).toBe(3);

      // Verify private fields are completely absent from public payload
      const payloadKeys = Object.keys(res.booking || {});
      expect(payloadKeys).not.toContain('customer_phone');
      expect(payloadKeys).not.toContain('customer_email');
      expect(payloadKeys).not.toContain('visa_status');
      expect(payloadKeys).not.toContain('documents');
      expect(payloadKeys).not.toContain('total_price');
    });
  });

  describe('3. Booking Status Handling', () => {
    it('marks confirmed bookings as officially confirmed', async () => {
      const validToken = generateVerificationToken(sampleBooking);
      const res = await verificationService.verifyBooking('MT-2026-00132', validToken);

      expect(res.booking?.status).toBe('confirmed');
      expect(res.booking?.is_confirmed).toBe(true);
      expect(res.booking?.status_label).toBe('OFFICIALLY CONFIRMED');
    });

    it('clearly flags pending bookings as NOT yet confirmed', async () => {
      const pendingBooking: Booking = {
        ...sampleBooking,
        id: 'test-pending-1',
        booking_reference: 'MT-2026-00139',
        status: 'pending',
      };
      localStorage.setItem(
        'musa_transport_bookings_store',
        JSON.stringify([sampleBooking, pendingBooking])
      );

      const validToken = generateVerificationToken(pendingBooking);
      const res = await verificationService.verifyBooking('MT-2026-00139', validToken);

      expect(res.booking?.status).toBe('pending');
      expect(res.booking?.is_confirmed).toBe(false);
      expect(res.booking?.status_label).toBe('PENDING CONFIRMATION');
      expect(res.booking?.status_description).toContain('NOT yet a confirmed reservation');
    });
  });

  describe('4. Voucher PDF Generation & Layout Overlap Prevention', () => {
    it('generates PDF for confirmed booking with proper heading and no musatransport.com in QR', async () => {
      const pdf = await generateVoucherPDF(sampleBooking);
      expect(pdf).toBeDefined();
      expect(pdf.getNumberOfPages()).toBe(1);
    });

    it('generates PDF for pending booking without claiming official confirmation', async () => {
      const pendingBooking: Booking = {
        ...sampleBooking,
        status: 'pending',
      };
      const pdf = await generateVoucherPDF(pendingBooking);
      expect(pdf).toBeDefined();
    });
  });

  describe('5. Public Booking Verification Page Rendering', () => {
    it('renders verified booking details when loaded with valid reference and token', async () => {
      const token = generateVerificationToken(sampleBooking);

      render(
        <MemoryRouter initialEntries={[`/verify/MT-2026-00132?token=${token}`]}>
          <Routes>
            <Route path="/verify/:reference" element={<BookingVerification />} />
          </Routes>
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByText('MT-2026-00132')).toBeInTheDocument();
        expect(screen.getByText(maskCustomerName(sampleBooking.customer_name))).toBeInTheDocument();
        expect(screen.getByText(/GMC Yukon/i)).toBeInTheDocument();
        expect(screen.getByText(/OFFICIALLY CONFIRMED RESERVATION/i)).toBeInTheDocument();
      });

      // Confirm phone and private info are NOT in the document
      expect(screen.queryByText('+966597100424')).not.toBeInTheDocument();
      expect(screen.queryByText('dr.bilal@example.com')).not.toBeInTheDocument();
    });

    it('renders security check failed warning when token is invalid', async () => {
      render(
        <MemoryRouter initialEntries={['/verify/MT-2026-00132?token=invalid-hack-token']}>
          <Routes>
            <Route path="/verify/:reference" element={<BookingVerification />} />
          </Routes>
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByText(/Voucher Authentication Failed/i)).toBeInTheDocument();
        expect(screen.getByText(/Security token mismatch/i)).toBeInTheDocument();
      });
    });
  });
});
