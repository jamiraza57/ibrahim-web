"use client";

import { useState } from "react";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");

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
    <div>
      <span className="eyebrow">Newsletter</span>
      <h4 className="mb-3 mt-2 font-serif text-lg">Stay Updated</h4>
      {status === "done" ? (
        <p className="text-sm text-gold">Subscribed — welcome.</p>
      ) : (
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email"
            className="w-full rounded border border-gold/20 bg-transparent px-3 py-2 text-sm text-foreground placeholder:text-secondary-text/60 focus:border-gold/50 focus:outline-none focus:ring-2 focus:ring-gold/30"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="whitespace-nowrap rounded bg-gold px-4 py-2 text-sm font-medium text-gold-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {status === "loading" ? "…" : "Join"}
          </button>
        </form>
      )}
      {status === "error" && <p className="mt-2 text-xs text-destructive">Something went wrong.</p>}
    </div>
  );
}
