import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useBooking } from "../context/BookingContext";
import { toast } from "react-hot-toast";

import jeddahImg from "../assets/jeddah.jpg";
import makkahImg from "../assets/makkah.jpg";
import madinaImg from "../assets/madina.jpg";
import hermainImg from "../assets/hermain.jpg";
import umrahpkjImg from "../assets/umrahpkj.jpg";
import ziyaratImg from "../assets/ziyarat.jpg";

const packages = [
  {
    id: "pkg-1",
    titleKey: "trips.pkg1Title",
    badgeKey: "trips.pkg1Badge",
    locationKey: "trips.pkg1Location",
    vehicleTagKey: "trips.pkg1Vehicle",
    image: jeddahImg,
    rating: "4.9",
    reviews: "1,241",
    price: "950",
    descriptionKey: "trips.pkg1Desc",
    routeStripKey: "trips.pkg1RouteStrip",
    routeDetailsKeys: [
      "trips.pkg1Route1",
      "trips.pkg1Route2",
      "trips.pkg1Route3",
      "trips.pkg1Route4",
      "trips.pkg1Route5"
    ],
    addOnKey: "trips.pkg1AddOn",
    bookingPrefill: {
      serviceType: "Hajj & Umrah Transfers",
      vehicleType: "Camry",
      destination: "Makkah Al-Mukarramah"
    }
  },
  {
    id: "pkg-2",
    titleKey: "trips.pkg2Title",
    badgeKey: "trips.pkg2Badge",
    locationKey: "trips.pkg2Location",
    vehicleTagKey: "trips.pkg2Vehicle",
    image: ziyaratImg,
    rating: "4.9",
    reviews: "987",
    price: "1,400",
    descriptionKey: "trips.pkg2Desc",
    routeStripKey: "trips.pkg2RouteStrip",
    routeDetailsKeys: [
      "trips.pkg2Route1",
      "trips.pkg2Route2",
      "trips.pkg2Route3",
      "trips.pkg2Route4",
      "trips.pkg2Route5",
      "trips.pkg2Route6"
    ],
    addOnKey: "trips.pkg2AddOn",
    bookingPrefill: {
      serviceType: "Umrah Package + Ziyarat",
      vehicleType: "Camry",
      destination: "Makkah Al-Mukarramah"
    }
  },
  {
    id: "pkg-3",
    titleKey: "trips.pkg3Title",
    badgeKey: "trips.pkg3Badge",
    locationKey: "trips.pkg3Location",
    vehicleTagKey: "trips.pkg3Vehicle",
    image: madinaImg,
    rating: "5.0",
    reviews: "743",
    price: "1,400",
    descriptionKey: "trips.pkg3Desc",
    routeStripKey: "trips.pkg3RouteStrip",
    routeDetailsKeys: [
      "trips.pkg3Route1",
      "trips.pkg3Route2",
      "trips.pkg3Route3",
      "trips.pkg3Route4",
      "trips.pkg3Route5"
    ],
    addOnKey: "trips.pkg3AddOn",
    bookingPrefill: {
      serviceType: "Family Umrah Package",
      vehicleType: "Starex",
      destination: "Makkah Al-Mukarramah"
    }
  },
  {
    id: "pkg-4",
    titleKey: "trips.pkg4Title",
    badgeKey: "trips.pkg4Badge",
    locationKey: "trips.pkg4Location",
    vehicleTagKey: "trips.pkg4Vehicle",
    image: hermainImg,
    rating: "5.0",
    reviews: "521",
    price: "3,200",
    descriptionKey: "trips.pkg4Desc",
    routeStripKey: "trips.pkg4RouteStrip",
    routeDetailsKeys: [
      "trips.pkg4Route1",
      "trips.pkg4Route2",
      "trips.pkg4Route3",
      "trips.pkg4Route4",
      "trips.pkg4Route5",
      "trips.pkg4Route6",
      "trips.pkg4Route7"
    ],
    addOnKey: "trips.pkg4AddOn",
    bookingPrefill: {
      serviceType: "VIP Umrah Package",
      vehicleType: "Staria",
      destination: "Makkah Al-Mukarramah"
    }
  },
  {
    id: "pkg-5",
    titleKey: "trips.pkg5Title",
    badgeKey: "trips.pkg5Badge",
    locationKey: "trips.pkg5Location",
    vehicleTagKey: "trips.pkg5Vehicle",
    image: umrahpkjImg,
    rating: "4.8",
    reviews: "634",
    price: "1,800",
    descriptionKey: "trips.pkg5Desc",
    routeStripKey: "trips.pkg5RouteStrip",
    routeDetailsKeys: [
      "trips.pkg5Route1",
      "trips.pkg5Route2",
      "trips.pkg5Route3",
      "trips.pkg5Route4",
      "trips.pkg5Route5"
    ],
    addOnKey: "trips.pkg5AddOn",
    bookingPrefill: {
      serviceType: "Group Umrah Package",
      vehicleType: "Hiace",
      destination: "Makkah Al-Mukarramah"
    }
  },
  {
    id: "pkg-6",
    titleKey: "trips.pkg6Title",
    badgeKey: "trips.pkg6Badge",
    locationKey: "trips.pkg6Location",
    vehicleTagKey: "trips.pkg6Vehicle",
    image: makkahImg,
    rating: "5.0",
    reviews: "289",
    price: "4,500",
    descriptionKey: "trips.pkg6Desc",
    routeStripKey: "trips.pkg6RouteStrip",
    routeDetailsKeys: [
      "trips.pkg6Route1",
      "trips.pkg6Route2",
      "trips.pkg6Route3",
      "trips.pkg6Route4",
      "trips.pkg6Route5",
      "trips.pkg6Route6",
      "trips.pkg6Route7"
    ],
    addOnKey: "trips.pkg6AddOn",
    bookingPrefill: {
      serviceType: "VIP Umrah Package",
      vehicleType: "GMC",
      destination: "Makkah Al-Mukarramah"
    }
  }
];

const reveal = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
};

const FeaturedTrips = () => {
  const { t } = useTranslation();
  const { setBookingDefaults } = useBooking();

  const handleBook = (pkg: typeof packages[0]) => {
    setBookingDefaults({
      service_type: pkg.bookingPrefill.serviceType,
      drop_location: pkg.bookingPrefill.destination,
      vehicle_type: pkg.bookingPrefill.vehicleType,
      tripTitle: t(pkg.titleKey),
    });

    const bookingSection = document.getElementById('booking');
    if (bookingSection) {
      bookingSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }

    toast.success(
      `✅ "${t(pkg.titleKey)}" ${t('trips.success')}`,
      {
        duration: 4000,
        icon: '✅'
      }
    );
  };

  return (
    <section id="packages" className="py-20 md:py-28 bg-[#0E1111]">
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
            <span className="font-body font-medium text-xs uppercase tracking-[0.10em] text-gold">{t('trips.tag')}</span>
            <h2 className="font-display font-bold text-3xl md:text-4xl mt-3">{t('trips.heading')}</h2>
            <p className="text-gray-text font-body mt-2 max-w-xl mx-auto">
              {t('trips.subtext')}
            </p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {packages.map((pkg, i) => (
            <motion.div
              key={pkg.id}
              variants={reveal}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.6, ease: "easeOut" }}
              className="group bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-[0_8px_30px_rgba(176, 228, 204,0.15)] transition-all duration-300 relative border border-transparent hover:border-gold/30 hover:-translate-y-[6px] flex flex-col"
            >
              {/* TOP IMAGE AREA */}
              <div className="relative h-[200px] sm:h-[220px] md:h-[200px] lg:h-[240px] w-full bg-[#111] flex items-center justify-center overflow-hidden">
                <img
                  src={pkg.image}
                  alt={t(pkg.titleKey)}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Badge */}
                <div className="absolute top-4 left-4 z-10 bg-gold text-primary-foreground text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
                  {t(pkg.badgeKey)}
                </div>
                {/* Vehicle Tag */}
                <div className="absolute top-4 right-4 z-10 bg-black/50 backdrop-blur-sm border border-white/10 text-white text-[10px] font-medium px-2.5 py-1 rounded-full shadow-sm">
                  {t(pkg.vehicleTagKey)}
                </div>
              </div>

              {/* ROUTE STRIP */}
              <div className="bg-[#111] py-2 border-b border-white/5">
                <p className="text-center text-gold text-[10px] sm:text-xs tracking-widest uppercase font-medium">
                  {t(pkg.routeStripKey)}
                </p>
              </div>

              {/* CARD BODY */}
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-gold text-[10px] uppercase font-bold tracking-wider">{t(pkg.locationKey)}</span>
                  <div className="flex items-center text-[11px] text-gray-text">
                    <span className="text-gold mr-1">★</span> {pkg.rating} ({pkg.reviews})
                  </div>
                </div>

                <h3 className="font-display font-bold text-xl mb-2 text-foreground">{t(pkg.titleKey)}</h3>
                <p className="text-gray-text font-body text-sm mb-5 line-clamp-2 min-h-[40px]">{t(pkg.descriptionKey)}</p>

                {/* ROUTE DETAILS */}
                <div className="space-y-2 mb-6 flex-grow">
                  {pkg.routeDetailsKeys.map((key, idx) => (
                    <div key={idx} className="flex items-start">
                      <span className="text-gold text-xs mr-2 mt-[2px]">✓</span>
                      <span className="text-gray-text text-xs">{t(key)}</span>
                    </div>
                  ))}
                </div>

                {/* BOTTOM SECTION */}
                <div className="mt-auto border-t border-border pt-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <div className="flex items-baseline">
                        <span className="font-display font-bold text-xl sm:text-2xl text-gold">SAR {pkg.price}</span>
                      </div>
                      <span className="text-[10px] text-gray-text">{t('trips.perPackage')}</span>
                    </div>
                    <button
                      onClick={() => handleBook(pkg)}
                      className="gradient-gold text-primary-foreground font-body font-semibold text-sm px-6 py-2.5 rounded-full transition-transform hover:scale-[1.03] shadow-md"
                    >
                      {t('trips.bookNow')}
                    </button>
                  </div>

                  {/* ADD-ON BADGE */}
                  {t(pkg.addOnKey) ? (
                    <div className="w-full text-center py-1.5 px-3 bg-gold/10 border border-gold/30 rounded-lg mt-1">
                      <span className="text-gold text-[11px] font-medium">{t(pkg.addOnKey)}</span>
                    </div>
                  ) : (
                    <div className="h-[30px] mt-1" /> // Spacer
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CONTACT STRIP */}
        <motion.div
          variants={reveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-12 bg-[#0F1E1C] border border-[rgba(64,138,113,0.20)] rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <div className="text-center md:text-left">
            <h3 className="font-display font-bold text-white text-xl mb-1">{t('trips.customTag')}</h3>
            <p className="font-body text-gray-text text-sm max-w-md">
              {t('trips.customDesc')}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <a
              href="https://wa.me/966597100424?text=Hi%20MUSA%20TRANSPORT!%20I'm%20interested%20in%20a%20custom%20Umrah%20package."
              target="_blank"
              rel="noopener noreferrer"
              className="gradient-gold text-primary-foreground font-body font-semibold text-sm px-6 py-3 rounded-full flex items-center justify-center gap-2 transition-transform hover:scale-[1.03]"
            >
              <span className="text-lg">📱</span> {t('trips.whatsappUs')}
            </a>
            <a
              href="tel:+966597100424"
              className="bg-transparent border border-white/20 text-white font-body font-semibold text-sm px-6 py-3 rounded-full flex items-center justify-center gap-2 hover:bg-white/5 transition-colors"
            >
              <span className="text-lg">📞</span> {t('trips.callNow')}
            </a>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default FeaturedTrips;
