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
      <h4 className="mb-3 font-serif text-lg text-white">Stay Updated</h4>
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
            className="w-full rounded border border-gold/20 bg-transparent px-3 py-2 text-sm text-white"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="whitespace-nowrap rounded bg-gold px-4 py-2 text-sm font-medium text-background disabled:opacity-50"
          >
            {status === "loading" ? "…" : "Join"}
          </button>
        </form>
      )}
      {status === "error" && <p className="mt-2 text-xs text-red-400">Something went wrong.</p>}
    </div>
  );
}
