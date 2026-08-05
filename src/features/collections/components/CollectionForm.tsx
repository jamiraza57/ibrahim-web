"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { collectionSchema, type CollectionInput } from "../schemas/collection.schema";

interface CollectionFormProps {
  defaultValues?: Partial<CollectionInput>;
  onSubmit: (data: CollectionInput) => Promise<void>;
  submitLabel: string;
}

export function CollectionForm({ defaultValues, onSubmit, submitLabel }: CollectionFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CollectionInput>({
    resolver: zodResolver(collectionSchema),
    defaultValues: { name: "", slug: "", status: true, ...defaultValues },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="mb-1 block text-sm text-secondary-text">Name</label>
        <input
          {...register("name")}
          className="w-full rounded border border-gold/20 bg-transparent px-3 py-2 text-foreground"
        />
        {errors.name && <p className="mt-1 text-sm text-destructive">{errors.name.message}</p>}
      </div>

      <div>
        <label className="mb-1 block text-sm text-secondary-text">Slug</label>
        <input
          {...register("slug")}
          placeholder="new-arrivals"
          className="w-full rounded border border-gold/20 bg-transparent px-3 py-2 text-foreground"
        />
        {errors.slug && <p className="mt-1 text-sm text-destructive">{errors.slug.message}</p>}
      </div>

      <div>
        <label className="mb-1 block text-sm text-secondary-text">Description</label>
        <textarea
          {...register("description")}
          rows={3}
          className="w-full rounded border border-gold/20 bg-transparent px-3 py-2 text-foreground"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm text-secondary-text">Banner URL</label>
        <input
          {...register("bannerUrl")}
          placeholder="Uploaded via Media Library"
          className="w-full rounded border border-gold/20 bg-transparent px-3 py-2 text-foreground"
        />
      </div>

      <div className="flex items-center gap-2">
        <input type="checkbox" {...register("status")} id="status" />
        <label htmlFor="status" className="text-sm text-secondary-text">
          Active
        </label>
      </div>

      <div>
        <label className="mb-1 block text-sm text-secondary-text">Meta Title</label>
        <input
          {...register("metaTitle")}
          className="w-full rounded border border-gold/20 bg-transparent px-3 py-2 text-foreground"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm text-secondary-text">Meta Description</label>
        <textarea
          {...register("metaDescription")}
          rows={2}
          className="w-full rounded border border-gold/20 bg-transparent px-3 py-2 text-foreground"
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded bg-gold px-6 py-2 font-medium text-gold-foreground disabled:opacity-50"
      >
        {isSubmitting ? "Saving…" : submitLabel}
      </button>
    </form>
  );
}
