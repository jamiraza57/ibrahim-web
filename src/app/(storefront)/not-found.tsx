import Link from "next/link";
import { MagneticButton } from "@/components/shared/MagneticButton";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <p className="font-serif text-6xl text-gold sm:text-7xl">404</p>
      <h1 className="mt-4 font-serif text-2xl text-white sm:text-3xl">Page Not Found</h1>
      <p className="mt-2 max-w-sm text-secondary-text">
        The page you&apos;re looking for doesn&apos;t exist or may have moved.
      </p>
      <Link href="/" className="mt-8">
        <MagneticButton>Back to Home</MagneticButton>
      </Link>
    </div>
  );
}
