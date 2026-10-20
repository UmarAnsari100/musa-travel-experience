import { Booking } from '@/types/booking';
import { bookingService } from '@/services/bookingService';

import { fleetData } from '@/data/fleet';

export interface WhatsAppSendResult {
  success: boolean;
  messageId?: string;
  status: 'sent' | 'delivered' | 'failed' | 'manual_sent';
  error?: string;
  isManualFallback?: boolean;
}

export interface WhatsAppBookingDetails {
  customerName: string;
  selectedVehicle: string;
  passengers: number | string;
  pickupLocation: string;
  destination: string;
}

export interface WhatsAppVisaSubmissionDetails {
  customerName: string;
  bookingReference: string;
  selectedVehicle: string;
  passengerCount: number | string;
  pickupLocation: string;
  destination: string;
}

export const buildWhatsAppVisaSubmissionMessage = (data: WhatsAppVisaSubmissionDetails): string => {
  return (
    `*MUSA TRANSPORT | Visa Document Submission*\n\n` +
    `Assalamu Alaikum,\n\n` +
    `I would like to submit my visa copy for travel verification related to my transportation booking.\n\n` +
    `*👤 Customer & Booking Details*\n\n` +
    `*Name:* ${data.customerName}\n` +
    `*Booking Reference:* ${data.bookingReference}\n` +
    `*Vehicle:* ${data.selectedVehicle}\n` +
    `*Passengers:* ${data.passengerCount}\n` +
    `*Pickup Location:* ${data.pickupLocation}\n` +
    `*Destination:* ${data.destination}\n\n` +
    `*📄 Visa Verification*\n\n` +
    `I will attach my visa document to this message for verification. Kindly review the document and confirm its receipt.\n\n` +
    `JazakAllah Khair.`
  );
};

export const buildWhatsAppBookingMessage = (data: WhatsAppBookingDetails): string => {
  return (
    `Assalamu Alaikum!\n\n` +
    `👤 *Customer Name:* ${data.customerName}\n` +
    `🚗 *Selected Vehicle:* ${data.selectedVehicle}\n` +
    `👥 *Number of Passengers:* ${data.passengers}\n` +
    `📍 *Pickup Location:* ${data.pickupLocation}\n` +
    `📍 *Destination:* ${data.destination}\n\n` +
    `Please confirm my booking. Thank you!`
  );
};

export const buildUmrahConfirmationMessage = (booking: Booking): string => {
  const leadSegment = booking.segments?.[0];
  const pickup = leadSegment?.pickup_location || 'Designated Location';
  const dropoff = leadSegment?.drop_location || 'Destination';
  const vehicleRaw = leadSegment?.vehicle_type || 'VIP Vehicle';

  const matchedVehicle = fleetData.find(
    (v) => v.vehicleType === vehicleRaw || v.name === vehicleRaw
  );
  const vehicle = matchedVehicle?.name || vehicleRaw;

  return buildWhatsAppBookingMessage({
    customerName: booking.customer_name,
    selectedVehicle: vehicle,
    passengers: booking.passengers,
    pickupLocation: pickup,
    destination: dropoff,
  });
};

export const whatsappService = {
  // 1. Direct Meta WhatsApp Cloud API via Supabase Edge Function (Production Server-Side)
  async sendCloudAPIConfirmation(
    booking: Booking,
    voucherPdfUrl?: string
  ): Promise<WhatsAppSendResult> {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !anonKey || supabaseUrl.includes('placeholder')) {
      return {
        success: false,
        status: 'failed',
        error: 'Meta WhatsApp Cloud API requires Supabase Edge Function credentials. Please use Manual Dispatch fallback.',
      };
    }

    try {
      const response = await fetch(`${supabaseUrl}/functions/v1/send-whatsapp-voucher`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${anonKey}`,
        },
        body: JSON.stringify({
          bookingId: booking.id,
          recipientPhone: booking.customer_phone,
          customerName: booking.customer_name,
          bookingReference: booking.booking_reference,
          voucherUrl: voucherPdfUrl,
          messageText: buildUmrahConfirmationMessage(booking),
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'WhatsApp Cloud API call returned an error');
      }

      await bookingService.logWhatsAppMessage({
        booking_id: booking.id,
        recipient_phone: booking.customer_phone,
        message_type: 'template',
        template_name: 'musa_booking_confirmation',
        meta_message_id: data.messageId,
        status: 'sent',
        sent_at: new Date().toISOString(),
        retry_count: 0,
        is_manual_fallback: false,
      });

      return {
        success: true,
        messageId: data.messageId,
        status: 'sent',
      };
    } catch (err: any) {
      console.error('[whatsappService] Cloud API Error:', err);

      await bookingService.logWhatsAppMessage({
        booking_id: booking.id,
        recipient_phone: booking.customer_phone,
        message_type: 'template',
        status: 'failed',
        sent_at: new Date().toISOString(),
        error_message: err.message,
        retry_count: 1,
        is_manual_fallback: false,
      });

      return {
        success: false,
        status: 'failed',
        error: err.message || 'WhatsApp Cloud API dispatch failed',
      };
    }
  },

  // 2. Verified Manual WhatsApp Web/App Fallback (Always functional & labeled)
  sendManualWhatsApp(booking: Booking): void {
    const cleanPhone = booking.customer_phone.replace(/[^0-9]/g, '');
    const message = encodeURIComponent(buildUmrahConfirmationMessage(booking));
    const url = `https://wa.me/${cleanPhone}?text=${message}`;

    window.open(url, '_blank');

    bookingService.logWhatsAppMessage({
      booking_id: booking.id,
      recipient_phone: cleanPhone,
      message_type: 'manual',
      status: 'manual_sent',
      sent_at: new Date().toISOString(),
      retry_count: 0,
      is_manual_fallback: true,
    });
  },
};
