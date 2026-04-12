import { motion } from "framer-motion";
import { Shield, Clock, Award } from "lucide-react";

const cards = [
  {
    icon: Shield,
    title: "Uncompromising Safety",
    desc: "All drivers are MOI-verified, licensed, and trained for Hajj & Umrah transfer protocols. Your safety on Saudi roads is our promise.",
    dark: true,
  },
  {
    icon: Clock,
    title: "Time Precision",
    desc: "We monitor flight arrivals at KAIA, KFIA, and RUH airports. Punctual pickup for every pilgrim and business traveler — guaranteed.",
    dark: false,
  },
  {
    icon: Award,
    title: "Curated Expertise",
    desc: "Born and raised in the Kingdom — our drivers know every route from Makkah to Madinah, Jeddah to Riyadh, and every stop in between.",
    dark: false,
  },
];

const reveal = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0 },
};

const WhyChooseUs = () => (
  <section className="py-20 md:py-28">
    <div className="container mx-auto px-6">
      <motion.div
        variants={reveal}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        transition={{ duration: 0.65 }}
        className="text-center mb-16"
      >
        <span className="font-body font-medium text-xs uppercase tracking-[0.10em] text-gray-text">Why Choose Us</span>
        <h2 className="font-display font-bold text-3xl md:text-4xl mt-3">The Musa Distinction</h2>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        {cards.map((card, i) => (
          <motion.div
            key={card.title}
            variants={reveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.65 }}
            className={`rounded-2xl p-8 transition-all hover:-translate-y-1 hover:shadow-lg ${
              card.dark ? "bg-foreground text-primary-foreground" : "bg-card shadow-card"
            }`}
          >
            <card.icon size={28} className={card.dark ? "text-gold" : "text-gold"} />
            <h3 className="font-body font-semibold text-lg mt-5 mb-3">{card.title}</h3>
            <p className={`font-body text-sm leading-relaxed ${card.dark ? "text-primary-foreground/70" : "text-gray-text"}`}>
              {card.desc}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default WhyChooseUs;
