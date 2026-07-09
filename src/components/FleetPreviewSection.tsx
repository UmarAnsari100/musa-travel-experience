import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import FleetCard from "@/components/FleetCard";
import { useBooking } from "@/context/BookingContext";
import { fleetPreviewData, type FleetVehicle } from "@/data/fleet";
import { scheduleBookingScroll } from "@/lib/scroll";

const reveal = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
};

const FleetPreviewSection = () => {
  const { setBookingDefaults } = useBooking();

  const handleBook = (vehicle: FleetVehicle) => {
    setBookingDefaults({
      service_type: vehicle.serviceType,
      vehicle_type: vehicle.vehicleType,
      drop_location: "",
      tripTitle: `${vehicle.name} - ${vehicle.type}`,
    });

    setTimeout(scheduleBookingScroll, 300);

    toast.success(`${vehicle.name} selected. Complete your booking below.`);
  };

  return (
    <section id="fleet-preview" className="py-20 md:py-28 bg-surface-low">
      <div className="container mx-auto px-6">
        <motion.div
          variants={reveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center mb-16"
        >
          <span className="font-body font-medium text-xs uppercase tracking-[0.10em] text-gold">
            Premium Transport
          </span>
          <h2 className="font-display font-bold text-3xl md:text-4xl mt-3">Our Fleet</h2>
          <p className="text-gray-text font-body mt-2 max-w-2xl mx-auto">
            Choose from our comfortable and reliable vehicles for airport transfers, Umrah travel, city rides, and private trips.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {fleetPreviewData.map((vehicle, index) => (
            <motion.div
              key={vehicle.id}
              variants={reveal}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ delay: index * 0.08, duration: 0.6, ease: "easeOut" }}
            >
              <FleetCard vehicle={vehicle} onBook={handleBook} />
            </motion.div>
          ))}
        </div>

        <motion.div
          variants={reveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mt-12 flex justify-center"
        >
          <Link
            to="/fleet"
            className="gradient-gold text-primary-foreground font-body font-semibold text-sm px-8 py-3 rounded-full transition-transform hover:scale-[1.03] shadow-md"
          >
            View Full Fleet
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default FleetPreviewSection;
