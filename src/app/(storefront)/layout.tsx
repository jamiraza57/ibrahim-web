import { AnnouncementBar } from "@/features/announcement-bar/components/AnnouncementBar";
import { Header } from "@/components/shared/Header";
import { Footer } from "@/components/shared/Footer";
import { LuxuryCursor } from "@/components/shared/LuxuryCursor";
import { WhatsAppButton } from "@/components/shared/WhatsAppButton";
import { FixedHeaderStack } from "@/components/shared/FixedHeaderStack";

export default function StorefrontLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <LuxuryCursor />
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:border focus:border-gold focus:bg-background focus:px-6 focus:py-3 focus:text-sm focus:tracking-wide focus:text-gold"
      >
        Skip to content
      </a>
      <FixedHeaderStack>
        <AnnouncementBar />
        <Header />
      </FixedHeaderStack>
      <main id="main-content" className="pt-[var(--header-offset,88px)]">
        {children}
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
