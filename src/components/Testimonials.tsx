import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    text: "The Makkah to Madinah transfer was flawless. Driver was waiting at the Haram gate. Pure professionalism.",
    name: "Pilgrim Traveler",
    role: "Riyadh, KSA",
  },
  {
    text: "KAIA airport pickup was waiting before I even landed. Seamless experience. Highly recommend MUSA TRAVEL.",
    name: "Business Executive",
    role: "Jeddah, KSA",
  },
  {
    text: "AlUla tour was breathtaking. Guide knew every stone of Hegra. Best trip I've ever taken in the Kingdom.",
    name: "Heritage Explorer",
    role: "Makkah, KSA",
  },
  {
    text: "Asir Mountains package exceeded all expectations. Guide was brilliant and the views were absolutely breathtaking.",
    name: "Nature Lover",
    role: "Madinah, KSA",
  },
  {
    text: "Used MUSA TRAVEL for our corporate fleet. Reliable, professional, invoiced monthly. 10/10 service every time.",
    name: "Corporate Partner",
    role: "Dammam, KSA",
  },
];

const reveal = {
  hidden: { opacity: 0, y: 28 },
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
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="text-center mb-16"
      >
        <span className="font-body font-medium text-xs uppercase tracking-[0.10em] text-gray-text">Reviews</span>
        <h2 className="font-display font-bold text-3xl md:text-4xl mt-3">Voices of the Voyage</h2>
      </motion.div>

      <div className="marquee-wrapper">
        <div className="marquee-track">
          {[...testimonials, ...testimonials].map((t, i) => (
            <div
              key={i}
              className="bg-card p-8 rounded-2xl shadow-card transition-all testimonial-marquee-card"
            >
              <div className="flex gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Star key={j} size={14} className="fill-gold text-gold" />
                ))}
              </div>
              <p className="text-gray-text font-body text-sm leading-relaxed mb-6 italic">"{t.text}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full gradient-gold shrink-0 flex items-center justify-center text-primary-foreground font-body font-bold text-sm md:text-base overflow-hidden">
                  {t.name[0]}
                </div>
                <div>
                  <div className="font-body font-semibold text-sm">{t.name}</div>
                  <div className="font-body text-xs text-gray-text">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default Testimonials;
