import { motion } from "framer-motion";
import { Shield, Clock, Award } from "lucide-react";
import { useTranslation } from "react-i18next";

const reveal = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
};

const WhyChooseUs = () => {
  const { t } = useTranslation();

  const cards = [
    {
      icon: Shield,
      title: t('why.card1Title'),
      desc: t('why.card1Desc'),
      dark: true,
    },
    {
      icon: Clock,
      title: t('why.card2Title'),
      desc: t('why.card2Desc'),
      dark: false,
    },
    {
      icon: Award,
      title: t('why.card3Title'),
      desc: t('why.card3Desc'),
      dark: false,
    },
  ];

  return (
  <section className="py-20 md:py-28">
    <div className="container mx-auto px-6">
      <motion.div
        variants={reveal}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="text-center mb-16"
      >
        <span className="font-body font-medium text-xs uppercase tracking-[0.10em] text-gray-text">{t('why.tag')}</span>
        <h2 className="font-display font-bold text-3xl md:text-4xl mt-3">{t('why.heading')}</h2>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        {cards.map((card, i) => (
          <motion.div
            key={card.title}
            variants={reveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ delay: i * 0.08, duration: 0.6, ease: "easeOut" }}
            className="hover-black-card p-8"
          >
            <div className="icon-container mb-6">
              <card.icon size={28} />
            </div>
            <h3 className="font-body font-semibold text-lg mb-3">{card.title}</h3>
            <p className="font-body text-sm leading-relaxed">
              {card.desc}
            </p>
            <div className="shimmer-line" />
          </motion.div>
        ))}
      </div>
    </div>
  </section>
  );
};

export default WhyChooseUs;
