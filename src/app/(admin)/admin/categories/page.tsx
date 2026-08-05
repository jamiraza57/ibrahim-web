"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CategoryForm } from "@/features/categories/components/CategoryForm";
import type { CategoryInput } from "@/features/categories/schemas/category.schema";

interface CategoryRow {
  id: string;
  name: string;
  slug: string;
  status: boolean;
  parentId: string | null;
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<CategoryRow[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function loadCategories() {
    const res = await fetch("/api/v1/admin/categories");
    const { data } = await res.json();
    setCategories(data ?? []);
  }

  useEffect(() => {
    loadCategories();
  }, []);

  async function handleCreate(data: CategoryInput) {
    setError(null);
    const res = await fetch("/api/v1/admin/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const json = await res.json();
      setError(json.error ?? "Could not create category");
      return;
    }
    setShowForm(false);
    await loadCategories();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this category? Its products keep their other categories.")) return;
    await fetch(`/api/v1/admin/categories/${id}`, { method: "DELETE" });
    await loadCategories();
  }

  return (
    <div className="p-4 sm:p-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl text-foreground">Categories</h1>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="rounded bg-gold px-4 py-2 text-sm font-medium text-gold-foreground"
        >
          {showForm ? "Cancel" : "New Category"}
        </button>
      </div>

      {showForm && (
        <div className="mb-8 max-w-lg rounded border border-gold/20 bg-card p-6">
          {error && <p className="mb-3 text-sm text-destructive">{error}</p>}
          <CategoryForm
            parentOptions={categories.map((c) => ({ id: c.id, name: c.name }))}
            onSubmit={handleCreate}
            submitLabel="Create Category"
          />
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-gold/10 text-secondary-text">
            <th className="py-2">Name</th>
            <th className="py-2">Slug</th>
            <th className="py-2">Status</th>
            <th className="py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((c) => (
            <tr key={c.id} className="border-b border-gold/5 text-foreground">
              <td className="py-2">{c.name}</td>
              <td className="py-2 text-secondary-text">{c.slug}</td>
              <td className="py-2">{c.status ? "Active" : "Hidden"}</td>
              <td className="py-2">
                <Link href={`/admin/categories/${c.id}`} className="mr-4 text-gold hover:underline">
                  Edit
                </Link>
                <button onClick={() => handleDelete(c.id)} className="text-destructive hover:underline">
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {categories.length === 0 && (
            <tr>
              <td colSpan={4} className="py-6 text-center text-secondary-text">
                No categories yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
      </div>
    </div>
  );
}
