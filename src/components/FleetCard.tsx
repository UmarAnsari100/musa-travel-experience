import { Link } from "react-router-dom";
import { Briefcase, Check, Users } from "lucide-react";
import type { FleetVehicle } from "@/data/fleet";

type FleetCardProps = {
  vehicle: FleetVehicle;
  onBook: (vehicle: FleetVehicle) => void;
};

const FleetCard = ({ vehicle, onBook }: FleetCardProps) => {
  return (
    <article className="group bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-[0_8px_30px_rgba(176,228,204,0.15)] transition-all duration-300 relative border border-transparent hover:border-gold/30 hover:-translate-y-[6px] flex flex-col h-full">
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#0e1111]">
        <img
          src={vehicle.coverImage}
          alt={vehicle.name}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {vehicle.badge ? (
          <div className="absolute top-4 left-4 z-10 bg-gold text-primary-foreground text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
            {vehicle.badge}
          </div>
        ) : null}

        <div className="absolute top-4 right-4 z-10 bg-black/50 backdrop-blur-sm border border-white/10 text-white text-[10px] font-medium px-2.5 py-1 rounded-full shadow-sm">
          {vehicle.category}
        </div>
      </div>

      <div className="p-6 flex flex-col flex-grow">
        <span className="text-gold text-[10px] uppercase font-bold tracking-wider">{vehicle.type}</span>
        <h3 className="font-display font-bold text-xl mt-2 mb-2 text-foreground">{vehicle.name}</h3>
        <p className="text-gray-text font-body text-sm mb-5 line-clamp-2 min-h-[40px]">
          {vehicle.description}
        </p>

        <div className="grid grid-cols-2 gap-3 mb-5">
          <div className="rounded-xl bg-surface-low border border-border px-3 py-2.5">
            <div className="flex items-center gap-2 text-gold text-xs font-semibold">
              <Users size={15} />
              <span>{vehicle.seats} Seats</span>
            </div>
            <p className="text-gray-text text-[10px] mt-1">Passenger capacity</p>
          </div>
          <div className="rounded-xl bg-surface-low border border-border px-3 py-2.5">
            <div className="flex items-center gap-2 text-gold text-xs font-semibold">
              <Briefcase size={15} />
              <span>{vehicle.luggage}</span>
            </div>
            <p className="text-gray-text text-[10px] mt-1">Luggage capacity</p>
          </div>
        </div>

        <div className="space-y-2 mb-6 flex-grow">
          {vehicle.features.slice(0, 3).map((feature) => (
            <div key={feature} className="flex items-start">
              <Check size={14} className="text-gold mr-2 mt-[2px] flex-shrink-0" />
              <span className="text-gray-text text-xs">{feature}</span>
            </div>
          ))}
        </div>

        <div className="mt-auto border-t border-border pt-4">
          <div className="flex items-end justify-between gap-4 mb-4">
            <div>
              <span className="text-[10px] text-gray-text">Starting from</span>
              <div className="font-display font-bold text-xl sm:text-2xl text-gold price">{vehicle.price}</div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => onBook(vehicle)}
              className="gradient-gold text-primary-foreground font-body font-semibold text-sm px-5 py-3 rounded-full transition-transform hover:scale-[1.03] shadow-md"
            >
              Book Now
            </button>
            <Link
              to={`/fleet#${vehicle.slug}`}
              className="bg-transparent border border-white/20 text-white font-body font-semibold text-sm px-5 py-3 rounded-full flex items-center justify-center hover:bg-white/5 transition-colors text-center"
            >
              View Details
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
};

export default FleetCard;
