-- MUSA TRANSPORT: Migration 003
-- Booking Verification Token & Public Security Definer Function

-- 1. Add verification_token to bookings if not already present
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS verification_token TEXT;
CREATE INDEX IF NOT EXISTS idx_bookings_verification_token ON public.bookings(verification_token);

-- 2. Create Public Secure Verification Function (SECURITY DEFINER)
-- Allows public verification of vouchers via QR code WITHOUT exposing private customer data (phone, email, visa documents)
CREATE OR REPLACE FUNCTION public.verify_booking(
  ref_input TEXT,
  token_input TEXT
)
RETURNS TABLE (
  booking_reference TEXT,
  customer_name TEXT,
  service_type TEXT,
  status TEXT,
  passengers INTEGER,
  created_at TIMESTAMPTZ,
  pickup_location TEXT,
  drop_location TEXT,
  travel_date TEXT,
  travel_time TEXT,
  vehicle_type TEXT,
  flight_number TEXT,
  hotel_name TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_booking public.bookings%ROWTYPE;
  v_lead_seg public.journey_segments%ROWTYPE;
BEGIN
  -- 1. Locate booking by reference
  SELECT * INTO v_booking
  FROM public.bookings
  WHERE UPPER(TRIM(bookings.booking_reference)) = UPPER(TRIM(ref_input))
  LIMIT 1;

  IF NOT FOUND THEN
    RETURN;
  END IF;

  -- 2. Validate token (compare with stored token or permit verified token)
  -- If token does not match, return empty to prevent unauthorized inspection
  IF v_booking.verification_token IS NOT NULL AND TRIM(v_booking.verification_token) <> '' THEN
    IF TRIM(v_booking.verification_token) <> TRIM(token_input) THEN
      RETURN;
    END IF;
  END IF;

  -- 3. Fetch lead journey segment
  SELECT * INTO v_lead_seg
  FROM public.journey_segments
  WHERE journey_segments.booking_id = v_booking.id
  ORDER BY journey_segments.segment_order ASC
  LIMIT 1;

  -- 4. Return sanitized public travel verification details
  RETURN QUERY SELECT
    v_booking.booking_reference,
    v_booking.customer_name,
    v_booking.service_type,
    v_booking.status::TEXT,
    v_booking.passengers,
    v_booking.created_at,
    COALESCE(v_lead_seg.pickup_location, 'Designated Pickup Location'),
    COALESCE(v_lead_seg.drop_location, 'Destination Location'),
    v_lead_seg.pickup_date::TEXT,
    v_lead_seg.pickup_time::TEXT,
    COALESCE(v_lead_seg.vehicle_type, 'Executive Sedan'),
    v_lead_seg.flight_number,
    v_lead_seg.hotel_name;
END;
$$;

-- Grant execution to anon and authenticated users
GRANT EXECUTE ON FUNCTION public.verify_booking(TEXT, TEXT) TO anon, authenticated;
