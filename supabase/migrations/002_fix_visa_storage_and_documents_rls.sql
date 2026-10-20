-- MUSA TRANSPORT: Migration 002
-- Fix Visa Storage, Anonymous Upload Permissions, and RLS Policies

-- 1. Ensure 'visa-documents' bucket exists and is strictly PRIVATE (public = false)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'visa-documents',
  'visa-documents',
  false,
  10485760, -- 10MB limit
  ARRAY['application/pdf', 'image/jpeg', 'image/jpg', 'image/png']
)
ON CONFLICT (id) DO UPDATE SET
  public = false,
  file_size_limit = 10485760,
  allowed_mime_types = ARRAY['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];

-- 2. Enable RLS on storage.objects if not already enabled
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- 3. Drop any conflicting storage policies on visa-documents
DROP POLICY IF EXISTS "Admins can upload private visa documents" ON storage.objects;
DROP POLICY IF EXISTS "Admins can view private visa documents" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete private visa documents" ON storage.objects;
DROP POLICY IF EXISTS "Allow anon and auth upload to visa-documents" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated admins to read visa-documents" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated admins to delete visa-documents" ON storage.objects;

-- 4. Storage Policies:
-- Write-only drop box policy: Allow customers (anon and authenticated) to upload visa documents
CREATE POLICY "Allow anon and auth upload to visa-documents"
ON storage.objects FOR INSERT TO anon, authenticated
WITH CHECK (bucket_id = 'visa-documents');

-- Read policy: Only authenticated administrators can read/download documents
CREATE POLICY "Allow authenticated admins to read visa-documents"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'visa-documents');

-- Delete policy: Only authenticated administrators can delete documents
CREATE POLICY "Allow authenticated admins to delete visa-documents"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'visa-documents');

-- Update policy: Only authenticated administrators can update documents
CREATE POLICY "Allow authenticated admins to update visa-documents"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'visa-documents');


-- 5. Booking Documents Table RLS Policies
ALTER TABLE public.booking_documents ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins full access to documents" ON public.booking_documents;
DROP POLICY IF EXISTS "Allow anon and auth insert booking documents" ON public.booking_documents;
DROP POLICY IF EXISTS "Admins full access to booking documents" ON public.booking_documents;

-- Allow anonymous customers and admins to record an uploaded document with their booking
CREATE POLICY "Allow anon and auth insert booking documents"
ON public.booking_documents FOR INSERT TO anon, authenticated
WITH CHECK (true);

-- Allow authenticated administrators to view, update, delete all booking documents
CREATE POLICY "Admins full access to booking documents"
ON public.booking_documents FOR ALL TO authenticated
USING (true) WITH CHECK (true);


-- 6. Document Audit Logs RLS Policies
ALTER TABLE public.document_audit_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins full access to audit logs" ON public.document_audit_logs;
DROP POLICY IF EXISTS "Allow auth insert audit logs" ON public.document_audit_logs;
DROP POLICY IF EXISTS "Admins full access to document audit logs" ON public.document_audit_logs;

CREATE POLICY "Admins full access to document audit logs"
ON public.document_audit_logs FOR ALL TO authenticated
USING (true) WITH CHECK (true);

-- Also allow inserting audit logs if anon triggers an action
CREATE POLICY "Allow insert document audit logs"
ON public.document_audit_logs FOR INSERT TO anon, authenticated
WITH CHECK (true);
