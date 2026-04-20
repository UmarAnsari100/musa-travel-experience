import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { LanguageSwitcher } from "./ui/LanguageSwitcher";

const navLinks = [
  { key: "nav.home", name: "Home" },
  { key: "nav.services", name: "Services" },
  { key: "nav.packages", name: "Packages" },
  { key: "nav.faq", name: "FAQ" }
];

const Navbar = () => {
  const { t } = useTranslation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("Home");
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (location.pathname !== "/") {
      setActiveSection("");
      return;
    }

    const sectionIds = ["hero", "fleet", "services", "packages", "faq"];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            const map: Record<string, string> = { hero: "Home", fleet: "Fleet", services: "Services", packages: "Packages", faq: "FAQ" };
            setActiveSection(map[id] || "");
          }
        });
      },
      { threshold: 0.3 }
    );
    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [location.pathname]);

  const handleNavClick = (link: string) => {
    setMobileOpen(false);
    if (link === "Fleet") return; // Handled by Link component

    if (location.pathname !== "/") {
      // If not on home page, Home link takes back to /
      return;
    }

    const map: Record<string, string> = {
      Home: "hero",
      Services: "services",
      Packages: "packages",
      FAQ: "faq",
    };
    const el = document.getElementById(map[link]);
    el?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-shadow duration-300 ${scrolled ? "shadow-lg" : ""
        }`}
      style={{
        backdropFilter: "blur(20px)",
        backgroundColor: "rgba(250, 250, 248, 0.85)",
      }}
    >
      <div className="container mx-auto flex items-center justify-between py-4 px-6">
        <Link to="/" className="font-display text-xl font-bold tracking-tight">
          MUSA<span className="text-gold font-normal">TRAVEL</span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.slice(0, 1).map((link) => (
            <Link
              key={link.name}
              to="/"
              onClick={() => handleNavClick(link.name)}
              className={`text-sm font-body font-medium transition-colors ${activeSection === link.name ? "text-gold" : "text-foreground hover:text-gold"
                }`}
            >
              {t(link.key)}
            </Link>
          ))}
          <Link
            to="/fleet"
            onClick={() => {
              window.scrollTo({ top: 0, behavior: "instant" });
              setMobileOpen(false);
            }}
            className={`text-sm font-body font-medium transition-colors ${location.pathname === "/fleet" ? "text-gold" : "text-foreground hover:text-gold"
              }`}
          >
            {t('nav.fleet', 'Fleet')}
          </Link>
          {navLinks.slice(1).map((link) => (
            <Link
              key={link.name}
              to="/"
              onClick={() => handleNavClick(link.name)}
              className={`text-sm font-body font-medium transition-colors ${activeSection === link.name ? "text-gold" : "text-foreground hover:text-gold"
                }`}
            >
              {t(link.key)}
            </Link>
          ))}
        </div>

        {/* NAVBAR RIGHT AREA (Logic for Desktop/Mobile) */}
        <div className="flex items-center gap-2 md:gap-4">
          
          {/* Always Visible Switcher */}
          <LanguageSwitcher />

          {/* Book a Ride — desktop only */}
          <button
            onClick={() => {
              if (location.pathname !== "/") {
                window.location.href = "/#booking";
              } else {
                document.getElementById("booking")?.scrollIntoView({ behavior: "smooth" });
              }
            }}
            className="hidden md:flex gradient-gold text-primary-foreground font-body font-semibold text-sm px-6 py-2.5 rounded-full transition-transform hover:scale-[1.03]"
          >
            {t('nav.bookRide')}
          </button>

          {/* Hamburger Bar — mobile only */}
          <button 
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex md:hidden items-center justify-center w-[36px] h-[36px] rounded-[10px] bg-[rgba(212,168,83,0.08)] border border-[rgba(212,168,83,0.20)] text-gold transition-all hover:bg-[rgba(212,168,83,0.15)] hover:border-[rgba(212,168,83,0.40)]"
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        {/* Mobile Drawer */}
        {mobileOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-card px-6 pb-6 shadow-xl border-t border-border flex flex-col gap-4 animate-in fade-in slide-in-from-top-2">
            <div className="pt-4 space-y-1">
              {navLinks.slice(0, 1).map((link) => (
                <Link
                  key={link.name}
                  to="/"
                  onClick={() => handleNavClick(link.name)}
                  className="block w-full text-left font-body text-sm py-3 border-b border-border/50 text-foreground/80"
                >
                  {t(link.key)}
                </Link>
              ))}
              <Link
                to="/fleet"
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: "instant" });
                  setMobileOpen(false);
                }}
                className="block w-full text-left font-body text-sm py-3 border-b border-border/50 text-foreground/80"
              >
                {t('nav.fleet', 'Fleet')}
              </Link>
              {navLinks.slice(1).map((link) => (
                <Link
                  key={link.name}
                  to="/"
                  onClick={() => handleNavClick(link.name)}
                  className="block w-full text-left font-body text-sm py-3 border-b border-border/50 text-foreground/80"
                >
                  {t(link.key)}
                </Link>
              ))}
            </div>
            
            <button
              onClick={() => {
                setMobileOpen(false);
                if (location.pathname !== "/") {
                  window.location.href = "/#booking";
                } else {
                  document.getElementById("booking")?.scrollIntoView({ behavior: "smooth" });
                }
              }}
              className="gradient-gold text-primary-foreground font-body font-semibold text-sm px-6 py-3 rounded-full w-full shadow-lg"
            >
              {t('nav.bookRide')}
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
