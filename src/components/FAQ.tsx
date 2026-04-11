import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";

const faqs = [
  { q: "How far in a long distance trip?", a: "We cover distances across all major Pakistani cities and northern areas. Our long-distance trips range from 100km to over 1,500km including routes to Hunza, Skardu, and Gwadar." },
  { q: "Can I request a specific captain?", a: "Yes, repeat clients can request their preferred captain through our WhatsApp line or the booking form. Subject to availability, we always try to match you." },
  { q: "Are refreshments included in any rides?", a: "Our premium and corporate fleet packages include complimentary water and light refreshments. Northern tour packages include full meal stops at curated restaurants." },
  { q: "What is your cancellation policy?", a: "Free cancellation up to 24 hours before your scheduled ride. Within 24 hours, a 20% fee applies. No-shows are charged the full fare." },
  { q: "Do you provide a child safety seat?", a: "Absolutely. Child safety seats are available upon request at no extra charge. Please mention it during booking so we can prepare the appropriate vehicle." },
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-20 md:py-28">
      <div className="container mx-auto px-6 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65 }}
          className="text-center mb-12"
        >
          <h2 className="font-display font-bold text-3xl md:text-4xl">Common Enquiries</h2>
        </motion.div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05, duration: 0.4 }}
              className="bg-card rounded-2xl shadow-card overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between p-5 font-body font-medium text-sm text-left"
              >
                {faq.q}
                {openIndex === i ? <Minus size={18} className="text-gold flex-shrink-0" /> : <Plus size={18} className="text-gray-text flex-shrink-0" />}
              </button>
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <p className="px-5 pb-5 text-gray-text font-body text-sm leading-relaxed">{faq.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
