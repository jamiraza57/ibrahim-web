"use client";

import Link from "next/link";
import { Suspense, useState } from "react";
import type { Route } from "next";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { customerLoginSchema, type CustomerLoginInput } from "@/features/auth/schemas/customer-auth.schema";
import { MagneticButton } from "@/components/shared/MagneticButton";

export default function AccountLoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CustomerLoginInput>({ resolver: zodResolver(customerLoginSchema) });

  async function onSubmit(data: CustomerLoginInput) {
    setServerError(null);
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();

      if (!res.ok) {
        setServerError(json.error ?? "Login failed");
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
        <h1 className="font-display text-2xl text-foreground">Sign In</h1>

        <div>
          <label className="mb-1 block text-sm text-secondary-text">Email</label>
          <input type="email" {...register("email")} className="input-lux" />
          {errors.email && <p className="mt-1 text-sm text-destructive">{errors.email.message}</p>}
        </div>

        <div>
          <label className="mb-1 block text-sm text-secondary-text">Password</label>
          <input type="password" {...register("password")} className="input-lux" />
          {errors.password && <p className="mt-1 text-sm text-destructive">{errors.password.message}</p>}
        </div>

        {serverError && <p className="text-sm text-destructive">{serverError}</p>}

        <MagneticButton type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? "Signing in…" : "Sign In"}
        </MagneticButton>

        <p className="text-center text-sm text-secondary-text">
          New here?{" "}
          <Link href="/account/register" className="text-gold hover:underline">
            Create an account
          </Link>
        </p>
      </form>
    </div>
  );
}
