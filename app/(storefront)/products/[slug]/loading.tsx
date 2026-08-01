import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";

export default function ProductDetailLoading() {
  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16">
        {/* Product Images Skeleton */}
        <div className="flex flex-col-reverse md:flex-row gap-4 h-[600px]">
          {/* Thumbnails */}
          <div className="flex md:flex-col gap-4 overflow-x-auto md:w-24 shrink-0 pb-2 md:pb-0 hide-scrollbar">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="aspect-square w-20 md:w-full shrink-0 rounded-xl" />
            ))}
          </div>
          {/* Main Image */}
          <div className="flex-1 relative h-full">
            <Skeleton className="w-full h-full rounded-2xl" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Spinner className="w-8 h-8 text-primary opacity-50" />
            </div>
          </div>
        </div>

        {/* Product Info Skeleton */}
        <div className="flex flex-col gap-6 pt-4 lg:pt-0">
          <div className="space-y-4">
            <Skeleton className="h-4 w-32 rounded-full" />
            <Skeleton className="h-10 w-full rounded-xl" />
            <Skeleton className="h-10 w-3/4 rounded-xl" />
          </div>
          
          <div className="flex items-center gap-4">
            <Skeleton className="h-8 w-24 rounded-lg" />
            <Skeleton className="h-8 w-32 rounded-lg" />
          </div>

          <div className="pt-6 border-t border-border space-y-8">
            <Skeleton className="h-6 w-full rounded-md" />
            <Skeleton className="h-6 w-5/6 rounded-md" />
            <Skeleton className="h-6 w-4/6 rounded-md" />
          </div>
          
          <div className="pt-8 space-y-4">
            <div className="flex gap-4">
              <Skeleton className="h-14 flex-1 rounded-xl" />
              <Skeleton className="h-14 w-14 rounded-xl" />
            </div>
            <Skeleton className="h-12 w-full rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
