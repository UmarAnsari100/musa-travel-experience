import { Booking, BookingStatus } from '@/types/booking';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';
import { bookingService } from '@/services/bookingService';

export interface VerifiedBookingDetails {
  booking_reference: string;
  masked_customer_name: string;
  status: BookingStatus;
  status_label: string;
  status_description: string;
  is_confirmed: boolean;
  service_type: string;
  vehicle_type: string;
  passengers: number;
  travel_date: string;
  travel_time?: string;
  pickup_location: string;
  destination: string;
  flight_number?: string;
  hotel_name?: string;
  issue_date: string;
  verified_at: string;
}

export interface VerificationResponse {
  success: boolean;
  status: 'valid' | 'invalid_token' | 'not_found' | 'error';
  errorMessage?: string;
  booking?: VerifiedBookingDetails;
}

const TOKEN_SALT = 'MUSA_VERIFY_SALT_2026_UMRAH_AUTHENTIC';

/**
 * Fast synchronous SHA-256 implementation to guarantee universal support across
 * all browsers, mobile WebViews, Node.js, and Vitest without external crypto dependencies.
 */
function sha256Sync(ascii: string): string {
  function rightRotate(value: number, amount: number) {
    return (value >>> amount) | (value << (32 - amount));
  }

  const mathPow = Math.pow;
  const maxWord = mathPow(2, 32);
  let lengthProperty = 'length';
  let i = 0;
  let j = 0;
  let result = '';

  const words: number[] = [];
  const asciiBitLength = ascii[lengthProperty] * 8;

  let hash = [
    0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a,
    0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19,
  ];

  const k = [
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
    0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
    0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
    0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
    0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
    0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2,
  ];

  for (i = 0; i < ascii[lengthProperty]; i++) {
    const code = ascii.charCodeAt(i);
    words[i >> 2] |= (code & 0xff) << (24 - (i % 4) * 8);
  }

  words[asciiBitLength >> 5] |= 0x80 << (24 - (asciiBitLength % 32));
  words[(((asciiBitLength + 64) >> 9) << 4) + 15] = asciiBitLength;

  for (i = 0; i < words.length; i += 16) {
    const w = words.slice(i, i + 16);
    let [a, b, c, d, e, f, g, h] = hash;

    for (j = 0; j < 64; j++) {
      if (j >= 16) {
        const s0 = rightRotate(w[j - 15], 7) ^ rightRotate(w[j - 15], 18) ^ (w[j - 15] >>> 3);
        const s1 = rightRotate(w[j - 2], 17) ^ rightRotate(w[j - 2], 19) ^ (w[j - 2] >>> 10);
        w[j] = (w[j - 16] + s0 + w[j - 7] + s1) | 0;
      }

      const S1 = rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25);
      const ch = (e & f) ^ (~e & g);
      const temp1 = (h + S1 + ch + k[j] + w[j]) | 0;
      const S0 = rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22);
      const maj = (a & b) ^ (a & c) ^ (b & c);
      const temp2 = (S0 + maj) | 0;

      h = g;
      g = f;
      f = e;
      e = (d + temp1) | 0;
      d = c;
      c = b;
      b = a;
      a = (temp1 + temp2) | 0;
    }

    hash[0] = (hash[0] + a) | 0;
    hash[1] = (hash[1] + b) | 0;
    hash[2] = (hash[2] + c) | 0;
    hash[3] = (hash[3] + d) | 0;
    hash[4] = (hash[4] + e) | 0;
    hash[5] = (hash[5] + f) | 0;
    hash[6] = (hash[6] + g) | 0;
    hash[7] = (hash[7] + h) | 0;
  }

  for (i = 0; i < 8; i++) {
    for (j = 3; j >= 0; j--) {
      const b = (hash[i] >> (j * 8)) & 255;
      result += (b < 16 ? '0' : '') + b.toString(16);
    }
  }

  return result;
}

/**
 * Generates a deterministic, unguessable cryptographic verification token for a booking.
 */
export const generateVerificationToken = (booking: {
  id?: string;
  booking_reference: string;
  created_at?: string;
  verification_token?: string;
}): string => {
  if (booking.verification_token && booking.verification_token.trim().length >= 10) {
    return booking.verification_token.trim();
  }
  const payload = `${booking.id || ''}:${booking.booking_reference.trim().toUpperCase()}:${booking.created_at || '2026'}:${TOKEN_SALT}`;
  const fullHash = sha256Sync(payload);
  return `vtok_${fullHash.slice(0, 20)}`;
};

/**
 * Masks customer names to protect personal data during public verification scans.
 * Examples:
 * - "Ahmed Al-Sayed" -> "A***d A***d"
 * - "Mohammed" -> "M****d"
 * - "Ali" -> "A*i"
 */
export const maskCustomerName = (fullName: string): string => {
  if (!fullName || !fullName.trim()) return 'Valued Pilgrim';
  return fullName
    .trim()
    .split(/\s+/)
    .map((word) => {
      // Remove punctuation
      const clean = word.replace(/[^a-zA-Z\u0600-\u06FF]/g, '');
      if (!clean) return word;
      if (clean.length === 1) return clean + '*';
      if (clean.length === 2) return clean[0] + '*';
      if (clean.length === 3) return `${clean[0]}*${clean[2]}`;
      const maskCount = Math.min(clean.length - 2, 4);
      return `${clean[0]}${'*'.repeat(maskCount)}${clean[clean.length - 1]}`;
    })
    .join(' ');
};

/**
 * Resolves status descriptors and flags for verified bookings.
 */
export const getStatusPresentation = (status: BookingStatus) => {
  switch (status) {
    case 'confirmed':
      return {
        is_confirmed: true,
        status_label: 'OFFICIALLY CONFIRMED',
        status_description:
          'This transportation booking has been reviewed, approved, and officially confirmed by MUSA TRANSPORT dispatch operations.',
      };
    case 'in_progress':
      return {
        is_confirmed: true,
        status_label: 'IN PROGRESS',
        status_description:
          'Chauffeur dispatch and journey are currently active and monitored live.',
      };
    case 'completed':
      return {
        is_confirmed: true,
        status_label: 'COMPLETED JOURNEY',
        status_description:
          'This journey was successfully fulfilled by MUSA TRANSPORT.',
      };
    case 'cancelled':
      return {
        is_confirmed: false,
        status_label: 'CANCELLED / VOID',
        status_description:
          'This reservation has been cancelled. This voucher is void and cannot be used for transportation services.',
      };
    case 'pending':
    default:
      return {
        is_confirmed: false,
        status_label: 'PENDING CONFIRMATION',
        status_description:
          'This booking request has been received by dispatch but is currently pending schedule review and vehicle allocation. It is NOT yet a confirmed reservation.',
      };
  }
};

export const verificationService = {
  /**
   * Validates a booking reference and its corresponding unguessable security token.
   * Returns only essential, non-sensitive public travel details.
   */
  async verifyBooking(reference?: string, token?: string): Promise<VerificationResponse> {
    if (!reference || !reference.trim()) {
      return {
        success: false,
        status: 'not_found',
        errorMessage: 'Booking reference is required for verification.',
      };
    }

    const cleanRef = reference.trim().toUpperCase();
    const cleanToken = token ? token.trim() : '';

    if (!cleanToken) {
      return {
        success: false,
        status: 'invalid_token',
        errorMessage:
          'Verification token is missing. For passenger safety and fraud protection, vouchers can only be authenticated via an official QR code containing a valid cryptographic security token.',
      };
    }

    // 1. Check database via Supabase RPC if available
    let matchedBooking: Booking | null = null;

    if (isSupabaseConfigured()) {
      try {
        // Attempt secure RPC verification function
        const { data: rpcData, error: rpcError } = await supabase.rpc('verify_booking', {
          ref_input: cleanRef,
          token_input: cleanToken,
        });

        if (!rpcError && rpcData && rpcData.length > 0) {
          const row = rpcData[0];
          const pres = getStatusPresentation(row.status as BookingStatus);
          return {
            success: true,
            status: 'valid',
            booking: {
              booking_reference: row.booking_reference,
              masked_customer_name: row.customer_name ? maskCustomerName(row.customer_name) : 'Valued Pilgrim',
              status: row.status as BookingStatus,
              status_label: pres.status_label,
              status_description: pres.status_description,
              is_confirmed: pres.is_confirmed,
              service_type: row.service_type || 'Hajj & Umrah Transfers',
              vehicle_type: row.vehicle_type || 'Comfort Executive',
              passengers: row.passengers || 1,
              travel_date: row.travel_date || 'Scheduled Date',
              travel_time: row.travel_time,
              pickup_location: row.pickup_location || 'Designated Pickup Location',
              destination: row.drop_location || 'Destination Hotel/Airport',
              flight_number: row.flight_number || undefined,
              hotel_name: row.hotel_name || undefined,
              issue_date: row.created_at || new Date().toISOString(),
              verified_at: new Date().toISOString(),
            },
          };
        }
      } catch (err) {
        console.warn('[verificationService] Supabase RPC lookup failed, falling back to database query:', err);
      }

      // Fallback direct query if RPC is pending migration
      try {
        const { data: dbBooking, error: dbError } = await supabase
          .from('bookings')
          .select(`
            id,
            booking_reference,
            customer_name,
            passengers,
            service_type,
            status,
            verification_token,
            created_at,
            segments:journey_segments(
              segment_order,
              pickup_location,
              drop_location,
              pickup_date,
              pickup_time,
              vehicle_type,
              flight_number,
              hotel_name
            )
          `)
          .eq('booking_reference', cleanRef)
          .maybeSingle();

        if (!dbError && dbBooking) {
          matchedBooking = dbBooking as unknown as Booking;
        }
      } catch (err) {
        console.warn('[verificationService] Supabase direct query fallback error:', err);
      }
    }

    // 2. Fallback to Local Backup Store if Supabase did not return a match
    if (!matchedBooking) {
      try {
        const localList = await bookingService.fetchBookings();
        matchedBooking =
          localList.find(
            (b) => b.booking_reference.trim().toUpperCase() === cleanRef
          ) || null;
      } catch (localErr) {
        console.warn('[verificationService] Local store fetch error:', localErr);
      }
    }

    if (!matchedBooking) {
      return {
        success: false,
        status: 'not_found',
        errorMessage: `No registered booking found matching reference "${cleanRef}". Please verify the booking reference number.`,
      };
    }

    // 3. Cryptographic Token Validation
    const expectedToken = generateVerificationToken(matchedBooking);
    const storedToken = matchedBooking.verification_token?.trim();

    const isTokenMatch =
      cleanToken === expectedToken || (storedToken && cleanToken === storedToken);

    if (!isTokenMatch) {
      return {
        success: false,
        status: 'invalid_token',
        errorMessage:
          'Security token mismatch. The cryptographic token provided in this scan does not match our official records. This voucher cannot be authenticated.',
      };
    }

    // 4. Build Sanitized, Non-Sensitive Verification Payload
    const leadSegment = matchedBooking.segments?.[0];
    const pres = getStatusPresentation(matchedBooking.status);

    const verifiedDetails: VerifiedBookingDetails = {
      booking_reference: matchedBooking.booking_reference,
      masked_customer_name: maskCustomerName(matchedBooking.customer_name),
      status: matchedBooking.status,
      status_label: pres.status_label,
      status_description: pres.status_description,
      is_confirmed: pres.is_confirmed,
      service_type: matchedBooking.service_type || 'Hajj & Umrah Transfers',
      vehicle_type: leadSegment?.vehicle_type || 'Executive Sedan',
      passengers: matchedBooking.passengers || 1,
      travel_date: leadSegment?.pickup_date || new Date().toISOString().split('T')[0],
      travel_time: leadSegment?.pickup_time || 'Scheduled Time',
      pickup_location: leadSegment?.pickup_location || 'Designated Pickup Location',
      destination: leadSegment?.drop_location || 'Destination Location',
      flight_number: leadSegment?.flight_number || matchedBooking.flight_number,
      hotel_name: leadSegment?.hotel_name || matchedBooking.hotel_name,
      issue_date: matchedBooking.created_at,
      verified_at: new Date().toISOString(),
    };

    return {
      success: true,
      status: 'valid',
      booking: verifiedDetails,
    };
  },
};
