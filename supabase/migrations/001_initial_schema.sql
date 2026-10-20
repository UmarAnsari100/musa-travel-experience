-- MUSA TRANSPORT Umrah Transportation System Schema
-- Initial Migration: Schema, RLS, Sequences, Storage

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. SEQUENCES FOR UNIQUE COLLISION-FREE BOOKING REFERENCES
CREATE SEQUENCE IF NOT EXISTS booking_ref_seq START WITH 101;

CREATE OR REPLACE FUNCTION generate_booking_reference() 
RETURNS TEXT AS $$
DECLARE
  current_year TEXT;
  seq_num TEXT;
BEGIN
  current_year := TO_CHAR(CURRENT_DATE, 'YYYY');
  seq_num := LPAD(NEXTVAL('booking_ref_seq')::TEXT, 5, '0');
  RETURN 'MT-' || current_year || '-' || seq_num;
END;
$$ LANGUAGE plpgsql;

-- 3. PROFILES & ROLES
CREATE TYPE admin_role AS ENUM ('super_admin', 'operations_manager', 'dispatch_agent');

CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  role admin_role NOT NULL DEFAULT 'dispatch_agent',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. BOOKINGS TABLE
CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled');
CREATE TYPE payment_status AS ENUM ('unpaid', 'partial', 'paid', 'refunded');

CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_reference TEXT UNIQUE NOT NULL DEFAULT generate_booking_reference(),
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT,
  passengers INTEGER NOT NULL DEFAULT 1,
  additional_passengers TEXT[] DEFAULT '{}',
  service_type TEXT NOT NULL DEFAULT 'Hajj & Umrah Transfers',
  status booking_status NOT NULL DEFAULT 'pending',
  total_price NUMERIC(10, 2),
  currency TEXT DEFAULT 'SAR',
  payment_status payment_status NOT NULL DEFAULT 'unpaid',
  special_instructions TEXT,
  internal_notes TEXT,
  source TEXT NOT NULL DEFAULT 'website', -- website | admin_manual | whatsapp
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. JOURNEY SEGMENTS TABLE (Multi-Leg Journey Support)
CREATE TABLE IF NOT EXISTS public.journey_segments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  segment_order INTEGER NOT NULL DEFAULT 1,
  pickup_location TEXT NOT NULL,
  drop_location TEXT NOT NULL,
  pickup_date DATE NOT NULL,
  pickup_time TIME NOT NULL,
  flight_number TEXT,
  hotel_name TEXT,
  vehicle_type TEXT NOT NULL,
  number_of_vehicles INTEGER DEFAULT 1,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. PRIVATE VISA & PASSPORT DOCUMENTS TABLE
CREATE TABLE IF NOT EXISTS public.booking_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  document_type TEXT NOT NULL DEFAULT 'visa', -- visa | passport | ticket | other
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL, -- Private path in Supabase Storage bucket 'visa-documents'
  file_size BIGINT NOT NULL,
  mime_type TEXT NOT NULL,
  uploaded_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. DOCUMENT AUDIT LOGS TABLE
CREATE TABLE IF NOT EXISTS public.document_audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  document_id UUID REFERENCES public.booking_documents(id) ON DELETE SET NULL,
  booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE,
  action TEXT NOT NULL, -- view | download | share_whatsapp | delete
  performed_by UUID REFERENCES public.profiles(id),
  performed_by_name TEXT,
  ip_address TEXT,
  details TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. WHATSAPP MESSAGE LOGS TABLE
CREATE TABLE IF NOT EXISTS public.whatsapp_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  recipient_phone TEXT NOT NULL,
  message_type TEXT NOT NULL DEFAULT 'template', -- template | custom | manual
  template_name TEXT,
  meta_message_id TEXT,
  status TEXT NOT NULL DEFAULT 'queued', -- queued | sent | delivered | read | failed | manual_sent
  sent_at TIMESTAMPTZ DEFAULT NOW(),
  delivered_at TIMESTAMPTZ,
  read_at TIMESTAMPTZ,
  error_message TEXT,
  retry_count INTEGER DEFAULT 0,
  is_manual_fallback BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_bookings_reference ON public.bookings(booking_reference);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_phone ON public.bookings(customer_phone);
CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON public.bookings(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_journey_segments_booking ON public.journey_segments(booking_id);
CREATE INDEX IF NOT EXISTS idx_journey_segments_date ON public.journey_segments(pickup_date);
CREATE INDEX IF NOT EXISTS idx_booking_documents_booking ON public.booking_documents(booking_id);
CREATE INDEX IF NOT EXISTS idx_whatsapp_messages_booking ON public.whatsapp_messages(booking_id);
CREATE INDEX IF NOT EXISTS idx_whatsapp_messages_meta_id ON public.whatsapp_messages(meta_message_id);

-- 10. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.journey_segments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.whatsapp_messages ENABLE ROW LEVEL SECURITY;

-- Allow public website to INSERT new bookings without being authenticated:
CREATE POLICY "Public can insert bookings" ON public.bookings
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

-- Allow public website to insert corresponding journey segments:
CREATE POLICY "Public can insert journey segments" ON public.journey_segments
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

-- Allow authenticated administrators full SELECT/INSERT/UPDATE/DELETE access:
CREATE POLICY "Admins full access to profiles" ON public.profiles
  FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

CREATE POLICY "Admins full access to bookings" ON public.bookings
  FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

CREATE POLICY "Admins full access to journey segments" ON public.journey_segments
  FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

CREATE POLICY "Admins full access to documents" ON public.booking_documents
  FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

CREATE POLICY "Admins full access to audit logs" ON public.document_audit_logs
  FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

CREATE POLICY "Admins full access to whatsapp messages" ON public.whatsapp_messages
  FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

-- 11. STORAGE BUCKET CONFIGURATION FOR PRIVATE VISA DOCUMENTS
-- Note: Create 'visa-documents' bucket as PRIVATE (public = false)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('visa-documents', 'visa-documents', false)
ON CONFLICT (id) DO UPDATE SET public = false;

-- Storage RLS: Only authenticated admins can upload/read visa documents
CREATE POLICY "Admins can upload private visa documents"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'visa-documents');

CREATE POLICY "Admins can view private visa documents"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'visa-documents');

CREATE POLICY "Admins can delete private visa documents"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'visa-documents');
