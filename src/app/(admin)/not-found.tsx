import Link from "next/link";

export default function AdminNotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <p className="font-display text-6xl text-gold">404</p>
      <h1 className="mt-4 font-display text-2xl text-foreground">Page Not Found</h1>
      <p className="mt-2 max-w-sm text-secondary-text">
        This admin page doesn&apos;t exist or may have moved.
      </p>
      <Link
        href="/admin"
        className="mt-8 rounded-full border border-gold/40 px-8 py-3 text-sm text-gold transition-colors hover:bg-gold hover:text-gold-foreground"
      >
        Back to Dashboard
      </Link>
    </div>
  );
}
