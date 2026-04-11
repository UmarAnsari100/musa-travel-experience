const WhatsAppButton = () => {
  const number = import.meta.env.VITE_WHATSAPP_NUMBER || "923001234567";
  const msg = encodeURIComponent("Hi! I'm interested in MUSA TRAVEL services.");

  return (
    <a
      href={`https://wa.me/${number}?text=${msg}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-110"
      style={{ backgroundColor: "#25D366" }}
      aria-label="Chat on WhatsApp"
    >
      <svg viewBox="0 0 32 32" width="28" height="28" fill="white">
        <path d="M16.004 0h-.008C7.174 0 0 7.176 0 16.004c0 3.5 1.132 6.744 3.058 9.374L1.058 31.14l5.964-1.966A15.92 15.92 0 0016.004 32C24.826 32 32 24.826 32 16.004 32 7.176 24.826 0 16.004 0zm9.31 22.606c-.39 1.1-1.932 2.012-3.164 2.278-.846.18-1.95.322-5.668-1.218-4.762-1.97-7.826-6.81-8.064-7.124-.228-.314-1.918-2.556-1.918-4.876s1.214-3.458 1.644-3.932c.39-.428 1.032-.642 1.646-.642.198 0 .376.01.536.018.43.018.644.042.928.716.356.84 1.222 2.978 1.33 3.194.11.216.216.502.072.802-.134.304-.25.44-.466.69-.216.25-.424.442-.64.712-.198.234-.42.486-.178.928.242.44 1.078 1.778 2.314 2.882 1.59 1.418 2.93 1.858 3.346 2.064.416.206.66.172.902-.104.25-.286 1.07-1.244 1.354-1.674.278-.428.562-.358.948-.214.39.144 2.472 1.166 2.896 1.378.424.216.706.32.81.498.1.178.1 1.038-.29 2.138z" />
      </svg>
    </a>
  );
};

export default WhatsAppButton;
