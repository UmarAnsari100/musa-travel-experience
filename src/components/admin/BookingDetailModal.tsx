import React from 'react';
import { Booking } from '@/types/booking';
import {
  X,
  MapPin,
  Calendar,
  Clock,
  Car,
  User,
  Phone,
  Mail,
  Globe,
  Lock,
  FileText,
  Send,
  Zap,
  CheckCircle2,
  XCircle,
  Edit,
  Shield,
  Plane,
  Building,
} from 'lucide-react';

interface BookingDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: Booking | null;
  onConfirmAndSendVoucher: (booking: Booking) => void;
  onConfirmOnly: (booking: Booking) => void;
  onCancelBooking: (booking: Booking) => void;
  onOpenVoucher: (booking: Booking) => void;
  onOpenWhatsApp: (booking: Booking) => void;
  onOpenVisaVault: (booking: Booking) => void;
  onEdit: (booking: Booking) => void;
}

export const BookingDetailModal: React.FC<BookingDetailModalProps> = ({
  isOpen,
  onClose,
  booking,
  onConfirmAndSendVoucher,
  onConfirmOnly,
  onCancelBooking,
  onOpenVoucher,
  onOpenWhatsApp,
  onOpenVisaVault,
  onEdit,
}) => {
  if (!isOpen || !booking) return null;

  const leadSeg = booking.segments?.[0];

  const getVisaBadge = () => {
    switch (booking.visa_status) {
      case 'uploaded':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-950/70 border border-emerald-500/50 text-emerald-400">
            <Lock size={12} />
            <span>Visa Uploaded</span>
          </span>
        );
      case 'whatsapp':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#25D366]/15 border border-[#25D366]/40 text-[#25D366]">
            <span>📱 Via WhatsApp</span>
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-950/70 border border-amber-500/50 text-amber-300">
            <span>⏳ Visa Pending</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-800 border border-gray-700 text-gray-300">
            <span>{booking.is_international ? 'Not Provided' : 'Local / Not Req'}</span>
          </span>
        );
    }
  };

  const getStatusBadge = () => {
    switch (booking.status) {
      case 'confirmed':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-emerald-950/70 border border-emerald-500/50 text-emerald-400">
            Confirmed
          </span>
        );
      case 'pending':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-amber-950/70 border border-amber-500/50 text-amber-300">
            Pending Approval
          </span>
        );
      case 'in_progress':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-blue-950/70 border border-blue-500/50 text-blue-300">
            In Progress
          </span>
        );
      case 'completed':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-purple-950/70 border border-purple-500/50 text-purple-300">
            Completed
          </span>
        );
      case 'cancelled':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-red-950/70 border border-red-500/50 text-red-400">
            Cancelled
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl max-h-[92vh] flex flex-col bg-[#0D0E10] border border-[rgba(201,162,39,0.35)] rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.9)] overflow-hidden font-body text-[#F8F5EC]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[rgba(74,57,28,0.30)] bg-[#111317]">
          <div className="flex items-center gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-lg font-bold text-[#D4AF37]">
                  {booking.booking_reference}
                </span>
                {getStatusBadge()}
                {getVisaBadge()}
              </div>
              <p className="text-xs text-[#B8B2A3] mt-0.5">
                Created: {new Date(booking.created_at).toLocaleString()} • Source: {booking.source}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-[#181A1F] text-[#B8B2A3] hover:text-[#F8F5EC] flex items-center justify-center transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Quick Actions Bar */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-[rgba(212,175,55,0.15)] to-transparent border border-[rgba(212,175,55,0.30)] flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="text-xs font-bold text-[#F8F5EC] block">Quick Operations Action</span>
              <span className="text-[11px] text-[#B8B2A3] block">
                Verify booking, generate official PDF voucher, and dispatch WhatsApp confirmation in 1 click.
              </span>
            </div>
            <button
              onClick={() => onConfirmAndSendVoucher(booking)}
              className="px-4 py-2.5 rounded-xl font-bold text-xs text-black flex items-center gap-2 transition-transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer shadow-lg"
              style={{
                background: 'linear-gradient(135deg, #D7B447 0%, #A47B16 100%)',
              }}
            >
              <Zap size={14} fill="currentColor" />
              <span>Confirm & Send Voucher</span>
            </button>
          </div>

          {/* Passenger Information */}
          <div className="p-4 rounded-xl bg-[#12141A] border border-white/5 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#D4AF37] flex items-center gap-2">
              <User size={14} />
              <span>Customer Information</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <span className="text-[#8E8A82] block text-[10px] uppercase">Name</span>
                <span className="font-semibold text-sm text-[#F8F5EC]">{booking.customer_name}</span>
              </div>
              <div>
                <span className="text-[#8E8A82] block text-[10px] uppercase">WhatsApp Number</span>
                <a
                  href={`https://wa.me/${booking.customer_phone}`}
                  target="_blank"
                  rel="noreferrer"
                  className="font-semibold text-sm text-[#25D366] hover:underline flex items-center gap-1"
                >
                  <Phone size={12} />
                  <span>+{booking.customer_phone}</span>
                </a>
              </div>
              <div>
                <span className="text-[#8E8A82] block text-[10px] uppercase">Nationality / Origin</span>
                <span className="font-semibold text-sm text-[#F8F5EC] flex items-center gap-1">
                  <Globe size={12} className="text-[#D4AF37]" />
                  <span>
                    {booking.nationality || 'Not specified'} ({booking.is_international ? 'International' : 'Local'})
                  </span>
                </span>
              </div>
            </div>

            {booking.customer_email && (
              <div className="text-xs pt-1 border-t border-white/5">
                <span className="text-[#8E8A82] block text-[10px] uppercase">Email</span>
                <span className="text-[#F8F5EC]">{booking.customer_email}</span>
              </div>
            )}
          </div>

          {/* Route & Segments */}
          <div className="p-4 rounded-xl bg-[#12141A] border border-white/5 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#D4AF37] flex items-center gap-2">
              <MapPin size={14} />
              <span>Scheduled Journey Itinerary</span>
            </h4>
            <div className="space-y-3">
              {(booking.segments || []).map((seg, idx) => (
                <div
                  key={seg.id || idx}
                  className="p-3 rounded-xl bg-[#171922] border border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="font-semibold text-sm text-[#F8F5EC] flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-[rgba(212,175,55,0.2)] text-[#D4AF37] flex items-center justify-center text-[10px] font-bold">
                        {idx + 1}
                      </span>
                      <span>{seg.pickup_location}</span>
                      <span className="text-[#D4AF37]">→</span>
                      <span>{seg.drop_location}</span>
                    </div>
                    <div className="text-[#B8B2A3] flex items-center gap-4 text-[11px] pl-7">
                      <span>📅 {seg.pickup_date}</span>
                      <span>⏰ {seg.pickup_time}</span>
                      <span>🚗 {seg.vehicle_type}</span>
                    </div>
                  </div>

                  {(seg.flight_number || seg.hotel_name) && (
                    <div className="text-[11px] text-[#D4AF37] bg-black/30 px-3 py-1.5 rounded-lg border border-white/5">
                      {seg.flight_number && <div>Flight: {seg.flight_number}</div>}
                      {seg.hotel_name && <div>Hotel: {seg.hotel_name}</div>}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Special Instructions & Notes */}
          {(booking.special_instructions || booking.internal_notes) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              {booking.special_instructions && (
                <div className="p-3.5 rounded-xl bg-[#12141A] border border-white/5">
                  <span className="text-[10px] uppercase font-bold text-[#8E8A82] block mb-1">
                    Customer Requests & Notes
                  </span>
                  <p className="text-[#F8F5EC]">{booking.special_instructions}</p>
                </div>
              )}
              {booking.internal_notes && (
                <div className="p-3.5 rounded-xl bg-[#12141A] border border-white/5">
                  <span className="text-[10px] uppercase font-bold text-[#D4AF37] block mb-1">
                    Internal Dispatch Notes
                  </span>
                  <p className="text-[#F8F5EC]">{booking.internal_notes}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-[rgba(74,57,28,0.30)] bg-[#111317] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenVisaVault(booking)}
              className="px-3 py-2 rounded-xl bg-[#181A1F] hover:bg-[#252830] text-xs font-medium text-[#D4AF37] flex items-center gap-1.5 transition-colors cursor-pointer border border-white/5"
            >
              <Lock size={13} />
              <span>Visa Vault</span>
            </button>
            <button
              onClick={() => onOpenVoucher(booking)}
              className="px-3 py-2 rounded-xl bg-[#181A1F] hover:bg-[#252830] text-xs font-medium text-[#F8F5EC] flex items-center gap-1.5 transition-colors cursor-pointer border border-white/5"
            >
              <FileText size={13} />
              <span>Voucher PDF</span>
            </button>
            <button
              onClick={() => onOpenWhatsApp(booking)}
              className="px-3 py-2 rounded-xl bg-[#25D366]/15 hover:bg-[#25D366]/25 text-xs font-medium text-[#25D366] flex items-center gap-1.5 transition-colors cursor-pointer border border-[#25D366]/30"
            >
              <Send size={13} />
              <span>WhatsApp</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {booking.status === 'pending' && (
              <button
                onClick={() => onConfirmOnly(booking)}
                className="px-3 py-2 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/80 text-xs font-semibold text-emerald-300 border border-emerald-500/40 flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <CheckCircle2 size={13} />
                <span>Confirm Booking</span>
              </button>
            )}

            {booking.status !== 'cancelled' && (
              <button
                onClick={() => onCancelBooking(booking)}
                className="px-3 py-2 rounded-xl bg-red-950/40 hover:bg-red-900/60 text-xs font-semibold text-red-400 border border-red-500/40 flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <XCircle size={13} />
                <span>Cancel</span>
              </button>
            )}

            <button
              onClick={() => onEdit(booking)}
              className="px-3 py-2 rounded-xl bg-[#1F222B] hover:bg-[#2A2E3B] text-xs font-semibold text-[#F8F5EC] flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <Edit size={13} />
              <span>Edit</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
