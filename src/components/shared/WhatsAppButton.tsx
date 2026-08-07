import { siteConfig } from "@/config/site";

// Renders nothing until a real WhatsApp number is set in siteConfig — no
// fabricated contact channel ships by default.
export function WhatsAppButton() {
  if (!siteConfig.whatsappNumber) return null;

  const digits = siteConfig.whatsappNumber.replace(/[^\d]/g, "");

  return (
    <a
      href={`https://wa.me/${digits}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      data-cursor="hover"
      className="fixed bottom-5 right-5 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-gold text-gold-foreground shadow-lg transition-transform hover:scale-105"
    >
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6" aria-hidden="true">
        <path d="M12.04 2c-5.46 0-9.9 4.44-9.9 9.9 0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.9-4.44 9.9-9.9 0-2.64-1.03-5.12-2.9-6.99A9.82 9.82 0 0 0 12.04 2zm5.8 14.14c-.24.68-1.4 1.3-1.93 1.38-.5.08-1.12.11-1.81-.11-.42-.13-.95-.31-1.64-.6-2.88-1.24-4.76-4.13-4.9-4.32-.14-.19-1.17-1.56-1.17-2.98s.73-2.11 1-2.4c.26-.29.57-.36.76-.36l.55.01c.18.01.42-.07.65.5.24.58.81 2 .88 2.15.07.15.12.32.02.51-.1.19-.15.31-.29.48-.14.17-.3.37-.43.5-.14.14-.29.29-.13.57.17.29.75 1.24 1.61 2 1.11.99 2.04 1.3 2.33 1.44.29.14.46.12.63-.07.17-.19.72-.84.91-1.13.19-.29.38-.24.63-.14.26.1 1.65.78 1.93.92.29.14.48.22.55.34.07.13.07.72-.17 1.4z" />
      </svg>
    </a>
  );
}
