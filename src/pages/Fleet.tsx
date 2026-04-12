import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Briefcase, Snowflake, X, ChevronRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const fleetData = [
  { id: 1, name: "Toyota Camry", type: "Sedan", cat: "Sedan", passengers: 4, luggage: 2, price: 120, img: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&q=80&w=800", desc: "Reliable and comfortable ride for city travel." },
  { id: 2, name: "Toyota Corolla", type: "Sedan", cat: "Sedan", passengers: 4, luggage: 2, price: 100, img: "https://images.unsplash.com/photo-1623860831270-ee3132bf52e4?auto=format&fit=crop&q=80&w=800", desc: "Efficiency meets comfort for small families." },
  { id: 3, name: "GMC Yukon", type: "SUV", cat: "SUV", passengers: 6, luggage: 4, price: 250, img: "https://images.unsplash.com/photo-1567818735868-e71b99932e29?auto=format&fit=crop&q=80&w=800", desc: "Spacious and powerful for long-distance comfort." },
  { id: 4, name: "Toyota Land Cruiser", type: "VIP SUV", cat: "VIP", passengers: 6, luggage: 4, price: 350, img: "https://images.unsplash.com/photo-1594502184342-2e12f877aa73?auto=format&fit=crop&q=80&w=800", desc: "The ultimate luxury SUV experience across the Kingdom." },
  { id: 5, name: "Toyota Hiace", type: "Van", cat: "Van", passengers: 12, luggage: 8, price: 300, img: "https://images.unsplash.com/photo-1532007271951-c487760934ae?auto=format&fit=crop&q=80&w=800", desc: "Perfect for larger groups and heavy luggage requirements." },
  { id: 6, name: "Mercedes E-Class", type: "VIP Sedan", cat: "VIP", passengers: 4, luggage: 2, price: 400, img: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&q=80&w=800", desc: "Top-tier executive travel for high-profile business." },
  { id: 7, name: "Coaster Bus", type: "Bus", cat: "Bus", passengers: 30, luggage: 20, price: 600, img: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=800", desc: "Spacious group transport for delegations and events." },
  { id: 8, name: "Chevrolet Suburban", type: "SUV", cat: "SUV", passengers: 7, luggage: 5, price: 280, img: "https://images.unsplash.com/photo-1551522435-a13afa10f103?auto=format&fit=crop&q=80&w=800", desc: "Extra space and utility for large family adventures." },
];

const categories = ["All", "Sedan", "SUV", "Van", "VIP", "Bus"];

const Fleet = () => {
  const [filter, setFilter] = useState("All");
  const [selectedCar, setSelectedCar] = useState<any>(null);

  const filteredCars = filter === "All" 
    ? fleetData 
    : fleetData.filter(car => car.cat === filter || car.type.includes(filter));

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-[#0D0D14] pt-32 pb-20 px-6">
        <div className="container mx-auto max-w-[1200px] text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display font-bold text-4xl md:text-6xl text-white mb-4"
          >
            Our Fleet
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-white/80 font-body text-lg md:text-xl mb-2"
          >
            Travel in comfort and style across the Kingdom
          </motion.p>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-white/40 font-body text-sm"
          >
            Choose the perfect vehicle for your journey
          </motion.p>
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

                    <p className="text-gray-400 text-[13px] font-body leading-relaxed mb-6">
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
                      <button className="flex-1 border border-gray-200 text-[#1a1a1a] font-body font-bold text-sm py-3 rounded-xl hover:border-[#C9A84C] hover:text-[#C9A84C] transition-all">
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

              <div className="mb-8">
                <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#C9A84C] block mb-2">Complete Booking</span>
                <h2 className="font-display font-bold text-2xl text-[#1a1a1a]">{selectedCar.name}</h2>
              </div>

              <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setSelectedCar(null); }}>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1">Pickup</label>
                    <input type="text" placeholder="Hotel / Airport" className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#C9A84C]" required />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1">Drop-off</label>
                    <input type="text" placeholder="Destination" className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#C9A84C]" required />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1">Date</label>
                    <input type="date" className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#C9A84C]" required />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1">Time</label>
                    <input type="time" className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#C9A84C]" required />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1">Passengers</label>
                  <input type="number" min="1" max={selectedCar.passengers} placeholder={`Max ${selectedCar.passengers}`} className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#C9A84C]" required />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1">Notes</label>
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
