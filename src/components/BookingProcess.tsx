import { motion } from "framer-motion";
import { MapPin, Calendar, CreditCard, Car, CheckCircle, Star } from "lucide-react";

const steps = [
  { num: "01", icon: MapPin, title: "Choose Route", desc: "Select your pickup and drop-off locations." },
  { num: "02", icon: Calendar, title: "Pick Date & Time", desc: "Choose your preferred schedule." },
  { num: "03", icon: Star, title: "Select Service", desc: "Pick from our range of travel services." },
  { num: "04", icon: CreditCard, title: "Secure Pay", desc: "Pay securely through multiple methods." },
  { num: "05", icon: Car, title: "Enjoy Ride", desc: "Relax while our chauffeur handles the rest." },
  { num: "06", icon: CheckCircle, title: "Rate & Review", desc: "Share your experience and earn rewards." },
];

const reveal = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0 },
};

const BookingProcess = () => (
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
        <span className="font-body font-medium text-xs uppercase tracking-[0.10em] text-gray-text">How It Works</span>
        <h2 className="font-display font-bold text-3xl md:text-4xl mt-3">Seamlessly Crafted Booking Process</h2>
        <p className="text-gray-text font-body mt-4 max-w-lg mx-auto">
          From selection to drop-off, every step is optimized for your convenience.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {steps.map((step, i) => (
          <motion.div
            key={step.num}
            variants={reveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ delay: i * 0.08, duration: 0.65 }}
            className="bg-card rounded-2xl p-6 shadow-card hover:-translate-y-1 hover:shadow-lg transition-all"
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="font-display font-bold text-2xl text-gold">{step.num}</span>
              <step.icon size={20} className="text-gray-text" />
            </div>
            <h3 className="font-body font-semibold text-base mb-2">{step.title}</h3>
            <p className="text-gray-text font-body text-sm">{step.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default BookingProcess;
