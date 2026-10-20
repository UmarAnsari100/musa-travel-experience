import React, { useState, useEffect } from 'react';
import { useAdminAuth } from '@/context/AuthContext';
import { Booking, BookingStatus } from '@/types/booking';
import { bookingService } from '@/services/bookingService';
import { isSupabaseConfigured } from '@/lib/supabase';
import { BookingModal } from '@/components/admin/BookingModal';
import { VoucherPreviewModal } from '@/components/admin/VoucherPreviewModal';
import { WhatsAppDispatchModal } from '@/components/admin/WhatsAppDispatchModal';
import { VisaManagerModal } from '@/components/admin/VisaManagerModal';
import { BookingDetailModal } from '@/components/admin/BookingDetailModal';
import { whatsappService } from '@/services/whatsappService';
import {
  Car,
  Search,
  Filter,
  Plus,
  RefreshCw,
  LogOut,
  Send,
  FileText,
  Lock,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Clock3,
  ExternalLink,
  Shield,
  Eye,
  Edit,
  Trash2,
  Database,
  Smartphone,
  PhoneCall,
  Zap,
} from 'lucide-react';
import { toast } from 'react-hot-toast';

export const AdminDashboard: React.FC = () => {
  const { user, logout, role, isSuperAdmin } = useAdminAuth();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [vehicleFilter, setVehicleFilter] = useState<string>('all');
  const [visaFilter, setVisaFilter] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'bookings' | 'whatsapp' | 'visas' | 'infrastructure'>('bookings');

  // Modals state
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedDetailBooking, setSelectedDetailBooking] = useState<Booking | null>(null);

  const [isVoucherModalOpen, setIsVoucherModalOpen] = useState(false);
  const [selectedVoucherBooking, setSelectedVoucherBooking] = useState<Booking | null>(null);

  const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = useState(false);
  const [selectedWhatsAppBooking, setSelectedWhatsAppBooking] = useState<Booking | null>(null);

  const [isVisaModalOpen, setIsVisaModalOpen] = useState(false);
  const [selectedVisaBooking, setSelectedVisaBooking] = useState<Booking | null>(null);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    setIsLoading(true);
    try {
      const data = await bookingService.fetchBookings();
      setBookings(data);
    } catch (err: any) {
      toast.error('Failed to load bookings: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (booking: Booking, newStatus: BookingStatus) => {
    try {
      await bookingService.updateBookingStatus(booking.id, newStatus);
      toast.success(`Booking ${booking.booking_reference} marked as ${newStatus.toUpperCase()}`);
      await loadBookings();
    } catch (err: any) {
      toast.error('Status update failed: ' + err.message);
    }
  };

  // 1-Click Operations Action: Confirm & Send Voucher
  const handleQuickConfirmAndSendVoucher = async (b: Booking) => {
    // Check if WhatsApp confirmation already logged/sent to prevent duplicate messages
    const alreadySent = b.whatsapp_logs?.some(
      (l) => l.status === 'delivered' || l.status === 'sent' || l.status === 'manual_sent'
    );
    if (alreadySent) {
      const proceed = window.confirm(
        `WhatsApp message was already logged as sent for ${b.booking_reference}. Are you sure you want to send another confirmation?`
      );
      if (!proceed) return;
    }

    const toastId = toast.loading(`Confirming ${b.booking_reference} & preparing voucher...`);
    try {
      // 1. Confirm status
      if (b.status !== 'confirmed') {
        await bookingService.updateBookingStatus(b.id, 'confirmed');
      }

      // 2. Dispatch WhatsApp confirmation
      const res = await whatsappService.sendCloudAPIConfirmation(b);
      if (!res.success) {
        // Fallback to verified manual dispatch with official voucher prefill
        whatsappService.sendManualWhatsApp(b);
        toast.success(
          `Booking ${b.booking_reference} confirmed! WhatsApp opened for dispatch.`,
          { id: toastId }
        );
      } else {
        toast.success(
          `Booking ${b.booking_reference} confirmed & WhatsApp voucher dispatched!`,
          { id: toastId }
        );
      }

      await loadBookings();
    } catch (err: any) {
      toast.error(`Error: ${err.message || 'Operation failed'}`, { id: toastId });
    }
  };

  const handleCancelBooking = async (booking: Booking) => {
    if (!window.confirm(`Are you sure you want to cancel booking ${booking.booking_reference}?`)) return;

    try {
      await bookingService.updateBookingStatus(booking.id, 'cancelled');
      toast.success(`Booking ${booking.booking_reference} has been cancelled.`);
      await loadBookings();
      if (selectedDetailBooking?.id === booking.id) {
        setIsDetailModalOpen(false);
      }
    } catch (err: any) {
      toast.error('Failed to cancel booking: ' + err.message);
    }
  };

  const handleDeleteBooking = async (booking: Booking) => {
    if (!window.confirm(`Delete booking ${booking.booking_reference} for ${booking.customer_name}?`)) return;

    try {
      await bookingService.deleteBooking(booking.id);
      toast.success(`Booking ${booking.booking_reference} deleted.`);
      await loadBookings();
    } catch (err: any) {
      toast.error('Failed to delete booking: ' + err.message);
    }
  };

  const handleSaveBooking = async (bookingData: any) => {
    if (editingBooking) {
      await bookingService.updateBooking(editingBooking.id, bookingData);
    } else {
      await bookingService.createBooking(bookingData);
    }
    await loadBookings();
  };

  // Metrics calculation
  const totalBookings = bookings.length;
  const pendingCount = bookings.filter((b) => b.status === 'pending').length;
  const confirmedCount = bookings.filter((b) => b.status === 'confirmed').length;
  const inProgressCount = bookings.filter((b) => b.status === 'in_progress').length;
  const todayStr = new Date().toISOString().split('T')[0];
  const todayPickups = bookings.filter((b) =>
    b.segments?.some((s) => s.pickup_date === todayStr)
  ).length;

  // Filtered Bookings
  const filteredBookings = bookings.filter((b) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      b.customer_name.toLowerCase().includes(q) ||
      b.customer_phone.includes(q) ||
      b.booking_reference.toLowerCase().includes(q) ||
      b.nationality?.toLowerCase().includes(q) ||
      b.segments?.some(
        (s) =>
          s.pickup_location.toLowerCase().includes(q) ||
          s.drop_location.toLowerCase().includes(q) ||
          s.pickup_date.includes(q)
      );

    const matchesStatus = statusFilter === 'all' || b.status === statusFilter;
    const matchesVehicle =
      vehicleFilter === 'all' || b.segments?.some((s) => s.vehicle_type === vehicleFilter);

    const matchesVisa =
      visaFilter === 'all' ||
      (visaFilter === 'local'
        ? !b.is_international || b.visa_status === 'not_required'
        : b.visa_status === visaFilter);

    return matchesSearch && matchesStatus && matchesVehicle && matchesVisa;
  });

  return (
    <div className="min-h-screen bg-[#07080A] text-[#F8F5EC] font-body flex flex-col">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-[#0C0D10]/95 backdrop-blur-md border-b border-[rgba(74,57,28,0.25)] px-6 py-3.5">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-display text-xl font-bold tracking-tight text-[#F8F5EC]">
              MUSA<span className="text-[#D4AF37] font-normal">TRANSPORT</span>
            </span>
            <span className="hidden sm:inline-block h-4 w-px bg-[rgba(74,57,28,0.4)]" />
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[rgba(212,175,55,0.12)] border border-[rgba(212,175,55,0.30)] text-[10px] font-semibold text-[#D4AF37] tracking-wider uppercase">
              <Shield size={11} />
              <span>Operations Dispatch</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Supabase status badge */}
            <span
              title={
                isSupabaseConfigured()
                  ? 'Connected to live Supabase PostgreSQL & Storage'
                  : 'Running in Local Safe Mode (Configure Supabase in .env for multi-device sync)'
              }
              className={`hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10.5px] font-medium border ${
                isSupabaseConfigured()
                  ? 'bg-emerald-950/50 border-emerald-500/40 text-emerald-400'
                  : 'bg-amber-950/50 border-amber-500/40 text-amber-300'
              }`}
            >
              <Database size={11} />
              <span>{isSupabaseConfigured() ? 'Cloud DB Active' : 'Local Storage Mode'}</span>
            </span>

            {/* Admin User Pill */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#14161B] border border-[rgba(74,57,28,0.30)] text-xs">
              <div className="w-6 h-6 rounded-full bg-[#D4AF37] text-black font-bold flex items-center justify-center text-[10px]">
                {user?.name?.charAt(0) || 'A'}
              </div>
              <div className="text-left">
                <span className="font-semibold text-[#F8F5EC] block leading-tight">{user?.name}</span>
                <span className="text-[10px] text-[#D4AF37] capitalize block leading-tight">{role?.replace('_', ' ')}</span>
              </div>
            </div>

            {/* Create Booking Button */}
            <button
              onClick={() => {
                setEditingBooking(null);
                setIsBookingModalOpen(true);
              }}
              className="px-4 py-2 rounded-xl font-semibold text-xs text-[#050505] flex items-center gap-1.5 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-[0_2px_12px_rgba(212,175,55,0.3)] cursor-pointer"
              style={{
                background: 'linear-gradient(135deg, #D7B447 0%, #A47B16 100%)',
              }}
            >
              <Plus size={15} strokeWidth={2.5} />
              <span>New Booking</span>
            </button>

            {/* Logout */}
            <button
              onClick={logout}
              title="Sign Out"
              className="p-2 rounded-xl bg-[#14161B] border border-[rgba(74,57,28,0.30)] text-[#B8B2A3] hover:text-red-400 hover:border-red-500/40 transition-colors"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="container mx-auto px-4 sm:px-6 py-6 flex-1 space-y-6">
        {/* Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          <div className="p-4 rounded-xl bg-[#0D0E11] border border-[rgba(74,57,28,0.25)] relative overflow-hidden">
            <span className="text-[11px] text-[#B8B2A3] uppercase tracking-wider block font-medium">Total Bookings</span>
            <span className="font-display text-2xl sm:text-3xl font-bold text-[#F8F5EC] mt-1 block">
              {totalBookings}
            </span>
            <div className="absolute right-3 top-3 text-[rgba(212,175,55,0.2)]">
              <Car size={28} />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#0D0E11] border border-amber-500/30 relative overflow-hidden">
            <span className="text-[11px] text-amber-400 uppercase tracking-wider block font-medium">Pending Review</span>
            <span className="font-display text-2xl sm:text-3xl font-bold text-amber-300 mt-1 block">
              {pendingCount}
            </span>
            <div className="absolute right-3 top-3 text-amber-500/20">
              <Clock3 size={28} />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#0D0E11] border border-emerald-500/30 relative overflow-hidden">
            <span className="text-[11px] text-emerald-400 uppercase tracking-wider block font-medium">Confirmed</span>
            <span className="font-display text-2xl sm:text-3xl font-bold text-emerald-300 mt-1 block">
              {confirmedCount}
            </span>
            <div className="absolute right-3 top-3 text-emerald-500/20">
              <CheckCircle2 size={28} />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#0D0E11] border border-[rgba(74,57,28,0.25)] relative overflow-hidden">
            <span className="text-[11px] text-[#B8B2A3] uppercase tracking-wider block font-medium">In Progress</span>
            <span className="font-display text-2xl sm:text-3xl font-bold text-[#D4AF37] mt-1 block">
              {inProgressCount}
            </span>
            <div className="absolute right-3 top-3 text-[rgba(212,175,55,0.2)]">
              <Car size={28} />
            </div>
          </div>

          <div className="col-span-2 sm:col-span-1 p-4 rounded-xl bg-[#0D0E11] border border-[rgba(74,57,28,0.25)] relative overflow-hidden">
            <span className="text-[11px] text-[#D4AF37] uppercase tracking-wider block font-medium">Today's Pickups</span>
            <span className="font-display text-2xl sm:text-3xl font-bold text-[#F8F5EC] mt-1 block">
              {todayPickups}
            </span>
            <div className="absolute right-3 top-3 text-[rgba(212,175,55,0.2)]">
              <Calendar size={28} />
            </div>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex items-center justify-between border-b border-[rgba(74,57,28,0.25)] pb-1">
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => setActiveTab('bookings')}
              className={`px-3.5 py-2 text-xs font-semibold uppercase tracking-wider border-b-2 transition-all flex items-center gap-2 ${
                activeTab === 'bookings'
                  ? 'border-[#D4AF37] text-[#D4AF37]'
                  : 'border-transparent text-[#B8B2A3] hover:text-[#F8F5EC]'
              }`}
            >
              <Car size={14} />
              <span>Bookings ({totalBookings})</span>
            </button>

            <button
              onClick={() => setActiveTab('whatsapp')}
              className={`px-3.5 py-2 text-xs font-semibold uppercase tracking-wider border-b-2 transition-all flex items-center gap-2 ${
                activeTab === 'whatsapp'
                  ? 'border-[#D4AF37] text-[#D4AF37]'
                  : 'border-transparent text-[#B8B2A3] hover:text-[#F8F5EC]'
              }`}
            >
              <Send size={14} className="text-[#25D366]" />
              <span>WhatsApp Automation</span>
            </button>

            <button
              onClick={() => setActiveTab('visas')}
              className={`px-3.5 py-2 text-xs font-semibold uppercase tracking-wider border-b-2 transition-all flex items-center gap-2 ${
                activeTab === 'visas'
                  ? 'border-[#D4AF37] text-[#D4AF37]'
                  : 'border-transparent text-[#B8B2A3] hover:text-[#F8F5EC]'
              }`}
            >
              <Lock size={14} />
              <span>Private Visa Vault</span>
            </button>

            <button
              onClick={() => setActiveTab('infrastructure')}
              className={`px-3.5 py-2 text-xs font-semibold uppercase tracking-wider border-b-2 transition-all flex items-center gap-2 ${
                activeTab === 'infrastructure'
                  ? 'border-[#D4AF37] text-[#D4AF37]'
                  : 'border-transparent text-[#B8B2A3] hover:text-[#F8F5EC]'
              }`}
            >
              <Database size={14} />
              <span>API & Cloud</span>
            </button>
          </div>

          <button
            onClick={loadBookings}
            disabled={isLoading}
            className="p-2 rounded-lg bg-[#14161B] text-[#B8B2A3] hover:text-[#D4AF37] transition-colors"
            title="Refresh bookings data"
          >
            <RefreshCw size={15} className={isLoading ? 'animate-spin' : ''} />
          </button>
        </div>

        {/* Tab 1: Bookings Management */}
        {activeTab === 'bookings' && (
          <div className="space-y-4">
            {/* Search and Filters Bar */}
            <div className="p-3.5 rounded-xl bg-[#0D0E11] border border-[rgba(74,57,28,0.25)] flex flex-col md:flex-row items-center justify-between gap-3">
              <div className="relative w-full md:w-80">
                <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7A756C]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search passenger, phone, MT-Ref, date..."
                  className="w-full bg-[#14161A] border border-[rgba(74,57,28,0.30)] focus:border-[#D4AF37] rounded-lg px-3 pl-9 py-2 text-xs text-[#F8F5EC] outline-none"
                />
              </div>

              <div className="flex items-center gap-2 w-full md:w-auto">
                <div className="flex items-center gap-1.5 text-xs text-[#B8B2A3]">
                  <Filter size={13} />
                  <span>Status:</span>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="bg-[#14161A] border border-[rgba(74,57,28,0.30)] text-xs text-[#F8F5EC] rounded-lg px-2.5 py-1.5 outline-none"
                  >
                    <option value="all">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-[#B8B2A3]">
                  <span>Vehicle:</span>
                  <select
                    value={vehicleFilter}
                    onChange={(e) => setVehicleFilter(e.target.value)}
                    className="bg-[#14161A] border border-[rgba(74,57,28,0.30)] text-xs text-[#F8F5EC] rounded-lg px-2.5 py-1.5 outline-none"
                  >
                    <option value="all">All Vehicles</option>
                    <option value="GMC">GMC</option>
                    <option value="Camry">Camry</option>
                    <option value="Hiace">Hiace</option>
                    <option value="Staria">Staria</option>
                    <option value="Starex">Starex</option>
                    <option value="Bus">Bus</option>
                    <option value="Coaster">Coaster</option>
                  </select>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-[#B8B2A3]">
                  <Lock size={12} className="text-[#D4AF37]" />
                  <span>Visa:</span>
                  <select
                    value={visaFilter}
                    onChange={(e) => setVisaFilter(e.target.value)}
                    className="bg-[#14161A] border border-[rgba(74,57,28,0.30)] text-xs text-[#F8F5EC] rounded-lg px-2.5 py-1.5 outline-none"
                  >
                    <option value="all">All Visa Statuses</option>
                    <option value="uploaded">Uploaded</option>
                    <option value="whatsapp">Via WhatsApp</option>
                    <option value="pending">Pending</option>
                    <option value="local">Local / Not Req</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Bookings Table */}
            <div className="rounded-xl bg-[#0D0E11] border border-[rgba(74,57,28,0.25)] overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-[rgba(74,57,28,0.30)] bg-[#111317] text-[#B8B2A3] uppercase text-[10px] tracking-wider font-semibold">
                      <th className="py-3 px-4">Booking Ref</th>
                      <th className="py-3 px-4">Customer & Contact</th>
                      <th className="py-3 px-4">Route & Schedule</th>
                      <th className="py-3 px-4">Vehicle & Pax</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Visa Status</th>
                      <th className="py-3 px-4">WhatsApp Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[rgba(74,57,28,0.15)]">
                    {filteredBookings.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="text-center py-12 text-[#7A756C]">
                          No bookings found matching your search and filter criteria.
                        </td>
                      </tr>
                    ) : (
                      filteredBookings.map((b) => {
                        const leadSeg = b.segments?.[0];
                        const latestWa = b.whatsapp_logs?.[b.whatsapp_logs.length - 1];

                        return (
                          <tr key={b.id} className="hover:bg-[#131519] transition-colors">
                            {/* Ref & Source */}
                            <td className="py-3.5 px-4">
                              <span className="font-mono font-bold text-[#D4AF37] block">
                                {b.booking_reference}
                              </span>
                              <span className="text-[10px] text-[#7A756C] capitalize block">
                                {b.source === 'website' ? '🌐 Public Web' : '👔 Admin Direct'}
                              </span>
                            </td>

                            {/* Customer */}
                            <td className="py-3.5 px-4">
                              <span className="font-semibold text-[#F8F5EC] block">{b.customer_name}</span>
                              <a
                                href={`https://wa.me/${b.customer_phone}`}
                                target="_blank"
                                rel="noreferrer"
                                className="text-[11px] text-[#B8B2A3] hover:text-[#25D366] inline-flex items-center gap-1 transition-colors"
                              >
                                <span>+{b.customer_phone}</span>
                              </a>
                              {b.nationality && (
                                <span className="text-[10px] text-[#7A756C] block">
                                  {b.nationality} ({b.is_international ? 'Intl' : 'Local'})
                                </span>
                              )}
                            </td>

                            {/* Route & Schedule */}
                            <td className="py-3.5 px-4 max-w-xs">
                              {leadSeg ? (
                                <div>
                                  <div className="font-medium text-[#F8F5EC] truncate">
                                    <span>{leadSeg.pickup_location}</span>
                                    <span className="text-[#D4AF37] mx-1">→</span>
                                    <span>{leadSeg.drop_location}</span>
                                  </div>
                                  <div className="text-[10px] text-[#7A756C] flex items-center gap-2 mt-0.5">
                                    <span>📅 {leadSeg.pickup_date}</span>
                                    <span>⏰ {leadSeg.pickup_time}</span>
                                    {b.segments && b.segments.length > 1 && (
                                       <span className="text-[#D4AF37] font-semibold">
                                         (+{b.segments.length - 1} Leg)
                                       </span>
                                    )}
                                  </div>
                                </div>
                              ) : (
                                <span className="text-gray-500">No route legs</span>
                              )}
                            </td>

                            {/* Vehicle & Pax */}
                            <td className="py-3.5 px-4">
                              <span className="font-semibold text-[#F8F5EC] block">
                                {leadSeg?.vehicle_type || 'Vehicle'}
                              </span>
                              <span className="text-[10px] text-[#7A756C] block">
                                {b.passengers} Passenger(s)
                              </span>
                            </td>

                            {/* Status Selector */}
                            <td className="py-3.5 px-4">
                              <select
                                value={b.status}
                                onChange={(e) => handleStatusChange(b, e.target.value as BookingStatus)}
                                className={`text-[10.5px] font-bold uppercase rounded-lg px-2.5 py-1 outline-none border cursor-pointer ${
                                  b.status === 'confirmed'
                                    ? 'bg-emerald-950/60 text-emerald-400 border-emerald-500/40'
                                    : b.status === 'pending'
                                    ? 'bg-amber-950/60 text-amber-300 border-amber-500/40'
                                    : b.status === 'in_progress'
                                    ? 'bg-blue-950/60 text-blue-300 border-blue-500/40'
                                    : b.status === 'completed'
                                    ? 'bg-purple-950/60 text-purple-300 border-purple-500/40'
                                    : 'bg-red-950/60 text-red-400 border-red-500/40'
                                }`}
                              >
                                <option value="pending">Pending</option>
                                <option value="confirmed">Confirmed</option>
                                <option value="in_progress">In Progress</option>
                                <option value="completed">Completed</option>
                                <option value="cancelled">Cancelled</option>
                              </select>
                            </td>

                            {/* Visa Status */}
                            <td className="py-3.5 px-4">
                              {b.visa_status === 'uploaded' ? (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setSelectedVisaBooking(b);
                                    setIsVisaModalOpen(true);
                                  }}
                                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-emerald-950/70 border border-emerald-500/40 text-emerald-400 hover:border-emerald-400 transition-colors cursor-pointer"
                                  title="Click to view uploaded visa document in secure vault"
                                >
                                  <Lock size={10} />
                                  <span>Uploaded</span>
                                </button>
                              ) : b.visa_status === 'whatsapp' ? (
                                <button
                                  type="button"
                                  onClick={() => {
                                    const clean = b.customer_phone.replace(/[^0-9]/g, '');
                                    window.open(`https://wa.me/${clean}`, '_blank');
                                  }}
                                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-[#25D366]/15 border border-[#25D366]/40 text-[#25D366] hover:bg-[#25D366]/25 transition-colors cursor-pointer"
                                  title="Customer sending visa via WhatsApp"
                                >
                                  <span>📱 Via WhatsApp</span>
                                </button>
                              ) : b.visa_status === 'pending' ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-amber-950/60 border border-amber-500/40 text-amber-300">
                                  <span>⏳ Pending</span>
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] text-[#7A756C] bg-white/5 border border-white/5">
                                  <span>{b.is_international ? 'Not Provided' : 'Local / N/A'}</span>
                                </span>
                              )}
                            </td>

                            {/* WhatsApp Receipt Status */}
                            <td className="py-3.5 px-4">
                              {latestWa ? (
                                <div className="flex items-center gap-1.5">
                                  <span
                                    className={`w-2 h-2 rounded-full ${
                                      latestWa.status === 'delivered' || latestWa.status === 'read'
                                        ? 'bg-emerald-400'
                                        : latestWa.status === 'sent' || latestWa.status === 'manual_sent'
                                        ? 'bg-blue-400'
                                        : 'bg-red-400'
                                    }`}
                                  />
                                  <span className="capitalize text-[11px] font-medium text-[#E5E0D5]">
                                    {latestWa.status.replace('_', ' ')}
                                  </span>
                                </div>
                              ) : (
                                <span className="text-[10px] text-[#7A756C] italic">Not sent</span>
                              )}
                            </td>

                            {/* Actions */}
                            <td className="py-3.5 px-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                {/* 1-Click Action: Confirm & Send Voucher */}
                                <button
                                  onClick={() => handleQuickConfirmAndSendVoucher(b)}
                                  title="1-Click: Confirm Booking & Send WhatsApp Voucher"
                                  className="p-1.5 rounded-lg bg-[rgba(212,175,55,0.20)] border border-[rgba(212,175,55,0.45)] text-[#D4AF37] hover:bg-[rgba(212,175,55,0.35)] hover:scale-105 transition-all cursor-pointer shadow-sm"
                                >
                                  <Zap size={14} fill="currentColor" />
                                </button>

                                {/* View Details Modal */}
                                <button
                                  onClick={() => {
                                    setSelectedDetailBooking(b);
                                    setIsDetailModalOpen(true);
                                  }}
                                  title="View Full Booking Details"
                                  className="p-1.5 rounded-lg bg-[#181A1F] text-[#F8F5EC] hover:bg-[#252830] transition-colors cursor-pointer"
                                >
                                  <Eye size={14} />
                                </button>

                                {/* Voucher Preview */}
                                <button
                                  onClick={() => {
                                    setSelectedVoucherBooking(b);
                                    setIsVoucherModalOpen(true);
                                  }}
                                  title="View & Download PDF Voucher"
                                  className="p-1.5 rounded-lg bg-[#181A1F] text-[#D4AF37] hover:bg-[#252830] transition-colors cursor-pointer"
                                >
                                  <FileText size={14} />
                                </button>

                                {/* WhatsApp Dispatch */}
                                <button
                                  onClick={() => {
                                    setSelectedWhatsAppBooking(b);
                                    setIsWhatsAppModalOpen(true);
                                  }}
                                  title="Send WhatsApp Confirmation"
                                  className="p-1.5 rounded-lg bg-[#25D366]/20 text-[#25D366] hover:bg-[#25D366]/30 transition-colors cursor-pointer"
                                >
                                  <Send size={14} />
                                </button>

                                {/* Visa Docs */}
                                <button
                                  onClick={() => {
                                    setSelectedVisaBooking(b);
                                    setIsVisaModalOpen(true);
                                  }}
                                  title="Private Visa Documents"
                                  className="p-1.5 rounded-lg bg-[#181A1F] text-[#B8B2A3] hover:text-[#D4AF37] hover:bg-[#252830] transition-colors cursor-pointer"
                                >
                                  <Lock size={14} />
                                </button>

                                {/* Edit */}
                                <button
                                  onClick={() => {
                                    setEditingBooking(b);
                                    setIsBookingModalOpen(true);
                                  }}
                                  title="Edit Booking"
                                  className="p-1.5 rounded-lg bg-[#181A1F] text-[#B8B2A3] hover:text-[#F8F5EC] hover:bg-[#252830] transition-colors cursor-pointer"
                                >
                                  <Edit size={14} />
                                </button>

                                {/* Delete (Super Admin / Ops) */}
                                {isSuperAdmin && (
                                  <button
                                    onClick={() => handleDeleteBooking(b)}
                                    title="Delete Booking"
                                    className="p-1.5 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-950/40 transition-colors cursor-pointer"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: WhatsApp Automation Center */}
        {activeTab === 'whatsapp' && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-[#0D0E11] border border-[rgba(74,57,28,0.25)] flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-sm text-[#F8F5EC] flex items-center gap-2">
                  <Send size={16} className="text-[#25D366]" />
                  <span>WhatsApp Business Cloud API Automation Tracker</span>
                </h3>
                <p className="text-xs text-[#B8B2A3] mt-0.5">
                  Real-time monitoring of automated customer confirmations, PDF voucher attachments, and delivery status webhooks.
                </p>
              </div>
            </div>

            <div className="rounded-xl bg-[#0D0E11] border border-[rgba(74,57,28,0.25)] overflow-hidden">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[rgba(74,57,28,0.30)] bg-[#111317] text-[#B8B2A3] uppercase text-[10px] tracking-wider">
                    <th className="py-3 px-4">Booking Ref</th>
                    <th className="py-3 px-4">Recipient</th>
                    <th className="py-3 px-4">Channel / Type</th>
                    <th className="py-3 px-4">Dispatched At</th>
                    <th className="py-3 px-4">Delivery Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[rgba(74,57,28,0.15)]">
                  {bookings.flatMap((b) => (b.whatsapp_logs || []).map((log) => ({ log, booking: b }))).length ===
                  0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-10 text-[#7A756C]">
                        No WhatsApp confirmation messages have been dispatched yet.
                      </td>
                    </tr>
                  ) : (
                    bookings
                      .flatMap((b) => (b.whatsapp_logs || []).map((log) => ({ log, booking: b })))
                      .map(({ log, booking }, idx) => (
                        <tr key={idx} className="hover:bg-[#131519] transition-colors">
                          <td className="py-3 px-4 font-mono font-bold text-[#D4AF37]">
                            {booking.booking_reference}
                          </td>
                          <td className="py-3 px-4">
                            <span className="font-semibold text-[#F8F5EC] block">{booking.customer_name}</span>
                            <span className="text-[11px] text-[#7A756C]">+{log.recipient_phone}</span>
                          </td>
                          <td className="py-3 px-4">
                            <span className="capitalize">
                              {log.is_manual_fallback ? 'Manual Web Dispatch' : 'Meta Cloud API Template'}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-[#B8B2A3]">
                            {new Date(log.sent_at).toLocaleString()}
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded ${
                                log.status === 'delivered' || log.status === 'read'
                                  ? 'bg-emerald-950 text-emerald-400'
                                  : log.status === 'sent' || log.status === 'manual_sent'
                                  ? 'bg-blue-950 text-blue-400'
                                  : 'bg-red-950 text-red-400'
                              }`}
                            >
                              {log.status.replace('_', ' ')}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <button
                              onClick={() => {
                                setSelectedWhatsAppBooking(booking);
                                setIsWhatsAppModalOpen(true);
                              }}
                              className="px-2.5 py-1 rounded bg-[#181A1F] text-xs text-[#D4AF37] hover:bg-[#252830] transition-colors"
                            >
                              Resend
                            </button>
                          </td>
                        </tr>
                      ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Private Documents Vault */}
        {activeTab === 'visas' && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-[#0D0E11] border border-[rgba(74,57,28,0.25)] flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-sm text-[#F8F5EC] flex items-center gap-2">
                  <Lock size={16} className="text-[#D4AF37]" />
                  <span>Private Visa & Passport Vault</span>
                </h3>
                <p className="text-xs text-[#B8B2A3] mt-0.5">
                  All sensitive traveler identity documents are stored in private cloud storage. Zero public links.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {bookings.map((b) => (
                <div key={b.id} className="p-4 rounded-xl bg-[#0D0E11] border border-[rgba(74,57,28,0.25)] flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono font-bold text-xs text-[#D4AF37]">{b.booking_reference}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-[#181A1F] text-[#B8B2A3]">
                        {b.documents?.length || 0} File(s)
                      </span>
                    </div>
                    <span className="font-semibold text-sm text-[#F8F5EC] block">{b.customer_name}</span>
                    <span className="text-xs text-[#7A756C] block mt-0.5">WhatsApp: +{b.customer_phone}</span>
                  </div>

                  <div className="pt-4 border-t border-[rgba(74,57,28,0.20)] mt-4">
                    <button
                      onClick={() => {
                        setSelectedVisaBooking(b);
                        setIsVisaModalOpen(true);
                      }}
                      className="w-full py-2 rounded-lg bg-[rgba(212,175,55,0.12)] border border-[rgba(212,175,55,0.30)] text-[#D4AF37] hover:bg-[rgba(212,175,55,0.22)] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Lock size={13} />
                      <span>Manage Private Documents</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: API & Cloud Infrastructure Status */}
        {activeTab === 'infrastructure' && (
          <div className="space-y-4 max-w-3xl mx-auto">
            <div className="p-6 rounded-xl bg-[#0D0E11] border border-[rgba(74,57,28,0.30)] space-y-5">
              <h3 className="font-display text-lg font-bold text-[#F8F5EC]">
                Backend & Cloud Infrastructure Status
              </h3>

              {/* Supabase PostgreSQL status */}
              <div className="p-4 rounded-xl bg-[#14161A] border border-[rgba(74,57,28,0.25)] flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2.5 h-2.5 rounded-full ${
                        isSupabaseConfigured() ? 'bg-emerald-400' : 'bg-amber-400'
                      }`}
                    />
                    <span className="font-semibold text-sm text-[#F8F5EC]">
                      Supabase PostgreSQL & Private Storage
                    </span>
                  </div>
                  <p className="text-xs text-[#B8B2A3] mt-1">
                    {isSupabaseConfigured()
                      ? 'Live connection verified. All bookings, multi-leg segments, and private documents sync across all admin devices.'
                      : 'Running in resilient Local Mode. To enable full cloud sync across multiple devices, add your VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file.'}
                  </p>
                </div>
                <span
                  className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded shrink-0 ${
                    isSupabaseConfigured() ? 'bg-emerald-950 text-emerald-400' : 'bg-amber-950 text-amber-300'
                  }`}
                >
                  {isSupabaseConfigured() ? 'Connected' : 'Local Fallback'}
                </span>
              </div>

              {/* Meta WhatsApp Cloud API status */}
              <div className="p-4 rounded-xl bg-[#14161A] border border-[rgba(74,57,28,0.25)] flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                    <span className="font-semibold text-sm text-[#F8F5EC]">
                      WhatsApp Dispatch Engine
                    </span>
                  </div>
                  <p className="text-xs text-[#B8B2A3] mt-1">
                    Direct 1-click WhatsApp Dispatch is active with Umrah template formatting and automatic luxury PDF voucher generation. Edge Function endpoints ready for Meta Graph API tokens.
                  </p>
                </div>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 shrink-0">
                  Ready
                </span>
              </div>

              {/* Database Migration Instructions */}
              <div className="p-4 rounded-xl bg-[#101216] border border-[rgba(74,57,28,0.20)] text-xs text-[#B8B2A3] space-y-2">
                <span className="text-[#D4AF37] font-semibold block uppercase tracking-wider text-[11px]">
                  Database Migration Reference
                </span>
                <p>
                  The complete production migration schema is saved at{' '}
                  <code className="text-[#D4AF37] bg-black/40 px-1 py-0.5 rounded">
                    supabase/migrations/001_initial_schema.sql
                  </code>
                  . Execute this script in your Supabase project SQL Editor to instantiate all tables, RLS policies, sequences, and private storage buckets.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* All Modal Windows */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        onSave={handleSaveBooking}
        existingBooking={editingBooking}
      />

      <VoucherPreviewModal
        isOpen={isVoucherModalOpen}
        onClose={() => setIsVoucherModalOpen(false)}
        booking={selectedVoucherBooking}
        onOpenWhatsApp={(b) => {
          setSelectedWhatsAppBooking(b);
          setIsWhatsAppModalOpen(true);
        }}
      />

      <WhatsAppDispatchModal
        isOpen={isWhatsAppModalOpen}
        onClose={() => setIsWhatsAppModalOpen(false)}
        booking={selectedWhatsAppBooking}
        onSuccess={loadBookings}
      />

      <VisaManagerModal
        isOpen={isVisaModalOpen}
        onClose={() => setIsVisaModalOpen(false)}
        booking={selectedVisaBooking}
      />

      <BookingDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        booking={selectedDetailBooking}
        onConfirmAndSendVoucher={(b) => {
          setIsDetailModalOpen(false);
          handleQuickConfirmAndSendVoucher(b);
        }}
        onConfirmOnly={(b) => {
          handleStatusChange(b, 'confirmed');
          setIsDetailModalOpen(false);
        }}
        onCancelBooking={(b) => {
          handleCancelBooking(b);
        }}
        onOpenVoucher={(b) => {
          setSelectedVoucherBooking(b);
          setIsVoucherModalOpen(true);
        }}
        onOpenWhatsApp={(b) => {
          setSelectedWhatsAppBooking(b);
          setIsWhatsAppModalOpen(true);
        }}
        onOpenVisaVault={(b) => {
          setSelectedVisaBooking(b);
          setIsVisaModalOpen(true);
        }}
        onEdit={(b) => {
          setIsDetailModalOpen(false);
          setEditingBooking(b);
          setIsBookingModalOpen(true);
        }}
      />
    </div>
  );
};

export default AdminDashboard;
