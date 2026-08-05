"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { testimonialSchema, type TestimonialInput } from "@/features/testimonials/schemas/testimonial.schema";

interface TestimonialRow {
  id: string;
  name: string;
  content: string;
  rating: number;
  isVisible: boolean;
}

function TestimonialForm({ onSubmit }: { onSubmit: (data: TestimonialInput) => Promise<void> }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TestimonialInput>({
    resolver: zodResolver(testimonialSchema),
    defaultValues: { rating: 5, isVisible: true, order: 0 },
  });

  async function submit(data: TestimonialInput) {
    await onSubmit(data);
    reset();
  }

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-3">
      <input
        {...register("name")}
        placeholder="Customer name"
        className="w-full rounded border border-gold/20 bg-transparent px-3 py-2 text-white"
      />
      {errors.name && <p className="text-sm text-red-400">{errors.name.message}</p>}

      <textarea
        {...register("content")}
        rows={3}
        placeholder="Testimonial content"
        className="w-full rounded border border-gold/20 bg-transparent px-3 py-2 text-white"
      />
      {errors.content && <p className="text-sm text-red-400">{errors.content.message}</p>}

      <div className="flex items-center gap-4">
        <select
          {...register("rating", { valueAsNumber: true })}
          className="rounded border border-gold/20 bg-background px-3 py-2 text-white"
        >
          {[1, 2, 3, 4, 5].map((r) => (
            <option key={r} value={r}>
              {r} star{r > 1 ? "s" : ""}
            </option>
          ))}
        </select>
        <label className="flex items-center gap-2 text-sm text-secondary-text">
          <input type="checkbox" {...register("isVisible")} />
          Visible
        </label>
      </div>

      <button type="submit" disabled={isSubmitting} className="rounded bg-gold px-4 py-2 text-sm font-medium text-background disabled:opacity-50">
        {isSubmitting ? "Saving…" : "Add Testimonial"}
      </button>
    </form>
  );
}

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<TestimonialRow[]>([]);

  async function load() {
    const res = await fetch("/api/v1/admin/testimonials");
    const { data } = await res.json();
    setTestimonials(data ?? []);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleCreate(data: TestimonialInput) {
    await fetch("/api/v1/admin/testimonials", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    await load();
  }

  async function toggleVisibility(t: TestimonialRow) {
    await fetch(`/api/v1/admin/testimonials/${t.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...t, isVisible: !t.isVisible, order: 0 }),
    });
    await load();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this testimonial?")) return;
    await fetch(`/api/v1/admin/testimonials/${id}`, { method: "DELETE" });
    await load();
  }

  return (
    <div className="p-4 sm:p-8">
      <h1 className="mb-6 font-serif text-2xl text-white">Testimonials</h1>

      <div className="mb-8 max-w-lg rounded border border-gold/20 bg-card p-4 sm:p-6">
        <TestimonialForm onSubmit={handleCreate} />
      </div>

      <div className="space-y-3">
        {testimonials.map((t) => (
          <div key={t.id} className="flex flex-wrap items-center justify-between gap-3 rounded border border-gold/10 bg-card p-4">
            <div>
              <p className="text-white">{t.name} — {"★".repeat(t.rating)}</p>
              <p className="text-sm text-secondary-text">{t.content}</p>
            </div>
            <div className="flex gap-3 text-sm">
              <button onClick={() => toggleVisibility(t)} className="text-gold hover:underline">
                {t.isVisible ? "Hide" : "Show"}
              </button>
              <button onClick={() => handleDelete(t.id)} className="text-red-400 hover:underline">
                Delete
              </button>
            </div>
          </div>
        ))}
        {testimonials.length === 0 && <p className="text-secondary-text">No testimonials yet.</p>}
      </div>
    </div>
  );
}
