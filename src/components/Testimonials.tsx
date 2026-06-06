import { motion } from "framer-motion";

const testimonials = [
  {
    name: "Mohammed Maqsood",
    handle: "Admin, DIY Umrah UK",
    location: "United Kingdom 🇬🇧",
    initials: "MM",
    text: "From the moment I met Brother Afzal at Jeddah airport, I felt welcomed and well taken care of. The transport from Jeddah to Makkah was seamless, Makkah to Madinah went just as smoothly. By the end of my trip, I felt as if I had known them for years. Highly recommend Musa Transport for anyone needing reliable transport in the region!"
  },
  {
    name: "Talib Hussain",
    handle: "Verified Customer",
    location: "United Kingdom 🇬🇧",
    initials: "TH",
    text: "Muhammad Afzal drove our group of nine from Makkah to Madina via Badr. He was extremely knowledgeable, professional, and made the journey very comfortable. The vehicle was very spacious and easily accommodated all of us. We highly recommend him to anyone looking for reliable transport in Saudi Arabia."
  },
  {
    name: "Ab Mir",
    handle: "Verified Customer",
    location: "United Kingdom 🇬🇧",
    initials: "AM",
    text: "We were in Madinah stuck at hotel waiting for coach transfer over 7-8 hours. I messaged Brother Afzal and he himself picked me up and took me to Makkah. Was very responsive Alhamdulillah. Exceptional service when we needed it most!"
  },
  {
    name: "Suhel Namaji",
    handle: "Group Travel Organizer",
    location: "United Kingdom 🇬🇧",
    initials: "SN",
    text: "Last minute I messaged at 5am to arrange Ziyarat and Brother Muhammad Afzal replied promptly, picked us up at 8:30am. Not only did he have great knowledge of Makkah but delivered in English for the kids too. We take groups to Haramain regularly — I know good service and I was impressed!"
  },
  {
    name: "Sobia Yaser",
    handle: "Verified Customer",
    location: "United Kingdom 🇬🇧",
    initials: "SY",
    text: "Used the taxi services from Muhammad Afzal bhai to get from Jeddah to Makkah after reading reviews. Very highly recommended! The whole pickup from the airport to our hotel was very smooth. Afzal bhai also provided very useful information about sims, food, and Umrah related topics."
  },
  {
    name: "Nazaal Ahmed",
    handle: "Verified Customer",
    location: "United Kingdom 🇬🇧",
    initials: "NA",
    text: "We used MUSA LUXURY TRANSPORT with 9 seater vehicle. As soon as we landed Afzal bhai was there waiting for us — no waiting! He even helped us change local currency on the way to Makkah. Used him for Jeddah to Makkah, Makkah Ziyarat, Madina Ziyarat, and back to Jeddah. For every query he was there to respond. Highly recommend!"
  },
  {
    name: "Atika Mulla",
    handle: "Verified Customer",
    location: "United Kingdom 🇬🇧",
    initials: "AT",
    text: "The service we received was outstanding. Communication was very good along with prompt timekeeping. We used them for airport transport, Ziyarat, and to Madinah — we were not left disappointed. All our requests were met from this company. Highly recommended!"
  },
  {
    name: "Abz Hussain",
    handle: "Verified Customer",
    location: "United Kingdom 🇬🇧",
    initials: "AH",
    text: "Completed Makkah Ziyarats with Muhammad Afzal — what a guy! Very knowledgeable, available in both Urdu and English, and kept the little ones engaged throughout. Also used him for Jeddah to Makkah transfer. He came to meet us rather than us wandering in circles looking for him. Top guy. Can't recommend enough. Congratulations!"
  },
  {
    name: "Nazia Kayani",
    handle: "Verified Customer",
    location: "United Kingdom 🇬🇧",
    initials: "NK",
    text: "I want to give a massive shoutout to Muhammad Afzal bhai from Musa Travel for providing trouble-free transfer in Makkah. It's always reassuring having reliable contacts. We recommend Musa Travel and Insha'Allah will use their services again on our next visit to the Holy Cities."
  },
  {
    name: "Riyad Hussain",
    handle: "Verified Customer",
    location: "United Kingdom 🇬🇧",
    initials: "RH",
    text: "I went with 8 people, a mix of Pakistanis and Bengalis. Muhammad Afzal speaks Urdu fluently and has good English — explained everything so both older and younger people understood. Used him for all our needs: airport transfers arriving and departing, Ziyarats in Makkah and Madina, and the long drive to Medina and back. Outstanding!"
  }
];

const reveal = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
};

const Testimonials = () => {
  return (
    <section className="py-20 md:py-28 bg-surface-low">
      <div className="container mx-auto px-6">
        <motion.div
          variants={reveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center mb-10"
        >
          <span className="font-body font-medium text-xs uppercase tracking-[0.10em] text-gray-text">
            REVIEWS
          </span>
          <h2 className="font-display font-bold text-3xl md:text-4xl mt-3">
            Voices of the Voyage
          </h2>
          <p className="font-body text-gray-text mt-4 max-w-2xl mx-auto leading-relaxed">
            Experiences from pilgrims across the UK who trusted MUSA TRANSPORT for their sacred journey
          </p>
        </motion.div>



        <div className="marquee-wrapper">
          <div className="marquee-track hover:[animation-play-state:paused] cursor-pointer">
            {[...testimonials, ...testimonials].map((tm, i) => {
              const isOddCard = i % 2 === 0;

              return (
                <div
                  key={i}
                  className="testimonial-marquee-card relative flex flex-col hover:border-[rgba(212,168,83,0.2)]"
                  style={{
                    background: '#FFFFFF',
                    border: '1px solid #E5E7EB',
                    borderRadius: '16px',
                    padding: '24px'
                  }}
                >
                  {/* Verified Badge */}
                  <div
                    className="absolute top-6 right-6 font-body font-semibold"
                    style={{
                      background: 'rgba(212,168,83,0.10)',
                      border: '1px solid rgba(212,168,83,0.25)',
                      color: '#D4A853',
                      fontSize: '10px',
                      padding: '3px 10px',
                      borderRadius: '20px'
                    }}
                  >
                    ✓ Verified
                  </div>

                  <div className="flex items-center gap-3 mb-4 pr-[70px]">
                    <div
                      className="flex items-center justify-center shrink-0 font-body font-bold"
                      style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '50%',
                        fontSize: '16px',
                        border: '2px solid rgba(212,168,83,0.3)',
                        background: isOddCard ? '#D4A853' : '#1C1C1C',
                        color: isOddCard ? '#000000' : '#D4A853'
                      }}
                    >
                      {tm.initials}
                    </div>
                    <div className="flex flex-col overflow-hidden">
                      <div className="font-body font-semibold truncate" style={{ fontSize: '14px', color: '#111111' }}>
                        {tm.name}
                      </div>
                      <div className="font-body truncate" style={{ fontSize: '12px', color: '#6B7280' }}>
                        {tm.handle}
                      </div>
                      <div className="font-body flex items-center gap-1 mt-0.5 truncate" style={{ fontSize: '12px', color: '#6B7280' }}>
                        <span style={{ fontSize: '12px' }}>🇬🇧</span>
                        <span>United Kingdom</span>
                      </div>
                    </div>
                  </div>

                  <div
                    className="flex gap-[2px]"
                    style={{ fontSize: '14px', letterSpacing: '2px', color: '#FFD700', margin: '10px 0' }}
                  >
                    ★★★★★
                  </div>

                  <p
                    className="font-body"
                    style={{
                      fontSize: '13px',
                      color: '#4B5563',
                      lineHeight: '1.7',
                      display: '-webkit-box',
                      WebkitLineClamp: 5,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}
                  >
                    "{tm.text}"
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
