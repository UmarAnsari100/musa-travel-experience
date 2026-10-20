import React, { useState } from 'react';
import { Booking, JourneySegment, BookingStatus, PaymentStatus } from '@/types/booking';
import { X, Plus, Trash2, Calendar, Clock, MapPin, Car, User, Phone, Mail, DollarSign, FileText } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (booking: Partial<Booking> & { segments: JourneySegment[] }) => Promise<void>;
  existingBooking?: Booking | null;
}

const COMMON_UMRAH_ROUTES = [
  { label: 'Jeddah Airport (KAIA) → Makkah Hotel', from: 'Jeddah Airport (KAIA Terminal 1)', to: 'Makkah Hotel (Haram Area)' },
  { label: 'Makkah Hotel → Madinah Munawwarah', from: 'Makkah Hotel', to: 'Madinah Hotel (Central Area)' },
  { label: 'Madinah Hotel → Makkah Al-Mukarramah', from: 'Madinah Hotel', to: 'Makkah Hotel' },
  { label: 'Madinah Airport (MED) → Madinah Hotel', from: 'Prince Mohammad Bin Abdulaziz Airport (MED)', to: 'Madinah Hotel' },
  { label: 'Makkah Hotel → Jeddah Airport (KAIA)', from: 'Makkah Hotel', to: 'Jeddah International Airport (KAIA)' },
  { label: 'Makkah Ziyarat Tour (Cave Hira / Jabal Noor)', from: 'Makkah Hotel', to: 'Makkah Holy Ziyarat Sites' },
  { label: 'Madinah Ziyarat Tour (Masjid Quba / Uhud)', from: 'Madinah Hotel', to: 'Madinah Sacred Ziyarat Sites' },
];

const VEHICLE_OPTIONS = ['GMC', 'Camry', 'Hiace', 'Staria', 'Starex', 'Coaster', 'Bus'];

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  onSave,
  existingBooking,
}) => {
  if (!isOpen) return null;

  const [customerName, setCustomerName] = useState(existingBooking?.customer_name || '');
  const [customerPhone, setCustomerPhone] = useState(existingBooking?.customer_phone || '');
  const [customerEmail, setCustomerEmail] = useState(existingBooking?.customer_email || '');
  const [passengers, setPassengers] = useState(existingBooking?.passengers || 1);
  const [additionalPassengersText, setAdditionalPassengersText] = useState(
    (existingBooking?.additional_passengers || []).join(', ')
  );
  const [serviceType, setServiceType] = useState(existingBooking?.service_type || 'Hajj & Umrah Transfers');
  const [status, setStatus] = useState<BookingStatus>(existingBooking?.status || 'confirmed');
  const [totalPrice, setTotalPrice] = useState<number | ''>(existingBooking?.total_price || '');
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>(existingBooking?.payment_status || 'unpaid');
  const [specialInstructions, setSpecialInstructions] = useState(existingBooking?.special_instructions || '');
  const [internalNotes, setInternalNotes] = useState(existingBooking?.internal_notes || '');

  // Multi-segment Journey Legs
  const [segments, setSegments] = useState<JourneySegment[]>(
    existingBooking?.segments && existingBooking.segments.length > 0
      ? existingBooking.segments
      : [
          {
            segment_order: 1,
            pickup_location: 'Jeddah International Airport (KAIA)',
            drop_location: 'Makkah Hotel (Haram Zone)',
            pickup_date: new Date().toISOString().split('T')[0],
            pickup_time: '12:00',
            vehicle_type: 'GMC',
            number_of_vehicles: 1,
          },
        ]
  );

  const [isSaving, setIsSaving] = useState(false);

  const handleAddSegment = () => {
    setSegments([
      ...segments,
      {
        segment_order: segments.length + 1,
        pickup_location: '',
        drop_location: '',
        pickup_date: new Date().toISOString().split('T')[0],
        pickup_time: '12:00',
        vehicle_type: 'GMC',
        number_of_vehicles: 1,
      },
    ]);
  };

  const handleRemoveSegment = (index: number) => {
    if (segments.length === 1) {
      toast.error('At least one journey segment is required.');
      return;
    }
    setSegments(segments.filter((_, i) => i !== index));
  };

  const handleSegmentChange = (index: number, field: keyof JourneySegment, value: any) => {
    const updated = [...segments];
    updated[index] = { ...updated[index], [field]: value };
    setSegments(updated);
  };

  const applyQuickRoute = (index: number, route: { from: string; to: string }) => {
    handleSegmentChange(index, 'pickup_location', route.from);
    handleSegmentChange(index, 'drop_location', route.to);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerName.trim() || !customerPhone.trim()) {
      toast.error('Customer name and WhatsApp phone number are required.');
      return;
    }

    for (let i = 0; i < segments.length; i++) {
      if (!segments[i].pickup_location.trim() || !segments[i].drop_location.trim()) {
        toast.error(`Please provide pickup and destination for Journey Leg #${i + 1}`);
        return;
      }
    }

    const additionalPassengers = additionalPassengersText
      .split(',')
      .map((p) => p.trim())
      .filter(Boolean);

    setIsSaving(true);
    try {
      await onSave({
        id: existingBooking?.id,
        booking_reference: existingBooking?.booking_reference,
        customer_name: customerName.trim(),
        customer_phone: customerPhone.replace(/[^0-9]/g, ''),
        customer_email: customerEmail.trim() || undefined,
        passengers: Number(passengers),
        additional_passengers: additionalPassengers,
        service_type: serviceType,
        status,
        total_price: totalPrice ? Number(totalPrice) : undefined,
        currency: 'SAR',
        payment_status: paymentStatus,
        special_instructions: specialInstructions.trim(),
        internal_notes: internalNotes.trim(),
        segments: segments.map((s, idx) => ({ ...s, segment_order: idx + 1 })),
      });
      toast.success(existingBooking ? 'Booking updated successfully.' : 'New Umrah booking created.');
      onClose();
    } catch (err: any) {
      toast.error(err.message || 'Failed to save booking.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-[#0D0E10] border border-[rgba(201,162,39,0.35)] rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.9)] overflow-hidden font-body text-[#F8F5EC]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[rgba(74,57,28,0.30)] bg-[#111317]">
          <div>
            <h2 className="font-display text-lg sm:text-xl font-bold text-[#F8F5EC] flex items-center gap-2">
              <span>{existingBooking ? 'Edit Umrah Booking' : 'Create New Umrah Transportation Booking'}</span>
              {existingBooking && (
                <span className="text-xs px-2.5 py-0.5 rounded bg-[rgba(212,175,55,0.15)] border border-[rgba(212,175,55,0.35)] text-[#D4AF37] font-mono">
                  {existingBooking.booking_reference}
                </span>
              )}
            </h2>
            <p className="text-xs text-[#B8B2A3] mt-0.5">
              Enter customer details, multi-leg journey coordinates, and dispatch instructions.
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-[#181A1F] text-[#B8B2A3] hover:text-[#F8F5EC] hover:bg-[#22252B] flex items-center justify-center transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Section 1: Customer Details */}
          <div className="bg-[#14161A] border border-[rgba(74,57,28,0.25)] rounded-xl p-4 sm:p-5">
            <h3 className="text-xs uppercase tracking-wider font-semibold text-[#D4AF37] mb-4 flex items-center gap-2">
              <User size={14} />
              <span>Customer & Passenger Information</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs text-[#B8B2A3] mb-1.5">Full Name *</label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Ahmed Tariq Khan"
                  className="w-full bg-[#0D0E10] border border-[rgba(74,57,28,0.35)] focus:border-[#D4AF37] rounded-lg px-3 py-2 text-sm text-[#F8F5EC] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs text-[#B8B2A3] mb-1.5">WhatsApp Number (with Country Code) *</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-[#D4AF37] font-semibold">+</span>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="966597100424"
                    className="w-full bg-[#0D0E10] border border-[rgba(74,57,28,0.35)] focus:border-[#D4AF37] rounded-lg px-3 pl-7 py-2 text-sm text-[#F8F5EC] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-[#B8B2A3] mb-1.5">Customer Email (Optional)</label>
                <input
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="customer@example.com"
                  className="w-full bg-[#0D0E10] border border-[rgba(74,57,28,0.35)] focus:border-[#D4AF37] rounded-lg px-3 py-2 text-sm text-[#F8F5EC] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs text-[#B8B2A3] mb-1.5">Number of Passengers</label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={passengers}
                  onChange={(e) => setPassengers(Number(e.target.value))}
                  className="w-full bg-[#0D0E10] border border-[rgba(74,57,28,0.35)] focus:border-[#D4AF37] rounded-lg px-3 py-2 text-sm text-[#F8F5EC] outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs text-[#B8B2A3] mb-1.5">Additional Passenger Names (comma separated)</label>
                <input
                  type="text"
                  value={additionalPassengersText}
                  onChange={(e) => setAdditionalPassengersText(e.target.value)}
                  placeholder="e.g. Fatima Khan, Zaid Khan"
                  className="w-full bg-[#0D0E10] border border-[rgba(74,57,28,0.35)] focus:border-[#D4AF37] rounded-lg px-3 py-2 text-sm text-[#F8F5EC] outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Journey Segments (Multi-Leg) */}
          <div className="bg-[#14161A] border border-[rgba(74,57,28,0.25)] rounded-xl p-4 sm:p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs uppercase tracking-wider font-semibold text-[#D4AF37] flex items-center gap-2">
                <Car size={14} />
                <span>Journey Segments ({segments.length} Leg{segments.length > 1 ? 's' : ''})</span>
              </h3>
              <button
                type="button"
                onClick={handleAddSegment}
                className="px-3 py-1.5 rounded-lg bg-[rgba(212,175,55,0.12)] border border-[rgba(212,175,55,0.35)] text-[#D4AF37] hover:bg-[rgba(212,175,55,0.25)] text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Plus size={14} />
                <span>Add Journey Leg</span>
              </button>
            </div>

            <div className="space-y-4">
              {segments.map((seg, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-[#0D0E10] border border-[rgba(74,57,28,0.30)] relative">
                  <div className="flex items-center justify-between mb-3 pb-2 border-b border-[rgba(74,57,28,0.20)]">
                    <span className="text-xs font-semibold text-[#D4AF37] uppercase tracking-wider">
                      Journey Leg #{idx + 1}
                    </span>
                    {segments.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveSegment(idx)}
                        className="text-red-400 hover:text-red-300 text-xs flex items-center gap-1 transition-colors"
                      >
                        <Trash2 size={13} />
                        <span>Remove Leg</span>
                      </button>
                    )}
                  </div>

                  {/* Quick route selector */}
                  <div className="mb-3">
                    <span className="text-[11px] text-[#B8B2A3] mr-2">Quick Route Presets:</span>
                    <select
                      className="bg-[#181A1F] border border-[rgba(74,57,28,0.35)] text-xs text-[#F8F5EC] rounded px-2 py-1 outline-none"
                      onChange={(e) => {
                        const route = COMMON_UMRAH_ROUTES[Number(e.target.value)];
                        if (route) applyQuickRoute(idx, route);
                      }}
                      defaultValue=""
                    >
                      <option value="" disabled>
                        Select common Umrah route...
                      </option>
                      {COMMON_UMRAH_ROUTES.map((r, rIdx) => (
                        <option key={rIdx} value={rIdx}>
                          {r.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-[11px] text-[#B8B2A3] mb-1">Pickup Location *</label>
                      <input
                        type="text"
                        required
                        value={seg.pickup_location}
                        onChange={(e) => handleSegmentChange(idx, 'pickup_location', e.target.value)}
                        placeholder="e.g. Jeddah KAIA Airport"
                        className="w-full bg-[#181A1F] border border-[rgba(74,57,28,0.35)] rounded px-3 py-1.5 text-xs text-[#F8F5EC] outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] text-[#B8B2A3] mb-1">Destination Location *</label>
                      <input
                        type="text"
                        required
                        value={seg.drop_location}
                        onChange={(e) => handleSegmentChange(idx, 'drop_location', e.target.value)}
                        placeholder="e.g. Clock Tower Hotel, Makkah"
                        className="w-full bg-[#181A1F] border border-[rgba(74,57,28,0.35)] rounded px-3 py-1.5 text-xs text-[#F8F5EC] outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] text-[#B8B2A3] mb-1">Pickup Date *</label>
                      <input
                        type="date"
                        required
                        value={seg.pickup_date}
                        onChange={(e) => handleSegmentChange(idx, 'pickup_date', e.target.value)}
                        className="w-full bg-[#181A1F] border border-[rgba(74,57,28,0.35)] rounded px-3 py-1.5 text-xs text-[#F8F5EC] outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] text-[#B8B2A3] mb-1">Pickup Time *</label>
                      <input
                        type="time"
                        required
                        value={seg.pickup_time}
                        onChange={(e) => handleSegmentChange(idx, 'pickup_time', e.target.value)}
                        className="w-full bg-[#181A1F] border border-[rgba(74,57,28,0.35)] rounded px-3 py-1.5 text-xs text-[#F8F5EC] outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] text-[#B8B2A3] mb-1">Vehicle Type</label>
                      <select
                        value={seg.vehicle_type}
                        onChange={(e) => handleSegmentChange(idx, 'vehicle_type', e.target.value)}
                        className="w-full bg-[#181A1F] border border-[rgba(74,57,28,0.35)] rounded px-3 py-1.5 text-xs text-[#F8F5EC] outline-none"
                      >
                        {VEHICLE_OPTIONS.map((v) => (
                          <option key={v} value={v}>
                            {v}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] text-[#B8B2A3] mb-1">Number of Vehicles</label>
                      <input
                        type="number"
                        min="1"
                        max="20"
                        value={seg.number_of_vehicles || 1}
                        onChange={(e) => handleSegmentChange(idx, 'number_of_vehicles', Number(e.target.value))}
                        className="w-full bg-[#181A1F] border border-[rgba(74,57,28,0.35)] rounded px-3 py-1.5 text-xs text-[#F8F5EC] outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] text-[#B8B2A3] mb-1">Flight Number (if airport)</label>
                      <input
                        type="text"
                        value={seg.flight_number || ''}
                        onChange={(e) => handleSegmentChange(idx, 'flight_number', e.target.value)}
                        placeholder="e.g. SV 734"
                        className="w-full bg-[#181A1F] border border-[rgba(74,57,28,0.35)] rounded px-3 py-1.5 text-xs text-[#F8F5EC] outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] text-[#B8B2A3] mb-1">Hotel / Terminal</label>
                      <input
                        type="text"
                        value={seg.hotel_name || ''}
                        onChange={(e) => handleSegmentChange(idx, 'hotel_name', e.target.value)}
                        placeholder="e.g. Swissotel Makkah"
                        className="w-full bg-[#181A1F] border border-[rgba(74,57,28,0.35)] rounded px-3 py-1.5 text-xs text-[#F8F5EC] outline-none"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Financial & Status Information */}
          <div className="bg-[#14161A] border border-[rgba(74,57,28,0.25)] rounded-xl p-4 sm:p-5">
            <h3 className="text-xs uppercase tracking-wider font-semibold text-[#D4AF37] mb-4 flex items-center gap-2">
              <DollarSign size={14} />
              <span>Status & Operations Coordination</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs text-[#B8B2A3] mb-1.5">Booking Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as BookingStatus)}
                  className="w-full bg-[#0D0E10] border border-[rgba(74,57,28,0.35)] rounded-lg px-3 py-2 text-sm text-[#F8F5EC] outline-none"
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-[#B8B2A3] mb-1.5">Total Price (SAR)</label>
                <input
                  type="number"
                  min="0"
                  step="10"
                  value={totalPrice}
                  onChange={(e) => setTotalPrice(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="e.g. 650"
                  className="w-full bg-[#0D0E10] border border-[rgba(74,57,28,0.35)] rounded-lg px-3 py-2 text-sm text-[#F8F5EC] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs text-[#B8B2A3] mb-1.5">Payment Status</label>
                <select
                  value={paymentStatus}
                  onChange={(e) => setPaymentStatus(e.target.value as PaymentStatus)}
                  className="w-full bg-[#0D0E10] border border-[rgba(74,57,28,0.35)] rounded-lg px-3 py-2 text-sm text-[#F8F5EC] outline-none"
                >
                  <option value="unpaid">Unpaid</option>
                  <option value="partial">Partial</option>
                  <option value="paid">Paid</option>
                  <option value="refunded">Refunded</option>
                </select>
              </div>

              <div className="sm:col-span-3">
                <label className="block text-xs text-[#B8B2A3] mb-1.5">Special Instructions (Printed on Voucher)</label>
                <textarea
                  rows={2}
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  placeholder="e.g. Large luggage trunk needed, elderly pilgrim requires wheelchair assistance."
                  className="w-full bg-[#0D0E10] border border-[rgba(74,57,28,0.35)] rounded-lg px-3 py-2 text-sm text-[#F8F5EC] outline-none"
                />
              </div>

              <div className="sm:col-span-3">
                <label className="block text-xs text-[#B8B2A3] mb-1.5">Internal Administrative Notes (Private Staff Only)</label>
                <input
                  type="text"
                  value={internalNotes}
                  onChange={(e) => setInternalNotes(e.target.value)}
                  placeholder="e.g. Assigned to driver Abu Fahad (GMC Yukon 2024 - Plate: 4821 KSA)"
                  className="w-full bg-[#0D0E10] border border-[rgba(74,57,28,0.35)] rounded-lg px-3 py-2 text-sm text-[#F8F5EC] outline-none"
                />
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[rgba(74,57,28,0.30)]">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="px-5 py-2.5 rounded-xl border border-[rgba(74,57,28,0.35)] text-[#B8B2A3] hover:text-[#F8F5EC] text-sm font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-7 py-2.5 rounded-xl font-semibold text-sm text-[#050505] transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 shadow-[0_4px_16px_rgba(212,175,55,0.35)]"
              style={{
                background: 'linear-gradient(135deg, #D7B447 0%, #A47B16 100%)',
              }}
            >
              {isSaving ? 'Saving Booking...' : existingBooking ? 'Update Booking' : 'Save & Create Booking'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
