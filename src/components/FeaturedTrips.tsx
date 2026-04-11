import { motion } from "framer-motion";
import hunza from "@/assets/hunza-valley.jpg";
import mughal from "@/assets/mughal-heritage.jpg";
import skardu from "@/assets/skardu-wilderness.jpg";

const trips = [
  { img: hunza, title: "Hunza Valley Escape", desc: "Explore the legendary Silk Road and Rakaposhi valley.", price: "₨25,000", dest: "Hunza" },
  { img: mughal, title: "Mughal Heritage Tour", desc: "A curated journey through Lahore's majestic history.", price: "₨18,000", dest: "Lahore" },
  { img: skardu, title: "Skardu Wilderness", desc: "Brave the Cold Waters and Shangrila's beauty.", price: "₨32,000", dest: "Skardu" },
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
              className="bg-card rounded-2xl overflow-hidden shadow-card hover:-translate-y-1 hover:shadow-lg transition-all"
            >
              <img src={trip.img} alt={trip.title} className="w-full h-52 object-cover" loading="lazy" />
              <div className="p-6">
                <h3 className="font-body font-semibold text-lg mb-1">{trip.title}</h3>
                <p className="text-gray-text font-body text-sm mb-4">{trip.desc}</p>
                <div className="flex items-center justify-between">
                  <span className="font-display font-bold text-xl text-gold">{trip.price}</span>
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
