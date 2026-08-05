"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface ProductRow {
  id: string;
  name: string;
  sku: string;
  price: string;
  stock: number;
  status: string;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const params = new URLSearchParams({ page: String(page), pageSize: "20" });
    if (search) params.set("search", search);

    fetch(`/api/v1/admin/products?${params}`)
      .then((res) => res.json())
      .then(({ data, meta }) => {
        setProducts(data ?? []);
        setTotalPages(meta?.totalPages ?? 1);
      });
  }, [search, page]);

  async function handleDelete(id: string) {
    if (!confirm("Delete this product?")) return;
    const res = await fetch(`/api/v1/admin/products/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const json = await res.json();
      alert(json.error ?? "Could not delete product");
      return;
    }
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }

  return (
    <div className="p-4 sm:p-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl text-foreground">Products</h1>
        <Link href="/admin/products/new" className="rounded bg-gold px-4 py-2 text-sm font-medium text-gold-foreground">
          New Product
        </Link>
      </div>

      <input
        value={search}
        onChange={(e) => {
          setPage(1);
          setSearch(e.target.value);
        }}
        placeholder="Search by name or SKU…"
        className="mb-4 w-full max-w-sm rounded border border-gold/20 bg-transparent px-3 py-2 text-foreground"
      />

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-gold/10 text-secondary-text">
            <th className="py-2">Name</th>
            <th className="py-2">SKU</th>
            <th className="py-2">Price</th>
            <th className="py-2">Stock</th>
            <th className="py-2">Status</th>
            <th className="py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id} className="border-b border-gold/5 text-foreground">
              <td className="py-2">{p.name}</td>
              <td className="py-2 text-secondary-text">{p.sku}</td>
              <td className="py-2">${p.price}</td>
              <td className="py-2">{p.stock}</td>
              <td className="py-2">{p.status}</td>
              <td className="py-2">
                <Link href={`/admin/products/${p.id}`} className="mr-4 text-gold hover:underline">
                  Edit
                </Link>
                <button onClick={() => handleDelete(p.id)} className="text-destructive hover:underline">
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {products.length === 0 && (
            <tr>
              <td colSpan={6} className="py-6 text-center text-secondary-text">
                No products yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
      </div>

      {totalPages > 1 && (
        <div className="mt-4 flex gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`rounded px-3 py-1 text-sm ${
                p === page ? "bg-gold text-gold-foreground" : "border border-gold/20 text-foreground"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
