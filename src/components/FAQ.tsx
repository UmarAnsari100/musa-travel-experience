import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";

const faqs = [
  { q: "How do I book a Hajj or Umrah transfer?", a: "Book via WhatsApp, our website, or call our 24/7 hotline. We serve all pilgrims arriving at KAIA and KFIA with direct transfers to Makkah and Madinah." },
  { q: "Are your drivers Hajj-licensed?", a: "Yes. All drivers hold valid Saudi MOI licenses and Hajj transport permits issued by the Ministry of Hajj." },
  { q: "Which cities and airports do you cover?", a: "All major KSA cities: Riyadh, Jeddah, Makkah, Madinah, Dammam, Taif, Abha. Airports: KAIA, KFIA, RUH, AHB, DMM." },
  { q: "Do you offer group rates for families?", a: "Groups of 4+ receive 15% discount. Hajj & Umrah groups of 10+ get a dedicated Coaster with coordinator." },
  { q: "What is your cancellation policy?", a: "Free cancellation 2 hours before pickup. Tours: full refund 7 days before, 50% credit after that." },
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-20 md:py-28">
      <div className="container mx-auto px-6 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center mb-12"
        >
          <h2 className="font-display font-bold text-3xl md:text-4xl">Common Enquiries</h2>
        </motion.div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.6, ease: "easeOut" }}
              className="bg-card shadow-card overflow-hidden"
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
