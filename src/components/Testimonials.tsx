import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    text: "The most professional service in the country. The captain was knowledgeable and the vehicle was immaculate. Truly a comfort masterpiece.",
    name: "Zara Ahmed",
    role: "Frequent Traveler",
  },
  {
    text: "Musa Travel feels like your private international concierge. Every detail is polished, each plan covers just the essentials in comfort.",
    name: "Ayesha Malik",
    role: "Business Executive",
  },
  {
    text: "Reliability is hard to find but Musa Travel delivers every time. Their support infrastructure is always at the ready, no matter what.",
    name: "Omar Farooq",
    role: "Corporate Client",
  },
];

const reveal = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0 },
};

const Testimonials = () => (
  <section className="py-20 md:py-28 bg-surface-low">
    <div className="container mx-auto px-6">
      <motion.div
        variants={reveal}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        transition={{ duration: 0.65 }}
        className="text-center mb-16"
      >
        <span className="font-body font-medium text-xs uppercase tracking-[0.10em] text-gray-text">Reviews</span>
        <h2 className="font-display font-bold text-3xl md:text-4xl mt-3">Voices of the Voyage</h2>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {testimonials.map((t, i) => (
          <motion.div
            key={t.name}
            variants={reveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.65 }}
            className="bg-card rounded-2xl p-8 shadow-card hover:-translate-y-1 hover:shadow-lg transition-all"
          >
            <div className="flex gap-1 mb-4">
              {Array.from({ length: 5 }).map((_, j) => (
                <Star key={j} size={14} className="fill-gold text-gold" />
              ))}
            </div>
            <p className="text-gray-text font-body text-sm leading-relaxed mb-6">"{t.text}"</p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full gradient-gold flex items-center justify-center text-primary-foreground font-body font-bold text-sm">
                {t.name[0]}
              </div>
              <div>
                <div className="font-body font-semibold text-sm">{t.name}</div>
                <div className="font-body text-xs text-gray-text">{t.role}</div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default Testimonials;
