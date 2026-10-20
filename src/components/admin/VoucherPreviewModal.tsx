import React, { useState } from 'react';
import { Booking } from '@/types/booking';
import { downloadVoucherPDF, printVoucherPDF } from '@/services/voucherGenerator';
import { X, Download, Printer, Send, QrCode, CheckCircle2, ShieldCheck, MapPin, Calendar, Clock, Car } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface VoucherPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: Booking | null;
  onOpenWhatsApp: (booking: Booking) => void;
}

export const VoucherPreviewModal: React.FC<VoucherPreviewModalProps> = ({
  isOpen,
  onClose,
  booking,
  onOpenWhatsApp,
}) => {
  if (!isOpen || !booking) return null;

  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      await downloadVoucherPDF(booking);
      toast.success(`Voucher PDF downloaded: MT-${booking.booking_reference}.pdf`);
    } catch (err: any) {
      toast.error('Failed to generate PDF: ' + err.message);
    } finally {
      setIsDownloading(false);
    }
  };

  const handlePrint = async () => {
    try {
      await printVoucherPDF(booking);
    } catch (err: any) {
      toast.error('Failed to prepare print view: ' + err.message);
    }
  };

  const leadSegment = booking.segments?.[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl max-h-[94vh] flex flex-col bg-[#0D0E10] border border-[rgba(201,162,39,0.35)] rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.9)] overflow-hidden font-body text-[#F8F5EC]">
        {/* Top Header Controls */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[rgba(74,57,28,0.30)] bg-[#111317]">
          <div>
            <h2 className="font-display text-lg font-bold text-[#F8F5EC] flex items-center gap-2">
              <span>Official Voucher Preview</span>
              <span className="text-xs px-2.5 py-0.5 rounded bg-[rgba(212,175,55,0.15)] text-[#D4AF37] font-mono">
                {booking.booking_reference}
              </span>
            </h2>
            <p className="text-xs text-[#B8B2A3]">
              Luxury A4 printable & downloadable confirmation document with embedded QR verification.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              disabled={isDownloading}
              className="px-3.5 py-1.5 rounded-lg bg-[rgba(212,175,55,0.15)] border border-[rgba(212,175,55,0.35)] text-[#D4AF37] hover:bg-[rgba(212,175,55,0.25)] text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Download size={14} />
              <span>{isDownloading ? 'Generating...' : 'Download PDF'}</span>
            </button>
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-lg bg-[#181A1F] border border-[rgba(74,57,28,0.35)] text-[#F8F5EC] hover:bg-[#22252B] text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Printer size={14} />
              <span>Print A4</span>
            </button>
            <button
              onClick={() => {
                onClose();
                onOpenWhatsApp(booking);
              }}
              className="px-3.5 py-1.5 rounded-lg bg-[#25D366]/20 border border-[#25D366]/40 text-[#25D366] hover:bg-[#25D366]/30 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Send size={14} />
              <span>Send WhatsApp</span>
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-[#181A1F] text-[#B8B2A3] hover:text-[#F8F5EC] flex items-center justify-center transition-colors ml-2"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Live Visual Voucher Canvas Preview */}
        <div className="flex-1 overflow-y-auto p-6 bg-[#08090A] flex justify-center">
          <div className="w-full max-w-xl bg-white text-black rounded-lg p-6 shadow-2xl border border-[rgba(212,175,55,0.4)] text-xs">
            {/* Header Banner */}
            <div className="bg-[#0B0D0F] text-white p-4 rounded-t-md relative border-b-2 border-[#D4AF37]">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="font-serif text-lg font-bold tracking-tight text-[#F8F5EC]">
                    MUSA<span className="text-[#D4AF37] font-normal">TRANSPORT</span>
                  </h1>
                  <p className="text-[9px] text-[#B8B2A3] tracking-wider uppercase mt-0.5">
                    Kingdom of Saudi Arabia — Umrah & Hajj Transfers
                  </p>
                </div>
                <div className="text-right bg-[#14161A] p-2 rounded border border-[#D4AF37]/40">
                  <span className="text-[8px] text-[#D4AF37] uppercase block font-bold">Booking Reference</span>
                  <span className="font-mono text-sm font-bold text-white">{booking.booking_reference}</span>
                </div>
              </div>
            </div>

            {/* Voucher Subheader & Status */}
            <div className="py-3 px-2 flex justify-between items-center border-b border-gray-200">
              <span className="font-bold text-xs uppercase tracking-wide text-gray-800">
                Official Umrah Transportation Voucher
              </span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                  booking.status === 'confirmed' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                }`}
              >
                {booking.status}
              </span>
            </div>

            {/* Customer & Trip Details */}
            <div className="grid grid-cols-2 gap-4 p-3 bg-gray-50 rounded-md my-3 border border-gray-200">
              <div>
                <span className="text-[9px] text-gray-500 uppercase block font-semibold">Lead Passenger</span>
                <span className="text-xs font-bold text-gray-900">{booking.customer_name}</span>
                <span className="text-[10px] text-gray-600 block mt-1">WhatsApp: +{booking.customer_phone}</span>
              </div>
              <div>
                <span className="text-[9px] text-gray-500 uppercase block font-semibold">Service Class</span>
                <span className="text-xs font-semibold text-gray-900">{booking.service_type}</span>
                <span className="text-[10px] text-gray-600 block mt-1">Passengers: {booking.passengers} Person(s)</span>
              </div>
            </div>

            {/* Journey Segments */}
            <div className="space-y-2 mb-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-700 block">
                Scheduled Journey Route
              </span>
              {booking.segments?.map((seg, i) => (
                <div key={i} className="p-2.5 bg-white border border-amber-300 rounded shadow-sm flex justify-between items-center">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-gray-900">
                      <span className="w-4 h-4 rounded-full bg-[#D4AF37] text-black text-[9px] flex items-center justify-center font-bold">
                        {i + 1}
                      </span>
                      <span>{seg.pickup_location}</span>
                      <span className="text-gray-400">→</span>
                      <span>{seg.drop_location}</span>
                    </div>
                    {seg.flight_number && (
                      <span className="text-[9px] text-gray-500 block">Flight: {seg.flight_number}</span>
                    )}
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] font-bold text-gray-800 block">
                      {seg.pickup_date} @ {seg.pickup_time}
                    </span>
                    <span className="text-[9px] font-semibold text-[#D4AF37] bg-black px-1.5 py-0.5 rounded">
                      {seg.vehicle_type}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Paging & Driver Instructions */}
            <div className="p-2.5 bg-amber-50/60 border border-amber-200 rounded text-[9px] text-gray-700 space-y-1 mb-3">
              <span className="font-bold block uppercase text-amber-900">Paging & Meeting Protocol:</span>
              <p>• Your assigned chauffeur will await you at the arrival hall holding a paging sign with your name.</p>
              <p>• 24/7 Operations Dispatch & Emergency Assistance: <strong>+966 59 710 0424</strong></p>
            </div>

            {/* Footer */}
            <div className="border-t border-gray-300 pt-2 flex justify-between items-center text-[8px] text-gray-500">
              <span>MUSA TRANSPORT SAUDI ARABIA • Authorized Transport Service</span>
              <span>Verification Ref: {booking.booking_reference}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
