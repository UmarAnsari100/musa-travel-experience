import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Briefcase, Snowflake, X, ChevronRight, Star, Check, Fuel, Settings, ShieldCheck, MapPin, Calendar, Clock, MessageSquare } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const fleetData = [
  { id: 1, name: "Toyota Camry", type: "Sedan", cat: "Sedan", passengers: 4, luggage: 3, trans: "Automatic", fuel: "Hybrid", rating: 4.8, reviews: 98, price: 120, img: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&q=80&w=800", desc: "Comfortable mid-size sedan perfect for city transfers and airport rides." },
  { id: 2, name: "Toyota Corolla", type: "Sedan", cat: "Sedan", passengers: 4, luggage: 2, trans: "Automatic", fuel: "Petrol", rating: 4.7, reviews: 143, price: 100, img: "https://images.unsplash.com/photo-1623860831270-ee3132bf52e4?auto=format&fit=crop&q=80&w=800", desc: "Reliable and economical choice for short to medium distance trips." },
  { id: 3, name: "GMC Yukon", type: "SUV", cat: "SUV", passengers: 6, luggage: 5, trans: "Automatic", fuel: "Petrol", rating: 4.9, reviews: 76, price: 250, img: "https://images.unsplash.com/photo-1567818735868-e71b99932e29?auto=format&fit=crop&q=80&w=800", desc: "Spacious full-size SUV ideal for families and group travel." },
  { id: 4, name: "Toyota Land Cruiser", type: "VIP SUV", cat: "VIP", passengers: 6, luggage: 4, trans: "Automatic", fuel: "Petrol", rating: 5.0, reviews: 201, price: 350, img: "https://images.unsplash.com/photo-1594502184342-2e12f877aa73?auto=format&fit=crop&q=80&w=800", desc: "Premium VIP SUV delivering the ultimate luxury experience across the Kingdom." },
  { id: 5, name: "Toyota Hiace", type: "Van", cat: "Van", passengers: 12, luggage: 8, trans: "Manual", fuel: "Diesel", rating: 4.8, reviews: 112, price: 300, img: "https://images.unsplash.com/photo-1532007271951-c487760934ae?auto=format&fit=crop&q=80&w=800", desc: "Spacious van perfect for group travel, pilgrim transfers and corporate trips." },
  { id: 6, name: "Mercedes E-Class", type: "VIP Sedan", cat: "VIP", passengers: 4, luggage: 3, trans: "Automatic", fuel: "Hybrid", rating: 5.0, reviews: 89, price: 400, img: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&q=80&w=800", desc: "Executive class sedan for business travel and VIP airport transfers." },
  { id: 7, name: "Coaster Bus", type: "Bus", cat: "Bus", passengers: 30, luggage: 15, trans: "Manual", fuel: "Diesel", rating: 4.7, reviews: 54, price: 600, img: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=800", desc: "Large capacity bus for pilgrim groups, school trips and corporate events." },
  { id: 8, name: "Chevrolet Suburban", type: "SUV", cat: "SUV", passengers: 7, luggage: 6, trans: "Automatic", fuel: "Petrol", rating: 4.9, reviews: 67, price: 280, img: "https://images.unsplash.com/photo-1551522435-a13afa10f103?auto=format&fit=crop&q=80&w=800", desc: "Full-size SUV combining comfort and cargo space for longer journeys." },
];

const categories = ["All", "Sedan", "SUV", "Van", "VIP", "Bus"];

const Fleet = () => {
  const [filter, setFilter] = useState("All");
  const [selectedCar, setSelectedCar] = useState<any>(null);
  const [detailsCar, setDetailsCar] = useState<any>(null);

  const filteredCars = filter === "All" 
    ? fleetData 
    : fleetData.filter(car => car.cat === filter || car.type.includes(filter));

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, []);

  const handleEsc = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") {
      setSelectedCar(null);
      setDetailsCar(null);
    }
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [handleEsc]);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-44 md:pb-32 overflow-hidden">
        {/* Ghost watermark */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
          <span className="font-display text-[12rem] md:text-[20rem] font-black text-black/[0.05] leading-none uppercase">
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
            <h1 className="font-display font-black text-4xl md:text-[3.5rem] leading-tight tracking-[-0.02em] mb-4 text-[#1a1a1a]">
              Our <span className="italic text-gold">Premium Fleet</span>
            </h1>
            <p className="text-gray-text font-body text-base md:text-lg max-w-xl mx-auto mb-2">
              Travel in comfort and style across the Kingdom. Choose the perfect vehicle for your journey.
            </p>
            <p className="text-[#C9A84C] font-body text-[11px] uppercase tracking-[0.3em] font-bold">
              ELEGANCE IN EVERY MILE
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filter Bar */}
      <section className="py-12 bg-gray-50 border-b border-gray-200 sticky top-[72px] z-40">
        <div className="container mx-auto px-6 flex justify-center flex-wrap gap-3">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-6 py-2 rounded-full font-body text-sm font-semibold transition-all border ${
                filter === cat 
                  ? "bg-[#C9A84C] text-[#0D0D14] border-[#C9A84C]" 
                  : "bg-white text-gray-600 border-gray-200 hover:border-[#C9A84C] hover:text-[#C9A84C]"
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
                  className="bg-white border border-black/5 rounded-2xl overflow-hidden shadow-card hover:shadow-featured transition-all hover:-translate-y-2 group"
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
                    <h3 className="font-display font-bold text-xl text-[#1a1a1a] mb-2">{car.name}</h3>
                    
                    <div className="flex gap-4 mb-4 text-gray-500 text-[13px] font-body">
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

                    <p className="text-gray-400 text-[13px] font-body leading-relaxed mb-6 line-clamp-2">
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
                        onClick={() => setSelectedCar(car)}
                        className="flex-1 bg-[#C9A84C] text-[#0D0D14] font-body font-bold text-sm py-3 rounded-xl hover:opacity-90 transition-opacity"
                      >
                        Book Now
                      </button>
                      <button 
                        onClick={() => setDetailsCar(car)}
                        className="flex-1 border border-gray-200 text-[#1a1a1a] font-body font-bold text-sm py-3 rounded-xl hover:border-[#C9A84C] hover:text-[#C9A84C] transition-all"
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

      {/* Vehicle Details Modal */}
      <AnimatePresence>
        {detailsCar && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDetailsCar(null)}
              className="absolute inset-0 bg-black/75 backdrop-blur-lg"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-[860px] bg-white rounded-[24px] overflow-hidden shadow-2xl flex flex-col md:flex-row"
            >
              <button 
                onClick={() => setDetailsCar(null)}
                className="absolute top-6 right-6 z-10 p-2 rounded-full bg-black/10 hover:bg-black/20 md:bg-gray-100 md:hover:bg-gray-200 transition-colors"
              >
                <X size={20} className="text-gray-600" />
              </button>

              {/* Left Column: Image */}
              <div className="relative w-full md:w-[45%] h-64 md:h-auto">
                <img src={detailsCar.img} alt={detailsCar.name} className="w-full h-full object-cover" />
                <div className="absolute bottom-6 left-6">
                  <span className="bg-[#C9A84C] text-[#0D0D14] text-[11px] font-bold px-4 py-1.5 rounded-full uppercase tracking-wider shadow-lg">
                    {detailsCar.type}
                  </span>
                </div>
              </div>

              {/* Right Column: Details */}
              <div className="flex-1 p-8 md:p-10 text-[#1a1a1a]">
                <div className="flex items-center gap-2 mb-2 text-gold">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={14} className={i < Math.floor(detailsCar.rating) ? "fill-current" : "opacity-30"} />
                  ))}
                  <span className="text-gray-400 text-xs font-bold ml-1">{detailsCar.rating} · {detailsCar.reviews} reviews</span>
                </div>
                
                <h2 className="font-display font-bold text-2xl md:text-3xl mb-1">{detailsCar.name}</h2>
                <div className="text-[#C9A84C] font-display font-bold text-xl mb-6">
                  SAR {detailsCar.price} <span className="text-gray-400 text-xs font-body font-normal">/ trip</span>
                </div>

                <div className="w-full h-px bg-gray-100 mb-6" />

                {/* Specs Grid */}
                <div className="grid grid-cols-2 gap-y-4 gap-x-8 mb-6">
                  {[
                    { icon: Users, label: "Passengers", val: detailsCar.passengers },
                    { icon: Briefcase, label: "Luggage", val: `${detailsCar.luggage} bags` },
                    { icon: Fuel, label: "Fuel", val: detailsCar.fuel },
                    { icon: Settings, label: "Transmission", val: detailsCar.trans },
                    { icon: Snowflake, label: "AC", val: "Yes" },
                    { icon: ShieldCheck, label: "Insurance", val: "Included" },
                  ].map((spec, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <spec.icon size={16} className="text-[#C9A84C]" />
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{spec.label}</span>
                        <span className="text-sm font-semibold">{spec.val}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="w-full h-px bg-gray-100 mb-6" />

                {/* Features */}
                <div className="mb-6">
                  <h4 className="font-body font-bold text-[#C9A84C] mb-3 uppercase tracking-widest text-[11px]">Included Features</h4>
                  <div className="flex flex-wrap gap-2">
                    {["Free WiFi", "Water Bottle", "Phone Charger", "Child Seat Available", "24/7 Support", "Meet & Greet", "Flight Tracking"].map((f, i) => (
                      <div key={i} className="flex items-center gap-1 bg-[#C9A84C]/5 border border-[#C9A84C]/10 px-2.5 py-1 rounded-full">
                        <Check size={10} className="text-[#C9A84C]" />
                        <span className="text-[11px] font-medium text-gray-600">{f}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="w-full h-px bg-gray-100 mb-6" />

                <p className="text-gray-500 text-sm font-body leading-relaxed mb-8">
                  {detailsCar.desc}
                </p>

                <div className="flex gap-4">
                  <button 
                    onClick={() => {
                      setDetailsCar(null);
                      setSelectedCar(detailsCar);
                    }}
                    className="flex-1 bg-[#C9A84C] text-[#0D0D14] font-body font-bold text-sm py-4 rounded-xl shadow-lg hover:opacity-95"
                  >
                    Book Now
                  </button>
                  <button 
                    onClick={() => setDetailsCar(null)}
                    className="flex-1 border border-gray-200 text-[#1a1a1a] font-body font-bold text-sm py-4 rounded-xl hover:border-gray-400"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Booking Modal */}
      <AnimatePresence>
        {selectedCar && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedCar(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-[480px] bg-white rounded-[24px] p-8 shadow-2xl"
            >
              <button 
                onClick={() => setSelectedCar(null)}
                className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X size={20} className="text-gray-400" />
              </button>

              <div className="mb-8 flex items-center gap-4">
                <div className="w-16 h-12 rounded-lg overflow-hidden bg-gray-100">
                   <img src={selectedCar.img} className="w-full h-full object-cover" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#C9A84C] block mb-0.5">Complete Booking</span>
                  <h2 className="font-display font-bold text-xl text-[#1a1a1a]">{selectedCar.name}</h2>
                </div>
              </div>

              <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setSelectedCar(null); }}>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5 text-left">
                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1 flex items-center gap-1.5">
                      <MapPin size={10} /> Pickup
                    </label>
                    <input type="text" placeholder="Hotel / Airport" className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#C9A84C]" required />
                  </div>
                  <div className="space-y-1.5 text-left">
                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1 flex items-center gap-1.5">
                      <MapPin size={10} /> Drop-off
                    </label>
                    <input type="text" placeholder="Destination" className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#C9A84C]" required />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-left">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1 flex items-center gap-1.5">
                      <Calendar size={10} /> Date
                    </label>
                    <input type="date" className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#C9A84C]" required />
                  </div>
                  <div className="space-y-1.5 text-left">
                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1 flex items-center gap-1.5">
                      <Clock size={10} /> Time
                    </label>
                    <input type="time" className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#C9A84C]" required />
                  </div>
                </div>

                <div className="space-y-1.5 text-left">
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1 flex items-center gap-1.5">
                    <Users size={10} /> Passengers
                  </label>
                  <input type="number" min="1" max={selectedCar.passengers} placeholder={`Max ${selectedCar.passengers}`} className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#C9A84C]" required />
                </div>

                <div className="space-y-1.5 text-left">
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1 flex items-center gap-1.5">
                    <MessageSquare size={10} /> Notes
                  </label>
                  <textarea placeholder="Any special requests?" className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#C9A84C] h-24 resize-none"></textarea>
                </div>

                <div className="pt-4 space-y-4">
                  <button type="submit" className="w-full gradient-gold text-[#0D0D14] font-body font-bold text-sm py-4 rounded-xl shadow-lg hover:shadow-[#C9A84C]/20 transition-all flex items-center justify-center gap-2">
                    Confirm Booking <ChevronRight size={16} />
                  </button>
                  <button type="button" onClick={() => setSelectedCar(null)} className="w-full text-center text-gray-400 text-[13px] font-medium hover:text-gray-600 transition-colors">
                    Cancel and return
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
};

export default Fleet;
