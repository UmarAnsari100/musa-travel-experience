import React, { useState, useEffect } from 'react';
import { Booking, BookingDocument } from '@/types/booking';
import { documentService } from '@/services/documentService';
import { useAdminAuth } from '@/context/AuthContext';
import {
  X,
  Download,
  FileText,
  AlertCircle,
  RefreshCw,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Lock,
  ExternalLink,
} from 'lucide-react';
import { toast } from 'react-hot-toast';

interface VisaPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  document: BookingDocument | null;
  booking?: Booking | null;
  onDownload?: (doc: BookingDocument) => void;
}

export const VisaPreviewModal: React.FC<VisaPreviewModalProps> = ({
  isOpen,
  onClose,
  document: doc,
  booking,
  onDownload,
}) => {
  if (!isOpen || !doc) return null;

  const { user } = useAdminAuth();
  const [signedUrl, setSignedUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);

  const isPdf =
    doc.mime_type === 'application/pdf' ||
    doc.file_name.toLowerCase().endsWith('.pdf');
  const isImage =
    doc.mime_type.startsWith('image/') ||
    /\.(jpg|jpeg|png|webp|avif)$/i.test(doc.file_name);

  useEffect(() => {
    let isMounted = true;
    const fetchUrl = async () => {
      setIsLoading(true);
      setError(null);
      setZoomLevel(1);

      try {
        const url = await documentService.getSecureSignedUrl(
          doc,
          'view',
          user?.id || 'admin',
          user?.name || 'Administrator'
        );

        if (isMounted) {
          setSignedUrl(url);
          setIsLoading(false);
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err.message || 'Failed to retrieve secure document access token.');
          setIsLoading(false);
        }
      }
    };

    fetchUrl();

    return () => {
      isMounted = false;
    };
  }, [doc.id, doc.file_path]);

  const handleDownloadClick = async () => {
    setIsDownloading(true);
    try {
      if (onDownload) {
        await onDownload(doc);
      } else {
        await documentService.downloadDocument(
          doc,
          user?.id || 'admin',
          user?.name || 'Administrator'
        );
      }
      toast.success(`Downloaded: ${doc.file_name}`);
    } catch (err: any) {
      toast.error('Download error: ' + err.message);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleRefresh = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const url = await documentService.getSecureSignedUrl(
        doc,
        'view',
        user?.id || 'admin',
        user?.name || 'Administrator'
      );
      setSignedUrl(url);
      toast.success('Signed access token refreshed.');
    } catch (err: any) {
      setError(err.message || 'Refresh failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl h-[92vh] flex flex-col bg-[#0B0D11] border border-[rgba(212,175,55,0.35)] rounded-2xl shadow-[0_25px_70px_rgba(0,0,0,0.95)] overflow-hidden font-body text-[#F8F5EC]">
        
        {/* Header Bar */}
        <div className="px-5 py-4 border-b border-[rgba(212,175,55,0.20)] bg-[#101217] flex items-center justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-[rgba(212,175,55,0.12)] text-[#D4AF37]">
                <FileText size={18} />
              </span>
              <h3 className="font-display font-bold text-base sm:text-lg text-[#F8F5EC] truncate">
                {doc.file_name}
              </h3>
              <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/30">
                {doc.document_type}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs text-[#A8A295] mt-1 pl-8">
              {booking && (
                <>
                  <span>
                    Pilgrim:{' '}
                    <strong className="text-[#F8F5EC]">{booking.customer_name}</strong>
                  </span>
                  <span>•</span>
                  <span>
                    Booking Ref:{' '}
                    <strong className="font-mono text-[#D4AF37]">{booking.booking_reference}</strong>
                  </span>
                  <span>•</span>
                </>
              )}
              <span>Size: {(doc.file_size / 1024).toFixed(1)} KB</span>
              <span>•</span>
              <span>Uploaded: {new Date(doc.created_at).toLocaleString()}</span>
            </div>
          </div>

          {/* Action Buttons & Close */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleDownloadClick}
              disabled={isDownloading}
              className="px-3.5 py-2 rounded-xl bg-[#D4AF37] hover:bg-[#e6c55f] text-black font-semibold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-md disabled:opacity-50"
              title="Download original document"
            >
              <Download size={14} />
              <span>{isDownloading ? 'Downloading...' : 'Download Visa'}</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-xl bg-[#171920] hover:bg-[#252834] text-[#B8B2A3] hover:text-[#F8F5EC] flex items-center justify-center transition-colors cursor-pointer border border-white/5"
              title="Close Preview"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Preview Viewport */}
        <div className="flex-1 bg-[#060709] relative flex flex-col items-center justify-center p-4 overflow-hidden">
          {isLoading && (
            <div className="flex flex-col items-center gap-3 text-center">
              <div className="w-10 h-10 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
              <p className="text-xs uppercase tracking-widest text-[#D4AF37] font-semibold">
                Retrieving Secure Document Stream...
              </p>
              <p className="text-[11px] text-[#7A756C]">
                Generating authorized 5-minute signed token from private vault
              </p>
            </div>
          )}

          {!isLoading && error && (
            <div className="max-w-md p-6 rounded-2xl bg-[#151214] border border-red-500/40 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-red-950/60 text-red-400 mx-auto flex items-center justify-center">
                <AlertCircle size={24} />
              </div>
              <div>
                <h4 className="font-semibold text-sm text-red-200">Unable to View Document</h4>
                <p className="text-xs text-[#B8B2A3] mt-1.5 leading-relaxed">{error}</p>
              </div>
              <button
                type="button"
                onClick={handleRefresh}
                className="px-4 py-2 rounded-xl bg-[#232732] hover:bg-[#2E3342] text-xs font-semibold text-[#F8F5EC] inline-flex items-center gap-2 transition-colors cursor-pointer border border-white/10"
              >
                <RefreshCw size={13} />
                <span>Retry Authorization</span>
              </button>
            </div>
          )}

          {!isLoading && !error && signedUrl && (
            <div className="w-full h-full flex items-center justify-center overflow-auto relative">
              {isImage ? (
                <div className="relative max-w-full max-h-full flex items-center justify-center p-2">
                  <img
                    src={signedUrl}
                    alt={doc.file_name}
                    style={{ transform: `scale(${zoomLevel})` }}
                    className="max-h-[75vh] max-w-full object-contain rounded-lg shadow-2xl transition-transform duration-150 border border-white/10 select-none"
                  />
                </div>
              ) : isPdf ? (
                <div className="w-full h-full flex flex-col">
                  <object
                    data={signedUrl}
                    type="application/pdf"
                    className="w-full h-full rounded-xl border border-white/10 bg-[#16181F]"
                  >
                    <div className="p-8 text-center text-xs text-[#B8B2A3] space-y-4">
                      <p>Your browser cannot inline-preview this PDF directly.</p>
                      <a
                        href={signedUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#D4AF37] text-black font-semibold"
                      >
                        <ExternalLink size={14} />
                        <span>Open PDF in New Window</span>
                      </a>
                    </div>
                  </object>
                </div>
              ) : (
                <div className="p-8 text-center text-xs text-[#B8B2A3] space-y-3">
                  <p>Document type ({doc.mime_type}) is ready for download.</p>
                  <button
                    type="button"
                    onClick={handleDownloadClick}
                    className="px-4 py-2.5 rounded-xl bg-[#D4AF37] text-black font-bold flex items-center gap-2 mx-auto"
                  >
                    <Download size={14} />
                    <span>Download File</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Bottom Control Bar */}
        <div className="px-5 py-3 border-t border-[rgba(212,175,55,0.20)] bg-[#101217] flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-[11px] text-[#A8A295]">
            <Lock size={12} className="text-[#D4AF37]" />
            <span>Private Vault Token: Valid for 5 minutes. Protected by Server RLS.</span>
          </div>

          <div className="flex items-center gap-2">
            {isImage && (
              <div className="flex items-center bg-[#171920] border border-white/10 rounded-lg p-0.5 mr-2">
                <button
                  type="button"
                  onClick={() => setZoomLevel((z) => Math.max(0.5, z - 0.25))}
                  className="p-1.5 text-[#B8B2A3] hover:text-[#F8F5EC] transition-colors"
                  title="Zoom Out"
                >
                  <ZoomOut size={13} />
                </button>
                <span className="text-[10px] px-2 text-[#D4AF37] font-mono">
                  {Math.round(zoomLevel * 100)}%
                </span>
                <button
                  type="button"
                  onClick={() => setZoomLevel((z) => Math.min(3, z + 0.25))}
                  className="p-1.5 text-[#B8B2A3] hover:text-[#F8F5EC] transition-colors"
                  title="Zoom In"
                >
                  <ZoomIn size={13} />
                </button>
                <button
                  type="button"
                  onClick={() => setZoomLevel(1)}
                  className="p-1.5 text-[#B8B2A3] hover:text-[#F8F5EC] transition-colors"
                  title="Reset Zoom"
                >
                  <Maximize2 size={13} />
                </button>
              </div>
            )}

            <button
              type="button"
              onClick={handleRefresh}
              className="px-3 py-1.5 rounded-lg bg-[#171920] hover:bg-[#252834] text-[#B8B2A3] hover:text-[#F8F5EC] flex items-center gap-1.5 transition-colors border border-white/5 cursor-pointer"
            >
              <RefreshCw size={12} />
              <span>Refresh Token</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg bg-[#252834] hover:bg-[#323646] text-[#F8F5EC] font-medium transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
