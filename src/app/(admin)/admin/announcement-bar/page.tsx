"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  announcementBarSchema,
  type AnnouncementBarInput,
} from "@/features/announcement-bar/schemas/announcement-bar.schema";

const TYPE_OPTIONS = ["SALE", "FLASH_SALE", "FREE_SHIPPING", "NEW_COLLECTION"] as const;

export default function AnnouncementBarAdminPage() {
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AnnouncementBarInput>({
    resolver: zodResolver(announcementBarSchema),
    defaultValues: {
      text: "",
      isActive: false,
      bgColor: "#D4AF37",
      textColor: "#050505",
      type: "SALE",
    },
  });

  useEffect(() => {
    fetch("/api/v1/announcement-bar")
      .then((res) => res.json())
      .then(({ data }) => {
        if (data) reset(data);
      });
  }, [reset]);

  async function onSubmit(data: AnnouncementBarInput) {
    setStatus("saving");
    const res = await fetch("/api/v1/announcement-bar", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    setStatus(res.ok ? "saved" : "error");
  }

  return (
    <div className="max-w-lg p-4 sm:p-8">
      <h1 className="mb-6 font-display text-2xl text-foreground">Announcement Bar</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm text-secondary-text">Text</label>
          <input
            {...register("text")}
            className="w-full rounded border border-gold/20 bg-transparent px-3 py-2 text-foreground"
            placeholder="Free shipping on all orders over $200"
          />
          {errors.text && <p className="mt-1 text-sm text-destructive">{errors.text.message}</p>}
        </div>

        <div className="flex items-center gap-2">
          <input type="checkbox" {...register("isActive")} id="isActive" />
          <label htmlFor="isActive" className="text-sm text-secondary-text">
            Active
          </label>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm text-secondary-text">Background</label>
            <input type="color" {...register("bgColor")} className="h-10 w-full" />
          </div>
          <div>
            <label className="mb-1 block text-sm text-secondary-text">Text Color</label>
            <input type="color" {...register("textColor")} className="h-10 w-full" />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm text-secondary-text">Type</label>
          <select
            {...register("type")}
            className="w-full rounded border border-gold/20 bg-background px-3 py-2 text-foreground"
          >
            {TYPE_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt.replace("_", " ")}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={status === "saving"}
          className="rounded bg-gold px-6 py-2 font-medium text-gold-foreground disabled:opacity-50"
        >
          {status === "saving" ? "Saving…" : "Save"}
        </button>

        {status === "saved" && <p className="text-sm text-green-400">Saved.</p>}
        {status === "error" && <p className="text-sm text-destructive">Something went wrong.</p>}
      </form>
    </div>
  );
}
