import { Send, Facebook, Instagram, Twitter, Phone, MessageCircle, Mail } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

const socialLinks = [
  { Icon: Facebook, name: "Facebook" },
  { Icon: Instagram, name: "Instagram" },
  { Icon: Twitter, name: "Twitter" },
];

const Footer = () => {
  const { t } = useTranslation();
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
    <footer className="relative bg-[#000000] text-white pt-20 pb-10 overflow-hidden">
      <div className="relative container mx-auto px-6 max-w-[1200px]">

        {/* Middle Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-start py-12">
          <div className="pr-0 md:pr-12 h-full">
            <div className="font-display text-xl font-bold mb-4 tracking-tight">
              MUSA<span className="text-[#C9A84C] font-normal"> TRAVEL</span>
            </div>
            <p className="text-white/50 font-body text-[13px] leading-relaxed mb-8 max-w-[240px]">
              {t('footer.tagline')}
            </p>
            <div className="flex gap-3 mb-8">
              {socialLinks.map(({ Icon, name }) => (
                <button
                  key={name}
                  className="w-9 h-9 rounded-full border border-white/30 flex items-center justify-center transition-all hover:border-[#C9A84C] hover:text-[#C9A84C]"
                  aria-label={name}
                >
                  <Icon size={14} />
                </button>
              ))}
            </div>

            <div className="space-y-4">
              <h4 className="font-body font-bold text-[#C9A84C] mb-2 uppercase tracking-[0.25em] text-[10px]">{t('contact.tag')}</h4>
              <div className="flex flex-col gap-3">
                <a href="https://wa.me/966597100424" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-white/70 hover:text-[#C9A84C] transition-colors group">
                  <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center text-green-500 group-hover:scale-110 transition-transform">
                    <MessageCircle size={14} />
                  </div>
                  <span className="font-body text-[13px]">{t('contact.whatsapp1')}</span>
                </a>
                <a href="https://wa.me/966593760027" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-white/70 hover:text-[#C9A84C] transition-colors group">
                  <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center text-green-500 group-hover:scale-110 transition-transform">
                    <MessageCircle size={14} />
                  </div>
                  <span className="font-body text-[13px]">{t('contact.whatsapp2')}</span>
                </a>
                <a href="mailto:support@musatravel.com" className="flex items-center gap-3 text-white/70 hover:text-[#C9A84C] transition-colors group">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform">
                    <Mail size={14} />
                  </div>
                  <span className="font-body text-[13px]">support@musatravel.com</span>
                </a>
              </div>
            </div>
          </div>

          {/* Column 2: Links */}
          <div className="px-0 md:px-12 h-full">
            <div className="mb-10">
              <h4 className="font-body font-bold text-[#C9A84C] mb-6 uppercase tracking-[0.25em] text-[10px]">{t('footer.quickLinks')}</h4>
              <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                {[
                  { k: "nav.home", l: "Home" },
                  { k: "nav.destinations", l: "Destinations" },
                  { k: "nav.services", l: "Services" },
                  { k: "nav.packages", l: "Packages" },
                  { k: "nav.faq", l: "FAQ" }
                ].map((link) => (
                  <button
                    key={link.l}
                    onClick={() => {
                      const map: Record<string, string> = { Home: "hero", Destinations: "destinations", Services: "services", Packages: "packages", FAQ: "faq" };
                      document.getElementById(map[link.l])?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="text-white text-left font-body text-[13px] hover:text-[#C9A84C] transition-colors"
                  >
                    {t(link.k)}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-body font-bold text-[#C9A84C] mb-6 uppercase tracking-[0.25em] text-[10px]">{t('footer.legal')}</h4>
              <div className="flex flex-col gap-3">
                {[
                  { k: 'footer.privacy', l: "Privacy Policy" },
                  { k: 'footer.terms', l: "Terms of Service" }
                ].map((link) => (
                  <span key={link.l} className="text-white font-body text-[13px] cursor-pointer hover:text-[#C9A84C] transition-colors">
                    {t(link.k)}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Column 3: Newsletter */}
          <div className="pl-0 md:pl-12">
            <h4 className="font-body font-bold text-[#C9A84C] mb-6 uppercase tracking-[0.25em] text-[10px]">{t('footer.newsletter')}</h4>
            <p className="text-white/50 font-body text-[13px] leading-relaxed mb-6">
              {t('footer.newsletterDesc')}
            </p>
            <form onSubmit={handleNewsletter} className="relative flex items-center max-w-[280px]">
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('footer.emailPlaceholder')}
                className="w-full bg-[#1a1a2e] border border-white/10 rounded-full py-3.5 px-6 text-[13px] text-white placeholder:text-white/40 focus:outline-none focus:border-[#C9A84C] transition-colors pr-14"
              />
              <button
                type="submit"
                className="absolute right-1.5 w-10 h-10 bg-[#C9A84C] rounded-full flex items-center justify-center hover:opacity-90 transition-opacity"
              >
                <Send size={15} className="text-[#0D0D14]" />
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/35 font-body text-[12px]">
            {t('footer.copyright')}
          </p>
          <div className="flex gap-6">
            {[
              { k: 'footer.privacy', l: "Privacy" },
              { k: 'footer.terms', l: "Terms" }
            ].map((l) => (
              <span key={l.l} className="text-white/35 font-body text-[12px] hover:text-white cursor-pointer transition-colors">
                {t(l.k)}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
