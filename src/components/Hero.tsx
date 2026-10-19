import { motion } from "framer-motion";
import { Search, MapPin, Crown } from "lucide-react";
import { useTranslation } from "react-i18next";
import makkahImg from "../assets/makkah.jpg";
import haramainImg from "../assets/hermain.jpg";
import ziyaratImg from "../assets/ziyarat.jpg";

const heroBg = "/makkah.jpg";

const Hero = () => {
  const { t, i18n } = useTranslation();

  const isArabic = i18n.language === "ar";
  const isUrdu = i18n.language === "ur";

  const badgeText = isArabic
    ? "خدمة نقل وسفر فاخرة"
    : isUrdu
    ? "پریمیم ٹریول اور ٹیکسی سروس"
    : "PREMIUM TRAVEL & TAXI SERVICE";

  const heroCards = [
    {
      img: makkahImg,
      title: t("hero.card1", "Makkah Transfers"),
      desc: t("hero.card1Desc", "Spiritual journey comfort"),
    },
    {
      img: haramainImg,
      title: t("hero.card2", "Haramain Express"),
      desc: t("hero.card2Desc", "Seamless railway transfers"),
    },
    {
      img: ziyaratImg,
      title: t("hero.card3", "Umrah Ziyarat"),
      desc: t("hero.card3Desc", "Visit the holy sites"),
    },
  ];

  const handleBookingRedirect = () => {
    const el = document.getElementById("booking") || document.getElementById("services");
    el?.scrollIntoView({ behavior: "smooth" });
  };

  const handleServicesRedirect = () => {
    const el = document.getElementById("services") || document.getElementById("booking");
    el?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="hero"
      className="relative min-h-[90vh] md:min-h-screen flex items-center justify-center pt-28 pb-16 md:pt-36 md:pb-20 lg:pt-40 lg:pb-24 overflow-hidden bg-[#050607]"
    >
      {/* Background Image: Nighttime Panorama of Masjid al-Haram */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-no-repeat pointer-events-none transition-opacity duration-1000"
        style={{
          backgroundImage: `url(${heroBg})`,
          backgroundPosition: "center 32%",
        }}
      />

      {/* Cinematic Dark Gradient Overlays */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          background: `linear-gradient(
            180deg,
            rgba(5, 6, 7, 0.78) 0%,
            rgba(5, 6, 7, 0.60) 38%,
            rgba(5, 6, 7, 0.76) 72%,
            rgba(5, 6, 7, 0.95) 100%
          )`,
        }}
      />

      {/* Subtle Radial Vignette for Depth & Focus */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 50% 38%, rgba(5, 6, 7, 0) 0%, rgba(5, 6, 7, 0.5) 75%, rgba(5, 6, 7, 0.85) 100%)",
        }}
      />

      {/* Hero Content Container */}
      <div className="container mx-auto px-4 sm:px-6 relative z-10 flex flex-col items-center text-center max-w-5xl">
        {/* Premium Badge */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full mb-5 sm:mb-6 border border-[#C9A227]/35 bg-[#0F1012]/70 backdrop-blur-md shadow-[0_2px_12px_rgba(0,0,0,0.4)]"
        >
          <Crown size={12} className="text-[#D4AF37] fill-[#D4AF37]/30 shrink-0" />
          <span className="text-[10px] sm:text-[11px] font-medium tracking-[0.15em] uppercase text-[#D6B648]">
            {badgeText}
          </span>
        </motion.div>

        {/* Headline & Description */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.08, ease: "easeOut" }}
          className="max-w-3xl mx-auto mb-7 sm:mb-8"
        >
          <h1 className="font-display font-bold text-[2.5rem] sm:text-[3.4rem] md:text-[4.2rem] lg:text-[4.75rem] leading-[1.08] tracking-[-0.02em] text-[#F6F1E9] mb-4 sm:mb-5">
            <span className="block">{t("hero.headline1")}</span>
            <span className="block">{t("hero.headline2")}</span>
            <span
              className="block italic font-normal text-[#C9A227] mt-1 sm:mt-1.5"
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                textShadow: "0 2px 24px rgba(201, 162, 39, 0.28)",
              }}
            >
              {t("hero.headline3")}
            </span>
          </h1>

          <p className="text-[#B8B2A3] font-body text-xs sm:text-sm md:text-[15px] leading-relaxed max-w-[500px] mx-auto">
            {t("hero.subtext")}
          </p>
        </motion.div>

        {/* Premium Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.16, ease: "easeOut" }}
          className="w-full max-w-[570px] mx-auto mb-10 sm:mb-12"
        >
          <div
            className="flex items-center justify-between p-1.5 sm:p-2 pl-3 sm:pl-5 rounded-2xl transition-all duration-300 focus-within:border-[rgba(201,162,39,0.55)] focus-within:shadow-[0_12px_45px_rgba(201,162,39,0.16)]"
            style={{
              background: "rgba(15, 15, 15, 0.88)",
              border: "1px solid rgba(201, 162, 39, 0.32)",
              boxShadow: "0 12px 40px rgba(0, 0, 0, 0.35)",
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
            }}
          >
            <div className="flex items-center gap-2.5 sm:gap-3 flex-1 min-w-0 pr-2">
              <MapPin size={18} className="text-[#A89F91] shrink-0" />
              <input
                type="text"
                placeholder={`${t("hero.searchFrom")}...`}
                className="bg-transparent w-full outline-none font-body text-xs sm:text-sm text-[#F6F1E9] placeholder:text-[#7A756C]"
                onFocus={handleBookingRedirect}
              />
            </div>
            <button
              onClick={handleBookingRedirect}
              className="shrink-0 h-[42px] sm:h-[46px] px-4 sm:px-6 rounded-xl font-body font-semibold text-xs sm:text-sm text-[#0D0D0D] flex items-center gap-1.5 sm:gap-2 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-[0_4px_16px_rgba(164,123,22,0.35)] hover:shadow-[0_6px_22px_rgba(215,180,71,0.48)] cursor-pointer"
              style={{
                background: "linear-gradient(135deg, #D7B447 0%, #A47B16 100%)",
              }}
            >
              <Search size={15} strokeWidth={2.4} />
              <span>{t("hero.searchBtn")}</span>
            </button>
          </div>
        </motion.div>

        {/* Three Glass-like Service Cards */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.24, ease: "easeOut" }}
          className="flex flex-wrap sm:flex-nowrap justify-center gap-4 md:gap-5 w-full max-w-4xl mx-auto"
        >
          {heroCards.map((card) => (
            <div
              key={card.title}
              onClick={handleServicesRedirect}
              className="group relative cursor-pointer w-full max-w-[280px] sm:w-[215px] md:w-[220px] rounded-[13px] p-2 sm:p-2.5 transition-all duration-300 ease-out hover:-translate-y-1.5"
              style={{
                background: "rgba(14, 15, 17, 0.82)",
                border: "1px solid rgba(201, 162, 39, 0.22)",
                boxShadow: "0 10px 30px rgba(0, 0, 0, 0.45)",
                backdropFilter: "blur(14px)",
                WebkitBackdropFilter: "blur(14px)",
              }}
            >
              {/* Gold Top Spotlight Glow (Subtle Luxury Highlight) */}
              <div
                className="pointer-events-none absolute -top-px left-1/2 -translate-x-1/2 w-20 h-[2px] transition-all duration-300 group-hover:w-28"
                style={{
                  background: "linear-gradient(90deg, transparent, #D7B447, transparent)",
                }}
              />
              <div
                className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-24 h-9 rounded-full opacity-70 transition-all duration-300 group-hover:opacity-100 group-hover:h-12 group-hover:w-32"
                style={{
                  background:
                    "radial-gradient(ellipse at top, rgba(215, 180, 71, 0.45) 0%, rgba(215, 180, 71, 0.08) 55%, transparent 75%)",
                }}
              />

              {/* Card Image */}
              <div className="w-full h-[105px] sm:h-[115px] rounded-lg overflow-hidden relative">
                <img
                  src={card.img}
                  alt={card.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
              </div>

              {/* Card Bottom Content Section */}
              <div className="pt-2.5 pb-1 px-1 text-left rtl:text-right">
                <div className="flex items-center gap-1.5">
                  <span className="w-[2px] h-[13px] bg-[#C9A227] rounded-full shrink-0" />
                  <h3 className="font-body font-semibold text-xs sm:text-[13px] text-[#F8F5EC] tracking-tight">
                    {card.title}
                  </h3>
                </div>
                <p className="text-[#9E978B] font-body text-[10.5px] sm:text-[11px] leading-snug mt-1 pl-[9px] rtl:pl-0 rtl:pr-[9px]">
                  {card.desc}
                </p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;

