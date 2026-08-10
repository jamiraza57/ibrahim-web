"use client";

import Link from "next/link";
import { Suspense, useState } from "react";
import type { Route } from "next";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { customerSignupSchema, type CustomerSignupInput } from "@/features/auth/schemas/customer-auth.schema";
import { MagneticButton } from "@/components/shared/MagneticButton";

export default function RegisterPage() {
  return (
    <Suspense>
      <RegisterForm />
    </Suspense>
  );
}

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CustomerSignupInput>({ resolver: zodResolver(customerSignupSchema) });

  async function onSubmit(data: CustomerSignupInput) {
    setServerError(null);
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/v1/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();

      if (!res.ok) {
        setServerError(json.error ?? "Sign up failed");
        return;
      }

      const redirectTo = searchParams.get("from") ?? "/account";
      router.push(redirectTo as Route);
      router.refresh();
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-sm items-center px-4 py-16 sm:px-6">
      <form onSubmit={handleSubmit(onSubmit)} className="lux-card w-full space-y-4 rounded-lg p-8">
        <span className="eyebrow">Ibrahim Jewels</span>
        <h1 className="font-display text-2xl text-foreground">Create Account</h1>

        <div>
          <label className="mb-1 block text-sm text-secondary-text">Full Name</label>
          <input {...register("name")} className="input-lux" />
          {errors.name && <p className="mt-1 text-sm text-destructive">{errors.name.message}</p>}
        </div>

        <div>
          <label className="mb-1 block text-sm text-secondary-text">Email</label>
          <input type="email" {...register("email")} className="input-lux" />
          {errors.email && <p className="mt-1 text-sm text-destructive">{errors.email.message}</p>}
        </div>

        <div>
          <label className="mb-1 block text-sm text-secondary-text">Phone</label>
          <input {...register("phone")} className="input-lux" />
          {errors.phone && <p className="mt-1 text-sm text-destructive">{errors.phone.message}</p>}
        </div>

        <div>
          <label className="mb-1 block text-sm text-secondary-text">Password</label>
          <input type="password" {...register("password")} className="input-lux" />
          {errors.password && <p className="mt-1 text-sm text-destructive">{errors.password.message}</p>}
        </div>

        {serverError && <p className="text-sm text-destructive">{serverError}</p>}

        <MagneticButton type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? "Creating account…" : "Create Account"}
        </MagneticButton>

        <p className="text-center text-sm text-secondary-text">
          Already have an account?{" "}
          <Link href="/account/login" className="text-gold hover:underline">
            Sign in
          </Link>
        </p>
      </form>
    </div>
  );
}
