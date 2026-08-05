import { notFound } from "next/navigation";

// Catches any URL that doesn't match a real storefront route so it renders
// this group's styled not-found.tsx (with Header/Footer) instead of falling
// all the way through to the bare root not-found.tsx.
export default function CatchAll(): never {
  notFound();
}
