import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Briefcase, Snowflake, X, ChevronRight, Star, Check, Fuel, Settings, ShieldCheck, MapPin, Calendar, Clock, MessageSquare } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BookingForm from "@/components/BookingForm";
import { toast } from "sonner";

const fleetData = [
  { 
    id: 1, 
    name: "Toyota Camry", 
    type: "Sedan", 
    cat: "Sedan", 
    passengers: 4, 
    luggage: 3, 
    trans: "Automatic", 
    fuel: "Hybrid", 
    rating: 4.8, 
    reviews: 98, 
    price: 120, 
    img: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&q=80&w=800",
    gallery: [
      "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1550355291-b6a678dc238f?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1619682817481-e994891cd1f5?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1619682817660-8488e0da9dca?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1486496146582-9ffcd0b2b2b7?auto=format&fit=crop&q=80&w=800"
    ],
    desc: "Comfortable mid-size sedan perfect for city transfers and airport rides. Features advanced safety systems and smooth handling." 
  },
  { 
    id: 6, 
    name: "Mercedes E-Class", 
    type: "VIP Sedan", 
    cat: "VIP", 
    passengers: 4, 
    luggage: 3, 
    trans: "Automatic", 
    fuel: "Hybrid", 
    rating: 5.0, 
    reviews: 89, 
    price: 400, 
    img: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&q=80&w=800",
    gallery: [
       "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&q=80&w=800",
       "https://images.unsplash.com/photo-1507767439269-2c64f107e609?auto=format&fit=crop&q=80&w=800",
       "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&q=80&w=800",
       "https://images.unsplash.com/photo-1511119253457-37fb8bb0f146?auto=format&fit=crop&q=80&w=800",
       "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=800"
    ],
    desc: "Executive class sedan for business travel and VIP airport transfers. Experience the pinnacle of German engineering and luxury."
  },
  { 
    id: 4, 
    name: "Toyota Land Cruiser", 
    type: "VIP SUV", 
    cat: "VIP", 
    passengers: 6, 
    luggage: 4, 
    trans: "Automatic", 
    fuel: "Petrol", 
    rating: 5.0, 
    reviews: 201, 
    price: 350, 
    img: "https://images.unsplash.com/photo-1594502184342-2e12f877aa73?auto=format&fit=crop&q=80&w=800",
    gallery: [
      "https://images.unsplash.com/photo-1594502184342-2e12f877aa73?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1469285994282-454ceb49e63c?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&q=80&w=800"
    ],
    desc: "Premium VIP SUV delivering the ultimate luxury experience across the Kingdom, perfect for desert tours and VIP groups." 
  },
  { 
    id: 3, 
    name: "GMC Yukon", 
    type: "SUV", 
    cat: "SUV", 
    passengers: 6, 
    luggage: 5, 
    trans: "Automatic", 
    fuel: "Petrol", 
    rating: 4.9, 
    reviews: 76, 
    price: 250, 
    img: "https://images.unsplash.com/photo-1567818735868-e71b99932e29?auto=format&fit=crop&q=80&w=800",
    gallery: [
      "https://images.unsplash.com/photo-1567818735868-e71b99932e29?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1551522435-a13afa10f103?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1568844293986-ca45e54881ae?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1486496146582-9ffcd0b2b2b7?auto=format&fit=crop&q=80&w=800"
    ],
    desc: "Spacious full-size SUV ideal for families and group travel. Combines utility with premium comfort features." 
  },
  { 
    id: 5, 
    name: "Toyota Hiace", 
    type: "Van", 
    cat: "Van", 
    passengers: 12, 
    luggage: 8, 
    trans: "Manual", 
    fuel: "Diesel", 
    rating: 4.8, 
    reviews: 112, 
    price: 300, 
    img: "https://images.unsplash.com/photo-1532007271951-c487760934ae?auto=format&fit=crop&q=80&w=800",
    gallery: [
      "https://images.unsplash.com/photo-1532007271951-c487760934ae?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1486496146582-9ffcd0b2b2b7?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1619682817481-e994891cd1f5?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1619682817660-8488e0da9dca?auto=format&fit=crop&q=80&w=800"
    ],
    desc: "Spacious van perfect for group travel, pilgrim transfers and corporate trips. Plenty of room for passengers and luggage." 
  },
  { 
    id: 9, 
    name: "Mercedes S-Class", 
    type: "Luxury Sedan", 
    cat: "VIP", 
    passengers: 3, 
    luggage: 2, 
    trans: "Automatic", 
    fuel: "Hybrid", 
    rating: 5.0, 
    reviews: 42, 
    price: 800, 
    img: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=800",
    gallery: [
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1511119253457-37fb8bb0f146?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=800"
    ],
    desc: "The ultimate luxury limousine. Featuring massage seats, ambient lighting, and rear-seat entertainment for unparalleled comfort." 
  },
  { id: 2, name: "Toyota Corolla", type: "Sedan", cat: "Sedan", passengers: 4, luggage: 2, trans: "Automatic", fuel: "Petrol", rating: 4.7, reviews: 143, price: 100, img: "https://images.unsplash.com/photo-1623860831270-ee3132bf52e4?auto=format&fit=crop&q=80&w=800", gallery: ["https://images.unsplash.com/photo-1623860831270-ee3132bf52e4?auto=format&fit=crop&q=80&w=800"], desc: "Reliable and economical choice for short to medium distance trips." },
  { id: 7, name: "Coaster Bus", type: "Bus", cat: "Bus", passengers: 30, luggage: 15, trans: "Manual", fuel: "Diesel", rating: 4.7, reviews: 54, price: 600, img: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=800", gallery: ["https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=800"], desc: "Large capacity bus for pilgrim groups, school trips and corporate events." },
  { id: 8, name: "Chevrolet Suburban", type: "SUV", cat: "SUV", passengers: 7, luggage: 6, trans: "Automatic", fuel: "Petrol", rating: 4.9, reviews: 67, price: 280, img: "https://images.unsplash.com/photo-1551522435-a13afa10f103?auto=format&fit=crop&q=80&w=800", gallery: ["https://images.unsplash.com/photo-1551522435-a13afa10f103?auto=format&fit=crop&q=80&w=800"], desc: "Full-size SUV combining comfort and cargo space for longer journeys." },
];

const categories = ["All", "Sedan", "SUV", "Van", "VIP", "Bus"];

const Fleet = () => {
  const [filter, setFilter] = useState("All");
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

  const filteredCars = filter === "All" 
    ? fleetData 
    : fleetData.filter(car => car.cat === filter || car.type.includes(filter));

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

  const handleBookNow = (carName: string) => {
    setDetailsCar(null);
    setPrefillVehicle(carName);
    
    setTimeout(() => {
      const el = document.getElementById("booking");
      el?.scrollIntoView({ behavior: "smooth", block: "start" });
      toast.success(`Selected vehicle: ${carName}`, {
        className: "bg-[#D4A853] text-white font-body font-bold border-none",
      });
    }, 100);
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
              Our <span className="italic text-gold">Premium Fleet</span>
            </h1>
            <p className="text-gray-text font-body text-base md:text-lg max-w-xl mx-auto mb-2 dark:text-gray-400">
              Travel in comfort and style across the Kingdom. Choose the perfect vehicle for your journey.
            </p>
            <p className="text-[#C9A84C] font-body text-[11px] uppercase tracking-[0.3em] font-bold">
              ELEGANCE IN EVERY MILE
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filter Bar */}
      <section className="py-8 bg-gray-50 dark:bg-[#111] border-b border-gray-200 dark:border-white/5 sticky top-[72px] z-40 transition-colors">
        <div className="container mx-auto px-6 flex justify-center flex-wrap gap-3">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-6 py-2 rounded-full font-body text-sm font-semibold transition-all border ${
                filter === cat 
                  ? "bg-[#C9A84C] text-[#0D0D14] border-[#C9A84C]" 
                  : "bg-white dark:bg-[#1A1A1A] text-gray-600 dark:text-gray-400 border-gray-200 dark:border-white/10 hover:border-[#C9A84C] hover:text-[#C9A84C]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Fleet Grid */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-[1200px]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {filteredCars.map((car, i) => (
                <motion.div
                  key={car.id}
                  layout
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.6, ease: "easeOut" }}
                  className="bg-white dark:bg-[#111] border border-black/5 dark:border-white/5 rounded-2xl overflow-hidden shadow-card transition-all hover:-translate-y-2 group"
                >
                  <div className="relative h-[220px] overflow-hidden">
                    <img 
                      src={car.img} 
                      alt={car.name} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-[#C9A84C] text-[#0D0D14] text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                        {car.type}
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="font-display font-bold text-xl text-[#1a1a1a] dark:text-white mb-2">{car.name}</h3>
                    
                    <div className="flex gap-4 mb-4 text-gray-500 dark:text-gray-400 text-[13px] font-body">
                      <div className="flex items-center gap-1.5">
                        <Users size={14} className="text-[#C9A84C]" />
                        <span>{car.passengers} pax</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Briefcase size={14} className="text-[#C9A84C]" />
                        <span>{car.luggage} bags</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Snowflake size={14} className="text-[#C9A84C]" />
                        <span>AC</span>
                      </div>
                    </div>

                    <p className="text-gray-400 dark:text-gray-500 text-[13px] font-body leading-relaxed mb-6 line-clamp-2">
                      {car.desc}
                    </p>

                    <div className="flex items-end justify-between mb-6">
                      <div>
                        <span className="text-gray-400 text-xs block mb-1 font-body">Starting from</span>
                        <span className="text-[#C9A84C] font-display font-bold text-xl">SAR {car.price}</span>
                        <span className="text-gray-400 text-[10px] ml-1 font-body">/ trip</span>
                      </div>
                    </div>

                    <div className="flex gap-3 mt-auto">
                      <button 
                        onClick={() => handleBookNow(car.name)}
                        className="flex-1 bg-[#C9A84C] text-[#0D0D14] font-body font-bold text-sm py-3 rounded-xl hover:opacity-90 transition-opacity"
                      >
                        Book Now
                      </button>
                      <button 
                        onClick={() => {
                          setDetailsCar(car);
                          setCurrentImageIndex(0);
                        }}
                        className="flex-1 border border-gray-200 dark:border-white/10 text-[#1a1a1a] dark:text-white font-body font-bold text-sm py-3 rounded-xl hover:border-[#C9A84C] hover:text-[#C9A84C] transition-all"
                      >
                        View Details
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
              <button 
                onClick={() => setDetailsCar(null)}
                className="absolute top-4 right-4 z-[10] w-9 h-9 rounded-full bg-black/10 dark:bg-white/10 flex items-center justify-center hover:bg-black/20 dark:hover:bg-white/20 transition-colors"
              >
                <X size={20} className="text-gray-800 dark:text-white" />
              </button>

              {/* Left Column: Gallery */}
              <div className="w-full md:w-[45%] lg:w-[42%] flex flex-col h-auto md:min-h-[500px]">
                {/* Main Image */}
                <div className="relative h-[220px] md:h-[280px] w-full overflow-hidden bg-gray-100 dark:bg-white/5 rounded-t-[16px] md:rounded-tr-none md:rounded-tl-[16px]">
                  <AnimatePresence mode="wait">
                    <motion.img 
                      key={currentImageIndex}
                      src={detailsCar.gallery[currentImageIndex] || detailsCar.img} 
                      alt={detailsCar.name} 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="w-full h-full object-cover" 
                    />
                  </AnimatePresence>
                </div>

                {/* Thumbnail strip */}
                <div className="flex gap-2 p-3 bg-[#F8F8F6] dark:bg-[#1C1C1C] overflow-x-auto no-scrollbar transition-colors">
                  {(detailsCar.gallery && detailsCar.gallery.length > 0 ? detailsCar.gallery : [detailsCar.img]).map((img: string, idx: number) => (
                    <img 
                      key={idx}
                      src={img}
                      onClick={() => setCurrentImageIndex(idx)}
                      className={`w-[72px] h-[54px] rounded-lg object-cover cursor-pointer transition-all duration-200 flex-shrink-0 ${
                        currentImageIndex === idx 
                          ? "border-2 border-[#D4A853] opacity-100 scale-105" 
                          : "border-2 border-transparent opacity-60 hover:opacity-90 hover:border-[#D4A853]/50"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Right Column: Details */}
              <div className="flex-1 p-4 md:p-8 lg:p-10 overflow-y-auto max-h-[none] md:max-h-none">
                <div className="flex items-center gap-3 mb-3">
                  <span className="border border-[#D4A853] text-[#D4A853] text-[11px] font-body font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
                    {detailsCar.cat || detailsCar.type}
                  </span>
                  <div className="flex items-center gap-1 text-[#D4A853]">
                    <Star size={13} className="fill-current" />
                    <span className="text-gray-400 dark:text-gray-500 text-[13px] font-body">
                      {detailsCar.rating} · {detailsCar.reviews} reviews
                    </span>
                  </div>
                </div>

                <h2 className="font-display font-bold text-xl md:text-[28px] text-[#1a1a1a] dark:text-[#F5F5F0] mb-1">
                  {detailsCar.name}
                </h2>
                
                <div className="mb-4">
                  <span className="text-[#D4A853] font-display font-bold text-xl md:text-2xl">SAR {detailsCar.price}</span>
                  <span className="text-gray-400 dark:text-gray-500 text-sm font-body ml-1">/trip</span>
                </div>

                <div className="h-px bg-[#E8E8E4] dark:bg-[#222220] my-4" />

                {/* Specs Grid */}
                <div className="grid grid-cols-2 gap-x-4 md:gap-x-8 gap-y-4 mb-6">
                  {[
                    { icon: Users, label: "PASSENGERS", val: detailsCar.passengers },
                    { icon: Briefcase, label: "LUGGAGE", val: `${detailsCar.luggage} bags` },
                    { icon: Fuel, label: "FUEL", val: detailsCar.fuel },
                    { icon: Settings, label: "TRANSMISSION", val: detailsCar.trans },
                    { icon: Snowflake, label: "AC", val: "Yes" },
                    { icon: ShieldCheck, label: "INSURANCE", val: "Included" },
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
                    {["Free WiFi", "Water Bottle", "Phone Charger", "Child Seat Available", "24/7 Support", "Meet & Greet", "Flight Tracking"].map((f, i) => (
                      <div 
                        key={i} 
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
                  {detailsCar.desc}
                </p>

                <div className="flex flex-col md:flex-row gap-3">
                  <button 
                    onClick={() => handleBookNow(detailsCar.name)}
                    className="flex-1 gradient-gold text-black font-body font-bold text-[15px] h-[48px] md:h-auto py-3.5 rounded-full shadow-lg shadow-gold/10 hover:shadow-gold/20 transition-all"
                  >
                    Book Now
                  </button>
                  <button 
                    onClick={() => setDetailsCar(null)}
                    className="flex-1 border-1.5 border-[#E8E8E4] dark:border-[#333330] text-[#1a1a1a] dark:text-[#F5F5F0] font-body font-medium text-[15px] h-[48px] md:h-auto py-3.5 rounded-full hover:bg-[#F5F5F0] dark:hover:bg-white/5 transition-all"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Integrated Booking Form */}
      <div id="booking">
        <BookingForm prefillVehicle={prefillVehicle} />
      </div>

      <Footer />
    </div>
  );
};

export default Fleet;
