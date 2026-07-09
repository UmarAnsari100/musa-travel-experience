import { useTranslation } from "react-i18next";

const destinations = [
  "Makkah Al-Mukarramah",
  "Madinah Al-Munawwarah",
  "Riyadh City",
  "Jeddah Corniche",
  "AlUla Heritage",
  "Diriyah Historic",
  "Taif Mountains",
  "Empty Quarter",
  "Hegra Site",
  "Dammam Coast",
  "Abha Heights",
  "NEOM City"
];


const DestinationsMarquee = () => {
  const { t } = useTranslation();

  return (
    <section id="destinations" className="py-12 overflow-hidden bg-[#050505] border-y border-[rgba(74,57,28,0.15)]">

      <div className="animate-marquee flex whitespace-nowrap hover:[animation-play-state:paused] cursor-pointer">
        {[...destinations, ...destinations].map((d, i) => (
          <span
            key={i}
            className="inline-block font-display font-bold text-2xl md:text-4xl text-[#F8F5EC] mx-8"
          >
            {d}
            <span className="text-[#D4AF37] ml-8">·</span>
          </span>
        ))}
      </div>
    </section>
  );
};

export default DestinationsMarquee;

