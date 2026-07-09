import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Briefcase, Snowflake, X, ChevronRight, Star, Check, Fuel, Settings, ShieldCheck, MapPin, Calendar, Clock, MessageSquare } from "lucide-react";
import { useTranslation } from "react-i18next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BookingForm from "@/components/BookingForm";
import WhatsAppButton from "@/components/WhatsAppButton";
import { useBooking } from "@/context/BookingContext";
import { toast } from "react-hot-toast";

import { fleetData, type FleetVehicle } from "@/data/fleet";
import { scheduleBookingScroll } from "@/lib/scroll";

const Fleet = () => {
  const { t } = useTranslation();
  const { setBookingDefaults } = useBooking();
  const [detailsCar, setDetailsCar] = useState<FleetVehicle | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [prefillVehicle, setPrefillVehicle] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Check dark mode
  useEffect(() => {
    const checkDark = () => setIsDarkMode(document.documentElement.classList.contains('dark'));
    checkDark();
    const observer = new MutationObserver(checkDark);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);


  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  useEffect(() => {
    const openVehicleFromHash = () => {
      const slug = window.location.hash.replace("#", "");
      if (!slug) return;

      const vehicle = fleetData.find((car) => car.slug === slug);
      if (!vehicle) return;

      setDetailsCar(vehicle);
      setCurrentImageIndex(0);
    };

    openVehicleFromHash();
    window.addEventListener("hashchange", openVehicleFromHash);

    return () => window.removeEventListener("hashchange", openVehicleFromHash);
  }, []);

  const handleEsc = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") setDetailsCar(null);
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [handleEsc]);

  const handleWhatsApp = (car: FleetVehicle) => {
    const waNumber = import.meta.env.VITE_WHATSAPP_NUMBER || "966532822165";
    const message = encodeURIComponent(
      `Hi MUSA TRAVEL! 👋\n\n` +
      `I'm interested in booking:\n` +
      `🚗 *${car.name}*\n` +
      `📋 Type: ${car.type}\n` +
      `👥 Passengers: ${car.passengers}\n` +
      `💰 Price: SAR ${car.price}\n\n` +
      `Please confirm availability.`
    );
    window.open(`https://wa.me/${waNumber}?text=${message}`, "_blank");
  };

  const handleCustomFleetWhatsApp = () => {
    const waNumber = import.meta.env.VITE_WHATSAPP_NUMBER || "966532822165";
    const fleetMessage = encodeURIComponent(
      `Hi MUSA TRAVEL! 👋\n\n` +
      `I need a *Custom Fleet* arrangement.\n\n` +
      `Please contact me with details.`
    );
    window.open(`https://wa.me/${waNumber}?text=${fleetMessage}`, "_blank");
  };

  const handleBookNow = (vehicle: FleetVehicle) => {
    // Step 1 — Set booking defaults
    setBookingDefaults({
      service_type: vehicle.serviceType,
      vehicle_type: vehicle.vehicleType,
      drop_location: '', // empty for fleet
      tripTitle: `${vehicle.name} — ${vehicle.type}`,
    });

    // Step 2 — Close modal if open
    setDetailsCar(null);

    // Step 3 — Smooth scroll to booking
    setTimeout(scheduleBookingScroll, 300);

    // Step 4 — Toast notification
    toast.success(
      `✅ ${vehicle.name} selected! Complete your booking below.`,
      {
        duration: 4000,
        icon: '🚗',
        style: {
          background: '#111111',
          color: '#F8F5EC',
          border: '1px solid rgba(212,175,55,0.30)',
          borderRadius: '12px',
        }
      }
    );
  };

  return (
    <div className="min-h-screen bg-[#050505] transition-colors duration-300">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-44 md:pb-32 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
          <span className="font-display text-[12rem] md:text-[20rem] font-black text-[rgba(212,175,55,0.02)] leading-none uppercase">
            MUSA
          </span>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: "easeOut" }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="font-display font-black text-4xl md:text-[3.5rem] leading-tight tracking-[-0.02em] mb-4 text-[#F8F5EC]">
              {t('fleet.heading')}
            </h1>
            <p className="text-[#B8B2A3] font-body text-base md:text-lg max-w-xl mx-auto mb-2">
              {t('fleet.subtext')}
            </p>
            <p className="text-[#D4AF37] font-body text-[11px] uppercase tracking-[0.3em] font-bold">
              {t('fleet.tag')}
            </p>
          </motion.div>
        </div>
      </section>


      {/* Fleet Grid */}
      <section className="py-20 px-4 md:px-6 overflow-x-hidden">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 md:gap-6 max-w-4xl mx-auto">
            <AnimatePresence mode="popLayout">
              {fleetData.map((car, i) => (
                <motion.div
                  key={car.id}
                  id={car.slug}
                  layout
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.6, ease: "easeOut" }}
                  className="bg-[#0B0B0B] border border-[rgba(74,57,28,0.15)] rounded-2xl overflow-hidden shadow-card transition-all hover:-translate-y-2 group cursor-pointer w-full"
                  onClick={() => {
                    setDetailsCar(car);
                    setCurrentImageIndex(0);
                  }}
                >
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#050505] transition-colors">
                    <img
                      src={car.coverImage}
                      alt={car.name}
                      loading="lazy"
                      className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                    />
                    {car.badge && (
                      <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-sm text-white text-[10px] font-bold tracking-wider px-3 py-1.5 rounded-full border border-[rgba(212,175,55,0.30)]">
                        {car.badge}
                      </div>
                    )}
                    <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm text-[#D4AF37] text-[10px] font-semibold tracking-wider uppercase px-3 py-1.5 rounded-full border border-[rgba(212,175,55,0.25)]">
                      {car.category}
                    </div>
                  </div>

                  <div className="p-3 md:p-6">
                    <h3 className="font-display font-bold text-sm md:text-xl text-[#F8F5EC] mb-1 md:mb-2">{car.name}</h3>

                    <div className="flex flex-wrap gap-2 md:gap-4 mb-3 md:mb-4 text-[#B8B2A3] text-[10px] md:text-[13px] font-body">
                      <div className="flex items-center gap-1 md:gap-1.5">
                        <Users size={12} className="text-[#D4AF37]" />
                        <span>{car.seats} Seats</span>
                      </div>
                      <div className="flex items-center gap-1 md:gap-1.5">
                        <Briefcase size={12} className="text-[#D4AF37]" />
                        <span>{car.luggage}</span>
                      </div>
                      <div className="flex items-center gap-1 md:gap-1.5 hidden sm:flex">
                        <Snowflake size={12} className="text-[#D4AF37]" />
                        <span>AC</span>
                      </div>
                    </div>

                    <p className="text-[rgba(212,175,55,0.50)] text-[13px] font-body leading-relaxed mb-6 line-clamp-2">
                      {car.description}
                    </p>

                    <div className="flex items-end justify-between mb-4 md:mb-6">
                      <div>
                        <span className="text-[rgba(212,175,55,0.50)] text-[9px] md:text-xs block mb-0.5 md:mb-1 font-body">Starts at</span>
                        <span className="text-[#D4AF37] font-display font-bold text-sm md:text-xl">{car.price}</span>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2 md:gap-3 mt-auto">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleBookNow(car);
                        }}
                        className="flex-1 bg-[#D4AF37] text-[#050505] font-body font-bold text-[11px] md:text-sm py-2.5 md:py-3 rounded-lg md:rounded-xl hover:opacity-90 transition-opacity"
                      >
                        {t('fleet.bookNow')}
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setDetailsCar(car);
                          setCurrentImageIndex(0);
                        }}
                        className="flex-1 border border-[rgba(74,57,28,0.15)] text-[#F8F5EC] font-body font-bold text-[11px] md:text-sm py-2.5 md:py-3 rounded-lg md:rounded-xl hover:border-[#D4AF37] hover:text-[#D4AF37] transition-all"
                      >
                        {t('fleet.viewDetail')}
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Rebuilt Details Modal */}
      <AnimatePresence>
        {detailsCar && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDetailsCar(null)}
              className="absolute inset-0 bg-black/75 backdrop-blur-[4px]"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="relative w-[min(96vw,1040px)] max-h-[calc(100dvh-2rem)] bg-[#111111] rounded-[20px] md:rounded-[24px] overflow-y-auto md:overflow-hidden shadow-2xl flex flex-col md:grid md:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] transition-colors"
            >
              {/* Close Button */}
              <button
                onClick={() => setDetailsCar(null)}
                className="absolute top-4 right-4 z-[100] w-9 h-9 rounded-full bg-[rgba(212,175,55,0.10)] flex items-center justify-center hover:bg-[rgba(212,175,55,0.20)] transition-colors"
              >
                <X size={20} className="text-[#F8F5EC]" />
              </button>

              {/* Left Column: Gallery */}
              <div className="w-full min-w-0 flex flex-col bg-[#050505]">
                {/* Main Image */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#050505] p-3 sm:p-4 rounded-t-[16px] md:rounded-tr-none md:rounded-tl-[16px]">
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={currentImageIndex}
                      src={detailsCar.gallery[currentImageIndex]}
                      alt={`${detailsCar.name} view ${currentImageIndex + 1}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="h-full w-full rounded-xl border border-[rgba(74,57,28,0.15)] object-contain object-center"
                    />
                  </AnimatePresence>

                  {/* Image counter */}
                  <div className="absolute bottom-5 right-5 bg-black/60 text-white text-xs font-medium px-2.5 py-1 rounded-full backdrop-blur-sm">
                    {currentImageIndex + 1} / {detailsCar.gallery.length}
                  </div>

                  {/* Arrow navigation */}
                  <button
                    onClick={() => setCurrentImageIndex(prev => prev === 0 ? detailsCar.gallery.length - 1 : prev - 1)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/80 transition-all"
                  >
                    ‹
                  </button>
                  <button
                    onClick={() => setCurrentImageIndex(prev => prev === detailsCar.gallery.length - 1 ? 0 : prev + 1)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/80 transition-all"
                  >
                    ›
                  </button>
                </div>

              </div>

              {/* Right Column: Details */}
              <div className="min-w-0 p-4 sm:p-6 md:p-8 lg:p-10 overflow-visible md:overflow-y-auto md:max-h-[calc(100dvh-2rem)]">
                <div className="flex items-center gap-3 mb-3">
                  <span className="border border-[#D4AF37] text-[#D4AF37] text-[11px] font-body font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
                    {detailsCar.category || detailsCar.type}
                  </span>
                  <div className="flex items-center gap-1 text-[#D4AF37]">
                    <Star size={13} className="fill-current" />
                    <span className="text-[rgba(212,175,55,0.50)] text-[13px] font-body">
                      4.9 · 100+ reviews
                    </span>
                  </div>
                </div>

                <h2 className="font-display font-bold text-xl md:text-[28px] text-[#F8F5EC] mb-1">
                  {detailsCar.name}
                </h2>

                <div className="mb-4">
                  <span className="text-[#D4AF37] font-display font-bold text-xl md:text-2xl">{detailsCar.price}</span>
                  <span className="text-[rgba(212,175,55,0.50)] text-sm font-body ml-1">/trip</span>
                </div>

                <div className="h-px bg-[rgba(74,57,28,0.15)] my-4" />

                {/* Specs Grid */}
                <div className="grid grid-cols-2 gap-x-4 md:gap-x-8 gap-y-4 mb-6">
                  {[
                    { icon: Users, label: t('fleet.passengers'), val: `${detailsCar.seats} Seats` },
                    { icon: Briefcase, label: t('fleet.luggage'), val: detailsCar.luggage },
                    { icon: Fuel, label: t('fleet.fuel'), val: detailsCar.fuel },
                    { icon: Settings, label: t('fleet.transmission'), val: detailsCar.transmission },
                    { icon: Snowflake, label: t('fleet.ac'), val: detailsCar.ac },
                    { icon: ShieldCheck, label: t('fleet.insurance'), val: detailsCar.insurance },
                  ].map((spec, i) => (
                    <div key={i} className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <spec.icon size={16} className="text-[#D4AF37]" />
                        <span className="text-[10px] font-body font-semibold text-[#B8B2A3] uppercase tracking-[0.1em]">
                          {spec.label}
                        </span>
                      </div>
                      <span className="text-sm font-body font-semibold text-[#F8F5EC] ml-[24px]">
                        {spec.val}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="h-px bg-[rgba(74,57,28,0.15)] my-4" />

                {/* Features */}
                <div className="mb-6">
                  <h4 className="text-[#D4AF37] font-body font-semibold text-[12px] uppercase tracking-[0.1em] mb-3">
                    INCLUDED FEATURES
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {detailsCar.features.map((f: string, idx: number) => (
                      <div
                        key={idx}
                        className="flex items-center gap-1.5 bg-[#D4AF37]/5 dark:bg-[#D4AF37]/8 border border-[#D4AF37]/20 px-3 py-1.5 rounded-full"
                      >
                        <Check size={12} className="text-[#D4AF37]" />
                        <span className="text-[11px] md:text-[12px] font-body text-[#B8B2A3]">{f}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="h-px bg-[rgba(74,57,28,0.15)] my-4" />

                <p className="text-[#B8B2A3] text-sm font-body leading-relaxed mb-8">
                  {detailsCar.description}
                </p>

                <div className="flex flex-col md:flex-row gap-3">
                  <button
                    onClick={() => handleBookNow(detailsCar)}
                    className="flex-1 gradient-gold text-black font-body font-bold text-[15px] h-[48px] md:h-auto py-3.5 rounded-full shadow-lg shadow-gold/10 hover:shadow-gold/20 transition-all"
                  >
                    {t('fleet.bookNow')}
                  </button>
                  <button
                    onClick={() => setDetailsCar(null)}
                    className="flex-1 border-1.5 border-[rgba(74,57,28,0.25)] text-[#F8F5EC] font-body font-medium text-[15px] h-[48px] md:h-auto py-3.5 rounded-full hover:bg-[#1F1F1F] hover:bg-white/5 transition-all"
                  >
                    {t('fleet.close')}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Custom Fleet Banner */}
      <section className="py-16 bg-[#0B0B0B] border-y border-[rgba(74,57,28,0.15)]">
        <div className="container mx-auto px-6 text-center">
          <h3 className="font-display font-bold text-2xl md:text-3xl mb-4 text-[#F8F5EC]">
            {t('fleet.customFleet')}
          </h3>
          <p className="text-[#B8B2A3]  font-body mb-8 max-w-lg mx-auto">
            {t('fleet.customDesc')}
          </p>
          <button
            onClick={handleCustomFleetWhatsApp}
            className="inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20BA5A] text-white font-semibold text-sm px-8 py-3 rounded-full transition-all duration-200 hover:scale-105"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.112 1.523 5.836L.057 23.886a.5.5 0 00.611.61l6.218-1.637A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.9a9.9 9.9 0 01-5.031-1.371l-.36-.214-3.733.982.998-3.648-.235-.374 A9.9 9.9 0 012.1 12C2.1 6.533 6.533 2.1 12 2.1c5.467 0 9.9 4.433 9.9 9.9 0 5.467-4.433 9.9-9.9 9.9z" />
            </svg>
            {t('fleet.contactTeam')}
          </button>
        </div>
      </section>

      {/* Integrated Booking Form */}
      <div id="booking">
        <BookingForm prefillVehicle={prefillVehicle} />
      </div>

      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Fleet;



