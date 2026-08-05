import { AnnouncementBar } from "@/features/announcement-bar/components/AnnouncementBar";
import { Header } from "@/components/shared/Header";
import { Footer } from "@/components/shared/Footer";
import { LuxuryCursor } from "@/components/shared/LuxuryCursor";

export default function StorefrontLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <LuxuryCursor />
      <AnnouncementBar />
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}
