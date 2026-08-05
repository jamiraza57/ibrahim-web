"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { MagneticButton } from "@/components/shared/MagneticButton";

const contactFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Enter a valid email"),
  message: z.string().min(10, "Tell us a bit more (10 characters minimum)"),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

export default function ContactPage() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>({ resolver: zodResolver(contactFormSchema) });

  async function onSubmit(data: ContactFormValues) {
    setStatus("sending");
    const res = await fetch("/api/v1/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      setStatus("sent");
      reset();
    } else {
      setStatus("error");
    }
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-16 sm:px-6">
      <h1 className="mb-2 font-serif text-3xl text-white sm:text-4xl">Get in Touch</h1>
      <p className="mb-8 text-secondary-text">
        Questions about an order, a custom piece, or anything else — we usually reply within a day.
      </p>

      {status === "sent" ? (
        <p className="rounded border border-gold/20 bg-card p-6 text-gold">
          Thanks — your message has been sent. We&apos;ll get back to you soon.
        </p>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm text-secondary-text">Name</label>
            <input {...register("name")} className="w-full rounded border border-gold/20 bg-transparent px-3 py-2 text-white" />
            {errors.name && <p className="mt-1 text-sm text-red-400">{errors.name.message}</p>}
          </div>
          <div>
            <label className="mb-1 block text-sm text-secondary-text">Email</label>
            <input {...register("email")} className="w-full rounded border border-gold/20 bg-transparent px-3 py-2 text-white" />
            {errors.email && <p className="mt-1 text-sm text-red-400">{errors.email.message}</p>}
          </div>
          <div>
            <label className="mb-1 block text-sm text-secondary-text">Message</label>
            <textarea {...register("message")} rows={5} className="w-full rounded border border-gold/20 bg-transparent px-3 py-2 text-white" />
            {errors.message && <p className="mt-1 text-sm text-red-400">{errors.message.message}</p>}
          </div>

          {status === "error" && <p className="text-sm text-red-400">Something went wrong — please try again.</p>}

          <MagneticButton type="submit" disabled={status === "sending"}>
            {status === "sending" ? "Sending…" : "Send Message"}
          </MagneticButton>
        </form>
      )}
    </div>
  );
}
