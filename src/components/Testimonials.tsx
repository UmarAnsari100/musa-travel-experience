import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const reviews = [
  {
    id: 1,
    initials: "MM",
    name: "Mohammed Maqsood",
    handle: "Admin, DIY Umrah UK",
    location: "United Kingdom",
    stars: 5,
    avatarBg: "#D4A853",
    avatarColor: "#000000",
    previewText: "From the moment I met Brother Afzal at Jeddah airport, I felt welcomed and well taken care of...",
    fullText: "From the moment I met Brother Afzal at Jeddah airport, I felt welcomed and well taken care of. The communication was excellent throughout the entire process, making it easy to coordinate my rides. The transport from Jeddah to Makkah was seamless, with a comfortable vehicle that made the journey enjoyable. The transfer from Makkah to Madinah went just as smoothly, and I appreciated the punctuality and professionalism shown by Brother Afzal and his team. Finally, the ride from my hotel in Madinah to the airport was equally impressive. What stood out the most was their willingness to go above and beyond. By the end of my trip, I felt as if I had known them for years, thanks to their warm demeanor and genuine hospitality. I highly recommend Musa Transport for anyone needing reliable transport in the region!"
  },
  {
    id: 2,
    initials: "TH",
    name: "Talib Hussain",
    handle: "Verified Customer",
    location: "United Kingdom",
    stars: 5,
    avatarBg: "#1C1C1C",
    avatarColor: "#D4A853",
    previewText: "Muhammad Afzal drove our group of nine from Makkah to Madina via Badr. Extremely knowledgeable and professional...",
    fullText: "We had an excellent experience with Muhammad Afzal from Musa Transport, who drove our group of nine from Makkah to Madina via Badr. He was extremely knowledgeable, professional, and made the journey very comfortable. The vehicle was very spacious and easily accommodated all of us with plenty of room. We highly recommend him to anyone looking for reliable transport in Saudi Arabia."
  },
  {
    id: 3,
    initials: "AM",
    name: "Ab Mir",
    handle: "Verified Customer",
    location: "United Kingdom",
    stars: 5,
    avatarBg: "#D4A853",
    avatarColor: "#000000",
    previewText: "We were stuck at hotel waiting for coach transfer over 7-8 hours. I messaged Brother Afzal and he himself picked me up...",
    fullText: "We were in Madinah stuck at hotel waiting for coach transfer over 7 to 8 hours. I then messaged Brother Afzal and he himself picked me up and took me to Makkah. Was very responsive Alhamdulillah. Exceptional service when we needed it most. Cannot thank him enough for going out of his way to help us."
  },
  {
    id: 4,
    initials: "SN",
    name: "Suhel Namaji",
    handle: "Group Travel Organizer",
    location: "United Kingdom",
    stars: 5,
    avatarBg: "#1C1C1C",
    avatarColor: "#D4A853",
    previewText: "Last minute I messaged at 5am to arrange Ziyarat and Brother Muhammad Afzal replied promptly, picked us up at 8:30am...",
    fullText: "Last minute plans — I messaged at 5am to see if Ziyarat could be arranged. Brother Muhammad Afzal replied promptly and arranged to pick us up at 8:30am. I asked if we could shorten the Ziyarat to 3 hours to ensure we reached back to the Haram without missing Salaah. Alhamdulillah this was accomplished. Not only did he have great knowledge of Makkah but also delivered in English for the kids. We take groups to Haramain so we are well aware of what is good service. I wanted to try something new and was very impressed!"
  },
  {
    id: 5,
    initials: "SY",
    name: "Sobia Yaser",
    handle: "Verified Customer",
    location: "United Kingdom",
    stars: 5,
    avatarBg: "#D4A853",
    avatarColor: "#000000",
    previewText: "Used the taxi services from Muhammad Afzal bhai after reading reviews. Very highly recommended! Airport to hotel was very smooth...",
    fullText: "We used the taxi services from Muhammad Afzal bhai to get from Jeddah to Makkah after reading reviews from the group. Very highly recommended. The whole pickup from the airport to our hotel was very smooth and Afzal bhai also provided very useful information for anything ranging from getting sims to food to Umrah related topics. A truly helpful and knowledgeable person."
  },
  {
    id: 6,
    initials: "NA",
    name: "Nazaal Ahmed",
    handle: "Verified Customer",
    location: "United Kingdom",
    stars: 5,
    avatarBg: "#1C1C1C",
    avatarColor: "#D4A853",
    previewText: "As soon as we landed Afzal bhai was there waiting for us — no waiting! He even helped change local currency on the way...",
    fullText: "We used MUSA LUXURY TRANSPORT with 9 seater vehicle. We paid prices as mentioned. I will highly recommend Afzal bhai. He was very supportive, punctual and helpful. We booked Jeddah to Makkah, Makkah Ziyarat, Madina Ziyarat and back to Jeddah. As soon as we landed Afzal bhai was there waiting for us — no waiting! He even helped us change local currency on the way to Makkah as there was a long line at the airport. For every query he was there to respond. Thank you for your outstanding services!"
  },
  {
    id: 7,
    initials: "AT",
    name: "Atika Mulla",
    handle: "Verified Customer",
    location: "United Kingdom",
    stars: 5,
    avatarBg: "#D4A853",
    avatarColor: "#000000",
    previewText: "The service we received was outstanding. Communication was very good along with prompt timekeeping throughout the trip...",
    fullText: "Upon recommendations from this group we used Musa Transport Services for our recent trip. The service we received was outstanding. Communication was very good along with prompt timekeeping. We used them for transport for airport and Ziyarat and to Madinah and we were not left disappointed. All our requests were met from this company. Highly recommended to everyone planning their Umrah journey!"
  },
  {
    id: 8,
    initials: "AH",
    name: "Abz Hussain",
    handle: "Verified Customer",
    location: "United Kingdom",
    stars: 5,
    avatarBg: "#1C1C1C",
    avatarColor: "#D4A853",
    previewText: "Completed Makkah Ziyarats with Muhammad Afzal — what a guy! Very knowledgeable, available in Urdu and English...",
    fullText: "Completed Makkah Ziyarats with Musa Transport and the absolutely brilliant Muhammad Afzal. What a guy — gets my vote of approval many times over. Very knowledgeable on the Ziyarats, available in both Urdu and English, and kept the little ones engaged by asking questions and pointing out things of interest. Brilliant and humble guy. Also used Muhammad Afzal for the trip from Jeddah to Makkah hotel. He was there, ready, and came to meet us rather than us wandering around looking for him. Top guy. Congratulations!"
  },
  {
    id: 9,
    initials: "NK",
    name: "Nazia Kayani",
    handle: "Verified Customer",
    location: "United Kingdom",
    stars: 5,
    avatarBg: "#D4A853",
    avatarColor: "#000000",
    previewText: "I want to give a massive shoutout to Muhammad Afzal from Musa Travel for providing trouble-free transfer in Makkah...",
    fullText: "We had a couple of hiccups along the way with transfers but with guidance available we were quickly able to find alternatives. I want to give a massive shoutout to Muhammad Afzal bhai from Musa Travel for providing trouble-free transfer in Makkah. It is always reassuring having reliable contacts. We recommend Musa Travel and Insha'Allah will use their services again on our next blessed visit to the Holy Cities."
  },
  {
    id: 10,
    initials: "RH",
    name: "Riyad Hussain",
    handle: "Verified Customer",
    location: "United Kingdom",
    stars: 5,
    avatarBg: "#1C1C1C",
    avatarColor: "#D4A853",
    previewText: "I went with 8 people, mix of Pakistanis and Bengalis. Muhammad Afzal speaks Urdu fluently and has excellent English...",
    fullText: "I went with 8 people and we were a mix of Pakistanis and Bengalis. I mention this because Muhammad Afzal speaks Urdu fluently and also has good English, explaining everything so both older and younger people understood everything clearly. We used him for all our transportation needs: both airport transfers arriving and departing, Ziyarats in both Makkah and Madina, as well as the long drive to Medina and back to Makkah. Outstanding service from start to finish. Would highly recommend to anyone!"
  },
];

const reveal = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
};

const Testimonials = () => {
  const [selectedReview, setSelectedReview] = useState<typeof reviews[0] | null>(null);

  const closeModal = () => setSelectedReview(null);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal();
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, []);

  return (
    <section className="py-20 md:py-28 bg-surface-low relative">
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
          <div className="marquee-track hover:[animation-play-state:paused]">
            {[...reviews, ...reviews].map((review, i) => (
              <div
                key={i}
                onClick={() => setSelectedReview(review)}
                className="testimonial-marquee-card cursor-pointer relative flex flex-col hover:border-[rgba(212,168,83,0.2)] group"
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
                      background: review.avatarBg,
                      color: review.avatarColor
                    }}
                  >
                    {review.initials}
                  </div>
                  <div className="flex flex-col overflow-hidden">
                    <div className="font-body font-semibold truncate" style={{ fontSize: '14px', color: '#111111' }}>
                      {review.name}
                    </div>
                    <div className="font-body truncate" style={{ fontSize: '12px', color: '#6B7280' }}>
                      {review.handle}
                    </div>
                    <div className="font-body flex items-center gap-1 mt-0.5 truncate" style={{ fontSize: '12px', color: '#6B7280' }}>
                      <span style={{ fontSize: '12px' }}>🇬🇧</span>
                      <span>{review.location}</span>
                    </div>
                  </div>
                </div>

                <div
                  className="flex gap-[2px]"
                  style={{ fontSize: '14px', letterSpacing: '2px', color: '#FFD700', margin: '10px 0' }}
                >
                  ★★★★★
                </div>

                <p className="font-body text-[13px] text-[#4B5563] leading-[1.65] overflow-hidden display-[-webkit-box] [-webkit-line-clamp:3] [-webkit-box-orient:vertical]">
                  {review.previewText}
                </p>

                <button className="mt-3 text-[12px] font-semibold text-[#D4A853] hover:text-[#B8902A] flex items-center gap-1 transition-colors w-fit group-hover:text-[#B8902A]">
                  Read Full Review
                  <span className="group-hover:translate-x-1 transition-transform duration-200 inline-block">
                    →
                  </span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedReview && (
          <>
            {/* BACKDROP */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={closeModal}
              className="fixed inset-0 z-[998] bg-black/75 backdrop-blur-sm"
            />

            {/* MODAL */}
            <motion.div
              initial={{ 
                opacity: 0, 
                scale: 0.92,
                y: 20
              }}
              animate={{ 
                opacity: 1, 
                scale: 1,
                y: 0
              }}
              exit={{ 
                opacity: 0, 
                scale: 0.92,
                y: 20
              }}
              transition={{ 
                duration: 0.3,
                ease: [0.25, 0.46, 0.45, 0.94]
              }}
              className="fixed inset-0 z-[999] flex items-center justify-center p-4 md:p-8 pointer-events-none"
            >
              <div className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-[20px] md:rounded-2xl w-full max-w-[95vw] md:max-w-lg max-h-[85vh] md:max-h-[90vh] overflow-y-auto pointer-events-auto relative shadow-[0_24px_80px_rgba(0,0,0,0.15)]">
                {/* GOLD TOP BORDER */}
                <div className="h-[3px] w-full bg-gradient-to-r from-transparent via-[#D4A853] to-transparent rounded-t-2xl" />

                {/* MODAL CONTENT */}
                <div className="p-5 md:p-8">
                  {/* CLOSE BUTTON */}
                  <button
                    onClick={closeModal}
                    className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#F3F4F6] border border-[#E5E7EB] flex items-center justify-center text-[#6B7280] hover:bg-[#D4A853] hover:text-white hover:border-[#D4A853] transition-all duration-200 text-lg font-light"
                  >
                    ✕
                  </button>

                  {/* REVIEWER INFO */}
                  <div className="flex items-center gap-4 mb-6 pr-8">
                    {/* AVATAR */}
                    <div 
                      className="w-[52px] h-[52px] md:w-16 md:h-16 rounded-full flex items-center justify-center flex-shrink-0 text-lg md:text-xl font-bold border-2 border-[rgba(212,168,83,0.4)]"
                      style={{
                        background: selectedReview.avatarBg,
                        color: selectedReview.avatarColor
                      }}
                    >
                      {selectedReview.initials}
                    </div>

                    {/* NAME & DETAILS */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-[16px] md:text-[18px] font-bold text-[#111111] font-display">
                          {selectedReview.name}
                        </h3>
                        {/* VERIFIED BADGE */}
                        <span className="text-[10px] font-bold text-[#D4A853] bg-[rgba(212,168,83,0.10)] border border-[rgba(212,168,83,0.25)] px-2.5 py-0.5 rounded-full">
                          ✓ Verified
                        </span>
                      </div>
                      
                      <p className="text-[12px] md:text-[13px] text-[#6B7280] mt-0.5">
                        {selectedReview.handle}
                      </p>

                      {/* STARS + LOCATION ROW */}
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-[#FFD700] text-[12px] md:text-[14px] tracking-[2px]">
                          ★★★★★
                        </span>
                        <span className="text-[11px] md:text-[12px] text-[#6B7280] flex items-center gap-1">
                          🇬🇧 {selectedReview.location}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* GOLD DIVIDER */}
                  <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-[rgba(212,168,83,0.3)] to-transparent mb-6" />

                  {/* LARGE QUOTE MARK */}
                  <div className="text-[60px] md:text-[80px] leading-none text-[rgba(212,168,83,0.15)] font-display font-bold mb-[-16px] md:mb-[-20px] mt-[-12px] md:mt-[-16px] select-none">
                    "
                  </div>

                  {/* FULL REVIEW TEXT */}
                  <p className="text-[14px] md:text-[15px] text-[#4B5563] leading-[1.7] md:leading-[1.85] mb-6">
                    {selectedReview.fullText}
                  </p>

                  {/* CLOSING QUOTE */}
                  <div className="text-[60px] md:text-[80px] leading-none text-[rgba(212,168,83,0.15)] font-display font-bold text-right mt-[-24px] md:mt-[-32px] mb-4 select-none">
                    "
                  </div>

                  {/* GOLD DIVIDER */}
                  <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-[rgba(212,168,83,0.3)] to-transparent mb-6" />

                  {/* BOTTOM ACTION BUTTONS */}
                  <div className="flex gap-3 flex-col sm:flex-row">
                    {/* WHATSAPP BOOK */}
                    <a
                      href="https://wa.me/966593760027"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20BA5A] text-white font-semibold text-[14px] py-3 px-6 rounded-full transition-all duration-200 hover:scale-[1.02]"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                        <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.112 1.523 5.836L.057 23.886a.5.5 0 00.611.61l6.218-1.637A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.9a9.9 9.9 0 01-5.031-1.371l-.36-.214-3.733.982.998-3.648-.235-.374A9.9 9.9 0 012.1 12C2.1 6.533 6.533 2.1 12 2.1c5.467 0 9.9 4.433 9.9 9.9 0 5.467-4.433 9.9-9.9 9.9z"/>
                      </svg>
                      Book via WhatsApp
                    </a>

                    {/* CLOSE BUTTON */}
                    <button
                      onClick={closeModal}
                      className="flex-1 sm:flex-none sm:px-8 border border-[#E5E7EB] text-[#4B5563] hover:border-[#111111] hover:text-[#111111] font-medium text-[14px] py-3 px-6 rounded-full transition-all duration-200"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Testimonials;
