"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { categorySchema, type CategoryInput } from "../schemas/category.schema";

interface CategoryFormProps {
  defaultValues?: Partial<CategoryInput>;
  parentOptions: { id: string; name: string }[];
  onSubmit: (data: CategoryInput) => Promise<void>;
  submitLabel: string;
}

export function CategoryForm({ defaultValues, parentOptions, onSubmit, submitLabel }: CategoryFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CategoryInput>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      slug: "",
      order: 0,
      status: true,
      ...defaultValues,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="mb-1 block text-sm text-secondary-text">Name</label>
        <input
          {...register("name")}
          className="w-full rounded border border-gold/20 bg-transparent px-3 py-2 text-white"
        />
        {errors.name && <p className="mt-1 text-sm text-red-400">{errors.name.message}</p>}
      </div>

      <div>
        <label className="mb-1 block text-sm text-secondary-text">Slug</label>
        <input
          {...register("slug")}
          placeholder="rings"
          className="w-full rounded border border-gold/20 bg-transparent px-3 py-2 text-white"
        />
        {errors.slug && <p className="mt-1 text-sm text-red-400">{errors.slug.message}</p>}
      </div>

      <div>
        <label className="mb-1 block text-sm text-secondary-text">Description</label>
        <textarea
          {...register("description")}
          rows={3}
          className="w-full rounded border border-gold/20 bg-transparent px-3 py-2 text-white"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm text-secondary-text">Parent Category</label>
        <select
          {...register("parentId")}
          className="w-full rounded border border-gold/20 bg-background px-3 py-2 text-white"
        >
          <option value="">None (top level)</option>
          {parentOptions.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm text-secondary-text">Order</label>
          <input
            type="number"
            {...register("order", { valueAsNumber: true })}
            className="w-full rounded border border-gold/20 bg-transparent px-3 py-2 text-white"
          />
        </div>
        <div className="flex items-end gap-2 pb-2">
          <input type="checkbox" {...register("status")} id="status" />
          <label htmlFor="status" className="text-sm text-secondary-text">
            Active
          </label>
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm text-secondary-text">Meta Title</label>
        <input
          {...register("metaTitle")}
          className="w-full rounded border border-gold/20 bg-transparent px-3 py-2 text-white"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm text-secondary-text">Meta Description</label>
        <textarea
          {...register("metaDescription")}
          rows={2}
          className="w-full rounded border border-gold/20 bg-transparent px-3 py-2 text-white"
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded bg-gold px-6 py-2 font-medium text-background disabled:opacity-50"
      >
        {isSubmitting ? "Saving…" : submitLabel}
      </button>
    </form>
  );
}
