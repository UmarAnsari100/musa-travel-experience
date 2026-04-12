import { motion } from "framer-motion";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Standard Transfer",
    price: "SAR 3",
    unit: "/ km",
    desc: "Ideal for city rides across Riyadh, Jeddah, and Dammam.",
    features: [
      "AC Sedan or SUV",
      "MOI-verified drivers",
      "24/7 availability",
      "App or WhatsApp booking",
    ],
    highlight: false,
  },
  {
    name: "Pilgrimage & Tour",
    price: "Custom",
    unit: "Pricing",
    desc: "Tailored for Hajj, Umrah, families & corporate groups.",
    features: [
      "Luxury GMC or Coaster",
      "Licensed Hajj transport permit",
      "Hotel + transfers included",
      "Multilingual drivers",
      "24/7 support hotline",
    ],
    highlight: true,
  },
];

const Pricing = () => (
  <section id="pricing" className="py-20 md:py-28 bg-surface-low">
    <div className="container mx-auto px-6">
      <div className="text-center mb-16">
        <span className="font-body font-medium text-xs uppercase tracking-[0.10em] text-gray-text">Transparent Pricing</span>
        <h2 className="font-display font-bold text-3xl md:text-4xl mt-3 text-foreground">Kingdom Rates</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {plans.map((plan, i) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.65 }}
            className={`relative rounded-3xl p-8 shadow-card flex flex-col h-full transition-all hover:-translate-y-1 ${
              plan.highlight ? "bg-foreground text-primary-foreground shadow-2xl scale-105 z-10" : "bg-card"
            }`}
          >
            {plan.highlight && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gold text-primary-foreground text-[10px] font-bold px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg">
                Recommended
              </div>
            )}
            <div className="mb-8">
              <h3 className="font-display font-bold text-xl mb-2">{plan.name}</h3>
              <p className={`font-body text-sm ${plan.highlight ? "text-primary-foreground/70" : "text-gray-text"}`}>
                {plan.desc}
              </p>
            </div>
            
            <div className="flex items-baseline gap-1 mb-8">
              <span className={`font-display font-black text-4xl ${plan.highlight ? "text-gold" : "text-foreground"}`}>
                {plan.price}
              </span>
              <span className={`font-body text-sm font-medium ${plan.highlight ? "text-primary-foreground/50" : "text-gray-text"}`}>
                {plan.unit}
              </span>
            </div>

            <ul className="space-y-4 mb-10 flex-1">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start gap-3">
                  <div className={`mt-1 p-0.5 rounded-full ${plan.highlight ? "bg-gold/20 text-gold" : "bg-gold/10 text-gold"}`}>
                    <Check size={12} strokeWidth={3} />
                  </div>
                  <span className="font-body text-sm">{feature}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => document.getElementById("booking")?.scrollIntoView({ behavior: "smooth" })}
              className={`w-full py-4 rounded-xl font-body font-bold text-sm transition-all hover:scale-[1.02] ${
                plan.highlight 
                  ? "gradient-gold text-primary-foreground" 
                  : "bg-foreground text-primary-foreground hover:bg-foreground/90"
              }`}
            >
              Get Started
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default Pricing;
