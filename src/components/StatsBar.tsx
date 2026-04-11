import { motion } from "framer-motion";

const stats = [
  { value: "12K+", label: "Happy Customers" },
  { value: "50+", label: "Destinations" },
  { value: "4.9/5", label: "Average Rating" },
  { value: "150+", label: "Fleet Vehicles" },
  { value: "24/7", label: "Customer Support" },
];

const StatsBar = () => (
  <section className="bg-foreground py-8">
    <div className="container mx-auto px-6">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.65 }}
        className="flex flex-wrap justify-between items-center gap-6"
      >
        {stats.map((s) => (
          <div key={s.label} className="text-center flex-1 min-w-[120px]">
            <div className="font-display font-bold text-2xl md:text-3xl text-gold">{s.value}</div>
            <div className="font-body text-xs text-primary-foreground/70 mt-1">{s.label}</div>
          </div>
        ))}
      </motion.div>
    </div>
  </section>
);

export default StatsBar;
