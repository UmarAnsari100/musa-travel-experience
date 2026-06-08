import { motion } from "framer-motion";
import { MapPin, Calendar, CreditCard, Car, CheckCircle, Star } from "lucide-react";
import { useTranslation } from "react-i18next";

const reveal = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
};

const BookingProcess = () => {
  const { t } = useTranslation();

  const steps = [
    { num: "01", icon: MapPin, title: t('process.step1'), desc: t('process.step1Desc') },
    { num: "02", icon: Calendar, title: t('process.step2'), desc: t('process.step2Desc') },
    { num: "03", icon: Star, title: t('process.step3'), desc: t('process.step3Desc') },
    { num: "04", icon: CreditCard, title: t('process.step4'), desc: t('process.step4Desc') },
    { num: "05", icon: Car, title: t('process.step5'), desc: t('process.step5Desc') },
    { num: "06", icon: CheckCircle, title: t('process.step6'), desc: t('process.step6Desc') },
  ];

  return (
  <section className="py-20 md:py-28 bg-[#0e1111]">
    <div className="container mx-auto px-6">
      <motion.div
        variants={reveal}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="text-center mb-16"
      >
        <span className="font-body font-medium text-xs uppercase tracking-[0.10em] text-gray-text">{t('process.tag')}</span>
        <h2 className="font-display font-bold text-3xl md:text-4xl mt-3">{t('process.heading')}</h2>
        <p className="text-gray-text font-body mt-4 max-w-lg mx-auto">
          {t('process.subtext')}
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
            transition={{ delay: i * 0.08, duration: 0.6, ease: "easeOut" }}
            className="hover-black-card p-6 group"
          >
            <div className="left-gold-bar" />
            <div className="flex items-center justify-between mb-4">
              <span className="step-number font-display font-bold text-2xl">{step.num}</span>
              <div className="icon-container m-0">
                <step.icon size={20} />
              </div>
            </div>
            <h3 className="font-body font-semibold text-base mb-2">{step.title}</h3>
            <p className="font-body text-sm leading-relaxed">{step.desc}</p>
            <div className="shimmer-line" />
          </motion.div>
        ))}
      </div>
    </div>
  </section>
  );
};

export default BookingProcess;
