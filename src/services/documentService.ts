import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { BookingDocument, DocumentAuditLog } from '@/types/booking';

const ALLOWED_MIME_TYPES = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

const LOCAL_DOCS_STORE_KEY = 'musa_transport_private_docs';
const LOCAL_AUDIT_STORE_KEY = 'musa_transport_doc_audit_logs';

export const documentService = {
  validateFile(file: File): { valid: boolean; error?: string } {
    if (!ALLOWED_MIME_TYPES.includes(file.type.toLowerCase())) {
      return {
        valid: false,
        error: 'Invalid file format. Only PDF, JPG, JPEG, and PNG files are accepted.',
      };
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      return {
        valid: false,
        error: 'File size exceeds maximum allowed limit of 10 MB.',
      };
    }

    return { valid: true };
  },

  async uploadDocument(
    bookingId: string,
    file: File,
    documentType: 'visa' | 'passport' | 'ticket' | 'other' = 'visa',
    uploadedBy?: string
  ): Promise<BookingDocument> {
    const validation = this.validateFile(file);
    if (!validation.valid) {
      throw new Error(validation.error);
    }

    const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const storagePath = `${bookingId}/${Date.now()}_${sanitizedFileName}`;

    if (isSupabaseConfigured()) {
      try {
        // Upload to private bucket 'visa-documents'
        const { error: uploadError } = await supabase.storage
          .from('visa-documents')
          .upload(storagePath, file, {
            contentType: file.type,
            upsert: false,
          });

        if (uploadError) throw uploadError;

        // Insert metadata in database
        const { data: docRecord, error: dbError } = await supabase
          .from('booking_documents')
          .insert({
            booking_id: bookingId,
            document_type: documentType,
            file_name: file.name,
            file_path: storagePath,
            file_size: file.size,
            mime_type: file.type,
            uploaded_by: uploadedBy || null,
          })
          .select()
          .single();

        if (dbError) throw dbError;

        return docRecord as BookingDocument;
      } catch (err) {
        console.warn('[documentService] Supabase upload failed, using local vault:', err);
      }
    }

    // Local / Offline fallback with simulated object URL
    const localDoc: BookingDocument = {
      id: 'doc-' + Date.now(),
      booking_id: bookingId,
      document_type: documentType,
      file_name: file.name,
      file_path: URL.createObjectURL(file), // Local blob representation
      file_size: file.size,
      mime_type: file.type,
      uploaded_by: uploadedBy,
      created_at: new Date().toISOString(),
    };

    const stored: BookingDocument[] = JSON.parse(localStorage.getItem(LOCAL_DOCS_STORE_KEY) || '[]');
    stored.push(localDoc);
    localStorage.setItem(LOCAL_DOCS_STORE_KEY, JSON.stringify(stored));

    return localDoc;
  },

  async getSecureSignedUrl(
    doc: BookingDocument,
    action: 'view' | 'download' | 'share_whatsapp',
    adminId: string,
    adminName: string
  ): Promise<string> {
    // 1. Audit Log Entry
    await this.logAudit({
      document_id: doc.id,
      booking_id: doc.booking_id,
      action,
      performed_by: adminId,
      performed_by_name: adminName,
      details: `Generated 5-minute signed access token for document: ${doc.file_name}`,
    });

    // 2. Generate 5-Minute Time-Limited Signed URL from Supabase
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase.storage
          .from('visa-documents')
          .createSignedUrl(doc.file_path, 300); // 300 seconds = 5 minutes expiry

        if (error) throw error;
        return data.signedUrl;
      } catch (err) {
        console.warn('[documentService] Signed URL generation error:', err);
      }
    }

    return doc.file_path; // Local object URL
  },

  async fetchDocuments(bookingId: string): Promise<BookingDocument[]> {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('booking_documents')
          .select('*')
          .eq('booking_id', bookingId)
          .order('created_at', { ascending: false });

        if (!error && data) {
          return data as BookingDocument[];
        }
      } catch (err) {
        console.warn('[documentService] Fetch documents error:', err);
      }
    }

    const stored: BookingDocument[] = JSON.parse(localStorage.getItem(LOCAL_DOCS_STORE_KEY) || '[]');
    return stored.filter((d) => d.booking_id === bookingId);
  },

  async deleteDocument(doc: BookingDocument, adminId: string, adminName: string): Promise<void> {
    await this.logAudit({
      document_id: doc.id,
      booking_id: doc.booking_id,
      action: 'delete',
      performed_by: adminId,
      performed_by_name: adminName,
      details: `Securely deleted document: ${doc.file_name}`,
    });

    if (isSupabaseConfigured()) {
      try {
        await supabase.storage.from('visa-documents').remove([doc.file_path]);
        await supabase.from('booking_documents').delete().eq('id', doc.id);
        return;
      } catch (err) {
        console.warn('[documentService] Delete document error:', err);
      }
    }

    const stored: BookingDocument[] = JSON.parse(localStorage.getItem(LOCAL_DOCS_STORE_KEY) || '[]');
    const filtered = stored.filter((d) => d.id !== doc.id);
    localStorage.setItem(LOCAL_DOCS_STORE_KEY, JSON.stringify(filtered));
  },

  async logAudit(log: Omit<DocumentAuditLog, 'id' | 'timestamp'>): Promise<void> {
    const auditRecord: DocumentAuditLog = {
      ...log,
      id: 'audit-' + Date.now(),
      timestamp: new Date().toISOString(),
    };

    if (isSupabaseConfigured()) {
      try {
        await supabase.from('document_audit_logs').insert({
          document_id: log.document_id,
          booking_id: log.booking_id,
          action: log.action,
          performed_by: log.performed_by,
          performed_by_name: log.performed_by_name,
          details: log.details,
        });
        return;
      } catch (err) {
        console.warn('[documentService] Audit log DB write error:', err);
      }
    }

    const stored: DocumentAuditLog[] = JSON.parse(localStorage.getItem(LOCAL_AUDIT_STORE_KEY) || '[]');
    stored.unshift(auditRecord);
    localStorage.setItem(LOCAL_AUDIT_STORE_KEY, JSON.stringify(stored));
  },

  async fetchAuditLogs(bookingId?: string): Promise<DocumentAuditLog[]> {
    if (isSupabaseConfigured()) {
      try {
        let query = supabase.from('document_audit_logs').select('*').order('created_at', { ascending: false });
        if (bookingId) query = query.eq('booking_id', bookingId);
        const { data, error } = await query;
        if (!error && data) return data as DocumentAuditLog[];
      } catch (err) {
        console.warn('[documentService] Fetch audit logs error:', err);
      }
    }

    const stored: DocumentAuditLog[] = JSON.parse(localStorage.getItem(LOCAL_AUDIT_STORE_KEY) || '[]');
    if (bookingId) {
      return stored.filter((l) => l.booking_id === bookingId);
    }
    return stored;
  },
};
