import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useBooking } from '../context/BookingContext'
import emailjs from '@emailjs/browser';

const serviceTypes = [
  { label: "Hajj & Umrah Transfers", value: "Hajj & Umrah Transfers" },
  { label: "Umrah Package (Economy)", value: "Umrah Package (Economy)" },
  { label: "Umrah Package + Ziyarat", value: "Umrah Package + Ziyarat" },
  { label: "Family Umrah Package", value: "Family Umrah Package" },
  { label: "Group Umrah Package", value: "Group Umrah Package" },
  { label: "VIP Umrah Package", value: "VIP Umrah Package" },
  { label: "Airport Transfers", value: "Airport Transfers" },
  { label: "Intercity Travel", value: "Intercity Travel" },
  { label: "Desert & Heritage Tours", value: "Desert & Heritage Tours" },
  { label: "Corporate Fleet", value: "Corporate Fleet" },
  { label: "VIP & Royal Events", value: "VIP & Royal Events" }
];

const vehicleTypes = [
  { label: "Bus", value: "Bus" },
  { label: "Camry", value: "Camry" },
  { label: "Coaster", value: "Coaster" },
  { label: "GMC", value: "GMC" },
  { label: "Hiace", value: "Hiace" },
  { label: "Starex", value: "Starex" },
  { label: "Staria", value: "Staria" },
];

const BookingForm = ({ prefillVehicle }: { prefillVehicle?: string }) => {
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    customer_name: '',
    customer_phone: '',
    customer_email: '',
    service_type: '',
    pickup_location: '',
    drop_location: '',
    travel_date: '',
    travel_time: '',
    passengers: '1',
    vehicle_type: prefillVehicle || '',
    message: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [highlightedFields, setHighlightedFields] = useState<string[]>([]);
  const [selectedTrip, setSelectedTrip] = useState<string | null>(null);
  const [badgeLabel, setBadgeLabel] = useState('Selected Package');

  const { bookingDefaults, setBookingDefaults } = useBooking();

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.customer_name.trim())
      newErrors.customer_name = t('booking.errRequired', 'Name is required');

    if (!formData.customer_phone.trim())
      newErrors.customer_phone = t('booking.errRequired', 'Phone is required');

    if (!formData.customer_email.trim())
      newErrors.customer_email = t('booking.errRequired', 'Email is required');
    else if (!/\S+@\S+\.\S+/.test(formData.customer_email))
      newErrors.customer_email = t('booking.errEmail', 'Invalid email address');

    if (!formData.service_type)
      newErrors.service_type = t('booking.errService', 'Please select a service');

    if (!formData.pickup_location.trim())
      newErrors.pickup_location = t('booking.errRequired', 'Pickup location required');

    if (!formData.drop_location.trim())
      newErrors.drop_location = t('booking.errRequired', 'Drop location required');

    if (!formData.travel_date)
      newErrors.travel_date = t('booking.errRequired', 'Date is required');

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setIsLoading(true)
    const loadingToast =
      toast.loading('Sending booking...')
    try {
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        formData,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      )
      const customerTemplateId =
        import.meta.env
          .VITE_EMAILJS_TEMPLATE_ID_CUSTOMER
      if (customerTemplateId) {
        try {
          await emailjs.send(
            import.meta.env.VITE_EMAILJS_SERVICE_ID,
            customerTemplateId,
            formData,
            import.meta.env.VITE_EMAILJS_PUBLIC_KEY
          )
          console.log('Customer email sent ✅')
        } catch (err) {
          console.warn('Customer email failed ⚠️', err)
        }
      }
      const waNum = import.meta.env.VITE_WHATSAPP_NUMBER
      if (waNum) {
        const msg = encodeURIComponent(
          `*New Booking — MUSA TRAVEL* 🚗\n\n` +
          `👤 *Name:* ${formData.customer_name}\n` +
          `📱 *Phone:* ${formData.customer_phone}\n` +
          `📧 *Email:* ${formData.customer_email}\n\n` +
          `🚗 *Service:* ${formData.service_type}\n` +
          `📍 *From:* ${formData.pickup_location}\n` +
          `📍 *To:* ${formData.drop_location}\n` +
          `📅 *Date:* ${formData.travel_date}\n` +
          `⏰ *Time:* ${formData.travel_time}\n` +
          `👥 *Passengers:* ${formData.passengers}\n` +
          `🚙 *Vehicle:* ${formData.vehicle_type}`
        )
        window.open(
          `https://wa.me/${waNum}?text=${msg}`,
          '_blank'
        )
      }
      toast.dismiss(loadingToast)
      toast.success(
        '✅ Booking sent! We will confirm shortly.',
        { duration: 5000 }
      )
      setFormData({
        customer_name: '',
        customer_phone: '',
        customer_email: '',
        service_type: '',
        pickup_location: '',
        drop_location: '',
        travel_date: '',
        travel_time: '',
        passengers: '1',
        vehicle_type: '',
        message: '',
      })
      setErrors({})
    } catch (error) {
      console.error('Submit error:', error)
      toast.dismiss(loadingToast)
      toast.error(
        'Failed to send booking. Try again.',
        { duration: 5000 }
      )
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  useEffect(() => {
    if (prefillVehicle) {
      setFormData(prev => ({ ...prev, vehicle_type: prefillVehicle }));
    }
  }, [prefillVehicle]);

  useEffect(() => {
    if (bookingDefaults) {
      setFormData(prev => ({
        ...prev,
        service_type: bookingDefaults.service_type || prev.service_type,
        drop_location: bookingDefaults.drop_location || prev.drop_location,
        vehicle_type: bookingDefaults.vehicle_type || prev.vehicle_type,
      }));

      if (bookingDefaults.tripTitle) {
        setSelectedTrip(bookingDefaults.tripTitle);
        // Detect source by checking drop_location
        setBadgeLabel(bookingDefaults.drop_location ? 'Selected Package' : 'Selected Vehicle');
      }

      setHighlightedFields(['service_type', 'drop_location', 'vehicle_type']);

      setTimeout(() => {
        setHighlightedFields([]);
      }, 3000);

      // Clear defaults after filling
      setBookingDefaults(null);
    }
  }, [bookingDefaults]);

  const inputClass = (key: string) =>
    `w-full bg-surface-low rounded-xl px-4 py-3 font-body text-sm outline-none transition-all duration-500 focus:ring-2 focus:ring-gold/40 ${errors[key] ? "ring-2 ring-destructive" : ""
    } ${highlightedFields.includes(key)
      ? 'border-gold ring-2 ring-gold/30 bg-gold/5'
      : 'border-transparent'
    }`;

  return (
    <section id="booking" className="scroll-mt-24 py-20 md:py-28 bg-surface-low">
      <div className="container mx-auto px-6 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center mb-12"
        >
          <span className="font-body font-medium text-xs uppercase tracking-[0.10em] text-gray-text">{t('booking.tag')}</span>
          <h2 className="font-display font-bold text-3xl md:text-4xl mt-3">{t('booking.heading')}</h2>
        </motion.div>

        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="bg-card shadow-card p-8 space-y-5"
        >
          {selectedTrip && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="flex items-center gap-3 bg-gold/10 border border-gold/20 rounded-xl px-4 py-3 mb-6"
            >
              <span className="text-gold text-lg">🚗</span>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-gold">
                  {badgeLabel}
                </p>
                <p className="text-[14px] font-medium text-foreground">
                  {selectedTrip}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSelectedTrip(null);
                  setFormData(prev => ({
                    ...prev,
                    service_type: '',
                    drop_location: '',
                    vehicle_type: '',
                  }));
                }}
                className="ml-auto text-gray-text hover:text-foreground text-lg transition-colors"
              >
                ✕
              </button>
            </motion.div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-body font-medium text-xs uppercase tracking-[0.10em] text-gray-text mb-2 block">{t('booking.serviceType')}</label>
              <select name="service_type" value={formData.service_type} onChange={handleChange} className={inputClass("service_type")}>
                <option value="">{t('booking.selectService', 'Select service...')}</option>
                {serviceTypes.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
              {errors.service_type && <span className="text-destructive text-xs mt-1 block">{errors.service_type}</span>}
            </div>
            <div>
              <label className="font-body font-medium text-xs uppercase tracking-[0.10em] text-gray-text mb-2 block">{t('booking.vehicle')}</label>
              <select name="vehicle_type" value={formData.vehicle_type} onChange={handleChange} className={inputClass("vehicle_type")}>
                <option value="">{t('booking.selectVehicle', 'Select vehicle...')}</option>
                {vehicleTypes.map((v) => (
                  <option key={v.value} value={v.value}>{v.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* From / To */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-body font-medium text-xs uppercase tracking-[0.10em] text-gray-text mb-2 block">{t('booking.from')}</label>
              <input name="pickup_location" value={formData.pickup_location} onChange={handleChange} placeholder={t('booking.fromPlaceholder', 'Pickup location')} className={inputClass("pickup_location")} />
              {errors.pickup_location && <span className="text-destructive text-xs mt-1 block">{errors.pickup_location}</span>}
            </div>
            <div>
              <label className="font-body font-medium text-xs uppercase tracking-[0.10em] text-gray-text mb-2 block">{t('booking.to')}</label>
              <input name="drop_location" value={formData.drop_location} onChange={handleChange} placeholder={t('booking.toPlaceholder', 'Drop-off location')} className={inputClass("drop_location")} />
              {errors.drop_location && <span className="text-destructive text-xs mt-1 block">{errors.drop_location}</span>}
            </div>
          </div>

          {/* Date / Time / Passengers */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="font-body font-medium text-xs uppercase tracking-[0.10em] text-gray-text mb-2 block">{t('booking.date')}</label>
              <input type="date" name="travel_date" value={formData.travel_date} onChange={handleChange} className={inputClass("travel_date")} />
              {errors.travel_date && <span className="text-destructive text-xs mt-1 block">{errors.travel_date}</span>}
            </div>
            <div>
              <label className="font-body font-medium text-xs uppercase tracking-[0.10em] text-gray-text mb-2 block">{t('booking.time')}</label>
              <input type="time" name="travel_time" value={formData.travel_time} onChange={handleChange} className={inputClass("travel_time")} />
              {errors.travel_time && <span className="text-destructive text-xs mt-1 block">{errors.travel_time}</span>}
            </div>
            <div>
              <label className="font-body font-medium text-xs uppercase tracking-[0.10em] text-gray-text mb-2 block">{t('booking.passengers')}</label>
              <select name="passengers" value={formData.passengers} onChange={handleChange} className={inputClass("passengers")}>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Name / Phone / Email */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="font-body font-medium text-xs uppercase tracking-[0.10em] text-gray-text mb-2 block">{t('booking.name')}</label>
              <input name="customer_name" value={formData.customer_name} onChange={handleChange} placeholder={t('booking.name', 'Full Name')} className={inputClass("customer_name")} />
              {errors.customer_name && <span className="text-destructive text-xs mt-1 block">{errors.customer_name}</span>}
            </div>
            <div>
              <label className="font-body font-medium text-xs uppercase tracking-[0.10em] text-gray-text mb-2 block">{t('booking.phone')}</label>
              <input name="customer_phone" value={formData.customer_phone} onChange={handleChange} placeholder={t('booking.phonePlaceholder', '+966 50 000 0000')} className={inputClass("customer_phone")} />
              {errors.customer_phone && <span className="text-destructive text-xs mt-1 block">{errors.customer_phone}</span>}
            </div>
            <div>
              <label className="font-body font-medium text-xs uppercase tracking-[0.10em] text-gray-text mb-2 block">{t('booking.email')}</label>
              <input name="customer_email" value={formData.customer_email} onChange={handleChange} placeholder={t('booking.emailPlaceholder', 'you@email.com')} className={inputClass("customer_email")} />
              {errors.customer_email && <span className="text-destructive text-xs mt-1 block">{errors.customer_email}</span>}
            </div>
          </div>

          {/* Message / Notes */}
          <div>
            <label className="font-body font-medium text-xs uppercase tracking-[0.10em] text-gray-text mb-2 block">{t('booking.message', 'Message / Special Requests')}</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder={t('booking.messagePlaceholder', 'Any special requests...')}
              rows={3}
              className={inputClass("message")}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full gradient-gold text-primary-foreground font-body font-semibold text-sm py-3.5 rounded-full transition-transform hover:scale-[1.03] disabled:opacity-60"
          >
            {isLoading ? t('booking.sending', 'Sending...') : t('booking.submit')}
          </button>
        </motion.form>
      </div>
    </section>
  );
};

export default BookingForm;
