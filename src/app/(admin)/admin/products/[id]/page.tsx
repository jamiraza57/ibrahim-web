"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ProductForm } from "@/features/products/components/ProductForm";
import type { ProductInput } from "@/features/products/schemas/product.schema";

interface ProductRelation {
  category?: { id: string };
  collection?: { id: string };
}

export default function EditProductPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [initialValues, setInitialValues] = useState<Partial<ProductInput> | null>(null);

  useEffect(() => {
    fetch(`/api/v1/admin/products/${params.id}`)
      .then((res) => res.json())
      .then(({ data }) => {
        if (!data) return;
        setInitialValues({
          ...data,
          price: Number(data.price),
          salePrice: data.salePrice ? Number(data.salePrice) : null,
          categoryIds: data.categories?.map((c: ProductRelation) => c.category?.id).filter(Boolean) ?? [],
          collectionIds: data.collections?.map((c: ProductRelation) => c.collection?.id).filter(Boolean) ?? [],
        });
      });
  }, [params.id]);

  async function handleUpdate(data: ProductInput) {
    const res = await fetch(`/api/v1/admin/products/${params.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const json = await res.json();
      throw new Error(json.error ?? "Could not update product");
    }
    router.push("/admin/products");
  }

  if (!initialValues) return <div className="p-8 text-secondary-text">Loading…</div>;

  return (
    <div className="p-4 sm:p-8">
      <h1 className="mb-6 font-display text-2xl text-foreground">Edit Product</h1>
      <ProductForm defaultValues={initialValues} onSubmit={handleUpdate} submitLabel="Save Changes" />
    </div>
  );
}
