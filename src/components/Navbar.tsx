import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const navLinks = ["Home", "Fleet", "Services", "Packages", "FAQ"];

const Navbar = () => {
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
            const idx = sectionIds.indexOf(entry.target.id);
            if (idx !== -1) setActiveSection(navLinks[idx]);
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
      className={`fixed top-0 left-0 right-0 z-50 transition-shadow duration-300 ${
        scrolled ? "shadow-lg" : ""
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

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            if (link === "Fleet") {
              return (
                <Link
                  key={link}
                  to="/fleet"
                  onClick={() => {
                    window.scrollTo({ top: 0, behavior: "instant" });
                    setMobileOpen(false);
                  }}
                  className={`text-sm font-body font-medium transition-colors ${
                    location.pathname === "/fleet" ? "text-gold" : "text-foreground hover:text-gold"
                  }`}
                >
                  {link}
                </Link>
              );
            }
            return (
              <Link
                key={link}
                to="/"
                onClick={() => handleNavClick(link)}
                className={`text-sm font-body font-medium transition-colors ${
                  activeSection === link ? "text-gold" : "text-foreground hover:text-gold"
                }`}
              >
                {link}
              </Link>
            );
          })}
        </div>

        <button
          onClick={() => {
            if (location.pathname !== "/") {
              window.location.href = "/#booking";
            } else {
              document.getElementById("booking")?.scrollIntoView({ behavior: "smooth" });
            }
          }}
          className="hidden md:block gradient-gold text-primary-foreground font-body font-semibold text-sm px-6 py-2.5 rounded-full transition-transform hover:scale-[1.03]"
        >
          Book a Ride
        </button>

        <button className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-card px-6 pb-4 space-y-3">
          {navLinks.map((link) => {
            const isFleet = link === "Fleet";
            return (
              <Link
                key={link}
                to={isFleet ? "/fleet" : "/"}
                onClick={() => {
                  if (isFleet) window.scrollTo({ top: 0, behavior: "instant" });
                  handleNavClick(link);
                }}
                className="block w-full text-left font-body text-sm py-2"
              >
                {link}
              </Link>
            );
          })}
          <button
            onClick={() => {
              setMobileOpen(false);
              if (location.pathname !== "/") {
                window.location.href = "/#booking";
              } else {
                document.getElementById("booking")?.scrollIntoView({ behavior: "smooth" });
              }
            }}
            className="gradient-gold text-primary-foreground font-body font-semibold text-sm px-6 py-2.5 rounded-full w-full"
          >
            Book a Ride
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
