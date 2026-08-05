import { notFound } from "next/navigation";

// Catches any /admin/* URL that doesn't match a real page so it renders
// this group's not-found.tsx (inside the sidebar shell) instead of the
// bare root not-found.tsx.
export default function AdminCatchAll(): never {
  notFound();
}
