import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { Booking, BookingStatus, JourneySegment } from '@/types/booking';

const LOCAL_STORAGE_BACKUP_KEY = 'musa_transport_bookings_store';

// High-quality realistic Umrah seed records for immediate testing & demo
const INITIAL_DEMO_BOOKINGS: Booking[] = [
  {
    id: 'b1-demo-umrah-1',
    booking_reference: 'MT-2026-00125',
    customer_name: 'Ahmed Tariq Khan',
    customer_phone: '966597100424',
    customer_email: 'ahmed.tariq@gmail.com',
    passengers: 4,
    additional_passengers: ['Fatima Khan', 'Zaid Khan', 'Amina Khan'],
    service_type: 'Hajj & Umrah Transfers',
    status: 'confirmed',
    total_price: 650,
    currency: 'SAR',
    payment_status: 'paid',
    is_international: false,
    nationality: 'Saudi Arabia',
    visa_status: 'not_required',
    special_instructions: 'Arriving with 4 large suitcases and elderly mother; need wheelchair assistance if possible.',
    internal_notes: 'Driver Assigned: Abu Fahad (GMC Yukon 2024 - Plate: 4821 KSA)',
    source: 'website',
    created_at: new Date(Date.now() - 3600000 * 4).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 2).toISOString(),
    segments: [
      {
        id: 'seg-1',
        segment_order: 1,
        pickup_location: 'Jeddah International Airport (KAIA Terminal 1)',
        drop_location: 'Swissotel Makkah, Clock Tower Complex',
        pickup_date: '2026-10-25',
        pickup_time: '10:30',
        flight_number: 'SV 734',
        hotel_name: 'Swissotel Makkah',
        vehicle_type: 'GMC',
        number_of_vehicles: 1,
        notes: 'Paging sign: AHMED TARIQ KHAN',
      },
      {
        id: 'seg-2',
        segment_order: 2,
        pickup_location: 'Swissotel Makkah',
        drop_location: 'Oberoi Hotel, Madinah Munawwarah',
        pickup_date: '2026-10-29',
        pickup_time: '08:00',
        hotel_name: 'Oberoi Madinah',
        vehicle_type: 'GMC',
        number_of_vehicles: 1,
        notes: 'Direct highway transfer via Haramain road',
      },
    ],
    whatsapp_logs: [
      {
        id: 'wa-1',
        booking_id: 'b1-demo-umrah-1',
        recipient_phone: '966597100424',
        message_type: 'template',
        template_name: 'musa_booking_confirmation',
        meta_message_id: 'wamid.HBgLMTk2NjU5NzEwMDQyNBUCABEYEjE0QzEyRjY1NkQ1RjM1M0VB',
        status: 'delivered',
        sent_at: new Date(Date.now() - 3600000 * 2).toISOString(),
        delivered_at: new Date(Date.now() - 3600000 * 1.9).toISOString(),
        read_at: new Date(Date.now() - 3600000 * 1.5).toISOString(),
        retry_count: 0,
      },
    ],
  },
  {
    id: 'b2-demo-umrah-2',
    booking_reference: 'MT-2026-00126',
    customer_name: 'Mohamed El-Sayed',
    customer_phone: '201009876543',
    customer_email: 'm.elsayed@outlook.com',
    passengers: 8,
    additional_passengers: ['Youssef El-Sayed', 'Nour El-Sayed', 'Laila Mansour'],
    service_type: 'Group Umrah Package',
    status: 'pending',
    total_price: 1200,
    currency: 'SAR',
    payment_status: 'unpaid',
    is_international: true,
    nationality: 'Egypt',
    visa_status: 'uploaded',
    flight_number: 'MS 671',
    hotel_name: 'Fairmont Makkah',
    special_instructions: 'Family group arriving from Cairo. Need spacious luggage trunk.',
    internal_notes: 'Visa uploaded securely. Ready for operations review.',
    source: 'website',
    created_at: new Date(Date.now() - 3600000 * 1).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 1).toISOString(),
    segments: [
      {
        id: 'seg-3',
        segment_order: 1,
        pickup_location: 'Jeddah International Airport (KAIA)',
        drop_location: 'Fairmont Makkah Clock Royal Tower',
        pickup_date: '2026-10-26',
        pickup_time: '14:15',
        flight_number: 'MS 671',
        hotel_name: 'Fairmont Makkah',
        vehicle_type: 'Hiace',
        number_of_vehicles: 1,
      },
    ],
    documents: [
      {
        id: 'doc-demo-1',
        booking_id: 'b2-demo-umrah-2',
        document_type: 'visa',
        file_name: 'Saudi_Umrah_Visa_ElSayed.pdf',
        file_path: 'b2-demo-umrah-2/Saudi_Umrah_Visa_ElSayed.pdf',
        file_size: 482100,
        mime_type: 'application/pdf',
        created_at: new Date(Date.now() - 3600000 * 1).toISOString(),
      },
    ],
  },
  {
    id: 'b3-demo-umrah-3',
    booking_reference: 'MT-2026-00127',
    customer_name: 'Dr. Bilal Qureshi',
    customer_phone: '447812345678',
    customer_email: 'dr.bilal.q@nhs.net',
    passengers: 2,
    service_type: 'VIP Umrah Package',
    status: 'in_progress',
    total_price: 950,
    currency: 'SAR',
    payment_status: 'paid',
    is_international: true,
    nationality: 'United Kingdom',
    visa_status: 'whatsapp',
    flight_number: 'BA 133',
    hotel_name: 'Dar Al Taqwa',
    special_instructions: 'VIP guest from London. Request premium English-speaking driver.',
    internal_notes: 'Customer sending visa via WhatsApp. Vehicle: Mercedes/GMC Luxury.',
    source: 'admin_manual',
    created_at: new Date(Date.now() - 86400000 * 1).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 3).toISOString(),
    segments: [
      {
        id: 'seg-4',
        segment_order: 1,
        pickup_location: 'Madinah Prince Mohammad Bin Abdulaziz Airport',
        drop_location: 'Dar Al Taqwa Hotel, Madinah',
        pickup_date: '2026-10-24',
        pickup_time: '21:00',
        flight_number: 'BA 133',
        hotel_name: 'Dar Al Taqwa',
        vehicle_type: 'GMC',
        number_of_vehicles: 1,
      },
    ],
  },
];

const getLocalStore = (): Booking[] => {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_BACKUP_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_STORAGE_BACKUP_KEY, JSON.stringify(INITIAL_DEMO_BOOKINGS));
      return INITIAL_DEMO_BOOKINGS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_DEMO_BOOKINGS;
  }
};

const saveLocalStore = (bookings: Booking[]) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_BACKUP_KEY, JSON.stringify(bookings));
  } catch (err) {
    console.warn('Failed to save to local backup store', err);
  }
};

// Generate collision-free reference locally as fallback
export const generateReferenceCode = (existingCount = 0): string => {
  const year = new Date().getFullYear();
  const num = String(128 + existingCount).padStart(5, '0');
  return `MT-${year}-${num}`;
};

export const bookingService = {
  async fetchBookings(): Promise<Booking[]> {
    if (isSupabaseConfigured()) {
      try {
        const { data: bookingsData, error } = await supabase
          .from('bookings')
          .select(`
            *,
            segments:journey_segments(*),
            documents:booking_documents(*),
            whatsapp_logs:whatsapp_messages(*)
          `)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('[bookingService] Supabase fetch error:', error);
          throw error;
        }

        if (bookingsData && bookingsData.length > 0) {
          return bookingsData as Booking[];
        }
      } catch (err) {
        console.warn('[bookingService] Falling back to local store due to Supabase error:', err);
      }
    }

    const local = getLocalStore();
    try {
      const storedDocs: any[] = JSON.parse(localStorage.getItem('musa_transport_private_docs') || '[]');
      if (storedDocs.length > 0) {
        return local.map((b) => {
          const bDocs = storedDocs.filter((d) => d.booking_id === b.id);
          return {
            ...b,
            documents: bDocs.length > 0 ? bDocs : b.documents,
            visa_status: bDocs.length > 0 ? 'uploaded' : b.visa_status,
          };
        });
      }
    } catch {
      // fallback
    }
    return local;
  },

  async createBooking(bookingInput: Partial<Booking> & { segments: JourneySegment[] }): Promise<Booking> {
    const newReference = bookingInput.booking_reference || generateReferenceCode(getLocalStore().length);

    if (isSupabaseConfigured()) {
      try {
        // 1. Insert Booking Header
        const { data: booking, error: bError } = await supabase
          .from('bookings')
          .insert({
            booking_reference: newReference,
            customer_name: bookingInput.customer_name,
            customer_phone: bookingInput.customer_phone,
            customer_email: bookingInput.customer_email || null,
            passengers: bookingInput.passengers || 1,
            additional_passengers: bookingInput.additional_passengers || [],
            service_type: bookingInput.service_type || 'Hajj & Umrah Transfers',
            status: bookingInput.status || 'pending',
            total_price: bookingInput.total_price || null,
            currency: bookingInput.currency || 'SAR',
            payment_status: bookingInput.payment_status || 'unpaid',
            special_instructions: bookingInput.special_instructions || '',
            internal_notes: bookingInput.internal_notes || '',
            source: bookingInput.source || 'admin_manual',
            is_international: bookingInput.is_international ?? false,
            nationality: bookingInput.nationality || '',
            visa_status: bookingInput.visa_status || 'not_required',
            flight_number: bookingInput.flight_number || null,
            hotel_name: bookingInput.hotel_name || null,
          })
          .select()
          .single();

        if (bError) throw bError;

        // 2. Insert Journey Segments
        if (bookingInput.segments && bookingInput.segments.length > 0) {
          const segmentsToInsert = bookingInput.segments.map((seg, idx) => ({
            booking_id: booking.id,
            segment_order: idx + 1,
            pickup_location: seg.pickup_location,
            drop_location: seg.drop_location,
            pickup_date: seg.pickup_date,
            pickup_time: seg.pickup_time,
            flight_number: seg.flight_number || bookingInput.flight_number || null,
            hotel_name: seg.hotel_name || bookingInput.hotel_name || null,
            vehicle_type: seg.vehicle_type,
            number_of_vehicles: seg.number_of_vehicles || 1,
            notes: seg.notes || '',
          }));

          const { data: segs, error: sError } = await supabase
            .from('journey_segments')
            .insert(segmentsToInsert)
            .select();

          if (sError) console.error('[bookingService] Segment insert error:', sError);
          booking.segments = segs || [];
        }

        return booking as Booking;
      } catch (err) {
        console.warn('[bookingService] Supabase insert failed, persisting to local store:', err);
      }
    }

    // Local / fallback store insertion
    const localStore = getLocalStore();
    const newBooking: Booking = {
      id: 'b-' + Date.now(),
      booking_reference: newReference,
      customer_name: bookingInput.customer_name || 'Guest Pilgrim',
      customer_phone: bookingInput.customer_phone || '',
      customer_email: bookingInput.customer_email || '',
      passengers: bookingInput.passengers || 1,
      additional_passengers: bookingInput.additional_passengers || [],
      service_type: bookingInput.service_type || 'Hajj & Umrah Transfers',
      status: bookingInput.status || 'pending',
      total_price: bookingInput.total_price,
      currency: bookingInput.currency || 'SAR',
      payment_status: bookingInput.payment_status || 'unpaid',
      special_instructions: bookingInput.special_instructions || '',
      internal_notes: bookingInput.internal_notes || '',
      source: bookingInput.source || 'admin_manual',
      is_international: bookingInput.is_international ?? false,
      nationality: bookingInput.nationality || '',
      visa_status: bookingInput.visa_status || 'not_required',
      flight_number: bookingInput.flight_number || '',
      hotel_name: bookingInput.hotel_name || '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      segments: (bookingInput.segments || []).map((s, idx) => ({
        ...s,
        id: s.id || `seg-${Date.now()}-${idx}`,
        segment_order: idx + 1,
        flight_number: s.flight_number || bookingInput.flight_number || undefined,
        hotel_name: s.hotel_name || bookingInput.hotel_name || undefined,
      })),
      documents: bookingInput.documents || [],
      whatsapp_logs: [],
    };

    const updated = [newBooking, ...localStore];
    saveLocalStore(updated);
    return newBooking;
  },

  async updateBookingStatus(id: string, status: BookingStatus): Promise<void> {
    if (isSupabaseConfigured()) {
      try {
        const { error } = await supabase
          .from('bookings')
          .update({ status, updated_at: new Date().toISOString() })
          .eq('id', id);

        if (error) throw error;
        return;
      } catch (err) {
        console.warn('[bookingService] Supabase update status failed, updating local store:', err);
      }
    }

    const store = getLocalStore();
    const target = store.find((b) => b.id === id);
    if (target) {
      target.status = status;
      target.updated_at = new Date().toISOString();
      saveLocalStore([...store]);
    }
  },

  async updateBooking(id: string, updates: Partial<Booking>): Promise<Booking | null> {
    if (isSupabaseConfigured()) {
      try {
        const { error } = await supabase
          .from('bookings')
          .update({
            customer_name: updates.customer_name,
            customer_phone: updates.customer_phone,
            customer_email: updates.customer_email,
            passengers: updates.passengers,
            additional_passengers: updates.additional_passengers,
            service_type: updates.service_type,
            status: updates.status,
            total_price: updates.total_price,
            payment_status: updates.payment_status,
            special_instructions: updates.special_instructions,
            internal_notes: updates.internal_notes,
            is_international: updates.is_international,
            nationality: updates.nationality,
            visa_status: updates.visa_status,
            flight_number: updates.flight_number,
            hotel_name: updates.hotel_name,
            updated_at: new Date().toISOString(),
          })
          .eq('id', id);

        if (error) throw error;
      } catch (err) {
        console.warn('[bookingService] Supabase update booking failed:', err);
      }
    }

    const store = getLocalStore();
    const index = store.findIndex((b) => b.id === id);
    if (index !== -1) {
      store[index] = {
        ...store[index],
        ...updates,
        updated_at: new Date().toISOString(),
      };
      saveLocalStore([...store]);
      return store[index];
    }
    return null;
  },

  async deleteBooking(id: string): Promise<boolean> {
    if (isSupabaseConfigured()) {
      try {
        const { error } = await supabase.from('bookings').delete().eq('id', id);
        if (error) throw error;
      } catch (err) {
        console.warn('[bookingService] Supabase delete failed:', err);
      }
    }

    const store = getLocalStore();
    const filtered = store.filter((b) => b.id !== id);
    saveLocalStore(filtered);
    return true;
  },

  async logWhatsAppMessage(log: Omit<import('@/types/booking').WhatsAppMessageLog, 'id'>): Promise<void> {
    if (isSupabaseConfigured()) {
      try {
        await supabase.from('whatsapp_messages').insert({
          booking_id: log.booking_id,
          recipient_phone: log.recipient_phone,
          message_type: log.message_type,
          template_name: log.template_name || null,
          meta_message_id: log.meta_message_id || null,
          status: log.status,
          sent_at: log.sent_at,
          delivered_at: log.delivered_at || null,
          read_at: log.read_at || null,
          error_message: log.error_message || null,
          retry_count: log.retry_count || 0,
          is_manual_fallback: log.is_manual_fallback || false,
        });
        return;
      } catch (err) {
        console.warn('[bookingService] WhatsApp log DB error:', err);
      }
    }

    // Local fallback update
    const store = getLocalStore();
    const booking = store.find((b) => b.id === log.booking_id);
    if (booking) {
      if (!booking.whatsapp_logs) booking.whatsapp_logs = [];
      booking.whatsapp_logs.push({
        ...log,
        id: 'wa-' + Date.now(),
      });
      saveLocalStore([...store]);
    }
  },

  async fetchBookingByReference(reference: string): Promise<Booking | null> {
    if (!reference) return null;
    const cleanRef = reference.trim().toUpperCase();

    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('bookings')
          .select(`
            *,
            segments:journey_segments(*),
            documents:booking_documents(*),
            whatsapp_logs:whatsapp_messages(*)
          `)
          .eq('booking_reference', cleanRef)
          .maybeSingle();

        if (!error && data) {
          return data as Booking;
        }
      } catch (err) {
        console.warn('[bookingService] Supabase fetch by reference error:', err);
      }
    }

    const store = getLocalStore();
    return (
      store.find(
        (b) => b.booking_reference.trim().toUpperCase() === cleanRef
      ) || null
    );
  },
};
