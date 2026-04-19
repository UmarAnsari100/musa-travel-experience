import { motion } from "framer-motion";
import { Search } from "lucide-react";
import makkahImg from "../assets/makkah.jpg";
import haramainImg from "../assets/hermain.jpg";
import desertSafariImg from "../assets/desert-safari.jpg";

const heroCards = [
  {
    img: makkahImg,
    title: " Makkah Transfers",
    desc: "Spiritual journey comfort"
  },
  {
    img: haramainImg,
    title: " Haramain Express",
    desc: "Seamless railway transfers"
  },
  {
    img: desertSafariImg,
    title: " Desert Safari",
    desc: "Explore the golden dunes"
  },
];

const Hero = () => {
  return (
    <section id="hero" className="relative pt-32 pb-20 md:pt-44 md:pb-32 overflow-hidden">
      {/* Ghost watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
        <span className="font-display text-[12rem] md:text-[20rem] font-black text-black/[0.05] leading-none uppercase">
          MUSA
        </span>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: "easeOut" }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h1 className="font-display font-black text-4xl md:text-[3.5rem] leading-tight tracking-[-0.02em] mb-4">
            Saudi Arabia's Premium
            <br />
            <span className="italic text-gold">Travel & Taxi Service</span>
          </h1>
          <p className="text-gray-text font-body text-base md:text-lg max-w-xl mx-auto">
            Experience luxury travel reimagined across the Kingdom. From sacred pilgrimages to desert adventures, we curate every mile of your voyage.
          </p>
        </motion.div>

        {/* Search bar */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="max-w-2xl mx-auto bg-card shadow-card p-3 flex flex-col sm:flex-row items-center gap-3 mb-16"
        >
          <div className="flex-1 w-full flex items-center gap-3 px-4 py-2">
            <Search size={18} className="text-gray-text" />
            <input
              type="text"
              placeholder="Where to in KSA?"
              className="bg-transparent w-full outline-none font-body text-sm placeholder:text-gray-text"
              onFocus={() => document.getElementById("booking")?.scrollIntoView({ behavior: "smooth" })}
            />
          </div>
          <button
            onClick={() => document.getElementById("booking")?.scrollIntoView({ behavior: "smooth" })}
            className="gradient-gold text-primary-foreground font-body font-semibold text-sm px-6 py-3 rounded-xl flex items-center gap-2 transition-transform hover:scale-[1.03] w-full sm:w-auto justify-center"
          >
            <Search size={16} />
            Explore Rides
          </button>
        </motion.div>

        {/* Floating cards */}
        <div className="flex flex-row overflow-x-auto snap-x snap-mandatory scrollbar-none gap-3 md:gap-6 px-6 pb-8 md:pb-0 md:px-0 md:justify-center max-w-full mx-auto relative overflow-y-visible">
          {heroCards.map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.6, ease: "easeOut" }}
              className={`bg-card shrink-0 snap-start overflow-hidden shadow-card transition-all rounded-xl lg:rounded-2xl w-[150px] md:w-[180px] lg:w-[220px] ${i === 0 ? "animate-float" : i === 1 ? "animate-float-delayed-1" : "animate-float-delayed-2"
                }`}
            >
              <img
                src={card.img}
                alt={card.title}
                className="w-full h-[90px] md:h-[120px] lg:h-[140px] object-cover rounded-t-xl lg:rounded-t-2xl"
              />
              <div className="p-3 md:p-4">
                <h3 className="font-body font-semibold text-xs md:text-sm">{card.title}</h3>
                <p className="text-gray-text font-body text-[10px] md:text-xs">{card.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;

