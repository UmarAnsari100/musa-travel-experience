import { motion } from "framer-motion";
import { Car, Plane, MapPin, Mountain, Building2, Heart } from "lucide-react";
import { useTranslation } from "react-i18next";

const reveal = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
};

const Services = () => {
  const { t } = useTranslation();

  const services = [
    { icon: MapPin, title: t('services.s1Title'), desc: t('services.s1Desc') },
    { icon: Plane, title: t('services.s2Title'), desc: t('services.s2Desc') },
    { icon: Car, title: t('services.s3Title'), desc: t('services.s3Desc') },
    { icon: Mountain, title: t('services.s4Title'), desc: t('services.s4Desc') },
    { icon: Building2, title: t('services.s5Title'), desc: t('services.s5Desc') },
    { icon: Heart, title: t('services.s6Title'), desc: t('services.s6Desc') },
  ];

  return (
  <section id="services" className="py-20 md:py-28">
    <div className="container mx-auto px-6">
      <motion.div
        variants={reveal}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="text-center mb-16"
      >
        <span className="font-body font-medium text-xs uppercase tracking-[0.10em] text-gray-text">{t('services.tag')}</span>
        <h2 className="font-display font-bold text-3xl md:text-4xl mt-3">{t('services.heading')}</h2>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {services.map((svc, i) => (
          <motion.div
            key={svc.title}
            variants={reveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ delay: i * 0.08, duration: 0.6, ease: "easeOut" }}
            className="hover-black-card p-8 text-center"
          >
            <div className="icon-container mx-auto mb-6">
              <svc.icon size={32} />
            </div>
            <h3 className="font-body font-semibold text-base mb-2">{svc.title}</h3>
            <p className="font-body text-sm leading-relaxed">{svc.desc}</p>
            <div className="shimmer-line" />
          </motion.div>
        ))}
      </div>
    </div>
  </section>
  );
};

export default Services;
