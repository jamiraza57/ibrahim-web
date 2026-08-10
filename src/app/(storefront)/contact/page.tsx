"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { MagneticButton } from "@/components/shared/MagneticButton";
import { siteConfig } from "@/config/site";

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
      <span className="eyebrow">Contact</span>
      <h1 className="mb-2 mt-2 font-display text-3xl sm:text-4xl">Get in Touch</h1>
      <p className="mb-2 text-secondary-text">
        Questions about an order, a custom piece, or anything else — we usually reply within a day.
      </p>
      <p className="mb-8 text-sm text-secondary-text">
        Email{" "}
        <a href={`mailto:${siteConfig.email}`} className="text-gold hover:underline">
          {siteConfig.email}
        </a>{" "}
        or message us on WhatsApp.
      </p>

      {status === "sent" ? (
        <p className="lux-card rounded-lg p-6 text-gold">
          Thanks — your message has been sent. We&apos;ll get back to you soon.
        </p>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm text-secondary-text">Name</label>
            <input {...register("name")} className="input-lux" />
            {errors.name && <p className="mt-1 text-sm text-destructive">{errors.name.message}</p>}
          </div>
          <div>
            <label className="mb-1 block text-sm text-secondary-text">Email</label>
            <input {...register("email")} className="input-lux" />
            {errors.email && <p className="mt-1 text-sm text-destructive">{errors.email.message}</p>}
          </div>
          <div>
            <label className="mb-1 block text-sm text-secondary-text">Message</label>
            <textarea {...register("message")} rows={5} className="input-lux" />
            {errors.message && <p className="mt-1 text-sm text-destructive">{errors.message.message}</p>}
          </div>

          {status === "error" && <p className="text-sm text-destructive">Something went wrong — please try again.</p>}

          <MagneticButton type="submit" disabled={status === "sending"}>
            {status === "sending" ? "Sending…" : "Send Message"}
          </MagneticButton>
        </form>
      )}
    </div>
  );
}
