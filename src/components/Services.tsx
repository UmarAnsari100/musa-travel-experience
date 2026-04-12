import { motion } from "framer-motion";
import { Car, Plane, MapPin, Mountain, Building2, Heart } from "lucide-react";

const services = [
  { icon: MapPin, title: " Hajj & Umrah Transfers", desc: "Dedicated transport between Makkah, Madinah, Mina, Arafat, and Muzdalifah for pilgrims." },
  { icon: Plane, title: " Airport Transfers", desc: "Meet & greet at King Abdulaziz (KAIA), King Fahd (KFIA), and King Khalid (RUH)." },
  { icon: Car, title: " Intercity Travel", desc: "Comfortable rides between Riyadh, Jeddah, Makkah, Madinah, Dammam, and Taif." },
  { icon: Mountain, title: " Desert & Heritage Tours", desc: "Guided tours to AlUla, Hegra, Edge of the World, Empty Quarter, and Diriyah UNESCO." },
  { icon: Building2, title: " Corporate Fleet", desc: "Monthly accounts and VIP transport for businesses across the Kingdom's major cities." },
  { icon: Heart, title: " VIP & Royal Events", desc: "Luxury vehicle hire for weddings, government events, and high-profile occasions in KSA." },
];

const reveal = {
  hidden: { opacity: 0, y: 28 },
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
        transition={{ duration: 0.6, ease: "easeOut" }}
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
            transition={{ delay: i * 0.08, duration: 0.6, ease: "easeOut" }}
            className="hover-black-card p-8 text-center"
          >
            <div className="icon-container mx-auto mb-6">
              <svc.icon size={32} />
            </div>
            <h3 className="font-body font-semibold text-base mb-2">{svc.title}</h3>
            <p className="font-body text-sm leading-relaxed">{svc.desc}</p>
            <div className="shimmer-line" />
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default Services;
