import Link from "next/link";

export default function RootNotFound() {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center text-foreground antialiased">
        <p className="font-display text-6xl text-gold sm:text-7xl">404</p>
        <h1 className="mt-4 font-display text-2xl sm:text-3xl">Page Not Found</h1>
        <p className="mt-2 max-w-sm text-secondary-text">
          The page you&apos;re looking for doesn&apos;t exist or may have moved.
        </p>
        <Link href="/" className="mt-8 rounded-full border border-gold/40 px-8 py-3 text-sm text-gold hover:bg-gold hover:text-gold-foreground">
          Back to Home
        </Link>
      </body>
    </html>
  );
}
