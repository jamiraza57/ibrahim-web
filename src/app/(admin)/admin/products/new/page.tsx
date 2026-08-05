"use client";

import { useRouter } from "next/navigation";
import { ProductForm } from "@/features/products/components/ProductForm";
import type { ProductInput } from "@/features/products/schemas/product.schema";

export default function NewProductPage() {
  const router = useRouter();

  async function handleCreate(data: ProductInput) {
    const res = await fetch("/api/v1/admin/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const json = await res.json();
      throw new Error(json.error ?? "Could not create product");
    }
    router.push("/admin/products");
  }

  return (
    <div className="p-4 sm:p-8">
      <h1 className="mb-6 font-serif text-2xl text-white">New Product</h1>
      <ProductForm onSubmit={handleCreate} submitLabel="Create Product" />
    </div>
  );
}
