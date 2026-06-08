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
    <section id="destinations" className="py-12 overflow-hidden bg-[#0e1111] border-y border-[rgba(64,138,113,0.15)]">

      <div className="animate-marquee flex whitespace-nowrap hover:[animation-play-state:paused] cursor-pointer">
        {[...destinations, ...destinations].map((d, i) => (
          <span
            key={i}
            className="inline-block font-display font-bold text-2xl md:text-4xl text-[#F0FFF8] mx-8"
          >
            {d}
            <span className="text-[#B0E4CC] ml-8">·</span>
          </span>
        ))}
      </div>
    </section>
  );
};

export default DestinationsMarquee;
