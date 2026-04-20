import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import madinahImg from "../assets/madina.jpg";
import alulaImg from "../assets/alula.jpg";
import riyadhImg from "../assets/riyadh.jpg";
import jeddahImg from "../assets/jeddah.jpg";
import abhaImg from "../assets/abha.jpg";
import airportImg from "../assets/airport.jpg";

const trips = [
  {
    img: madinahImg,
    titleKey: "trips.trip1Title",
    descKey: "trips.trip1Desc",
    price: "SAR 1,200",
    dest: "Makkah",
    badgeKey: "trips.trip1Badge"
  },
  {
    img: alulaImg,
    titleKey: "trips.trip2Title",
    descKey: "trips.trip2Desc",
    price: "SAR 2,500",
    dest: "AlUla",
    badgeKey: "trips.trip2Badge"
  },
  {
    img: riyadhImg,
    titleKey: "trips.trip3Title",
    descKey: "trips.trip3Desc",
    price: "SAR 800",
    dest: "Riyadh",
    badgeKey: "trips.trip3Badge"
  },
  {
    img: jeddahImg,
    titleKey: "trips.trip4Title",
    descKey: "trips.trip4Desc",
    price: "SAR 650",
    dest: "Jeddah"
  },
  {
    img: abhaImg,
    titleKey: "trips.trip5Title",
    descKey: "trips.trip5Desc",
    price: "SAR 1,800",
    dest: "Abha"
  },
  {
    img: airportImg,
    titleKey: "trips.trip6Title",
    descKey: "trips.trip6Desc",
    price: "SAR 250",
    dest: "Airport",
    badgeKey: "trips.trip6Badge"
  },
];

const reveal = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
};

const FeaturedTrips = () => {
  const { t } = useTranslation();

  const handleBook = (dest: string) => {
    const el = document.getElementById("booking");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
      // Pre-fill destination after scroll
      setTimeout(() => {
        const toInput = document.getElementById("booking-to") as HTMLInputElement;
        if (toInput) {
          toInput.value = dest;
          toInput.dispatchEvent(new Event("input", { bubbles: true }));
        }
      }, 800);
    }
  };

  return (
    <section id="packages" className="py-20 md:py-28">
      <div className="container mx-auto px-6">
        <motion.div
          variants={reveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center mb-16"
        >
          <div>
            <span className="font-body font-medium text-xs uppercase tracking-[0.10em] text-gray-text">{t('trips.tag')}</span>
            <h2 className="font-display font-bold text-3xl md:text-4xl mt-3">{t('trips.heading')}</h2>
            <p className="text-gray-text font-body mt-2 max-w-xl mx-auto">{t('trips.subtext')}</p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {trips.map((trip, i) => (
            <motion.div
              key={trip.titleKey}
              variants={reveal}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.6, ease: "easeOut" }}
              className="group bg-card overflow-hidden shadow-card transition-all relative"
            >
              {trip.badgeKey && (
                <div className="absolute top-4 right-4 z-10 bg-gold text-primary-foreground text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
                  {t(trip.badgeKey)}
                </div>
              )}
              <div className="overflow-hidden h-52">
                <img
                  src={trip.img}
                  alt={t(trip.titleKey)}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
              </div>
              <div className="p-6">
                <h3 className="font-body font-semibold text-lg mb-1">{t(trip.titleKey)}</h3>
                <p className="text-gray-text font-body text-sm mb-4 line-clamp-2">{t(trip.descKey)}</p>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-display font-bold text-xl text-gold">{trip.price}</span>
                    <span className="text-[10px] text-gray-text ml-1">{t('trips.perPerson')}</span>
                  </div>
                  <button
                    onClick={() => handleBook(trip.dest)}
                    className="gradient-gold text-primary-foreground font-body font-semibold text-sm px-5 py-2 rounded-full transition-transform hover:scale-[1.03]"
                  >
                    {t('trips.bookNow')}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedTrips;
