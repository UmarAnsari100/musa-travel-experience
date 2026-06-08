import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

const FooterCTA = () => {
  const { t } = useTranslation();
  return (
  <section className="relative bg-[#0D1C1A] border-t border-[rgba(64,138,113,0.15)] py-20 md:py-28 overflow-hidden">
    {/* Ghost watermark */}
    <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none select-none">
      <span className="font-display text-[10rem] md:text-[16rem] font-black text-[rgba(176,228,204,0.02)] leading-none">
        MUSA
      </span>
    </div>

    <div className="container mx-auto px-6 relative z-10 text-center">
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.65 }}
      >
        <h2 className="font-display font-bold text-3xl md:text-5xl text-[#F0FFF8] mb-4">
          {t('footerCta.heading1')}
          <br className="hidden md:block"/>
          <span className="text-[#B0E4CC] italic">{t('footerCta.heading2')}</span>
        </h2>
        <p className="text-[#7ABFA0] font-body mb-8 max-w-lg mx-auto">
          {t('footerCta.subtext')}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => document.getElementById("booking")?.scrollIntoView({ behavior: "smooth" })}
            className="gradient-gold text-[#F0FFF8] font-body font-semibold text-sm px-8 py-3 rounded-full transition-transform hover:scale-[1.03]"
          >
            {t('footerCta.btn1')}
          </button>
          <a
            href={`https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER || "966500000000"}?text=${encodeURIComponent("Hi, I'd like to know more about your services.")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-body font-semibold text-sm px-8 py-3 rounded-full text-[#F0FFF8] border border-[rgba(176,228,204,0.20)] transition-transform hover:scale-[1.03]"
          >
            {t('footerCta.btn2')}
          </a>
        </div>
      </motion.div>
    </div>
  </section>
  );
};

export default FooterCTA;
