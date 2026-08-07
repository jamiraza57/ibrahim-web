import { Skeleton, ProductGridSkeleton } from "@/components/shared/Skeleton";

export default function CategoryLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <Skeleton className="mb-3 h-8 w-64" />
      <Skeleton className="mb-8 h-4 w-96 max-w-full" />
      <ProductGridSkeleton />
    </div>
  );
}
