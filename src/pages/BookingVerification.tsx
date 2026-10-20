import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import {
  verificationService,
  VerificationResponse,
  VerifiedBookingDetails,
} from '@/services/verificationService';
import { SITE_CONFIG } from '@/config/site';
import {
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Car,
  Users,
  Calendar,
  MapPin,
  ArrowRight,
  PhoneCall,
  ExternalLink,
  Lock,
  Building2,
  Plane,
} from 'lucide-react';

export const BookingVerification: React.FC = () => {
  const { reference: paramReference } = useParams<{ reference?: string }>();
  const [searchParams] = useSearchParams();

  const reference = (paramReference || searchParams.get('ref') || '').trim();
  const token = (searchParams.get('token') || '').trim();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [verificationResult, setVerificationResult] = useState<VerificationResponse | null>(null);

  useEffect(() => {
    let isMounted = true;

    const runVerification = async () => {
      setIsLoading(true);
      try {
        const result = await verificationService.verifyBooking(reference, token);
        if (isMounted) {
          setVerificationResult(result);
        }
      } catch (err: any) {
        if (isMounted) {
          setVerificationResult({
            success: false,
            status: 'error',
            errorMessage: err?.message || 'An unexpected verification error occurred.',
          });
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    runVerification();

    return () => {
      isMounted = false;
    };
  }, [reference, token]);

  const booking = verificationResult?.booking;

  return (
    <div className="min-h-screen bg-[#07080A] text-[#F8F5EC] flex flex-col justify-between selection:bg-[#D4AF37]/30 selection:text-[#F8F5EC] font-body">
      {/* Top Brand Bar */}
      <header className="border-b border-[rgba(212,175,55,0.20)] bg-[#0C0E12]/90 backdrop-blur-md sticky top-0 z-20">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <span className="font-display font-bold text-lg tracking-wider text-[#F8F5EC]">
              MUSA<span className="text-[#D4AF37] font-normal">TRANSPORT</span>
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-[rgba(212,175,55,0.12)] border border-[rgba(212,175,55,0.30)] text-[#D4AF37]">
              <Lock size={11} />
              <span>Official Verification Portal</span>
            </span>
          </div>
        </div>
      </header>

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-8 sm:py-12 flex flex-col justify-center">
        {isLoading ? (
          <div className="p-8 sm:p-12 rounded-3xl bg-[#0D0F13] border border-[rgba(212,175,55,0.25)] text-center space-y-4 shadow-2xl">
            <div className="w-12 h-12 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin mx-auto" />
            <h2 className="font-display text-lg font-bold text-[#F8F5EC]">
              Authenticating Travel Voucher...
            </h2>
            <p className="text-xs text-[#B8B2A3] max-w-sm mx-auto">
              Validating cryptographic security token against MUSA TRANSPORT central registry.
            </p>
          </div>
        ) : !verificationResult?.success || !booking ? (
          /* Error / Invalid Token / Not Found View */
          <div className="p-6 sm:p-10 rounded-3xl bg-[#0F1116] border border-red-500/40 text-center space-y-6 shadow-2xl">
            <div className="w-16 h-16 rounded-2xl bg-red-950/60 border border-red-500/40 text-red-400 mx-auto flex items-center justify-center">
              <ShieldAlert size={32} />
            </div>

            <div className="space-y-2">
              <div className="inline-block px-3 py-1 rounded-full bg-red-950/70 border border-red-500/40 text-red-300 text-[11px] font-bold uppercase tracking-wider">
                {verificationResult?.status === 'invalid_token'
                  ? 'Security Token Invalid'
                  : 'Booking Not Found'}
              </div>
              <h2 className="font-display text-2xl font-bold text-[#F8F5EC]">
                {verificationResult?.status === 'invalid_token'
                  ? 'Voucher Authentication Failed'
                  : 'Record Not Located'}
              </h2>
              <p className="text-xs sm:text-sm text-[#B8B2A3] max-w-md mx-auto leading-relaxed">
                {verificationResult?.errorMessage ||
                  'The voucher you are attempting to inspect could not be verified by our security registry.'}
              </p>
            </div>

            {reference && (
              <div className="p-3 rounded-xl bg-[#151820] border border-white/5 inline-block font-mono text-xs text-[#D4AF37]">
                Reference Queried: <span className="font-bold">{reference}</span>
              </div>
            )}

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href={`https://wa.me/${SITE_CONFIG.supportWhatsApp}?text=${encodeURIComponent(
                  `Assalamu Alaikum, I need assistance verifying booking reference: ${reference}`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-[#25D366] hover:bg-[#20BA5A] text-black text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-lg"
              >
                <PhoneCall size={14} />
                <span>Contact Operations Dispatch</span>
              </a>
              <Link
                to="/"
                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-[#1C1F26] hover:bg-[#252832] text-[#F8F5EC] text-xs font-semibold border border-white/10 flex items-center justify-center gap-2 transition-all"
              >
                <span>Return to Homepage</span>
              </Link>
            </div>
          </div>
        ) : (
          /* Verified Success View */
          <div className="space-y-6">
            {/* Status Notification Banner */}
            {booking.status === 'confirmed' ? (
              <div className="p-5 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 flex items-start gap-4">
                <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 shrink-0">
                  <ShieldCheck size={24} />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-500/30">
                      OFFICIALLY CONFIRMED RESERVATION
                    </span>
                  </div>
                  <h3 className="font-display text-lg font-bold text-[#F8F5EC]">
                    Verified MUSA TRANSPORT Reservation
                  </h3>
                  <p className="text-xs text-emerald-200/80 leading-relaxed">
                    {booking.status_description}
                  </p>
                </div>
              </div>
            ) : booking.status === 'pending' ? (
              <div className="p-5 rounded-2xl bg-amber-950/40 border border-amber-500/40 flex items-start gap-4">
                <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 shrink-0">
                  <Clock size={24} className="animate-pulse" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded border border-amber-500/30">
                      PENDING REVIEW — NOT YET CONFIRMED
                    </span>
                  </div>
                  <h3 className="font-display text-lg font-bold text-[#F8F5EC]">
                    Reservation Request Pending Approval
                  </h3>
                  <p className="text-xs text-amber-200/80 leading-relaxed">
                    {booking.status_description}
                  </p>
                </div>
              </div>
            ) : booking.status === 'cancelled' ? (
              <div className="p-5 rounded-2xl bg-red-950/40 border border-red-500/40 flex items-start gap-4">
                <div className="p-2.5 rounded-xl bg-red-500/20 text-red-400 shrink-0">
                  <AlertTriangle size={24} />
                </div>
                <div className="space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-red-400 bg-red-500/10 px-2.5 py-0.5 rounded border border-red-500/30">
                    CANCELLED / VOID
                  </span>
                  <h3 className="font-display text-lg font-bold text-[#F8F5EC]">
                    Reservation Has Been Cancelled
                  </h3>
                  <p className="text-xs text-red-200/80 leading-relaxed">
                    {booking.status_description}
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-5 rounded-2xl bg-blue-950/40 border border-blue-500/40 flex items-start gap-4">
                <div className="p-2.5 rounded-xl bg-blue-500/20 text-blue-400 shrink-0">
                  <CheckCircle2 size={24} />
                </div>
                <div className="space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-blue-400 bg-blue-500/10 px-2.5 py-0.5 rounded border border-blue-500/30">
                    {booking.status_label}
                  </span>
                  <h3 className="font-display text-lg font-bold text-[#F8F5EC]">
                    Active Service Itinerary
                  </h3>
                  <p className="text-xs text-blue-200/80 leading-relaxed">
                    {booking.status_description}
                  </p>
                </div>
              </div>
            )}

            {/* Core Verification Card */}
            <div className="rounded-3xl bg-[#0D0F13] border border-[rgba(212,175,55,0.25)] p-6 sm:p-8 shadow-2xl space-y-6">
              {/* Header Box with Reference */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[rgba(212,175,55,0.15)] gap-4">
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-[#B8B2A3] block">
                    Verified Booking Reference
                  </span>
                  <span className="font-mono text-2xl font-bold text-[#D4AF37]">
                    {booking.booking_reference}
                  </span>
                </div>
                <div className="text-left sm:text-right">
                  <span className="text-[10px] uppercase tracking-widest text-[#B8B2A3] block">
                    Service Class
                  </span>
                  <span className="text-sm font-semibold text-[#F8F5EC]">
                    {booking.service_type}
                  </span>
                </div>
              </div>

              {/* Verified Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                {/* Masked Lead Traveler */}
                <div className="p-4 rounded-xl bg-[#14161C] border border-white/5 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[#8E8A82] text-[10px] uppercase tracking-wider font-semibold">
                      Lead Traveler
                    </span>
                    <span className="text-[9px] text-[#D4AF37] bg-[rgba(212,175,55,0.10)] px-2 py-0.5 rounded">
                      Privacy Masked
                    </span>
                  </div>
                  <span className="text-sm font-bold text-[#F8F5EC] block">
                    {booking.masked_customer_name}
                  </span>
                  <span className="text-[10px] text-[#7A756C] block">
                    Personal phone & documents are protected from public scans
                  </span>
                </div>

                {/* Vehicle & Passengers */}
                <div className="p-4 rounded-xl bg-[#14161C] border border-white/5 space-y-1">
                  <span className="text-[#8E8A82] text-[10px] uppercase tracking-wider font-semibold block">
                    Vehicle Allocation
                  </span>
                  <div className="flex items-center gap-2 text-sm font-bold text-[#D4AF37]">
                    <Car size={16} />
                    <span>{booking.vehicle_type}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-[#B8B2A3]">
                    <Users size={12} />
                    <span>{booking.passengers} Passenger(s)</span>
                  </div>
                </div>

                {/* Scheduled Travel Date & Time */}
                <div className="p-4 rounded-xl bg-[#14161C] border border-white/5 space-y-1 sm:col-span-2">
                  <span className="text-[#8E8A82] text-[10px] uppercase tracking-wider font-semibold block">
                    Scheduled Date & Timing
                  </span>
                  <div className="flex items-center gap-2 text-sm font-semibold text-[#F8F5EC]">
                    <Calendar size={15} className="text-[#D4AF37]" />
                    <span>{booking.travel_date}</span>
                    {booking.travel_time && (
                      <>
                        <span className="text-[#7A756C]">•</span>
                        <Clock size={15} className="text-[#D4AF37]" />
                        <span>{booking.travel_time}</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Route: Pickup -> Destination */}
                <div className="p-4 rounded-xl bg-[#14161C] border border-white/5 space-y-3 sm:col-span-2">
                  <span className="text-[#8E8A82] text-[10px] uppercase tracking-wider font-semibold block">
                    Itinerary Transfer Route
                  </span>
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-[rgba(212,175,55,0.15)] text-[#D4AF37] mt-0.5">
                      <MapPin size={16} />
                    </div>
                    <div className="space-y-1 flex-1">
                      <span className="text-[10px] uppercase text-[#7A756C] block">Pickup Location</span>
                      <span className="text-xs font-semibold text-[#F8F5EC] block">
                        {booking.pickup_location}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 pt-2 border-t border-white/5">
                    <div className="p-2 rounded-lg bg-[rgba(212,175,55,0.15)] text-[#D4AF37] mt-0.5">
                      <ArrowRight size={16} />
                    </div>
                    <div className="space-y-1 flex-1">
                      <span className="text-[10px] uppercase text-[#7A756C] block">Destination</span>
                      <span className="text-xs font-semibold text-[#F8F5EC] block">
                        {booking.destination}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Flight & Hotel (if applicable) */}
                {(booking.flight_number || booking.hotel_name) && (
                  <div className="p-4 rounded-xl bg-[#14161C] border border-white/5 space-y-2 sm:col-span-2">
                    <span className="text-[#8E8A82] text-[10px] uppercase tracking-wider font-semibold block">
                      Flight & Accommodation Details
                    </span>
                    <div className="flex flex-wrap gap-4 text-xs">
                      {booking.flight_number && (
                        <div className="flex items-center gap-1.5 text-[#E5E0D5]">
                          <Plane size={14} className="text-[#D4AF37]" />
                          <span>Flight: {booking.flight_number}</span>
                        </div>
                      )}
                      {booking.hotel_name && (
                        <div className="flex items-center gap-1.5 text-[#E5E0D5]">
                          <Building2 size={14} className="text-[#D4AF37]" />
                          <span>Hotel: {booking.hotel_name}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Digital Registry Authenticity Seal */}
              <div className="pt-4 border-t border-[rgba(212,175,55,0.15)] flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-[#7A756C] gap-2">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck size={14} className="text-[#D4AF37]" />
                  <span>
                    Cryptographically Authenticated: {new Date(booking.verified_at).toLocaleDateString()}
                  </span>
                </div>
                <span className="font-mono text-[10px] text-[#A69E8F]">
                  {SITE_CONFIG.domain}
                </span>
              </div>
            </div>

            {/* Need Assistance Action Bar */}
            <div className="p-4 rounded-2xl bg-[#0D0F13] border border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <span className="text-[#B8B2A3]">
                Have questions regarding this schedule or need chauffeur dispatch assistance?
              </span>
              <a
                href={`https://wa.me/${SITE_CONFIG.supportWhatsApp}?text=${encodeURIComponent(
                  `Assalamu Alaikum, I am verifying booking reference ${booking.booking_reference}.`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2.5 rounded-xl bg-[rgba(212,175,55,0.15)] hover:bg-[rgba(212,175,55,0.25)] border border-[rgba(212,175,55,0.35)] text-[#D4AF37] font-semibold flex items-center gap-2 transition-all shrink-0"
              >
                <PhoneCall size={13} />
                <span>24/7 Operations Hotline</span>
              </a>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-[rgba(212,175,55,0.15)] py-4 text-center text-[11px] text-[#7A756C]">
        <div className="max-w-4xl mx-auto px-4">
          <p>© {new Date().getFullYear()} MUSA TRANSPORT. Kingdom of Saudi Arabia. All Rights Reserved.</p>
          <p className="mt-0.5 text-[10px] text-[#55524B]">{SITE_CONFIG.officialLicense}</p>
        </div>
      </footer>
    </div>
  );
};

export default BookingVerification;
