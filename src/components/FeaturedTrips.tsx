import { motion } from "framer-motion";

const trips = [
  { 
    img: "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&q=80&w=800", 
    title: "Makkah & Madinah Pilgrimage Package", 
    desc: "7 days of spiritual journey with private transfers between the two Holy Cities, Mina, and Arafat.", 
    price: "SAR 1,200", 
    dest: "Makkah",
    badge: "BESTSELLER"
  },
  { 
    img: "https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?auto=format&fit=crop&q=80&w=800", 
    title: "AlUla Heritage & Rose City Tour", 
    desc: "5 days exploring Hegra, Dadan, Jabal Ikmah and Nabataean UNESCO World Heritage Sites.", 
    price: "SAR 2,500", 
    dest: "AlUla",
    badge: "POPULAR"
  },
  { 
    img: "https://images.unsplash.com/photo-1586724230473-4122198d4072?auto=format&fit=crop&q=80&w=800", 
    title: "Riyadh City & Diriyah Experience", 
    desc: "3 days: Kingdom Tower, Edge of the World, Diriyah UNESCO site, and the best of Saudi's modern capital.", 
    price: "SAR 800", 
    dest: "Riyadh",
    badge: "NEW"
  },
  { 
    img: "https://images.unsplash.com/photo-1551041738-f86047247d51?auto=format&fit=crop&q=80&w=800", 
    title: "Jeddah Corniche & Historic District", 
    desc: "2 days in Al-Balad UNESCO Heritage, Floating Mosque, King Fahd Fountain, and Red Sea corniche.", 
    price: "SAR 650", 
    dest: "Jeddah"
  },
  { 
    img: "https://images.unsplash.com/photo-1614741355037-339247f985b5?auto=format&fit=crop&q=80&w=800", 
    title: "Abha & Asir Mountains Retreat", 
    desc: "4 days in the Green Mountains — cable cars, flower markets, and cool mountain air.", 
    price: "SAR 1,800", 
    dest: "Abha"
  },
  { 
    img: "https://images.unsplash.com/photo-1436491865332-7a61a109c0f?auto=format&fit=crop&q=80&w=800", 
    title: "Airport VIP Transfer — Premium", 
    desc: "Luxury sedan with meet & greet, porter assistance, and real-time flight tracking at all KSA airports.", 
    price: "SAR 250", 
    dest: "Airport",
    badge: "TAXI"
  },
];

const reveal = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0 },
};

const FeaturedTrips = () => {
  const handleBook = (dest: string) => {
    const el = document.getElementById("booking");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
      // Pre-fill destination after scroll
      setTimeout(() => {
        const toInput = document.getElementById("booking-to") as HTMLInputElement;
        if (toInput) {
          toInput.value = dest;
          toInput.dispatchEvent(new Event("input", { bubbles: true }));
        }
      }, 800);
    }
  };

  return (
    <section id="packages" className="py-20 md:py-28">
      <div className="container mx-auto px-6">
        <motion.div
          variants={reveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.65 }}
          className="flex items-end justify-between mb-12"
        >
          <div>
            <span className="font-body font-medium text-xs uppercase tracking-[0.10em] text-gray-text">Top Picks</span>
            <h2 className="font-display font-bold text-3xl md:text-4xl mt-3">Featured Voyages</h2>
            <p className="text-gray-text font-body mt-2">Our most sought-after curated experiences.</p>
          </div>
          <button className="hidden md:block text-gold font-body font-medium text-sm hover:underline">
            View All Packages →
          </button>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {trips.map((trip, i) => (
            <motion.div
              key={trip.title}
              variants={reveal}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.65 }}
              className="group bg-card rounded-2xl overflow-hidden shadow-card hover:-translate-y-1 hover:shadow-lg transition-all relative"
            >
              {trip.badge && (
                <div className="absolute top-4 right-4 z-10 bg-gold text-primary-foreground text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
                  {trip.badge}
                </div>
              )}
              <div className="overflow-hidden h-52">
                <img 
                  src={trip.img} 
                  alt={trip.title} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                  loading="lazy" 
                />
              </div>
              <div className="p-6">
                <h3 className="font-body font-semibold text-lg mb-1">{trip.title}</h3>
                <p className="text-gray-text font-body text-sm mb-4 line-clamp-2">{trip.desc}</p>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-display font-bold text-xl text-gold">{trip.price}</span>
                    <span className="text-[10px] text-gray-text ml-1">/ person</span>
                  </div>
                  <button
                    onClick={() => handleBook(trip.dest)}
                    className="gradient-gold text-primary-foreground font-body font-semibold text-sm px-5 py-2 rounded-full transition-transform hover:scale-[1.03]"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedTrips;
