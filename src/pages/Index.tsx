import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import StatsBar from "@/components/StatsBar";
import WhyChooseUs from "@/components/WhyChooseUs";
import BookingProcess from "@/components/BookingProcess";
import Services from "@/components/Services";
import DestinationsMarquee from "@/components/DestinationsMarquee";
import FeaturedTrips from "@/components/FeaturedTrips";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import BookingForm from "@/components/BookingForm";
import FooterCTA from "@/components/FooterCTA";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <StatsBar />
      <WhyChooseUs />
      <BookingProcess />
      <Services />
      <DestinationsMarquee />
      <FeaturedTrips />
      <BookingForm />
      <Testimonials />
      <FAQ />
      <FooterCTA />
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Index;
