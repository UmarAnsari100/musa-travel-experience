import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

const StatsBar = () => {
  const { t } = useTranslation();

  const stats = [
    { value: "12K+", label: t('stats.travelers') },
    { value: "50+", label: t('stats.destinations') },
    { value: "4.9★", label: t('stats.rating') },
    { value: "150+", label: t('stats.vehicles') },
    { value: "24/7", label: t('stats.available') },
  ];

  return (
  <section className="bg-[#0D1C1A] border-y border-[rgba(64,138,113,0.15)] py-8">
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
            <div className="font-display font-bold text-2xl md:text-3xl text-[#F0FFF8]">
              {s.value.replace(/[^0-9.]/g, '')}
              <span className="text-[#B0E4CC]">{s.value.replace(/[0-9.]/g, '')}</span>
            </div>
            <div className="font-body text-xs text-[rgba(176,228,204,0.50)] mt-1">{s.label}</div>
          </div>
        ))}
      </motion.div>
    </div>
  </section>
  );
};

export default StatsBar;
