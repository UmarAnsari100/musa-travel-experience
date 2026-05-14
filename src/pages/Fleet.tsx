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

// ── BUS ──────────────────────────
import bus1 from '../assets/bus/bus1.png'
import bus2 from '../assets/bus/bus2.png'
import bus3 from '../assets/bus/bus3.png'
import bus4 from '../assets/bus/bus4.jpeg'

// ── CAMRY ────────────────────────
import camry1 from '../assets/camry/camry1.jpg'
import camry2 from '../assets/camry/camry2.jpg'
import camry3 from '../assets/camry/camry3.jpg'
import camry4 from '../assets/camry/camry4.jpg'

// ── COASTER ──────────────────────
import coaster1 from '../assets/coaster/coaster1.jpeg'
import coaster2 from '../assets/coaster/coaster2.jpg'
import coaster3 from '../assets/coaster/coaster3.jpg'
import coaster4 from '../assets/coaster/coaster4.png'

// ── GMC ──────────────────────────
import gmc1 from '../assets/gmc/gmc1.png'
import gmc2 from '../assets/gmc/gmc2.png'
import gmc3 from '../assets/gmc/gmc3.png'
import gmc4 from '../assets/gmc/gmc4.jpg'

// ── HIACE ────────────────────────
import hiace1 from '../assets/hiace/hiace1.png'
import hiace2 from '../assets/hiace/hiace2.png'
import hiace3 from '../assets/hiace/hiace3.png'
import hiace4 from '../assets/hiace/hiace4.png'

// ── STAREX ───────────────────────
import starex1 from '../assets/starex/starex1.jpg'
import starex2 from '../assets/starex/starex2.avif'
import starex3 from '../assets/starex/starex3.avif'
import starex4 from '../assets/starex/starex4.avif'
import starex5 from '../assets/starex/starex5.png'

// ── STARIA ───────────────────────
import staria1 from '../assets/staria/staria1.png'
import staria2 from '../assets/staria/staria2.png'
import staria3 from '../assets/staria/staria3.png'
import staria4 from '../assets/staria/staria4.png'
import staria5 from '../assets/staria/staria5.png'

const fleetData = [
  {
    id: 1,
    name: 'Toyota Camry',
    type: 'Business Sedan',
    category: 'Sedan',
    seats: 4,
    luggage: '2 Bags',
    fuel: 'Hybrid',
    transmission: 'Automatic',
    ac: 'Yes',
    insurance: 'Included',
    price: 'SAR 150',
    badge: 'MOST POPULAR',
    features: [
      'Free WiFi',
      'Water Bottle',
      'Phone Charger',
      'Meet & Greet',
      '24/7 Support',
      'Flight Tracking'
    ],
    description: 'Comfortable mid-size sedan perfect for city transfers and airport rides.',
    coverImage: camry1,
    gallery: [camry1, camry2, camry3, camry4],
    serviceType: 'City Taxi',
    vehicleType: 'Camry',
    vehicleLabel: 'Toyota Camry — SAR 150/trip',
  },
  {
    id: 2,
    name: 'GMC Yukon',
    type: 'Premium SUV',
    category: 'SUV',
    seats: 7,
    luggage: '5 Bags',
    fuel: 'Petrol',
    transmission: 'Automatic',
    ac: 'Yes',
    insurance: 'Included',
    price: 'SAR 450',
    badge: '',
    features: [
      'Free WiFi',
      'Captain Seats',
      'Water Bottle',
      'Phone Charger',
      '24/7 Support',
      'Meet & Greet'
    ],
    description: 'Spacious premium SUV perfect for group travel and long distance journeys.',
    coverImage: gmc1,
    gallery: [gmc1, gmc2, gmc3, gmc4],
    serviceType: 'Intercity Travel',
    vehicleType: 'GMC',
    vehicleLabel: 'GMC Yukon — SAR 450/trip',
  },
  {
    id: 3,
    name: 'Toyota Hiace',
    type: 'Executive Van',
    category: 'Van',
    seats: 12,
    luggage: '8 Bags',
    fuel: 'Diesel',
    transmission: 'Automatic',
    ac: 'Yes',
    insurance: 'Included',
    price: 'SAR 600',
    badge: 'HAJJ SPECIAL',
    features: [
      'Free WiFi',
      'USB Charging',
      'Water Bottles',
      'Extra Luggage Space',
      '24/7 Support',
      'Group Booking'
    ],
    description: 'Ideal for Hajj & Umrah groups, family trips, and airport group transfers.',
    coverImage: hiace1,
    gallery: [hiace1, hiace2, hiace3, hiace4],
    serviceType: 'Hajj & Umrah Transfers',
    vehicleType: 'Hiace',
    vehicleLabel: 'Toyota Hiace — SAR 600/trip',
  },
  {
    id: 4,
    name: 'Hyundai Starex',
    type: 'Premium Van',
    category: 'Van',
    seats: 9,
    luggage: '6 Bags',
    fuel: 'Diesel',
    transmission: 'Automatic',
    ac: 'Yes',
    insurance: 'Included',
    price: 'SAR 500',
    badge: '',
    features: [
      'Free WiFi',
      'Reclining Seats',
      'Water Bottle',
      'Phone Charger',
      '24/7 Support',
      'Meet & Greet'
    ],
    description: 'Premium van with reclining seats, perfect for comfortable group travel.',
    coverImage: starex1,
    gallery: [starex1, starex2, starex3, starex4, starex5],
    serviceType: 'Intercity Travel',
    vehicleType: 'Starex',
    vehicleLabel: 'Hyundai Starex — SAR 500/trip',
  },
  {
    id: 5,
    name: 'Kia Staria',
    type: 'Luxury Van',
    category: 'VIP',
    seats: 9,
    luggage: '6 Bags',
    fuel: 'Petrol',
    transmission: 'Automatic',
    ac: 'Yes',
    insurance: 'Included',
    price: 'SAR 650',
    badge: 'PREMIUM',
    features: [
      'Free WiFi',
      'Luxury Interior',
      'Water Bottle',
      'Phone Charger',
      '24/7 Support',
      'VIP Meet & Greet'
    ],
    description: 'Ultra-modern luxury van with premium interior for VIP group transfers.',
    coverImage: staria1,
    gallery: [staria1, staria2, staria3, staria4, staria5],
    serviceType: 'VIP & Royal Events',
    vehicleType: 'Staria',
    vehicleLabel: 'Kia Staria — SAR 650/trip',
  },
  {
    id: 6,
    name: 'Toyota Coaster',
    type: 'Coaster Bus',
    category: 'Bus',
    seats: 22,
    luggage: '15 Bags',
    fuel: 'Diesel',
    transmission: 'Manual',
    ac: 'Yes',
    insurance: 'Included',
    price: 'SAR 900',
    badge: 'HAJJ SPECIAL',
    features: [
      'Full AC',
      'Large Luggage Space',
      'USB Charging',
      'Water Bottles',
      '24/7 Support',
      'Hajj Permit'
    ],
    description: 'Large capacity coaster perfect for Hajj groups, tours, and corporate events.',
    coverImage: coaster1,
    gallery: [coaster1, coaster2, coaster3, coaster4],
    serviceType: 'Hajj & Umrah Transfers',
    vehicleType: 'Coaster',
    vehicleLabel: 'Toyota Coaster — SAR 900/trip',
  },
  {
    id: 7,
    name: 'Mini Bus',
    type: 'Mini Bus',
    category: 'Bus',
    seats: 30,
    luggage: '20 Bags',
    fuel: 'Diesel',
    transmission: 'Manual',
    ac: 'Yes',
    insurance: 'Included',
    price: 'SAR 1,200',
    badge: 'GROUP',
    features: [
      'Full AC',
      'Overhead Storage',
      'USB Charging',
      'Water Bottles',
      '24/7 Support',
      'Hajj Permit'
    ],
    description: 'Perfect for large Hajj groups, corporate events, and big family tours.',
    coverImage: bus1,
    gallery: [bus1, bus2, bus3, bus4],
    serviceType: 'Hajj & Umrah Transfers',
    vehicleType: 'Bus',
    vehicleLabel: 'Mini Bus — SAR 1,200/trip',
  },
];

const Fleet = () => {
  const { t } = useTranslation();
  const { setBookingDefaults } = useBooking();
  const [detailsCar, setDetailsCar] = useState<any>(null);
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

  const handleEsc = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") setDetailsCar(null);
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [handleEsc]);

  const handleWhatsApp = (car: any) => {
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

  const handleBookNow = (vehicle: any) => {
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
    setTimeout(() => {
      const el = document.getElementById("booking");
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 300);

    // Step 4 — Toast notification
    toast.success(
      `✅ ${vehicle.name} selected! Complete your booking below.`,
      {
        duration: 4000,
        icon: '🚗',
        style: {
          background: '#111111',
          color: '#F5F5F0',
          border: '1px solid rgba(212,168,83,0.3)',
          borderRadius: '12px',
        }
      }
    );
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0A0A0A] transition-colors duration-300">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-44 md:pb-32 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
          <span className="font-display text-[12rem] md:text-[20rem] font-black text-black/[0.05] dark:text-white/[0.03] leading-none uppercase">
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
            <h1 className="font-display font-black text-4xl md:text-[3.5rem] leading-tight tracking-[-0.02em] mb-4 text-[#1a1a1a] dark:text-white">
              {t('fleet.heading')}
            </h1>
            <p className="text-gray-text font-body text-base md:text-lg max-w-xl mx-auto mb-2 dark:text-gray-400">
              {t('fleet.subtext')}
            </p>
            <p className="text-[#C9A84C] font-body text-[11px] uppercase tracking-[0.3em] font-bold">
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
                  layout
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.6, ease: "easeOut" }}
                  className="bg-white dark:bg-[#111] border border-black/5 dark:border-white/5 rounded-2xl overflow-hidden shadow-card transition-all hover:-translate-y-2 group cursor-pointer w-full"
                  onClick={() => {
                    setDetailsCar(car);
                    setCurrentImageIndex(0);
                  }}
                >
                  <div className="relative h-[220px] sm:h-[180px] md:h-[210px] lg:h-[220px] w-full overflow-hidden bg-[#0D0D0D] transition-colors">
                    <img
                      src={car.coverImage}
                      alt={car.name}
                      className="w-full h-full object-cover object-center block transition-transform duration-500 group-hover:scale-105"
                    />
                    {car.badge && (
                      <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-sm text-white text-[10px] font-bold tracking-wider px-3 py-1.5 rounded-full border border-[rgba(212,168,83,0.3)]">
                        {car.badge}
                      </div>
                    )}
                    <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm text-[#D4A853] text-[10px] font-semibold tracking-wider uppercase px-3 py-1.5 rounded-full border border-[rgba(212,168,83,0.25)]">
                      {car.category}
                    </div>
                  </div>

                  <div className="p-3 md:p-6">
                    <h3 className="font-display font-bold text-sm md:text-xl text-[#1a1a1a] dark:text-white mb-1 md:mb-2">{car.name}</h3>

                    <div className="flex flex-wrap gap-2 md:gap-4 mb-3 md:mb-4 text-gray-500 dark:text-gray-400 text-[10px] md:text-[13px] font-body">
                      <div className="flex items-center gap-1 md:gap-1.5">
                        <Users size={12} className="text-[#C9A84C]" />
                        <span>{car.seats} Seats</span>
                      </div>
                      <div className="flex items-center gap-1 md:gap-1.5">
                        <Briefcase size={12} className="text-[#C9A84C]" />
                        <span>{car.luggage}</span>
                      </div>
                      <div className="flex items-center gap-1 md:gap-1.5 hidden sm:flex">
                        <Snowflake size={12} className="text-[#C9A84C]" />
                        <span>AC</span>
                      </div>
                    </div>

                    <p className="text-gray-400 dark:text-gray-500 text-[13px] font-body leading-relaxed mb-6 line-clamp-2">
                      {car.description}
                    </p>

                    <div className="flex items-end justify-between mb-4 md:mb-6">
                      <div>
                        <span className="text-gray-400 text-[9px] md:text-xs block mb-0.5 md:mb-1 font-body">Starts at</span>
                        <span className="text-[#C9A84C] font-display font-bold text-sm md:text-xl">{car.price}</span>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2 md:gap-3 mt-auto">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleBookNow(car);
                        }}
                        className="flex-1 bg-[#C9A84C] text-[#0D0D14] font-body font-bold text-[11px] md:text-sm py-2.5 md:py-3 rounded-lg md:rounded-xl hover:opacity-90 transition-opacity"
                      >
                        {t('fleet.bookNow')}
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setDetailsCar(car);
                          setCurrentImageIndex(0);
                        }}
                        className="flex-1 border border-gray-200 dark:border-white/10 text-[#1a1a1a] dark:text-white font-body font-bold text-[11px] md:text-sm py-2.5 md:py-3 rounded-lg md:rounded-xl hover:border-[#C9A84C] hover:text-[#C9A84C] transition-all"
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
              className="relative w-[95vw] md:w-[90vw] max-w-[900px] h-full max-h-[95vh] md:max-h-[90vh] bg-white dark:bg-[#111111] rounded-[20px] md:rounded-[24px] overflow-hidden shadow-2xl flex flex-col md:flex-row transition-colors"
            >
              {/* Close Button */}
              <button
                onClick={() => setDetailsCar(null)}
                className="absolute top-4 right-4 z-[100] w-9 h-9 rounded-full bg-black/10 dark:bg-white/10 flex items-center justify-center hover:bg-black/20 dark:hover:bg-white/20 transition-colors"
              >
                <X size={20} className="text-gray-800 dark:text-white" />
              </button>

              {/* Left Column: Gallery */}
              <div className="w-full md:w-[45%] lg:w-[42%] flex flex-col h-auto md:min-h-[500px]">
                {/* Main Image */}
                <div className="relative aspect-video w-full overflow-hidden bg-[#0D0D0D] p-4 rounded-t-[16px] md:rounded-tr-none md:rounded-tl-[16px]">
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={currentImageIndex}
                      src={detailsCar.gallery[currentImageIndex]}
                      alt={`${detailsCar.name} view ${currentImageIndex + 1}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="w-full h-[200px] md:h-[260px] lg:h-[300px] object-cover object-center block"
                    />
                  </AnimatePresence>

                  {/* Image counter */}
                  <div className="absolute top-3 right-3 bg-black/60 text-white text-xs font-medium px-2.5 py-1 rounded-full backdrop-blur-sm">
                    {currentImageIndex + 1} / {detailsCar.gallery.length}
                  </div>

                  {/* Arrow navigation */}
                  <button
                    onClick={() => setCurrentImageIndex(prev => prev === 0 ? detailsCar.gallery.length - 1 : prev - 1)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/80 transition-all"
                  >
                    ‹
                  </button>
                  <button
                    onClick={() => setCurrentImageIndex(prev => prev === detailsCar.gallery.length - 1 ? 0 : prev + 1)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/80 transition-all"
                  >
                    ›
                  </button>
                </div>

                {/* Thumbnail strip */}
                <div className="flex gap-2 p-3 overflow-x-auto bg-[#0D0D0D] scrollbar-none transition-colors">
                  {detailsCar.gallery.map((img: string, idx: number) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentImageIndex(idx)}
                      className={`flex-shrink-0 w-[60px] h-[44px] md:w-[72px] md:h-[54px] rounded-lg overflow-hidden border-2 transition-all duration-200 ${currentImageIndex === idx
                          ? "border-[#D4A853] opacity-100 scale-105"
                          : "border-transparent opacity-50 hover:opacity-80"
                        }`}
                    >
                      <img
                        src={img}
                        className="w-full h-full object-cover"
                        alt={`${detailsCar.name} thumbnail ${idx + 1}`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Right Column: Details */}
              <div className="flex-1 p-4 md:p-8 lg:p-10 overflow-y-auto max-h-[none] md:max-h-none">
                <div className="flex items-center gap-3 mb-3">
                  <span className="border border-[#D4A853] text-[#D4A853] text-[11px] font-body font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
                    {detailsCar.category || detailsCar.type}
                  </span>
                  <div className="flex items-center gap-1 text-[#D4A853]">
                    <Star size={13} className="fill-current" />
                    <span className="text-gray-400 dark:text-gray-500 text-[13px] font-body">
                      4.9 · 100+ reviews
                    </span>
                  </div>
                </div>

                <h2 className="font-display font-bold text-xl md:text-[28px] text-[#1a1a1a] dark:text-[#F5F5F0] mb-1">
                  {detailsCar.name}
                </h2>

                <div className="mb-4">
                  <span className="text-[#D4A853] font-display font-bold text-xl md:text-2xl">{detailsCar.price}</span>
                  <span className="text-gray-400 dark:text-gray-500 text-sm font-body ml-1">/trip</span>
                </div>

                <div className="h-px bg-[#E8E8E4] dark:bg-[#222220] my-4" />

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
                        <spec.icon size={16} className="text-[#D4A853]" />
                        <span className="text-[10px] font-body font-semibold text-gray-400 dark:text-[#888880] uppercase tracking-[0.1em]">
                          {spec.label}
                        </span>
                      </div>
                      <span className="text-sm font-body font-semibold text-[#1a1a1a] dark:text-[#F5F5F0] ml-[24px]">
                        {spec.val}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="h-px bg-[#E8E8E4] dark:bg-[#222220] my-4" />

                {/* Features */}
                <div className="mb-6">
                  <h4 className="text-[#D4A853] font-body font-semibold text-[12px] uppercase tracking-[0.1em] mb-3">
                    INCLUDED FEATURES
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {detailsCar.features.map((f: string, idx: number) => (
                      <div
                        key={idx}
                        className="flex items-center gap-1.5 bg-[#D4A853]/5 dark:bg-[#D4A853]/8 border border-[#D4A853]/20 px-3 py-1.5 rounded-full"
                      >
                        <Check size={12} className="text-[#D4A853]" />
                        <span className="text-[11px] md:text-[12px] font-body text-[#888880]">{f}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="h-px bg-[#E8E8E4] dark:bg-[#222220] my-4" />

                <p className="text-gray-500 dark:text-[#888880] text-sm font-body leading-relaxed mb-8">
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
                    className="flex-1 border-1.5 border-[#E8E8E4] dark:border-[#333330] text-[#1a1a1a] dark:text-[#F5F5F0] font-body font-medium text-[15px] h-[48px] md:h-auto py-3.5 rounded-full hover:bg-[#F5F5F0] dark:hover:bg-white/5 transition-all"
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
      <section className="py-16 bg-[#D4A853]/5 dark:bg-[#D4A853]/5 border-y border-[#D4A853]/10">
        <div className="container mx-auto px-6 text-center">
          <h3 className="font-display font-bold text-2xl md:text-3xl mb-4 text-[#1a1a1a] dark:text-white">
            {t('fleet.customFleet')}
          </h3>
          <p className="text-gray-text dark:text-gray-400 font-body mb-8 max-w-lg mx-auto">
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
