import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import { CheckCircle2, Phone, MessageSquare, Car, MapPin, Calendar, Clock } from "lucide-react";
import { sendConfirmationEmail } from "../lib/emailjs";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const ConfirmBooking = () => {
  const [searchParams] = useSearchParams();
  const [isConfirming, setIsConfirming] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);

  const bookingData = {
    customer_name: searchParams.get("name") || "Valued Customer",
    customer_email: searchParams.get("email") || "",
    service_type: searchParams.get("service") || "Private Transfer",
    vehicle_type: searchParams.get("vehicle") || "Luxury Sedan",
    pickup: searchParams.get("from") || "N/A",
    dropoff: searchParams.get("to") || "N/A",
    date: searchParams.get("date") || "N/A",
    time: searchParams.get("time") || "N/A",
  };

  const handleConfirm = async () => {
    setIsConfirming(true);
    const loadingToast = toast.loading("Confirming ride and notifying customer...");

    try {
      const result = await sendConfirmationEmail(bookingData);
      
      if (result.success) {
        toast.dismiss(loadingToast);
        toast.success("Ride Confirmed! Customer has been notified.");
        setIsConfirmed(true);
      } else {
        throw new Error("Failed to send confirmation");
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsConfirming(false);
    }
  };

  const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER || "966597100424";

  return (
    <div className="min-h-screen bg-[#0e1111] text-white">
      <Navbar />
      
      <main className="container mx-auto px-6 pt-32 pb-20 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#0F1E1C] border border-[rgba(64,138,113,0.20)] rounded-3xl p-8 md:p-12 shadow-2xl"
        >
          {!isConfirmed ? (
            <>
              <div className="text-center mb-10">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#B0E4CC]/10 text-[#B0E4CC] mb-6">
                  <Car size={32} />
                </div>
                <h1 className="text-3xl font-display font-bold mb-2">Driver Confirmation</h1>
                <p className="text-[#7ABFA0]">Review booking details and confirm the ride.</p>
              </div>

              <div className="space-y-6 mb-10">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-[rgba(64,138,113,0.12)] rounded-2xl border border-[rgba(64,138,113,0.20)]">
                    <span className="text-[10px] uppercase tracking-widest text-[#7ABFA0] block mb-1">Customer</span>
                    <p className="font-semibold">{bookingData.customer_name}</p>
                  </div>
                  <div className="p-4 bg-[rgba(64,138,113,0.12)] rounded-2xl border border-[rgba(64,138,113,0.20)]">
                    <span className="text-[10px] uppercase tracking-widest text-[#7ABFA0] block mb-1">Vehicle</span>
                    <p className="font-semibold text-[#B0E4CC]">{bookingData.vehicle_type}</p>
                  </div>
                </div>

                <div className="p-6 bg-[rgba(64,138,113,0.12)] rounded-2xl border border-[rgba(64,138,113,0.20)] space-y-4">
                  <div className="flex items-start gap-4">
                    <MapPin className="text-[#B0E4CC] mt-1" size={18} />
                    <div>
                      <span className="text-[10px] uppercase tracking-widest text-[#7ABFA0]">Route</span>
                      <p className="text-sm mt-1">{bookingData.pickup} → {bookingData.dropoff}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Calendar className="text-[#B0E4CC]" size={18} />
                    <p className="text-sm">{bookingData.date} at {bookingData.time}</p>
                  </div>
                </div>
              </div>

              <button
                onClick={handleConfirm}
                disabled={isConfirming}
                className="w-full py-5 rounded-2xl bg-gradient-to-r from-[#285A48] to-[#B0E4CC] text-black font-bold text-lg hover:scale-[1.02] transition-all disabled:opacity-50"
              >
                {isConfirming ? "Processing..." : "Confirm Ride"}
              </button>
            </>
          ) : (
            <div className="text-center py-10">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/10 text-green-500 mb-8"
              >
                <CheckCircle2 size={48} />
              </motion.div>
              <h2 className="text-3xl font-display font-bold mb-4">Ride Confirmed!</h2>
              <p className="text-[#7ABFA0] mb-10 max-w-md mx-auto">
                The customer has been notified via email. You can now contact them directly to coordinate.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <a
                  href={`https://wa.me/${whatsappNumber}`}
                  target="_blank"
                  className="flex items-center justify-center gap-3 py-4 rounded-2xl bg-[#25D366] text-white font-bold hover:opacity-90 transition-all"
                >
                  <MessageSquare size={20} />
                  Chat on WhatsApp
                </a>
                <a
                  href={`tel:${whatsappNumber}`}
                  className="flex items-center justify-center gap-3 py-4 rounded-2xl bg-white text-black font-bold hover:bg-gray-100 transition-all"
                >
                  <Phone size={20} />
                  Call Driver
                </a>
              </div>
            </div>
          )}
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default ConfirmBooking;
