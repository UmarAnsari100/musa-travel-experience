import { Send } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const Footer = () => {
  const [email, setEmail] = useState("");

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      toast.error("Please enter a valid email.");
      return;
    }
    toast.success("Subscribed! Welcome aboard.");
    setEmail("");
  };

  return (
    <footer className="bg-foreground text-primary-foreground pt-16 pb-8">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Logo */}
          <div>
            <div className="font-display text-xl font-bold mb-3">
              MUSA<span className="text-gold font-normal">TRAVEL</span>
            </div>
            <p className="text-primary-foreground/60 font-body text-sm leading-relaxed">
              Saudi Arabia's most trusted travel & taxi service. Redefining the journey for pilgrims and travelers with premium comfort and reliability across the Kingdom.
            </p>
            <div className="flex gap-4 mt-4">
              {["FB", "IG", "TW"].map((s) => (
                <span key={s} className="w-8 h-8 rounded-full bg-primary-foreground/10 flex items-center justify-center text-xs font-body">
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-body font-semibold text-sm mb-4">Quick Links</h4>
            {["Home", "Destinations", "Services", "Packages", "FAQ"].map((link) => (
              <button
                key={link}
                onClick={() => {
                  const map: Record<string, string> = { Home: "hero", Destinations: "destinations", Services: "services", Packages: "packages", FAQ: "faq" };
                  document.getElementById(map[link])?.scrollIntoView({ behavior: "smooth" });
                }}
                className="block text-primary-foreground/60 font-body text-sm py-1 hover:text-gold transition-colors"
              >
                {link}
              </button>
            ))}
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-body font-semibold text-sm mb-4">Legal</h4>
            {["Privacy Policy", "Terms of Service"].map((link) => (
              <span key={link} className="block text-primary-foreground/60 font-body text-sm py-1 cursor-pointer hover:text-gold transition-colors">
                {link}
              </span>
            ))}
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-body font-semibold text-sm mb-4">Newsletter</h4>
            <p className="text-primary-foreground/60 font-body text-sm mb-4">Get curated updates and exclusive voyage deals.</p>
            <form onSubmit={handleNewsletter} className="flex">
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter Email"
                className="flex-1 bg-primary-foreground/10 rounded-l-xl px-4 py-2.5 font-body text-sm outline-none text-primary-foreground placeholder:text-primary-foreground/40"
              />
              <button type="submit" className="gradient-gold px-4 py-2.5 rounded-r-xl transition-transform hover:scale-[1.03]">
                <Send size={16} className="text-primary-foreground" />
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-primary-foreground/10 pt-6 text-center">
          <p className="text-primary-foreground/40 font-body text-xs">
            © 2025 MUSA TRAVEL. The Curated Voyage All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
