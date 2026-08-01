import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";

export default function ProductsLoading() {
  return (
    <div className="container mx-auto px-4 py-8 lg:py-12">
      <div className="flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-48 rounded-lg" />
          <Skeleton className="h-10 w-32 rounded-lg" />
        </div>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Skeleton */}
          <div className="hidden lg:block w-64 shrink-0 space-y-6">
            <Skeleton className="h-8 w-3/4 rounded-md" />
            <div className="space-y-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-6 w-full rounded-md" />
              ))}
            </div>
            <Skeleton className="h-8 w-2/3 rounded-md mt-8" />
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-6 w-full rounded-md" />
              ))}
            </div>
          </div>

          {/* Products Grid Skeleton */}
          <div className="flex-1">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="flex flex-col space-y-3">
                  <Skeleton className="aspect-[4/5] rounded-xl w-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-2/3 rounded-md" />
                    <Skeleton className="h-4 w-1/2 rounded-md" />
                  </div>
                  <div className="flex justify-between items-center pt-2">
                    <Skeleton className="h-5 w-1/3 rounded-md" />
                    <Skeleton className="h-8 w-8 rounded-full" />
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex justify-center mt-12">
              <Spinner className="w-8 h-8 text-primary" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
