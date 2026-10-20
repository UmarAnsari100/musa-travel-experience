import React, { useState, useEffect } from 'react';
import { Booking, BookingDocument, DocumentAuditLog } from '@/types/booking';
import { documentService } from '@/services/documentService';
import { useAdminAuth } from '@/context/AuthContext';
import { X, Upload, FileText, Eye, Download, Trash2, Shield, Lock, AlertCircle, Share2, History } from 'lucide-react';
import { toast } from 'react-hot-toast';

import { VisaPreviewModal } from '@/components/admin/VisaPreviewModal';

interface VisaManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: Booking | null;
}

export const VisaManagerModal: React.FC<VisaManagerModalProps> = ({ isOpen, onClose, booking }) => {
  if (!isOpen || !booking) return null;

  const { user } = useAdminAuth();
  const [documents, setDocuments] = useState<BookingDocument[]>([]);
  const [auditLogs, setAuditLogs] = useState<DocumentAuditLog[]>([]);
  const [activeTab, setActiveTab] = useState<'documents' | 'audit'>('documents');
  const [isUploading, setIsUploading] = useState(false);
  const [docType, setDocType] = useState<'visa' | 'passport' | 'ticket' | 'other'>('visa');
  const [previewDoc, setPreviewDoc] = useState<BookingDocument | null>(null);

  useEffect(() => {
    loadDocs();
  }, [booking.id]);

  const loadDocs = async () => {
    const docs = await documentService.fetchDocuments(booking.id);
    const audits = await documentService.fetchAuditLogs(booking.id);
    setDocuments(docs);
    setAuditLogs(audits);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      await documentService.uploadDocument(booking.id, file, docType, user?.id);
      toast.success(`Securely uploaded ${docType.toUpperCase()}: ${file.name}`);
      await loadDocs();
    } catch (err: any) {
      toast.error(err.message || 'Failed to upload document');
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  const handleView = (doc: BookingDocument) => {
    setPreviewDoc(doc);
  };

  const handleDownload = async (doc: BookingDocument) => {
    try {
      await documentService.downloadDocument(
        doc,
        user?.id || 'admin',
        user?.name || 'Administrator'
      );
      toast.success(`Downloaded: ${doc.file_name}`);
      await loadDocs();
    } catch (err: any) {
      toast.error('Download error: ' + err.message);
    }
  };

  const handleDelete = async (doc: BookingDocument) => {
    if (!window.confirm(`Are you sure you want to securely delete ${doc.file_name}?`)) return;

    try {
      await documentService.deleteDocument(doc, user?.id || 'admin', user?.name || 'Administrator');
      toast.success('Document deleted and logged in audit trail.');
      await loadDocs();
    } catch (err: any) {
      toast.error('Deletion error: ' + err.message);
    }
  };

  const handleAuthorizedShareWhatsApp = async (doc: BookingDocument) => {
    if (!window.confirm(`Explicit Authorization Required: Are you sure you want to share visa document (${doc.file_name}) via WhatsApp to +${booking.customer_phone}?`)) {
      return;
    }

    try {
      const signedUrl = await documentService.getSecureSignedUrl(
        doc,
        'share_whatsapp',
        user?.id || 'admin',
        user?.name || 'Administrator'
      );

      const msg = encodeURIComponent(
        `*MUSA TRANSPORT — Authorized Travel Document*\n\n` +
        `Assalamu Alaikum, ${booking.customer_name}.\n\n` +
        `Your authorized travel document (*${doc.file_name}*) has been prepared by dispatch.\n\n` +
        `🔒 Secure Document Link (Valid for 5 minutes):\n${signedUrl}\n\n` +
        `Booking Ref: ${booking.booking_reference}`
      );

      window.open(`https://wa.me/${booking.customer_phone.replace(/[^0-9]/g, '')}?text=${msg}`, '_blank');
      toast.success('Authorized WhatsApp document share logged.');
      await loadDocs();
    } catch (err: any) {
      toast.error('Share error: ' + err.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl max-h-[92vh] flex flex-col bg-[#0D0E10] border border-[rgba(201,162,39,0.35)] rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.9)] overflow-hidden font-body text-[#F8F5EC]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[rgba(74,57,28,0.30)] bg-[#111317]">
          <div>
            <h2 className="font-display text-lg font-bold text-[#F8F5EC] flex items-center gap-2">
              <Lock size={18} className="text-[#D4AF37]" />
              <span>Private Visa & Passport Vault</span>
              <span className="text-xs px-2.5 py-0.5 rounded bg-[rgba(212,175,55,0.15)] text-[#D4AF37] font-mono">
                {booking.booking_reference}
              </span>
            </h2>
            <p className="text-xs text-[#B8B2A3]">
              Private cloud storage with strict server-enforced RLS, time-limited access tokens, and audit logging.
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-[#181A1F] text-[#B8B2A3] hover:text-[#F8F5EC] flex items-center justify-center transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab Controls */}
        <div className="flex border-b border-[rgba(74,57,28,0.25)] px-6 bg-[#0E1013]">
          <button
            onClick={() => setActiveTab('documents')}
            className={`py-3 px-4 text-xs font-semibold uppercase tracking-wider border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'documents'
                ? 'border-[#D4AF37] text-[#D4AF37]'
                : 'border-transparent text-[#B8B2A3] hover:text-[#F8F5EC]'
            }`}
          >
            <FileText size={14} />
            <span>Encrypted Documents ({documents.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`py-3 px-4 text-xs font-semibold uppercase tracking-wider border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'audit'
                ? 'border-[#D4AF37] text-[#D4AF37]'
                : 'border-transparent text-[#B8B2A3] hover:text-[#F8F5EC]'
            }`}
          >
            <History size={14} />
            <span>Audit Trail Log ({auditLogs.length})</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {activeTab === 'documents' ? (
            <>
              {/* Security Banner */}
              <div className="p-3.5 rounded-xl bg-[rgba(212,175,55,0.06)] border border-[rgba(212,175,55,0.25)] flex items-start gap-3 text-xs text-[#E5DFC8]">
                <Shield size={18} className="text-[#D4AF37] shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold block mb-0.5">Strict Confidentiality Guard</span>
                  <span>
                    Visa copies and passport scans are restricted to authorized personnel. Files are stored in private cloud buckets with zero public access. Access URLs expire automatically after 5 minutes.
                  </span>
                </div>
              </div>

              {/* Upload Box */}
              <div className="p-4 rounded-xl bg-[#14161A] border border-[rgba(74,57,28,0.30)] flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <select
                    value={docType}
                    onChange={(e: any) => setDocType(e.target.value)}
                    className="bg-[#0D0E10] border border-[rgba(74,57,28,0.35)] text-xs text-[#F8F5EC] rounded-lg px-3 py-2 outline-none"
                  >
                    <option value="visa">Umrah Visa Copy</option>
                    <option value="passport">Passport Scan</option>
                    <option value="ticket">Flight Ticket / Permit</option>
                    <option value="other">Other Document</option>
                  </select>
                  <span className="text-[11px] text-[#7A756C]">PDF, JPG, JPEG, PNG (Max 10 MB)</span>
                </div>

                <label className="w-full sm:w-auto px-4 py-2 rounded-xl bg-[#D4AF37] text-[#050505] font-semibold text-xs flex items-center justify-center gap-2 cursor-pointer hover:bg-[#e0bc46] transition-colors">
                  <Upload size={14} />
                  <span>{isUploading ? 'Encrypting & Uploading...' : 'Upload Private Document'}</span>
                  <input
                    type="file"
                    className="hidden"
                    accept=".pdf,.jpg,.jpeg,.png"
                    disabled={isUploading}
                    onChange={handleFileUpload}
                  />
                </label>
              </div>

              {/* Document List */}
              <div className="space-y-2">
                <span className="block text-xs uppercase tracking-wider text-[#B8B2A3] font-semibold">
                  Vault Files ({documents.length})
                </span>

                {documents.length === 0 ? (
                  <div className="p-8 text-center bg-[#14161A] rounded-xl border border-[rgba(74,57,28,0.20)] text-xs text-[#7A756C]">
                    No visa or passport documents uploaded for this booking yet.
                  </div>
                ) : (
                  documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="p-3.5 rounded-xl bg-[#14161A] border border-[rgba(74,57,28,0.25)] flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-lg bg-[rgba(212,175,55,0.12)] border border-[rgba(212,175,55,0.30)] flex items-center justify-center text-[#D4AF37] shrink-0">
                          <FileText size={18} />
                        </div>
                        <div className="min-w-0">
                          <span className="text-xs font-semibold text-[#F8F5EC] block truncate">
                            {doc.file_name}
                          </span>
                          <span className="text-[10px] text-[#7A756C] block">
                            <span className="uppercase font-bold text-[#D4AF37]">{doc.document_type}</span> •{' '}
                            {(doc.file_size / 1024).toFixed(1)} KB • {new Date(doc.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => handleView(doc)}
                          title="Generate 5-min signed view token"
                          className="px-2.5 py-1.5 rounded bg-[#181A1F] border border-[rgba(74,57,28,0.35)] text-xs text-[#F8F5EC] hover:bg-[#252830] flex items-center gap-1 transition-colors"
                        >
                          <Eye size={12} />
                          <span>View</span>
                        </button>
                        <button
                          onClick={() => handleDownload(doc)}
                          title="Download with audit logging"
                          className="px-2.5 py-1.5 rounded bg-[#181A1F] border border-[rgba(74,57,28,0.35)] text-xs text-[#F8F5EC] hover:bg-[#252830] flex items-center gap-1 transition-colors"
                        >
                          <Download size={12} />
                          <span>Download</span>
                        </button>
                        <button
                          onClick={() => handleAuthorizedShareWhatsApp(doc)}
                          title="Explicit WhatsApp sharing with customer"
                          className="px-2.5 py-1.5 rounded bg-[#25D366]/20 border border-[#25D366]/40 text-xs text-[#25D366] hover:bg-[#25D366]/30 flex items-center gap-1 transition-colors"
                        >
                          <Share2 size={12} />
                          <span>WhatsApp Share</span>
                        </button>
                        <button
                          onClick={() => handleDelete(doc)}
                          title="Secure delete"
                          className="p-1.5 rounded text-red-400 hover:text-red-300 hover:bg-red-950/40 transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </>
          ) : (
            /* Audit Log View */
            <div className="space-y-2">
              <span className="block text-xs uppercase tracking-wider text-[#B8B2A3] font-semibold mb-2">
                Security Audit Trail ({auditLogs.length} Events)
              </span>

              {auditLogs.length === 0 ? (
                <div className="p-8 text-center bg-[#14161A] rounded-xl text-xs text-[#7A756C]">
                  No audit events recorded yet.
                </div>
              ) : (
                auditLogs.map((log) => (
                  <div
                    key={log.id}
                    className="p-3 rounded-xl bg-[#14161A] border border-[rgba(74,57,28,0.20)] flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="uppercase text-[10px] font-bold px-2 py-0.5 rounded bg-[rgba(212,175,55,0.15)] text-[#D4AF37]">
                          {log.action.replace('_', ' ')}
                        </span>
                        <span className="text-[#F8F5EC] font-semibold">{log.performed_by_name || 'Admin'}</span>
                      </div>
                      <p className="text-[11px] text-[#7A756C] mt-1">{log.details}</p>
                    </div>
                    <span className="text-[10px] text-[#6F6A60] shrink-0">
                      {new Date(log.timestamp).toLocaleString()}
                    </span>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[rgba(74,57,28,0.30)] bg-[#111317] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#181A1F] border border-[rgba(74,57,28,0.35)] text-xs text-[#F8F5EC] hover:bg-[#252830] transition-colors"
          >
            Close Vault
          </button>
        </div>
      </div>

      {/* In-App Visa Preview Modal */}
      <VisaPreviewModal
        isOpen={Boolean(previewDoc)}
        onClose={() => setPreviewDoc(null)}
        document={previewDoc}
        booking={booking}
        onDownload={handleDownload}
      />
    </div>
  );
};
