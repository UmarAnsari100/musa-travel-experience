import bus1 from "@/assets/bus/bus1.png";
import bus2 from "@/assets/bus/bus2.png";
import bus3 from "@/assets/bus/bus3.png";
import bus4 from "@/assets/bus/bus4.jpeg";
import camry1 from "@/assets/camry/camry1.jpg";
import camry2 from "@/assets/camry/camry2.jpg";
import camry3 from "@/assets/camry/camry3.jpg";
import camry4 from "@/assets/camry/camry4.jpg";
import coaster1 from "@/assets/coaster/coaster1.jpeg";
import coaster2 from "@/assets/coaster/coaster2.jpg";
import coaster3 from "@/assets/coaster/coaster3.jpg";
import coaster4 from "@/assets/coaster/coaster4.png";
import gmc1 from "@/assets/gmc/gmc1.png";
import gmc2 from "@/assets/gmc/gmc2.png";
import gmc3 from "@/assets/gmc/gmc3.png";
import gmc4 from "@/assets/gmc/gmc4.jpg";
import hiace1 from "@/assets/hiace/hiace1.png";
import hiace2 from "@/assets/hiace/hiace2.png";
import hiace3 from "@/assets/hiace/hiace3.png";
import hiace4 from "@/assets/hiace/hiace4.png";
import starex1 from "@/assets/starex/starex1.jpg";
import starex2 from "@/assets/starex/starex2.avif";
import starex3 from "@/assets/starex/starex3.avif";
import starex4 from "@/assets/starex/starex4.avif";
import starex5 from "@/assets/starex/starex5.png";
import staria1 from "@/assets/staria/staria1.png";
import staria2 from "@/assets/staria/staria2.png";
import staria3 from "@/assets/staria/staria3.png";
import staria4 from "@/assets/staria/staria4.png";
import staria5 from "@/assets/staria/staria5.png";

export type FleetVehicle = {
  id: number;
  slug: string;
  name: string;
  type: string;
  category: string;
  seats: number;
  luggage: string;
  fuel: string;
  transmission: string;
  ac: string;
  insurance: string;
  price: string;
  badge: string;
  features: string[];
  description: string;
  coverImage: string;
  gallery: string[];
  serviceType: string;
  vehicleType: string;
  vehicleLabel: string;
};

export const fleetData: FleetVehicle[] = [
  {
    id: 1,
    slug: "toyota-camry",
    name: "Toyota Camry",
    type: "Business Sedan",
    category: "Sedan",
    seats: 4,
    luggage: "2 Bags",
    fuel: "Hybrid",
    transmission: "Automatic",
    ac: "Yes",
    insurance: "Included",
    price: "SAR 150",
    badge: "MOST POPULAR",
    features: ["Free WiFi", "Water Bottle", "Phone Charger", "Meet & Greet", "24/7 Support", "Flight Tracking"],
    description: "Comfortable mid-size sedan perfect for city transfers and airport rides.",
    coverImage: camry1,
    gallery: [camry1, camry2, camry3, camry4],
    serviceType: "City Taxi",
    vehicleType: "Camry",
    vehicleLabel: "Toyota Camry - SAR 150/trip",
  },
  {
    id: 2,
    slug: "gmc-yukon",
    name: "GMC Yukon",
    type: "Premium SUV",
    category: "SUV",
    seats: 7,
    luggage: "5 Bags",
    fuel: "Petrol",
    transmission: "Automatic",
    ac: "Yes",
    insurance: "Included",
    price: "SAR 450",
    badge: "",
    features: ["Free WiFi", "Captain Seats", "Water Bottle", "Phone Charger", "24/7 Support", "Meet & Greet"],
    description: "Spacious premium SUV perfect for group travel and long distance journeys.",
    coverImage: gmc1,
    gallery: [gmc1, gmc2, gmc3, gmc4],
    serviceType: "Intercity Travel",
    vehicleType: "GMC",
    vehicleLabel: "GMC Yukon - SAR 450/trip",
  },
  {
    id: 3,
    slug: "toyota-hiace",
    name: "Toyota Hiace",
    type: "Executive Van",
    category: "Van",
    seats: 12,
    luggage: "8 Bags",
    fuel: "Diesel",
    transmission: "Automatic",
    ac: "Yes",
    insurance: "Included",
    price: "SAR 600",
    badge: "HAJJ SPECIAL",
    features: ["Free WiFi", "USB Charging", "Water Bottles", "Extra Luggage Space", "24/7 Support", "Group Booking"],
    description: "Ideal for Hajj & Umrah groups, family trips, and airport group transfers.",
    coverImage: hiace1,
    gallery: [hiace1, hiace2, hiace3, hiace4],
    serviceType: "Hajj & Umrah Transfers",
    vehicleType: "Hiace",
    vehicleLabel: "Toyota Hiace - SAR 600/trip",
  },
  {
    id: 4,
    slug: "hyundai-starex",
    name: "Hyundai Starex",
    type: "Premium Van",
    category: "Van",
    seats: 9,
    luggage: "6 Bags",
    fuel: "Diesel",
    transmission: "Automatic",
    ac: "Yes",
    insurance: "Included",
    price: "SAR 500",
    badge: "",
    features: ["Free WiFi", "Reclining Seats", "Water Bottle", "Phone Charger", "24/7 Support", "Meet & Greet"],
    description: "Premium van with reclining seats, perfect for comfortable group travel.",
    coverImage: starex1,
    gallery: [starex1, starex2, starex3, starex4, starex5],
    serviceType: "Intercity Travel",
    vehicleType: "Starex",
    vehicleLabel: "Hyundai Starex - SAR 500/trip",
  },
  {
    id: 5,
    slug: "kia-staria",
    name: "Kia Staria",
    type: "Luxury Van",
    category: "VIP",
    seats: 9,
    luggage: "6 Bags",
    fuel: "Petrol",
    transmission: "Automatic",
    ac: "Yes",
    insurance: "Included",
    price: "SAR 650",
    badge: "PREMIUM",
    features: ["Free WiFi", "Luxury Interior", "Water Bottle", "Phone Charger", "24/7 Support", "VIP Meet & Greet"],
    description: "Ultra-modern luxury van with premium interior for VIP group transfers.",
    coverImage: staria1,
    gallery: [staria1, staria2, staria3, staria4, staria5],
    serviceType: "VIP & Royal Events",
    vehicleType: "Staria",
    vehicleLabel: "Kia Staria - SAR 650/trip",
  },
  {
    id: 6,
    slug: "toyota-coaster",
    name: "Toyota Coaster",
    type: "Coaster Bus",
    category: "Bus",
    seats: 22,
    luggage: "15 Bags",
    fuel: "Diesel",
    transmission: "Manual",
    ac: "Yes",
    insurance: "Included",
    price: "SAR 900",
    badge: "HAJJ SPECIAL",
    features: ["Full AC", "Large Luggage Space", "USB Charging", "Water Bottles", "24/7 Support", "Hajj Permit"],
    description: "Large capacity coaster perfect for Hajj groups, tours, and corporate events.",
    coverImage: coaster1,
    gallery: [coaster1, coaster2, coaster3, coaster4],
    serviceType: "Hajj & Umrah Transfers",
    vehicleType: "Coaster",
    vehicleLabel: "Toyota Coaster - SAR 900/trip",
  },
  {
    id: 7,
    slug: "mini-bus",
    name: "Mini Bus",
    type: "Mini Bus",
    category: "Bus",
    seats: 30,
    luggage: "20 Bags",
    fuel: "Diesel",
    transmission: "Manual",
    ac: "Yes",
    insurance: "Included",
    price: "SAR 1,200",
    badge: "GROUP",
    features: ["Full AC", "Overhead Storage", "USB Charging", "Water Bottles", "24/7 Support", "Hajj Permit"],
    description: "Perfect for large Hajj groups, corporate events, and big family tours.",
    coverImage: bus1,
    gallery: [bus1, bus2, bus3, bus4],
    serviceType: "Hajj & Umrah Transfers",
    vehicleType: "Bus",
    vehicleLabel: "Mini Bus - SAR 1,200/trip",
  },
];

export const fleetPreviewData = fleetData.slice(0, 6);
