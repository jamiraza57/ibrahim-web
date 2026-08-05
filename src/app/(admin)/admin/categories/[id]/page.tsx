"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { CategoryForm } from "@/features/categories/components/CategoryForm";
import type { CategoryInput } from "@/features/categories/schemas/category.schema";

interface CategoryRow {
  id: string;
  name: string;
}

export default function EditCategoryPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [initialValues, setInitialValues] = useState<Partial<CategoryInput> | null>(null);
  const [parentOptions, setParentOptions] = useState<CategoryRow[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const [categoryRes, listRes] = await Promise.all([
        fetch(`/api/v1/admin/categories/${params.id}`),
        fetch("/api/v1/admin/categories"),
      ]);
      const { data: category } = await categoryRes.json();
      const { data: allCategories } = await listRes.json();
      setInitialValues(category);
      setParentOptions(
        (allCategories as CategoryRow[]).filter((c: { id: string }) => c.id !== params.id)
      );
    }
    load();
  }, [params.id]);

  async function handleUpdate(data: CategoryInput) {
    setError(null);
    const res = await fetch(`/api/v1/admin/categories/${params.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const json = await res.json();
      setError(json.error ?? "Could not update category");
      return;
    }
    router.push("/admin/categories");
  }

  if (!initialValues) return <div className="p-8 text-secondary-text">Loading…</div>;

  return (
    <div className="max-w-lg p-4 sm:p-8">
      <h1 className="mb-6 font-display text-2xl text-foreground">Edit Category</h1>
      {error && <p className="mb-3 text-sm text-destructive">{error}</p>}
      <CategoryForm
        defaultValues={initialValues}
        parentOptions={parentOptions}
        onSubmit={handleUpdate}
        submitLabel="Save Changes"
      />
    </div>
  );
}
