import { motion } from "framer-motion";

const FooterCTA = () => (
  <section className="relative bg-foreground py-20 md:py-28 overflow-hidden">
    {/* Ghost watermark */}
    <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none select-none">
      <span className="font-display text-[10rem] md:text-[16rem] font-black text-primary-foreground/[0.04] leading-none">
        MUS
      </span>
    </div>

    <div className="container mx-auto px-6 relative z-10 text-center">
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.65 }}
      >
        <h2 className="font-display font-bold text-3xl md:text-5xl text-primary-foreground mb-4">
          Ready to Explore?
        </h2>
        <p className="text-primary-foreground/60 font-body mb-8 max-w-md mx-auto">
          Your next curated voyage is just a tap away.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => document.getElementById("booking")?.scrollIntoView({ behavior: "smooth" })}
            className="gradient-gold text-primary-foreground font-body font-semibold text-sm px-8 py-3 rounded-full transition-transform hover:scale-[1.03]"
          >
            Book Now
          </button>
          <a
            href={`https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER || "923001234567"}?text=${encodeURIComponent("Hi, I'd like to know more about your services.")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-body font-semibold text-sm px-8 py-3 rounded-full text-primary-foreground bg-primary-foreground/10 transition-transform hover:scale-[1.03]"
          >
            Contact Sales
          </a>
        </div>
      </motion.div>
    </div>
  </section>
);

export default FooterCTA;
