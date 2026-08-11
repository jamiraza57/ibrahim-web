"use client";

import { useState } from "react";

interface NewsletterFormProps {
  /** "hero" is the larger, centered treatment used on the homepage section;
   * "compact" (default) matches the existing Footer column layout. */
  variant?: "compact" | "hero";
  eyebrow?: string;
  heading?: string;
  description?: string;
}

export function NewsletterForm({
  variant = "compact",
  eyebrow = "Newsletter",
  heading = "Stay Updated",
  description,
}: NewsletterFormProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const isHero = variant === "hero";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    const res = await fetch("/api/v1/newsletter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    setStatus(res.ok ? "done" : "error");
    if (res.ok) setEmail("");
  }

  return (
    <div className={isHero ? "text-center" : undefined}>
      <span className="eyebrow">{eyebrow}</span>
      <h4 className={isHero ? "mt-3 font-display text-2xl sm:text-3xl" : "mb-3 mt-2 font-serif text-lg"}>
        {heading}
      </h4>
      {description && <p className="mx-auto mt-3 max-w-sm text-secondary-text">{description}</p>}
      {status === "done" ? (
        <p className={isHero ? "mt-6 text-sm text-gold" : "text-sm text-gold"}>Subscribed — welcome.</p>
      ) : (
        <form
          onSubmit={handleSubmit}
          className={isHero ? "mx-auto mt-6 flex max-w-sm gap-2" : "flex gap-2"}
        >
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email"
            className="w-full rounded-full border border-gold/20 bg-transparent px-4 py-2.5 text-sm text-foreground placeholder:text-secondary-text/60 focus:border-gold/50 focus:outline-none focus:ring-2 focus:ring-gold/30"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="whitespace-nowrap rounded-full bg-gold px-5 py-2.5 text-sm font-medium text-gold-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {status === "loading" ? "…" : "Join"}
          </button>
        </form>
      )}
      {status === "error" && <p className="mt-2 text-xs text-destructive">Something went wrong.</p>}
    </div>
  );
}
