import { describe, it, expect } from 'vitest';
import {
  buildWhatsAppBookingMessage,
  buildUmrahConfirmationMessage,
  buildWhatsAppVisaSubmissionMessage,
} from '@/services/whatsappService';
import { Booking } from '@/types/booking';

describe('WhatsApp Booking Message Template', () => {
  it('generates short, professional WhatsApp booking message with only the 5 required fields', () => {
    const message = buildWhatsAppBookingMessage({
      customerName: 'Muhammad Salman',
      selectedVehicle: 'Toyota Camry',
      passengers: 3,
      pickupLocation: 'King Abdulaziz International Airport (JED)',
      destination: 'Makkah Clock Royal Tower',
    });

    // 1. Starts with "Assalamu Alaikum!"
    expect(message.startsWith('Assalamu Alaikum!')).toBe(true);

    // 2. Contains exactly the 5 fields with proper emojis and bold formatting
    expect(message).toContain('👤 *Customer Name:* Muhammad Salman');
    expect(message).toContain('🚗 *Selected Vehicle:* Toyota Camry');
    expect(message).toContain('👥 *Number of Passengers:* 3');
    expect(message).toContain('📍 *Pickup Location:* King Abdulaziz International Airport (JED)');
    expect(message).toContain('📍 *Destination:* Makkah Clock Royal Tower');

    // 3. Ends with a polite request for booking confirmation
    expect(message.endsWith('Please confirm my booking. Thank you!')).toBe(true);

    // 4. Verify no extraneous fields are included
    expect(message).not.toContain('Booking ID');
    expect(message).not.toContain('Travel Date');
    expect(message).not.toContain('Pickup Time');
    expect(message).not.toContain('SAR');
    expect(message).not.toContain('Helpline');
  });

  it('populates booking data accurately in buildUmrahConfirmationMessage', () => {
    const mockBooking: Booking = {
      id: 'test-123',
      booking_reference: 'MT-2026-99999',
      customer_name: 'Dr. Fatima Zahra',
      customer_phone: '966551234567',
      service_type: 'Hajj & Umrah Transfers',
      passengers: 4,
      status: 'pending',
      created_at: new Date().toISOString(),
      source: 'website',
      segments: [
        {
          id: 'seg-1',
          booking_id: 'test-123',
          segment_order: 1,
          pickup_location: 'Madinah Airport',
          drop_location: 'Dar Al Taqwa Madinah',
          pickup_date: '2026-11-20',
          pickup_time: '14:30',
          vehicle_type: 'Staria',
          number_of_vehicles: 1,
        },
      ],
    };

    const message = buildUmrahConfirmationMessage(mockBooking);

    expect(message.startsWith('Assalamu Alaikum!')).toBe(true);
    expect(message).toContain('👤 *Customer Name:* Dr. Fatima Zahra');
    expect(message).toContain('🚗 *Selected Vehicle:* Kia Staria');
    expect(message).toContain('👥 *Number of Passengers:* 4');
    expect(message).toContain('📍 *Pickup Location:* Madinah Airport');
    expect(message).toContain('📍 *Destination:* Dar Al Taqwa Madinah');
    expect(message.endsWith('Please confirm my booking. Thank you!')).toBe(true);
  });

  it('generates properly formatted Send Visa via WhatsApp message template matching exact specifications', () => {
    const visaMsg = buildWhatsAppVisaSubmissionMessage({
      customerName: 'Sheikh Abdullah',
      bookingReference: 'MT-2026-77712',
      selectedVehicle: 'Toyota Hiace',
      passengerCount: 7,
      pickupLocation: 'Jeddah Seaport',
      destination: 'Makkah Clock Tower',
    });

    // Check title header
    expect(visaMsg).toContain('*MUSA TRANSPORT | Visa Document Submission*');

    // Check greeting and context
    expect(visaMsg).toContain('Assalamu Alaikum,\n\nI would like to submit my visa copy for travel verification related to my transportation booking.');

    // Check customer and booking details section
    expect(visaMsg).toContain('*👤 Customer & Booking Details*');
    expect(visaMsg).toContain('*Name:* Sheikh Abdullah');
    expect(visaMsg).toContain('*Booking Reference:* MT-2026-77712');
    expect(visaMsg).toContain('*Vehicle:* Toyota Hiace');
    expect(visaMsg).toContain('*Passengers:* 7');
    expect(visaMsg).toContain('*Pickup Location:* Jeddah Seaport');
    expect(visaMsg).toContain('*Destination:* Makkah Clock Tower');

    // Check visa verification section
    expect(visaMsg).toContain('*📄 Visa Verification*');
    // Must state that document will be attached, never that it has already been attached
    expect(visaMsg).toContain('I will attach my visa document to this message for verification. Kindly review the document and confirm its receipt.');
    expect(visaMsg).not.toContain('Please find the visa attached');

    // Check closing
    expect(visaMsg.endsWith('JazakAllah Khair.')).toBe(true);
  });
});
