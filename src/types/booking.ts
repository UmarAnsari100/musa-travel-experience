export type AdminRole = 'super_admin' | 'operations_manager' | 'dispatch_agent';

export type BookingStatus = 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';

export type PaymentStatus = 'unpaid' | 'partial' | 'paid' | 'refunded';

export type WhatsAppDeliveryStatus = 'not_sent' | 'queued' | 'sent' | 'delivered' | 'read' | 'failed' | 'manual_sent';

export interface JourneySegment {
  id?: string;
  booking_id?: string;
  segment_order: number;
  pickup_location: string;
  drop_location: string;
  pickup_date: string;
  pickup_time: string;
  flight_number?: string;
  hotel_name?: string;
  vehicle_type: string;
  number_of_vehicles?: number;
  notes?: string;
}

export interface BookingDocument {
  id: string;
  booking_id: string;
  document_type: 'visa' | 'passport' | 'ticket' | 'other';
  file_name: string;
  file_path: string;
  file_size: number;
  mime_type: string;
  uploaded_by?: string;
  created_at: string;
}

export interface DocumentAuditLog {
  id: string;
  document_id: string;
  booking_id: string;
  action: 'view' | 'download' | 'share_whatsapp' | 'delete';
  performed_by: string;
  performed_by_name?: string;
  ip_address?: string;
  timestamp: string;
  details?: string;
}

export interface WhatsAppMessageLog {
  id: string;
  booking_id: string;
  recipient_phone: string;
  message_type: 'template' | 'custom' | 'manual';
  template_name?: string;
  meta_message_id?: string;
  status: WhatsAppDeliveryStatus;
  sent_at: string;
  delivered_at?: string;
  read_at?: string;
  error_message?: string;
  retry_count: number;
  is_manual_fallback?: boolean;
}

export interface Booking {
  id: string;
  booking_reference: string; // e.g. MT-2026-00125
  customer_name: string;
  customer_phone: string; // WhatsApp number with country code
  customer_email?: string;
  passengers: number;
  additional_passengers?: string[];
  service_type: string;
  status: BookingStatus;
  verification_token?: string; // Secure unguessable token for public QR verification
  total_price?: number;
  currency?: string;
  payment_status: PaymentStatus;
  special_instructions?: string;
  internal_notes?: string;
  source: 'website' | 'admin_manual' | 'whatsapp';
  is_international?: boolean;
  nationality?: string;
  visa_status?: 'not_required' | 'uploaded' | 'whatsapp' | 'pending';
  flight_number?: string;
  hotel_name?: string;
  created_at: string;
  updated_at: string;
  segments: JourneySegment[];
  documents?: BookingDocument[];
  whatsapp_logs?: WhatsAppMessageLog[];
  created_by?: string;
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: AdminRole;
  created_at: string;
}
