import { Skeleton } from "@/components/shared/Skeleton";

export default function ProductLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
      <Skeleton className="mb-6 h-4 w-72 max-w-full" />
      <div className="grid gap-8 md:grid-cols-2 md:gap-12">
        <Skeleton className="aspect-square w-full" />
        <div className="space-y-4">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-9 w-3/4" />
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-12 w-48" />
        </div>
      </div>
    </div>
  );
}
