export const scrollToBookingSection = () => {
  const bookingSection = document.getElementById("booking");

  if (!bookingSection) return;

  bookingSection.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
};

export const scheduleBookingScroll = () => {
  if (typeof window.requestAnimationFrame === "function") {
    window.requestAnimationFrame(scrollToBookingSection);
    return;
  }

  window.setTimeout(scrollToBookingSection, 0);
};
