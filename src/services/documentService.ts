import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { BookingDocument, DocumentAuditLog } from '@/types/booking';

const ALLOWED_MIME_TYPES = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
const ALLOWED_EXTENSIONS = ['.pdf', '.jpg', '.jpeg', '.png'];
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

const LOCAL_DOCS_STORE_KEY = 'musa_transport_private_docs';
const LOCAL_AUDIT_STORE_KEY = 'musa_transport_doc_audit_logs';

const isUuid = (str?: string): boolean => {
  if (!str) return false;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);
};

const fileToDataUrl = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
};

export const documentService = {
  validateFile(file: File): { valid: boolean; error?: string } {
    if (!file) {
      return { valid: false, error: 'No file provided.' };
    }

    const ext = file.name.slice(file.name.lastIndexOf('.')).toLowerCase();
    const mime = file.type ? file.type.toLowerCase() : '';

    const mimeValid = ALLOWED_MIME_TYPES.includes(mime);
    const extValid = ALLOWED_EXTENSIONS.includes(ext);

    if (!mimeValid && !extValid) {
      return {
        valid: false,
        error: 'Invalid file format. Only PDF, JPG, JPEG, and PNG files are accepted.',
      };
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      return {
        valid: false,
        error: `File size (${(file.size / (1024 * 1024)).toFixed(1)} MB) exceeds maximum allowed limit of 10 MB.`,
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
      // 1. Upload to private Supabase Storage bucket 'visa-documents'
      const { error: uploadError } = await supabase.storage
        .from('visa-documents')
        .upload(storagePath, file, {
          contentType: file.type || 'application/octet-stream',
          upsert: false,
        });

      if (uploadError) {
        console.error('[documentService] Supabase Storage upload error:', uploadError);
        throw new Error(`Failed to upload document to secure storage: ${uploadError.message}`);
      }

      // 2. Insert metadata into booking_documents table
      const { data: docRecord, error: dbError } = await supabase
        .from('booking_documents')
        .insert({
          booking_id: bookingId,
          document_type: documentType,
          file_name: file.name,
          file_path: storagePath,
          file_size: file.size,
          mime_type: file.type || 'application/octet-stream',
          uploaded_by: isUuid(uploadedBy) ? uploadedBy : null,
        })
        .select()
        .single();

      if (dbError) {
        console.error('[documentService] Database insert error for document metadata:', dbError);
        // Clean up uploaded orphaned file to maintain zero-garbage policy
        await supabase.storage.from('visa-documents').remove([storagePath]);
        throw new Error(`Failed to record document metadata in database: ${dbError.message}`);
      }

      // 3. Update booking visa_status to 'uploaded'
      await supabase
        .from('bookings')
        .update({ visa_status: 'uploaded', updated_at: new Date().toISOString() })
        .eq('id', bookingId);

      return docRecord as BookingDocument;
    }

    // Offline / Local Vault Fallback (reads file as base64 data URL so preview & download persist reliably)
    let persistentDataUrl = '';
    try {
      persistentDataUrl = await fileToDataUrl(file);
    } catch {
      persistentDataUrl = '';
    }

    const localDoc: BookingDocument = {
      id: 'doc-' + Date.now(),
      booking_id: bookingId,
      document_type: documentType,
      file_name: file.name,
      file_path: persistentDataUrl || storagePath,
      file_size: file.size,
      mime_type: file.type || 'image/jpeg',
      uploaded_by: uploadedBy,
      created_at: new Date().toISOString(),
    };

    const stored: BookingDocument[] = JSON.parse(localStorage.getItem(LOCAL_DOCS_STORE_KEY) || '[]');
    stored.unshift(localDoc);
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
      details: `Generated 5-minute signed access token for document: ${doc.file_name} (${action})`,
    });

    // If already a data URL (offline mode) or full HTTP URL, return directly
    if (doc.file_path.startsWith('data:') || doc.file_path.startsWith('http://') || doc.file_path.startsWith('https://')) {
      return doc.file_path;
    }

    // 2. Generate 5-Minute Time-Limited Signed URL from Supabase
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase.storage
        .from('visa-documents')
        .createSignedUrl(doc.file_path, 300); // 300 seconds = 5 minutes expiry

      if (error) {
        console.error('[documentService] Supabase signed URL error:', error);
        throw new Error(`Failed to generate secure URL: ${error.message}`);
      }

      if (!data?.signedUrl) {
        throw new Error('Signed URL was not returned by storage service.');
      }

      return data.signedUrl;
    }

    // Fallback: check localStorage for saved base64 version
    const stored: BookingDocument[] = JSON.parse(localStorage.getItem(LOCAL_DOCS_STORE_KEY) || '[]');
    const match = stored.find((d) => d.id === doc.id || d.file_path === doc.file_path);
    if (match && match.file_path.startsWith('data:')) {
      return match.file_path;
    }

    return doc.file_path;
  },

  async downloadDocument(
    doc: BookingDocument,
    adminId: string,
    adminName: string
  ): Promise<void> {
    const url = await this.getSecureSignedUrl(doc, 'download', adminId, adminName);

    try {
      if (url.startsWith('data:')) {
        // Direct download for Data URLs
        const a = document.createElement('a');
        a.href = url;
        a.download = doc.file_name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        return;
      }

      // Fetch as blob to ensure cross-origin downloads retain the original file name and open correctly
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Server returned HTTP ${response.status} when downloading file.`);
      }

      const blob = await response.blob();
      const objectUrl = window.URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = objectUrl;
      a.download = doc.file_name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      setTimeout(() => {
        window.URL.revokeObjectURL(objectUrl);
      }, 1000);
    } catch (err: any) {
      console.error('[documentService] Download execution error:', err);
      // Fallback: try direct window navigation if blob fetch was blocked
      const fallbackA = document.createElement('a');
      fallbackA.href = url;
      fallbackA.download = doc.file_name;
      fallbackA.target = '_blank';
      fallbackA.rel = 'noreferrer';
      document.body.appendChild(fallbackA);
      fallbackA.click();
      document.body.removeChild(fallbackA);
    }
  },

  async fetchDocuments(bookingId: string): Promise<BookingDocument[]> {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('booking_documents')
          .select('*')
          .eq('booking_id', bookingId)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('[documentService] Supabase fetchDocuments error:', error);
          throw error;
        }

        if (data && data.length > 0) {
          return data as BookingDocument[];
        }
      } catch (err) {
        console.warn('[documentService] Fetch documents error, checking local store:', err);
      }
    }

    const stored: BookingDocument[] = JSON.parse(localStorage.getItem(LOCAL_DOCS_STORE_KEY) || '[]');
    return stored.filter((d) => d.booking_id === bookingId);
  },

  async fetchAllDocuments(): Promise<BookingDocument[]> {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('booking_documents')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('[documentService] Supabase fetchAllDocuments error:', error);
          throw error;
        }

        if (data && data.length > 0) {
          return data as BookingDocument[];
        }
      } catch (err) {
        console.warn('[documentService] Fetch all documents error, falling back to local vault:', err);
      }
    }

    const stored: BookingDocument[] = JSON.parse(localStorage.getItem(LOCAL_DOCS_STORE_KEY) || '[]');
    return stored;
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
        console.error('[documentService] Delete document error:', err);
        throw err;
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
          document_id: isUuid(log.document_id) ? log.document_id : null,
          booking_id: isUuid(log.booking_id) ? log.booking_id : null,
          action: log.action,
          performed_by: isUuid(log.performed_by) ? log.performed_by : null,
          performed_by_name: log.performed_by_name || 'Administrator',
          details: log.details || '',
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
        if (bookingId && isUuid(bookingId)) {
          query = query.eq('booking_id', bookingId);
        }
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
