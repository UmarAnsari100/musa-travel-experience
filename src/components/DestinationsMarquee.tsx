const destinations = ["Kardu", "Lahore", "Gwadar", "Naran", "Peshawar", "Islamabad", "Swat"];

const DestinationsMarquee = () => (
  <section id="destinations" className="py-12 overflow-hidden bg-foreground">
    <div className="animate-marquee flex whitespace-nowrap">
      {[...destinations, ...destinations].map((d, i) => (
        <span
          key={i}
          className="inline-block font-display font-bold text-2xl md:text-4xl text-primary-foreground/90 mx-8"
        >
          {d}
          <span className="text-gold ml-8">·</span>
        </span>
      ))}
    </div>
  </section>
);

export default DestinationsMarquee;
