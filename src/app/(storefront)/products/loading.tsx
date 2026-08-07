import { Skeleton, ProductGridSkeleton } from "@/components/shared/Skeleton";

export default function ProductsLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <Skeleton className="mx-auto mb-8 h-8 w-48" />
      <ProductGridSkeleton />
    </div>
  );
}
