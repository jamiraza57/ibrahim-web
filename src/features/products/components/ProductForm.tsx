"use client";

import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { productSchema, type ProductInput } from "../schemas/product.schema";
import { ImageUploader } from "@/components/shared/ImageUploader";

interface Option {
  id: string;
  name: string;
}

interface ProductFormProps {
  defaultValues?: Partial<ProductInput>;
  onSubmit: (data: ProductInput) => Promise<void>;
  submitLabel: string;
}

const STATUS_OPTIONS = ["DRAFT", "PUBLISHED", "SCHEDULED", "HIDDEN"] as const;
const FLAG_FIELDS = [
  ["isFeatured", "Featured"],
  ["isNewArrival", "New Arrival"],
  ["isBestSeller", "Best Seller"],
  ["isTrending", "Trending"],
  ["isOnSale", "On Sale"],
] as const;

export function ProductForm({ defaultValues, onSubmit, submitLabel }: ProductFormProps) {
  const [categories, setCategories] = useState<Option[]>([]);
  const [collections, setCollections] = useState<Option[]>([]);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ProductInput>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      status: "DRAFT",
      stock: 0,
      categoryIds: [],
      collectionIds: [],
      images: [],
      ...defaultValues,
    },
  });

  const { fields: imageFields, append: appendImage, remove: removeImage } = useFieldArray({
    control,
    name: "images",
  });

  const selectedCategoryIds = watch("categoryIds") ?? [];
  const selectedCollectionIds = watch("collectionIds") ?? [];

  useEffect(() => {
    Promise.all([
      fetch("/api/v1/admin/categories").then((r) => r.json()),
      fetch("/api/v1/admin/collections").then((r) => r.json()),
    ]).then(([catRes, colRes]) => {
      setCategories(catRes.data ?? []);
      setCollections(colRes.data ?? []);
    });
  }, []);

  function toggleId(field: "categoryIds" | "collectionIds", id: string) {
    const current = field === "categoryIds" ? selectedCategoryIds : selectedCollectionIds;
    const next = current.includes(id) ? current.filter((x) => x !== id) : [...current, id];
    setValue(field, next);
  }

  async function submit(data: ProductInput) {
    setServerError(null);
    try {
      await onSubmit(data);
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  return (
    <form onSubmit={handleSubmit(submit)} className="max-w-3xl space-y-6">
      {serverError && <p className="text-sm text-destructive">{serverError}</p>}

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="col-span-2">
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
            className="w-full rounded border border-gold/20 bg-transparent px-3 py-2 text-foreground"
          />
          {errors.slug && <p className="mt-1 text-sm text-destructive">{errors.slug.message}</p>}
        </div>

        <div>
          <label className="mb-1 block text-sm text-secondary-text">SKU</label>
          <input
            {...register("sku")}
            className="w-full rounded border border-gold/20 bg-transparent px-3 py-2 text-foreground"
          />
          {errors.sku && <p className="mt-1 text-sm text-destructive">{errors.sku.message}</p>}
        </div>

        <div className="col-span-2">
          <label className="mb-1 block text-sm text-secondary-text">Description</label>
          <textarea
            {...register("description")}
            rows={4}
            className="w-full rounded border border-gold/20 bg-transparent px-3 py-2 text-foreground"
          />
          {errors.description && <p className="mt-1 text-sm text-destructive">{errors.description.message}</p>}
        </div>

        <div className="col-span-2">
          <label className="mb-1 block text-sm text-secondary-text">Short Description</label>
          <input
            {...register("shortDescription")}
            className="w-full rounded border border-gold/20 bg-transparent px-3 py-2 text-foreground"
          />
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <label className="mb-1 block text-sm text-secondary-text">Price</label>
          <input
            type="number"
            step="0.01"
            {...register("price", { valueAsNumber: true })}
            className="w-full rounded border border-gold/20 bg-transparent px-3 py-2 text-foreground"
          />
          {errors.price && <p className="mt-1 text-sm text-destructive">{errors.price.message}</p>}
        </div>
        <div>
          <label className="mb-1 block text-sm text-secondary-text">Sale Price</label>
          <input
            type="number"
            step="0.01"
            {...register("salePrice", { valueAsNumber: true })}
            className="w-full rounded border border-gold/20 bg-transparent px-3 py-2 text-foreground"
          />
          {errors.salePrice && <p className="mt-1 text-sm text-destructive">{errors.salePrice.message}</p>}
        </div>
        <div>
          <label className="mb-1 block text-sm text-secondary-text">Stock</label>
          <input
            type="number"
            {...register("stock", { valueAsNumber: true })}
            className="w-full rounded border border-gold/20 bg-transparent px-3 py-2 text-foreground"
          />
        </div>
      </section>

      <section className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div>
          <label className="mb-1 block text-sm text-secondary-text">Material</label>
          <input
            {...register("material")}
            className="w-full rounded border border-gold/20 bg-transparent px-3 py-2 text-foreground"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm text-secondary-text">Purity</label>
          <input
            {...register("purity")}
            className="w-full rounded border border-gold/20 bg-transparent px-3 py-2 text-foreground"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm text-secondary-text">Stone</label>
          <input
            {...register("stone")}
            className="w-full rounded border border-gold/20 bg-transparent px-3 py-2 text-foreground"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm text-secondary-text">Color</label>
          <input
            {...register("color")}
            className="w-full rounded border border-gold/20 bg-transparent px-3 py-2 text-foreground"
          />
        </div>
      </section>

      <section>
        <label className="mb-2 block text-sm text-secondary-text">Images</label>
        <div className="mb-3 flex flex-wrap gap-3">
          {imageFields.map((field, index) => (
            <div key={field.id} className="relative">
              <Image
                src={field.url}
                alt=""
                width={96}
                height={96}
                className="h-24 w-24 rounded border border-gold/20 object-cover"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-destructive text-xs text-foreground"
              >
                ×
              </button>
            </div>
          ))}
        </div>
        <ImageUploader
          onUploaded={(img) =>
            appendImage({ url: img.url, position: imageFields.length, isThumbnail: imageFields.length === 0 })
          }
        />
      </section>

      <section>
        <label className="mb-2 block text-sm text-secondary-text">Categories</label>
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              type="button"
              key={c.id}
              onClick={() => toggleId("categoryIds", c.id)}
              className={`rounded-full px-3 py-1 text-xs ${
                selectedCategoryIds.includes(c.id)
                  ? "bg-gold text-gold-foreground"
                  : "border border-gold/20 text-secondary-text"
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      </section>

      <section>
        <label className="mb-2 block text-sm text-secondary-text">Collections</label>
        <div className="flex flex-wrap gap-2">
          {collections.map((c) => (
            <button
              type="button"
              key={c.id}
              onClick={() => toggleId("collectionIds", c.id)}
              className={`rounded-full px-3 py-1 text-xs ${
                selectedCollectionIds.includes(c.id)
                  ? "bg-gold text-gold-foreground"
                  : "border border-gold/20 text-secondary-text"
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm text-secondary-text">Status</label>
          <select
            {...register("status")}
            className="w-full rounded border border-gold/20 bg-background px-3 py-2 text-foreground"
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm text-secondary-text">Publish At (for Scheduled)</label>
          <input
            type="datetime-local"
            {...register("publishAt")}
            className="w-full rounded border border-gold/20 bg-transparent px-3 py-2 text-foreground"
          />
          {errors.publishAt && <p className="mt-1 text-sm text-destructive">{errors.publishAt.message}</p>}
        </div>
      </section>

      <section className="flex flex-wrap gap-4">
        {FLAG_FIELDS.map(([field, label]) => (
          <label key={field} className="flex items-center gap-2 text-sm text-secondary-text">
            <input type="checkbox" {...register(field)} />
            {label}
          </label>
        ))}
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm text-secondary-text">Meta Title</label>
          <input
            {...register("metaTitle")}
            className="w-full rounded border border-gold/20 bg-transparent px-3 py-2 text-foreground"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm text-secondary-text">Meta Description</label>
          <input
            {...register("metaDescription")}
            className="w-full rounded border border-gold/20 bg-transparent px-3 py-2 text-foreground"
          />
        </div>
      </section>

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
