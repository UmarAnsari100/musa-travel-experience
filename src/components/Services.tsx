import { motion } from "framer-motion";
import { Car, Plane, MapPin, Mountain, Building2, Heart } from "lucide-react";

const services = [
  { icon: Car, title: "City Taxi", desc: "Quick, reliable city-wide premium sedans and hatchback options." },
  { icon: Plane, title: "Airport Transfers", desc: "On-time pickups with tracked arrivals at major airports nationwide." },
  { icon: MapPin, title: "Intercity Travel", desc: "Comfortable long-distance rides across the country's major cities." },
  { icon: Mountain, title: "Northern Tours", desc: "Multi-day guided tour packages through the Karakoram mountains." },
  { icon: Building2, title: "Corporate Fleet", desc: "Dedicated fleet management tailored for businesses and corporates." },
  { icon: Heart, title: "Events & Weddings", desc: "Luxury fleets for celebrations, ceremonies and milestone events." },
];

const reveal = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0 },
};

const Services = () => (
  <section id="services" className="py-20 md:py-28">
    <div className="container mx-auto px-6">
      <motion.div
        variants={reveal}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        transition={{ duration: 0.65 }}
        className="text-center mb-16"
      >
        <span className="font-body font-medium text-xs uppercase tracking-[0.10em] text-gray-text">What We Offer</span>
        <h2 className="font-display font-bold text-3xl md:text-4xl mt-3">Services for Every Need</h2>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {services.map((svc, i) => (
          <motion.div
            key={svc.title}
            variants={reveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ delay: i * 0.08, duration: 0.65 }}
            className="bg-card rounded-2xl p-8 shadow-card hover:-translate-y-1 hover:shadow-lg transition-all text-center"
          >
            <svc.icon size={32} className="text-gold mx-auto mb-4" />
            <h3 className="font-body font-semibold text-base mb-2">{svc.title}</h3>
            <p className="text-gray-text font-body text-sm">{svc.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default Services;
