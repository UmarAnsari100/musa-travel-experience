import React, { useState } from 'react';
import { Booking } from '@/types/booking';
import { whatsappService, buildUmrahConfirmationMessage } from '@/services/whatsappService';
import { X, Send, ExternalLink, CheckCircle2, Clock, AlertTriangle, ShieldCheck, RefreshCw } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface WhatsAppDispatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: Booking | null;
  onSuccess: () => void;
}

export const WhatsAppDispatchModal: React.FC<WhatsAppDispatchModalProps> = ({
  isOpen,
  onClose,
  booking,
  onSuccess,
}) => {
  if (!isOpen || !booking) return null;

  const [isSendingCloud, setIsSendingCloud] = useState(false);
  const [includeVoucher, setIncludeVoucher] = useState(true);

  const messageText = buildUmrahConfirmationMessage(booking);
  const existingLogs = booking.whatsapp_logs || [];
  const latestLog = existingLogs[existingLogs.length - 1];
  const isAlreadySent = latestLog && (latestLog.status === 'sent' || latestLog.status === 'delivered' || latestLog.status === 'read');

  const handleCloudSend = async () => {
    setIsSendingCloud(true);
    try {
      const result = await whatsappService.sendCloudAPIConfirmation(booking);

      if (result.success) {
        toast.success(`WhatsApp confirmation dispatched to +${booking.customer_phone}`);
        onSuccess();
        onClose();
      } else {
        toast.error(result.error || 'Cloud API send failed. Please use Manual Dispatch fallback.');
      }
    } catch (err: any) {
      toast.error('Dispatch error: ' + err.message);
    } finally {
      setIsSendingCloud(false);
    }
  };

  const handleManualSend = () => {
    whatsappService.sendManualWhatsApp(booking);
    toast.success('Opened in WhatsApp with pre-formatted confirmation message.');
    onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl max-h-[92vh] flex flex-col bg-[#0D0E10] border border-[rgba(201,162,39,0.35)] rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.9)] overflow-hidden font-body text-[#F8F5EC]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[rgba(74,57,28,0.30)] bg-[#111317]">
          <div>
            <h2 className="font-display text-lg font-bold text-[#F8F5EC] flex items-center gap-2">
              <Send size={18} className="text-[#25D366]" />
              <span>WhatsApp Confirmation Dispatch</span>
            </h2>
            <p className="text-xs text-[#B8B2A3]">
              Send official Umrah booking confirmation directly to customer WhatsApp: +{booking.customer_phone}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-[#181A1F] text-[#B8B2A3] hover:text-[#F8F5EC] flex items-center justify-center transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Duplicate Prevention Notice */}
          {isAlreadySent && (
            <div className="p-3.5 rounded-xl bg-amber-950/40 border border-amber-600/40 flex items-start gap-3 text-xs text-amber-200">
              <AlertTriangle size={18} className="text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold block mb-0.5">Notice: Message Already Dispatched</span>
                <span>
                  A confirmation was previously sent on {new Date(latestLog.sent_at).toLocaleString()}. You may resend or retry if the customer requested another copy.
                </span>
              </div>
            </div>
          )}

          {/* Formatted Message Preview */}
          <div>
            <label className="block text-xs uppercase tracking-wider text-[#B8B2A3] font-semibold mb-2">
              Customer Message Preview
            </label>
            <div className="p-4 rounded-xl bg-[#090A0C] border border-[rgba(74,57,28,0.30)] font-mono text-xs text-[#E8E4DA] whitespace-pre-wrap leading-relaxed max-h-56 overflow-y-auto select-all">
              {messageText}
            </div>
          </div>

          {/* Voucher attachment option */}
          <div className="flex items-center gap-2 p-3 rounded-lg bg-[#14161A] border border-[rgba(74,57,28,0.25)]">
            <input
              type="checkbox"
              id="includeVoucher"
              checked={includeVoucher}
              onChange={(e) => setIncludeVoucher(e.target.checked)}
              className="accent-[#D4AF37] w-4 h-4 cursor-pointer"
            />
            <label htmlFor="includeVoucher" className="text-xs text-[#B8B2A3] cursor-pointer">
              Attach official luxury PDF voucher (<span className="text-[#D4AF37]">MUSA-Voucher-{booking.booking_reference}.pdf</span>)
            </label>
          </div>

          {/* Past Communication History */}
          {existingLogs.length > 0 && (
            <div>
              <span className="block text-xs uppercase tracking-wider text-[#B8B2A3] font-semibold mb-2">
                Delivery History & Receipts
              </span>
              <div className="space-y-1.5">
                {existingLogs.map((log, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-2.5 rounded-lg bg-[#14161A] border border-[rgba(74,57,28,0.20)] text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          log.status === 'delivered' || log.status === 'read'
                            ? 'bg-emerald-400'
                            : log.status === 'sent' || log.status === 'manual_sent'
                            ? 'bg-blue-400'
                            : 'bg-red-400'
                        }`}
                      />
                      <span className="capitalize font-medium text-[#F8F5EC]">
                        {log.is_manual_fallback ? 'Manual Web Dispatch' : 'Meta Cloud API Template'}
                      </span>
                      <span className="text-[10px] text-[#7A756C]">
                        {new Date(log.sent_at).toLocaleTimeString()}
                      </span>
                    </div>
                    <span
                      className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                        log.status === 'delivered' || log.status === 'read'
                          ? 'bg-emerald-950 text-emerald-400'
                          : log.status === 'sent' || log.status === 'manual_sent'
                          ? 'bg-blue-950 text-blue-400'
                          : 'bg-red-950 text-red-400'
                      }`}
                    >
                      {log.status.replace('_', ' ')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions with 2 Clear Options */}
        <div className="p-5 border-t border-[rgba(74,57,28,0.30)] bg-[#111317] flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-[rgba(74,57,28,0.35)] text-xs text-[#B8B2A3] hover:text-[#F8F5EC] transition-colors"
          >
            Cancel
          </button>

          <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full sm:w-auto">
            {/* Manual Fallback Option (Always available & clearly labeled) */}
            <button
              onClick={handleManualSend}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-[#181A1F] border border-[rgba(74,57,28,0.35)] text-[#B8B2A3] hover:text-[#F8F5EC] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <ExternalLink size={14} />
              <span>Manual WhatsApp (Fallback)</span>
            </button>

            {/* Meta Cloud API Option */}
            <button
              onClick={handleCloudSend}
              disabled={isSendingCloud}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl font-semibold text-xs text-white bg-[#25D366] hover:bg-[#20ba59] active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-[0_4px_16px_rgba(37,211,102,0.35)] cursor-pointer disabled:opacity-50"
            >
              <Send size={14} />
              <span>{isSendingCloud ? 'Dispatching via Meta API...' : 'Send via Meta Cloud API'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
