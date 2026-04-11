import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";

const serviceTypes = ["City Taxi", "Airport Transfer", "Intercity Travel", "Northern Tour", "Corporate Fleet", "Events & Weddings"];

const BookingForm = () => {
  const [form, setForm] = useState({
    service: "",
    from: "",
    to: "",
    date: "",
    time: "",
    passengers: "1",
    name: "",
    phone: "",
    email: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.service) e.service = "Select a service";
    if (!form.from.trim()) e.from = "Required";
    if (!form.to.trim()) e.to = "Required";
    if (!form.date) e.date = "Required";
    if (!form.time) e.time = "Required";
    if (!form.name.trim()) e.name = "Required";
    if (!form.phone.trim()) e.phone = "Required";
    if (!form.email.trim()) e.email = "Required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Invalid email";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);

    // Attempt EmailJS (gracefully fail if not configured)
    try {
      const emailjs = await import("@emailjs/browser");
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID || "demo",
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID || "demo",
        { ...form },
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY || "demo"
      );
    } catch {
      // EmailJS not configured, continue to WhatsApp
    }

    // WhatsApp message
    const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER || "923001234567";
    const msg = encodeURIComponent(
      `*New Booking — MUSA TRAVEL*\n\nService: ${form.service}\nFrom: ${form.from} → To: ${form.to}\nDate: ${form.date} at ${form.time}\nPassengers: ${form.passengers}\nName: ${form.name} | Phone: ${form.phone}`
    );
    window.open(`https://wa.me/${whatsappNumber}?text=${msg}`, "_blank");

    toast.success("Booking sent! We'll confirm shortly.");
    setForm({ service: "", from: "", to: "", date: "", time: "", passengers: "1", name: "", phone: "", email: "" });
    setErrors({});
    setLoading(false);
  };

  const update = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const inputClass = (key: string) =>
    `w-full bg-surface-low rounded-xl px-4 py-3 font-body text-sm outline-none transition-colors focus:ring-2 focus:ring-gold/40 ${
      errors[key] ? "ring-2 ring-destructive" : ""
    }`;

  return (
    <section id="booking" className="py-20 md:py-28 bg-surface-low">
      <div className="container mx-auto px-6 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65 }}
          className="text-center mb-12"
        >
          <span className="font-body font-medium text-xs uppercase tracking-[0.10em] text-gray-text">Reserve Now</span>
          <h2 className="font-display font-bold text-3xl md:text-4xl mt-3">Book Your Ride</h2>
        </motion.div>

        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="bg-card rounded-2xl shadow-card p-8 space-y-5"
        >
          {/* Service */}
          <div>
            <label className="font-body font-medium text-xs uppercase tracking-[0.10em] text-gray-text mb-2 block">Service Type</label>
            <select value={form.service} onChange={(e) => update("service", e.target.value)} className={inputClass("service")}>
              <option value="">Select service...</option>
              {serviceTypes.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            {errors.service && <span className="text-destructive text-xs mt-1 block">{errors.service}</span>}
          </div>

          {/* From / To */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-body font-medium text-xs uppercase tracking-[0.10em] text-gray-text mb-2 block">From</label>
              <input value={form.from} onChange={(e) => update("from", e.target.value)} placeholder="Pickup location" className={inputClass("from")} />
              {errors.from && <span className="text-destructive text-xs mt-1 block">{errors.from}</span>}
            </div>
            <div>
              <label className="font-body font-medium text-xs uppercase tracking-[0.10em] text-gray-text mb-2 block">To</label>
              <input id="booking-to" value={form.to} onChange={(e) => update("to", e.target.value)} placeholder="Drop-off location" className={inputClass("to")} />
              {errors.to && <span className="text-destructive text-xs mt-1 block">{errors.to}</span>}
            </div>
          </div>

          {/* Date / Time / Passengers */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="font-body font-medium text-xs uppercase tracking-[0.10em] text-gray-text mb-2 block">Date</label>
              <input type="date" value={form.date} onChange={(e) => update("date", e.target.value)} className={inputClass("date")} />
              {errors.date && <span className="text-destructive text-xs mt-1 block">{errors.date}</span>}
            </div>
            <div>
              <label className="font-body font-medium text-xs uppercase tracking-[0.10em] text-gray-text mb-2 block">Time</label>
              <input type="time" value={form.time} onChange={(e) => update("time", e.target.value)} className={inputClass("time")} />
              {errors.time && <span className="text-destructive text-xs mt-1 block">{errors.time}</span>}
            </div>
            <div>
              <label className="font-body font-medium text-xs uppercase tracking-[0.10em] text-gray-text mb-2 block">Passengers</label>
              <select value={form.passengers} onChange={(e) => update("passengers", e.target.value)} className={inputClass("passengers")}>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Name / Phone / Email */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="font-body font-medium text-xs uppercase tracking-[0.10em] text-gray-text mb-2 block">Name</label>
              <input value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="Full name" className={inputClass("name")} />
              {errors.name && <span className="text-destructive text-xs mt-1 block">{errors.name}</span>}
            </div>
            <div>
              <label className="font-body font-medium text-xs uppercase tracking-[0.10em] text-gray-text mb-2 block">Phone</label>
              <input value={form.phone} onChange={(e) => update("phone", e.target.value)} placeholder="+92 300 1234567" className={inputClass("phone")} />
              {errors.phone && <span className="text-destructive text-xs mt-1 block">{errors.phone}</span>}
            </div>
            <div>
              <label className="font-body font-medium text-xs uppercase tracking-[0.10em] text-gray-text mb-2 block">Email</label>
              <input value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="you@email.com" className={inputClass("email")} />
              {errors.email && <span className="text-destructive text-xs mt-1 block">{errors.email}</span>}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full gradient-gold text-primary-foreground font-body font-semibold text-sm py-3.5 rounded-full transition-transform hover:scale-[1.03] disabled:opacity-60"
          >
            {loading ? "Sending..." : "Submit Booking"}
          </button>
        </motion.form>
      </div>
    </section>
  );
};

export default BookingForm;
