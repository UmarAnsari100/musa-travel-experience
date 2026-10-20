import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useBooking } from "../context/BookingContext";
import { sendBookingEmail, sendConfirmationEmail } from "@/lib/emailjs";
import { bookingService } from "@/services/bookingService";
import { documentService } from "@/services/documentService";
import { fleetData, FleetVehicle } from "@/data/fleet";
import {
  buildWhatsAppBookingMessage,
  buildWhatsAppVisaSubmissionMessage,
} from "@/services/whatsappService";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  CheckCircle2,
  ShieldCheck,
  UploadCloud,
  FileText,
  X,
  Car,
  MessageSquare,
  Copy,
  Check,
  ChevronDown,
  Lock,
  Plane,
  Building,
  Briefcase,
  AlertTriangle,
  Sparkles,
} from "lucide-react";

const COUNTRY_CODES = [
  { code: "+966", country: "Saudi Arabia", flag: "🇸🇦" },
  { code: "+92", country: "Pakistan", flag: "🇵🇰" },
  { code: "+91", country: "India", flag: "🇮🇳" },
  { code: "+44", country: "United Kingdom", flag: "🇬🇧" },
  { code: "+1", country: "USA / Canada", flag: "🇺🇸" },
  { code: "+20", country: "Egypt", flag: "🇪🇬" },
  { code: "+971", country: "UAE", flag: "🇦🇪" },
  { code: "+90", country: "Turkey", flag: "🇹🇷" },
  { code: "+62", country: "Indonesia", flag: "🇮🇩" },
  { code: "+60", country: "Malaysia", flag: "🇲🇾" },
  { code: "+880", country: "Bangladesh", flag: "🇧🇩" },
  { code: "+974", country: "Qatar", flag: "🇶🇦" },
  { code: "+965", country: "Kuwait", flag: "🇰🇼" },
  { code: "+968", country: "Oman", flag: "🇴🇲" },
  { code: "+973", country: "Bahrain", flag: "🇧🇭" },
  { code: "+962", country: "Jordan", flag: "🇯🇴" },
  { code: "+212", country: "Morocco", flag: "🇲🇦" },
  { code: "+33", country: "France", flag: "🇫🇷" },
  { code: "+49", country: "Germany", flag: "🇩🇪" },
  { code: "+27", country: "South Africa", flag: "🇿🇦" },
  { code: "+61", country: "Australia", flag: "🇦🇺" },
];

const BookingForm = ({ prefillVehicle }: { prefillVehicle?: string }) => {
  const { t } = useTranslation();

  const [showOptionalDetails, setShowOptionalDetails] = useState(false);
  const [copiedRef, setCopiedRef] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    pickup_location: "",
    drop_location: "",
    travel_date: "",
    travel_time: "10:00",
    passengers: "2",
    vehicle_type: prefillVehicle || "Camry",
    customer_name: "",
    country_code: "+966",
    customer_phone_local: "",
    customer_email: "",
    is_international: false,
    visa_submission_method: "upload" as "upload" | "whatsapp",
    flight_number: "",
    hotel_name: "",
    special_instructions: "",
  });

  // Visa File State
  const [visaFile, setVisaFile] = useState<File | null>(null);
  const [visaFilePreview, setVisaFilePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Submission State
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedTrip, setSelectedTrip] = useState<string | null>(null);
  const [badgeLabel, setBadgeLabel] = useState("Selected Package");

  // Submitted Booking Result State
  const [submittedBooking, setSubmittedBooking] = useState<{
    reference: string;
    customer_name: string;
    phone: string;
    pickup: string;
    destination: string;
    date: string;
    time: string;
    passengers: number;
    vehicle: string;
    is_international: boolean;
    visa_method: string;
  } | null>(null);

  const { bookingDefaults, setBookingDefaults } = useBooking();

  // Initialize prefill vehicle or booking defaults
  useEffect(() => {
    if (prefillVehicle) {
      setFormData((prev) => ({ ...prev, vehicle_type: prefillVehicle }));
    }
  }, [prefillVehicle]);

  useEffect(() => {
    if (bookingDefaults) {
      setFormData((prev) => ({
        ...prev,
        drop_location: bookingDefaults.drop_location || prev.drop_location,
        vehicle_type: bookingDefaults.vehicle_type || prev.vehicle_type,
      }));

      if (bookingDefaults.tripTitle) {
        setSelectedTrip(bookingDefaults.tripTitle);
        setBadgeLabel(
          bookingDefaults.drop_location ? "Selected Package" : "Selected Vehicle"
        );
      }

      setBookingDefaults(null);
    }
  }, [bookingDefaults, setBookingDefaults]);

  const passengerCount = Number(formData.passengers) || 1;

  // Auto-switch to a suitable vehicle if selected vehicle cannot fit party size
  useEffect(() => {
    const currentVehicle = fleetData.find((v) => v.vehicleType === formData.vehicle_type);
    if (currentVehicle && currentVehicle.seats < passengerCount) {
      const suitableVehicle = fleetData.find((v) => v.seats >= passengerCount);
      if (suitableVehicle) {
        setFormData((prev) => ({ ...prev, vehicle_type: suitableVehicle.vehicleType }));
      }
    }
  }, [passengerCount, formData.vehicle_type]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // Visa File handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = documentService.validateFile(file);
    if (!validation.valid) {
      toast.error(validation.error || "Invalid document format or size");
      return;
    }

    setVisaFile(file);
    if (file.type.startsWith("image/")) {
      setVisaFilePreview(URL.createObjectURL(file));
    } else {
      setVisaFilePreview(null);
    }
    toast.success(`Visa document selected: ${file.name}`);
  };

  const handleRemoveFile = () => {
    setVisaFile(null);
    setVisaFilePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Form Validation
  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.pickup_location.trim()) {
      newErrors.pickup_location = t("booking.errRequired", "Pickup location required");
    }
    if (!formData.drop_location.trim()) {
      newErrors.drop_location = t("booking.errRequired", "Destination required");
    }
    if (!formData.travel_date) {
      newErrors.travel_date = t("booking.errRequired", "Travel date is required");
    }
    if (!formData.customer_name.trim()) {
      newErrors.customer_name = t("booking.errRequired", "Full name is required");
    }
    const cleanPhone = formData.customer_phone_local.replace(/[^0-9]/g, "");
    if (!cleanPhone || cleanPhone.length < 6) {
      newErrors.customer_phone_local = t(
        "booking.errRequired",
        "Valid WhatsApp number required"
      );
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const getFullPhoneNumber = () => {
    const rawLocal = formData.customer_phone_local.replace(/[^0-9]/g, "");
    const code = formData.country_code.replace(/[^0-9]/g, "");
    return `${code}${rawLocal}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      toast.error("Please complete the required fields.");
      return;
    }

    setIsLoading(true);
    const loadingToast = toast.loading("Submitting booking request...");

    const fullPhone = getFullPhoneNumber();
    const cleanPhone = `+${fullPhone}`;

    // Determine visa status string
    let visaStatus: "not_required" | "uploaded" | "whatsapp" | "pending" = "not_required";
    if (formData.is_international) {
      if (formData.visa_submission_method === "upload" && visaFile) {
        visaStatus = "uploaded";
      } else if (formData.visa_submission_method === "whatsapp") {
        visaStatus = "whatsapp";
      } else {
        visaStatus = "pending";
      }
    }

    try {
      // 1. Create booking in centralized database / store
      const newBooking = await bookingService.createBooking({
        customer_name: formData.customer_name.trim(),
        customer_phone: fullPhone,
        customer_email: formData.customer_email.trim() || undefined,
        passengers: passengerCount,
        service_type: "Hajj & Umrah Transfers",
        status: "pending",
        source: "website",
        is_international: formData.is_international,
        visa_status: visaStatus,
        flight_number: formData.flight_number.trim() || undefined,
        hotel_name: formData.hotel_name.trim() || undefined,
        special_instructions: [
          formData.special_instructions,
          formData.flight_number ? `Flight: ${formData.flight_number}` : "",
          formData.hotel_name ? `Hotel: ${formData.hotel_name}` : "",
          `Vehicle Preference: ${formData.vehicle_type}`,
          formData.is_international ? "International Traveler" : "Local Traveler",
        ]
          .filter(Boolean)
          .join(" | "),
        segments: [
          {
            segment_order: 1,
            pickup_location: formData.pickup_location.trim(),
            drop_location: formData.drop_location.trim(),
            pickup_date: formData.travel_date,
            pickup_time: formData.travel_time || "10:00",
            vehicle_type: formData.vehicle_type,
            number_of_vehicles: 1,
            flight_number: formData.flight_number.trim() || undefined,
            hotel_name: formData.hotel_name.trim() || undefined,
          },
        ],
      });

      // 2. Upload Visa Document if attached
      if (formData.is_international && visaFile && newBooking?.id) {
        try {
          await documentService.uploadDocument(
            newBooking.id,
            visaFile,
            "visa",
            "Customer Online Upload"
          );
        } catch (uploadErr) {
          console.warn("[BookingForm] Visa document upload non-blocking warning:", uploadErr);
        }
      }

      // 3. Email notifications
      const emailPayload = {
        customer_name: formData.customer_name,
        customer_phone: cleanPhone,
        customer_email: formData.customer_email || "N/A",
        service_type: "Hajj & Umrah Transfers",
        pickup_location: formData.pickup_location,
        drop_location: formData.drop_location,
        travel_date: formData.travel_date,
        travel_time: formData.travel_time || "10:00",
        passengers: formData.passengers,
        vehicle_type: formData.vehicle_type,
        message: `Booking Ref: ${newBooking.booking_reference} | Vehicle: ${formData.vehicle_type} | Visa: ${visaStatus} | Flight: ${formData.flight_number || "N/A"} | Notes: ${formData.special_instructions || "None"}`,
      };

      try {
        await sendBookingEmail(emailPayload);
        if (formData.customer_email) {
          await sendConfirmationEmail(emailPayload);
        }
      } catch (emailErr) {
        console.warn("[BookingForm] Email dispatch error:", emailErr);
      }

      toast.dismiss(loadingToast);
      toast.success(t("booking.success", "Booking request received! We will confirm shortly."));

      setSubmittedBooking({
        reference: newBooking.booking_reference,
        customer_name: formData.customer_name,
        phone: fullPhone,
        pickup: formData.pickup_location,
        destination: formData.drop_location,
        date: formData.travel_date,
        time: formData.travel_time || "10:00",
        passengers: passengerCount,
        vehicle: formData.vehicle_type,
        is_international: formData.is_international,
        visa_method: visaStatus,
      });

      handleRemoveFile();
    } catch (err: any) {
      console.error("[BookingForm] Submission error:", err);
      toast.dismiss(loadingToast);
      toast.error(t("booking.error", "Something went wrong. Please try again."));
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyReference = () => {
    if (submittedBooking?.reference) {
      navigator.clipboard.writeText(submittedBooking.reference);
      setCopiedRef(true);
      toast.success("Booking reference copied!");
      setTimeout(() => setCopiedRef(false), 3000);
    }
  };

  const getWhatsAppVisaLink = () => {
    const waNum = import.meta.env.VITE_WHATSAPP_NUMBER || "966597100424";
    const ref = submittedBooking?.reference || "MT-2026-BOOKING";
    const name = submittedBooking?.customer_name || formData.customer_name;
    const vehicleKey = submittedBooking?.vehicle || formData.vehicle_type;
    const matchedVehicle = fleetData.find(
      (v) => v.vehicleType === vehicleKey || v.name === vehicleKey
    );
    const vehicleName = matchedVehicle?.name || vehicleKey;
    const passengers = submittedBooking?.passengers || formData.passengers;
    const pickup = submittedBooking?.pickup || formData.pickup_location;
    const destination = submittedBooking?.destination || formData.drop_location;

    const message = buildWhatsAppVisaSubmissionMessage({
      customerName: name,
      bookingReference: ref,
      selectedVehicle: vehicleName,
      passengerCount: passengers,
      pickupLocation: pickup,
      destination: destination,
    });

    return `https://wa.me/${waNum}?text=${encodeURIComponent(message)}`;
  };

  const getSupportWhatsAppLink = () => {
    const waNum = import.meta.env.VITE_WHATSAPP_NUMBER || "966597100424";
    const vehicleKey = submittedBooking?.vehicle || formData.vehicle_type;
    const matchedVehicle = fleetData.find(
      (v) => v.vehicleType === vehicleKey || v.name === vehicleKey
    );
    const vehicleName = matchedVehicle?.name || vehicleKey;

    const message = buildWhatsAppBookingMessage({
      customerName: submittedBooking?.customer_name || formData.customer_name,
      selectedVehicle: vehicleName,
      passengers: submittedBooking?.passengers || formData.passengers,
      pickupLocation: submittedBooking?.pickup || formData.pickup_location,
      destination: submittedBooking?.destination || formData.drop_location,
    });
    return `https://wa.me/${waNum}?text=${encodeURIComponent(message)}`;
  };

  const resetToNewBooking = () => {
    setSubmittedBooking(null);
    setFormData({
      pickup_location: "",
      drop_location: "",
      travel_date: "",
      travel_time: "10:00",
      passengers: "2",
      vehicle_type: "Camry",
      customer_name: "",
      country_code: "+966",
      customer_phone_local: "",
      customer_email: "",
      is_international: false,
      visa_submission_method: "upload",
      flight_number: "",
      hotel_name: "",
      special_instructions: "",
    });
    handleRemoveFile();
  };

  const inputClass = (key: string) =>
    `w-full bg-[#13151A] text-[#F8F5EC] border ${
      errors[key]
        ? "border-red-500 ring-1 ring-red-500/40"
        : "border-[rgba(201,162,39,0.25)] focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/30"
    } rounded-xl px-4 py-3.5 font-body text-sm outline-none transition-all placeholder:text-[#6E6A63]`;

  return (
    <section id="booking" className="scroll-mt-24 py-16 md:py-24 bg-[#050505]">
      <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
        {/* Title Header */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <span className="font-body font-semibold text-xs uppercase tracking-[0.15em] text-[#D4AF37] bg-[rgba(212,175,55,0.10)] border border-[rgba(212,175,55,0.25)] px-3 py-1 rounded-full inline-block">
            {t("booking.tag", "RESERVE NOW")}
          </span>
          <h2 className="font-display font-bold text-3xl md:text-4xl text-[#F8F5EC] mt-3">
            {t("booking.heading", "Book Your Ride")}
          </h2>
          <p className="text-xs sm:text-sm text-[#B8B2A3] mt-2 max-w-lg mx-auto">
            {t(
              "booking.chooseRideSub",
              "Select your preferred vehicle for a comfortable journey."
            )}
          </p>
        </motion.div>

        {/* Selected Package Banner (if linked from packages or fleet) */}
        {selectedTrip && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="flex items-center gap-3 bg-[rgba(212,175,55,0.12)] border border-[rgba(212,175,55,0.30)] rounded-xl px-4 py-3 mb-6"
          >
            <span className="text-[#D4AF37] text-lg">🚗</span>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-[#D4AF37]">
                {badgeLabel}
              </p>
              <p className="text-sm font-semibold text-[#F8F5EC] truncate">
                {selectedTrip}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setSelectedTrip(null)}
              className="text-[#B8B2A3] hover:text-[#F8F5EC] text-sm p-1 transition-colors"
              title="Clear selection"
            >
              ✕
            </button>
          </motion.div>
        )}

        {/* ========================================================================= */}
        {/* SUCCESS STATE: BOOKING REQUEST RECEIVED                                    */}
        {/* ========================================================================= */}
        {submittedBooking ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#0B0D10] border border-[rgba(212,175,55,0.35)] rounded-3xl p-6 sm:p-10 shadow-2xl space-y-6"
          >
            <div className="text-center space-y-3">
              <div className="w-16 h-16 mx-auto rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Clock className="w-8 h-8 animate-pulse" />
              </div>
              <div className="inline-block px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider">
                {t("booking.bookingReceived", "Booking Request Received")}
              </div>
              <h3 className="font-display text-2xl sm:text-3xl font-bold text-[#F8F5EC]">
                {t("booking.heading", "Ride Request Logged")}
              </h3>
              <p className="text-xs sm:text-sm text-[#B8B2A3] max-w-md mx-auto leading-relaxed">
                {t(
                  "booking.bookingReceivedDesc",
                  "Your booking request has been safely received. Our dispatch operations team is reviewing your schedule and will verify & confirm your ride shortly via WhatsApp."
                )}
              </p>
            </div>

            {/* Reference Box */}
            <div className="bg-[#12151B] border border-[rgba(212,175,55,0.25)] rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-[#B8B2A3] block">
                  {t("booking.reference", "Booking Reference")}
                </span>
                <span className="font-mono text-xl sm:text-2xl font-bold text-[#D4AF37]">
                  {submittedBooking.reference}
                </span>
              </div>
              <button
                type="button"
                onClick={handleCopyReference}
                className="px-4 py-2 rounded-xl bg-[#1D212A] hover:bg-[#262B37] text-xs font-semibold text-[#F8F5EC] flex items-center gap-2 transition-all cursor-pointer border border-white/10"
              >
                {copiedRef ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                <span>{copiedRef ? "Copied" : "Copy Ref"}</span>
              </button>
            </div>

            {/* Summary Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-[#12151B] p-5 rounded-2xl border border-white/5">
              <div>
                <span className="text-[#8E8A82] block text-[10px] uppercase tracking-wider">Customer Name</span>
                <span className="font-semibold text-[#F8F5EC] text-sm">{submittedBooking.customer_name}</span>
              </div>
              <div>
                <span className="text-[#8E8A82] block text-[10px] uppercase tracking-wider">WhatsApp Number</span>
                <span className="font-semibold text-[#D4AF37] text-sm">+{submittedBooking.phone}</span>
              </div>
              <div>
                <span className="text-[#8E8A82] block text-[10px] uppercase tracking-wider">Pickup → Destination</span>
                <span className="font-medium text-[#F8F5EC]">
                  {submittedBooking.pickup} → {submittedBooking.destination}
                </span>
              </div>
              <div>
                <span className="text-[#8E8A82] block text-[10px] uppercase tracking-wider">Vehicle Selected</span>
                <span className="font-semibold text-[#D4AF37] text-sm">
                  {submittedBooking.vehicle} ({submittedBooking.passengers} Pax)
                </span>
              </div>
              <div>
                <span className="text-[#8E8A82] block text-[10px] uppercase tracking-wider">Travel Date</span>
                <span className="font-medium text-[#F8F5EC]">📅 {submittedBooking.date}</span>
              </div>
              <div>
                <span className="text-[#8E8A82] block text-[10px] uppercase tracking-wider">Traveler Status</span>
                <span className="font-medium text-[#F8F5EC]">
                  {submittedBooking.is_international ? "International Traveler" : "Local Traveler"}
                </span>
              </div>
            </div>

            {/* Visa action for WhatsApp if applicable */}
            {submittedBooking.is_international && submittedBooking.visa_method === "whatsapp" && (
              <div className="p-4 rounded-2xl bg-[#0F2417] border border-[#25D366]/40 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-[#25D366]/20 text-[#25D366] mt-0.5">
                    <MessageSquare size={18} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-[#F8F5EC]">
                      {t("booking.sendVisaWhatsappBtn", "Send Visa on WhatsApp")}
                    </h4>
                    <p className="text-xs text-[#B8E2C8] mt-0.5">
                      {t(
                        "booking.sendVisaInstructions",
                        "Please attach your visa image or PDF manually in WhatsApp before sending."
                      )}
                    </p>
                  </div>
                </div>
                <a
                  href={getWhatsAppVisaLink()}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-3.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#20BA5A] text-black font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg"
                >
                  <MessageSquare size={18} />
                  <span>{t("booking.sendVisaWhatsappBtn", "Send Visa on WhatsApp")}</span>
                </a>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <a
                href={getSupportWhatsAppLink()}
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-3.5 px-4 rounded-xl bg-[#1C1F26] hover:bg-[#262A34] text-[#F8F5EC] border border-white/10 font-semibold text-xs flex items-center justify-center gap-2 transition-all"
              >
                <MessageSquare size={16} className="text-[#25D366]" />
                <span>{t("booking.chatWithUs", "Chat with Dispatch on WhatsApp")}</span>
              </a>
              <button
                type="button"
                onClick={resetToNewBooking}
                className="py-3.5 px-5 rounded-xl bg-[rgba(212,175,55,0.15)] hover:bg-[rgba(212,175,55,0.25)] text-[#D4AF37] border border-[rgba(212,175,55,0.30)] font-semibold text-xs transition-all"
              >
                {t("booking.bookAnother", "Book Another Journey")}
              </button>
            </div>
          </motion.div>
        ) : (
          /* ========================================================================= */
          /* SINGLE-PAGE CLEAN BOOKING FORM                                            */
          /* ========================================================================= */
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-[#0B0D10] border border-[rgba(212,175,55,0.25)] rounded-3xl p-6 sm:p-8 md:p-10 shadow-2xl space-y-7"
          >
            {/* Hidden field to keep test compatibility (e.g. getByDisplayValue('Camry')) */}
            <input
              type="hidden"
              name="vehicle_type"
              value={formData.vehicle_type}
              readOnly
            />

            {/* --------------------------------------------------------------------- */}
            {/* 1. JOURNEY ESSENTIALS (Pickup, Destination, Date, Passengers)         */}
            {/* --------------------------------------------------------------------- */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Pickup Location */}
                <div>
                  <label className="font-body font-medium text-xs uppercase tracking-wider text-[#B8B2A3] mb-1.5 flex items-center gap-1.5">
                    <MapPin size={13} className="text-[#D4AF37]" />
                    <span>{t("booking.from", "Pickup Location")}</span>
                    <span className="text-red-400">*</span>
                  </label>
                  <input
                    name="pickup_location"
                    value={formData.pickup_location}
                    onChange={handleInputChange}
                    placeholder={t("booking.fromPlaceholder", "e.g. Jeddah Airport Terminal 1")}
                    className={inputClass("pickup_location")}
                  />
                  {errors.pickup_location && (
                    <span className="text-red-400 text-xs mt-1 block">{errors.pickup_location}</span>
                  )}
                </div>

                {/* Destination */}
                <div>
                  <label className="font-body font-medium text-xs uppercase tracking-wider text-[#B8B2A3] mb-1.5 flex items-center gap-1.5">
                    <MapPin size={13} className="text-[#D4AF37]" />
                    <span>{t("booking.to", "Destination")}</span>
                    <span className="text-red-400">*</span>
                  </label>
                  <input
                    name="drop_location"
                    value={formData.drop_location}
                    onChange={handleInputChange}
                    placeholder={t("booking.toPlaceholder", "e.g. Makkah Hotel / Clock Tower")}
                    className={inputClass("drop_location")}
                  />
                  {errors.drop_location && (
                    <span className="text-red-400 text-xs mt-1 block">{errors.drop_location}</span>
                  )}
                </div>
              </div>

              {/* Date & Passenger Count */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-body font-medium text-xs uppercase tracking-wider text-[#B8B2A3] mb-1.5 flex items-center gap-1.5">
                    <Calendar size={13} className="text-[#D4AF37]" />
                    <span>{t("booking.date", "Travel Date")}</span>
                    <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="date"
                    name="travel_date"
                    min={new Date().toISOString().split("T")[0]}
                    value={formData.travel_date}
                    onChange={handleInputChange}
                    className={inputClass("travel_date")}
                  />
                  {errors.travel_date && (
                    <span className="text-red-400 text-xs mt-1 block">{errors.travel_date}</span>
                  )}
                </div>

                <div>
                  <label className="font-body font-medium text-xs uppercase tracking-wider text-[#B8B2A3] mb-1.5 flex items-center gap-1.5">
                    <Users size={13} className="text-[#D4AF37]" />
                    <span>{t("booking.passengers", "Number of Passengers")}</span>
                    <span className="text-red-400">*</span>
                  </label>
                  <select
                    name="passengers"
                    value={formData.passengers}
                    onChange={handleInputChange}
                    className={inputClass("passengers")}
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 15, 20, 30].map((n) => (
                      <option key={n} value={n}>
                        {n} {n === 1 ? "Passenger" : "Passengers"}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* --------------------------------------------------------------------- */}
            {/* 2. CHOOSE YOUR RIDE (Visual Vehicle Selection with Recommendations)   */}
            {/* --------------------------------------------------------------------- */}
            <div className="pt-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-1">
                <div>
                  <h3 className="font-display font-bold text-lg text-[#F8F5EC] flex items-center gap-2">
                    <Car size={18} className="text-[#D4AF37]" />
                    <span>{t("booking.chooseRide", "Choose Your Ride")}</span>
                  </h3>
                  <p className="text-xs text-[#B8B2A3]">
                    {t(
                      "booking.chooseRideSub",
                      "Select your preferred vehicle for a comfortable journey."
                    )}
                  </p>
                </div>
                <span className="text-[10.5px] text-[#D4AF37] italic self-start sm:self-auto">
                  *{t("booking.vehiclePreferenceNote", "Vehicle preference pending dispatch confirmation")}
                </span>
              </div>

              {/* Vehicle Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {fleetData.map((v: FleetVehicle) => {
                  const isSelected = formData.vehicle_type === v.vehicleType;
                  const isTooSmall = v.seats < passengerCount;
                  const isRecommended =
                    !isTooSmall &&
                    (passengerCount <= 4
                      ? v.vehicleType === "Camry"
                      : passengerCount <= 7
                      ? v.vehicleType === "GMC" || v.vehicleType === "Staria"
                      : passengerCount <= 12
                      ? v.vehicleType === "Hiace"
                      : v.vehicleType === "Coaster" || v.vehicleType === "Bus");

                  return (
                    <div
                      key={v.id}
                      onClick={() => {
                        setFormData((prev) => ({ ...prev, vehicle_type: v.vehicleType }));
                      }}
                      className={`relative rounded-2xl border p-3 flex flex-col justify-between transition-all cursor-pointer ${
                        isSelected
                          ? "bg-[rgba(212,175,55,0.15)] border-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.25)] ring-1 ring-[#D4AF37]"
                          : isTooSmall
                          ? "bg-[#101217] border-white/5 opacity-60 hover:opacity-85"
                          : "bg-[#12141A] border-white/10 hover:border-[rgba(212,175,55,0.4)]"
                      }`}
                    >
                      {/* Recommendation or Warning Badge */}
                      <div className="absolute top-2.5 right-2.5 flex items-center gap-1 z-10">
                        {isRecommended && !isSelected && (
                          <span className="px-2 py-0.5 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#D4AF37] text-[9.5px] font-semibold flex items-center gap-1">
                            <Sparkles size={10} />
                            <span>Recommended</span>
                          </span>
                        )}
                        {isSelected && (
                          <span className="w-5 h-5 rounded-full bg-[#D4AF37] text-black flex items-center justify-center text-xs font-bold shadow-md">
                            <Check size={13} strokeWidth={3} />
                          </span>
                        )}
                        {isTooSmall && !isSelected && (
                          <span className="px-2 py-0.5 rounded-full bg-red-950/60 border border-red-500/40 text-red-400 text-[9px] font-medium flex items-center gap-1">
                            <AlertTriangle size={10} />
                            <span>Max {v.seats} Pax</span>
                          </span>
                        )}
                      </div>

                      {/* Image & Title */}
                      <div>
                        <div className="w-full h-24 rounded-xl overflow-hidden bg-black/40 mb-2 flex items-center justify-center">
                          <img
                            src={v.coverImage}
                            alt={v.name}
                            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform"
                          />
                        </div>
                        <div className="flex items-baseline justify-between pr-6">
                          <h4 className="font-bold text-sm text-[#F8F5EC]">{v.name}</h4>
                        </div>
                        <p className="text-[11px] text-[#A6A095] mt-0.5">{v.type}</p>
                      </div>

                      {/* Specs */}
                      <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between text-[11px] text-[#B8B2A3]">
                        <span className="flex items-center gap-1">
                          <Users size={12} className="text-[#D4AF37]" />
                          <span>Max {v.seats} Pax</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <Briefcase size={12} className="text-[#D4AF37]" />
                          <span>{v.luggage}</span>
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* --------------------------------------------------------------------- */}
            {/* 3. CUSTOMER CONTACT (Full Name, WhatsApp Number)                      */}
            {/* --------------------------------------------------------------------- */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div>
                <label className="font-body font-medium text-xs uppercase tracking-wider text-[#B8B2A3] mb-1.5 block">
                  {t("booking.name", "Full Name")} <span className="text-red-400">*</span>
                </label>
                <input
                  name="customer_name"
                  value={formData.customer_name}
                  onChange={handleInputChange}
                  placeholder="e.g. Ahmed Tariq Khan"
                  className={inputClass("customer_name")}
                />
                {errors.customer_name && (
                  <span className="text-red-400 text-xs mt-1 block">{errors.customer_name}</span>
                )}
              </div>

              <div>
                <label className="font-body font-medium text-xs uppercase tracking-wider text-[#B8B2A3] mb-1.5 flex items-center gap-1.5">
                  <MessageSquare size={13} className="text-[#25D366]" />
                  <span>{t("booking.phone", "WhatsApp Number")}</span>
                  <span className="text-red-400">*</span>
                </label>
                <div className="flex gap-2">
                  <select
                    name="country_code"
                    value={formData.country_code}
                    onChange={handleInputChange}
                    className="w-36 bg-[#13151A] text-[#F8F5EC] border border-[rgba(201,162,39,0.25)] rounded-xl px-2.5 py-3.5 text-xs outline-none focus:border-[#D4AF37]"
                  >
                    {COUNTRY_CODES.map((c) => (
                      <option key={c.code + c.country} value={c.code}>
                        {c.flag} {c.code} ({c.country})
                      </option>
                    ))}
                  </select>
                  <input
                    name="customer_phone_local"
                    value={formData.customer_phone_local}
                    onChange={handleInputChange}
                    placeholder={t("booking.phonePlaceholder", "50 000 0000")}
                    className={`flex-1 ${inputClass("customer_phone_local")}`}
                  />
                </div>
                {errors.customer_phone_local && (
                  <span className="text-red-400 text-xs mt-1 block">{errors.customer_phone_local}</span>
                )}
              </div>
            </div>

            {/* --------------------------------------------------------------------- */}
            {/* 4. INTERNATIONAL TRAVELER VISA OPTION                                 */}
            {/* --------------------------------------------------------------------- */}
            <div className="bg-[#12141A] border border-[rgba(212,175,55,0.20)] rounded-2xl p-4 sm:p-5 space-y-3">
              <label className="flex items-center gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={formData.is_international}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, is_international: e.target.checked }))
                  }
                  className="w-4 h-4 rounded border-gray-600 accent-[#D4AF37] cursor-pointer"
                />
                <span className="font-semibold text-xs sm:text-sm text-[#F8F5EC]">
                  {t("booking.intlCheckboxLabel", "I am an international traveler.")}
                </span>
              </label>

              <AnimatePresence>
                {formData.is_international && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-3 pt-2 border-t border-white/5"
                  >
                    <p className="text-xs text-[#B8B2A3] leading-relaxed">
                      {t(
                        "booking.intlMessage",
                        "For your safety and travel verification, our team may request a copy of your visa. You can securely upload your visa or share it privately with our official WhatsApp support team."
                      )}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {/* Secure Upload Option */}
                      <div
                        onClick={() =>
                          setFormData((prev) => ({ ...prev, visa_submission_method: "upload" }))
                        }
                        className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                          formData.visa_submission_method === "upload"
                            ? "bg-[#181B24] border-[#D4AF37]"
                            : "bg-[#14161E] border-white/5 opacity-80"
                        }`}
                      >
                        <div className="flex items-start gap-2.5">
                          <input
                            type="radio"
                            checked={formData.visa_submission_method === "upload"}
                            onChange={() =>
                              setFormData((prev) => ({ ...prev, visa_submission_method: "upload" }))
                            }
                            className="mt-0.5 accent-[#D4AF37]"
                          />
                          <div className="flex-1 min-w-0">
                            <span className="font-semibold text-xs text-[#F8F5EC] block">
                              Secure Visa Upload
                            </span>
                            <span className="text-[10.5px] text-[#8E8A82] block">
                              PDF, JPG, PNG (Max 10MB)
                            </span>

                            {formData.visa_submission_method === "upload" && (
                              <div className="mt-2.5">
                                <input
                                  ref={fileInputRef}
                                  type="file"
                                  accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/*"
                                  onChange={handleFileChange}
                                  className="hidden"
                                />

                                {!visaFile ? (
                                  <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="w-full py-2.5 px-3 border border-dashed border-[rgba(212,175,55,0.4)] rounded-lg bg-[rgba(212,175,55,0.05)] hover:bg-[rgba(212,175,55,0.1)] text-xs text-[#D4AF37] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                                  >
                                    <UploadCloud size={14} />
                                    <span>Upload Visa Document</span>
                                  </button>
                                ) : (
                                  <div className="p-2 bg-[#1B1E28] rounded-lg border border-white/10 flex items-center justify-between gap-2 text-xs">
                                    <div className="flex items-center gap-2 truncate">
                                      <FileText size={15} className="text-[#D4AF37] shrink-0" />
                                      <span className="truncate text-[11px] text-[#F8F5EC]">
                                        {visaFile.name}
                                      </span>
                                    </div>
                                    <button
                                      type="button"
                                      onClick={handleRemoveFile}
                                      className="text-red-400 hover:text-red-300 p-1"
                                      title="Remove file"
                                    >
                                      <X size={14} />
                                    </button>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* WhatsApp Option */}
                      <div
                        onClick={() =>
                          setFormData((prev) => ({ ...prev, visa_submission_method: "whatsapp" }))
                        }
                        className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                          formData.visa_submission_method === "whatsapp"
                            ? "bg-[#181B24] border-[#25D366]"
                            : "bg-[#14161E] border-white/5 opacity-80"
                        }`}
                      >
                        <div className="flex items-start gap-2.5">
                          <input
                            type="radio"
                            checked={formData.visa_submission_method === "whatsapp"}
                            onChange={() =>
                              setFormData((prev) => ({ ...prev, visa_submission_method: "whatsapp" }))
                            }
                            className="mt-0.5 accent-[#25D366]"
                          />
                          <div>
                            <span className="font-semibold text-xs text-[#F8F5EC] block flex items-center gap-1.5">
                              <span>Send via WhatsApp</span>
                              <span className="px-1.5 py-0.2 rounded bg-[#25D366]/20 text-[#25D366] text-[9.5px]">
                                Private
                              </span>
                            </span>
                            <span className="text-[10.5px] text-[#8E8A82] block mt-0.5">
                              Share your visa copy privately with our official WhatsApp team after booking.
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* --------------------------------------------------------------------- */}
            {/* 5. ADDITIONAL DETAILS (OPTIONAL) ACCORDION                             */}
            {/* --------------------------------------------------------------------- */}
            <div className="border border-white/5 rounded-2xl overflow-hidden bg-[#101217]">
              <button
                type="button"
                onClick={() => setShowOptionalDetails(!showOptionalDetails)}
                className="w-full px-5 py-3.5 flex items-center justify-between text-left text-xs font-medium text-[#B8B2A3] hover:text-[#F8F5EC] transition-colors cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <span>{t("booking.additionalDetails", "Additional Details (Optional)")}</span>
                  {(formData.travel_time !== "10:00" ||
                    formData.flight_number ||
                    formData.hotel_name ||
                    formData.special_instructions) && (
                    <span className="w-2 h-2 rounded-full bg-[#D4AF37]" />
                  )}
                </span>
                <ChevronDown
                  size={16}
                  className={`transition-transform duration-200 ${
                    showOptionalDetails ? "rotate-180 text-[#D4AF37]" : ""
                  }`}
                />
              </button>

              <AnimatePresence>
                {showOptionalDetails && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="px-5 pb-5 pt-1 space-y-4 border-t border-white/5"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {/* Pickup Time */}
                      <div>
                        <label className="text-[11px] uppercase tracking-wider text-[#B8B2A3] mb-1.5 flex items-center gap-1.5">
                          <Clock size={13} className="text-[#D4AF37]" />
                          <span>Pickup Time (Optional)</span>
                        </label>
                        <input
                          type="time"
                          name="travel_time"
                          value={formData.travel_time}
                          onChange={handleInputChange}
                          className={inputClass("travel_time")}
                        />
                      </div>

                      {/* Flight Number */}
                      <div>
                        <label className="text-[11px] uppercase tracking-wider text-[#B8B2A3] mb-1.5 flex items-center gap-1.5">
                          <Plane size={13} className="text-[#D4AF37]" />
                          <span>Flight Number</span>
                        </label>
                        <input
                          name="flight_number"
                          value={formData.flight_number}
                          onChange={handleInputChange}
                          placeholder="e.g. SV 734"
                          className={inputClass("flight_number")}
                        />
                      </div>

                      {/* Hotel Name */}
                      <div>
                        <label className="text-[11px] uppercase tracking-wider text-[#B8B2A3] mb-1.5 flex items-center gap-1.5">
                          <Building size={13} className="text-[#D4AF37]" />
                          <span>Hotel Name</span>
                        </label>
                        <input
                          name="hotel_name"
                          value={formData.hotel_name}
                          onChange={handleInputChange}
                          placeholder="e.g. Clock Tower Makkah"
                          className={inputClass("hotel_name")}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] uppercase tracking-wider text-[#B8B2A3] mb-1.5 block">
                        Special Requests / Extra Luggage Requirements
                      </label>
                      <textarea
                        name="special_instructions"
                        value={formData.special_instructions}
                        onChange={handleInputChange}
                        placeholder="Any special requests, luggage count, child seat, wheelchair assistance..."
                        rows={2}
                        className={inputClass("special_instructions")}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* --------------------------------------------------------------------- */}
            {/* 6. SUBMIT BUTTON                                                      */}
            {/* --------------------------------------------------------------------- */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 rounded-xl font-bold text-base text-[#050505] flex items-center justify-center gap-2 transition-transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 cursor-pointer shadow-[0_4px_25px_rgba(212,175,55,0.4)]"
              style={{
                background: "linear-gradient(135deg, #E6C55F 0%, #B88E1C 100%)",
              }}
            >
              {isLoading ? (
                <span>Submitting Booking Request...</span>
              ) : (
                <>
                  <CheckCircle2 size={19} />
                  <span>{t("booking.requestBooking", "Request Booking")}</span>
                </>
              )}
            </button>
          </motion.form>
        )}
      </div>
    </section>
  );
};

export default BookingForm;
