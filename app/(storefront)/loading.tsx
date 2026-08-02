import { Skeleton } from "@/components/ui/skeleton";

export default function HomeLoading() {
  return (
    <div className="flex flex-col flex-1 w-full font-sans bg-background animate-in fade-in duration-500">
      {/* 1. Hero Section Skeleton */}
      <div className="w-full h-[60vh] min-h-[500px] relative overflow-hidden bg-muted/50">
        <Skeleton className="w-full h-full rounded-none" />
      </div>

      {/* 2. Shop by Category Skeleton */}
      <section className="w-full py-12 md:py-20">
        <div className="container mx-auto px-4 flex flex-col lg:flex-row gap-12">
          <div className="flex flex-col min-w-[200px] shrink-0">
            <Skeleton className="h-8 w-40 mb-2" />
            <Skeleton className="h-4 w-32" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 pb-6 md:pb-0 md:flex-1">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="aspect-[4/3] rounded-2xl w-full" />
            ))}
          </div>
        </div>
      </section>

      {/* 3. Latest Products Skeleton */}
      <section className="w-full py-12 md:py-20 bg-muted/10">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-8 md:mb-12">
            <div className="flex flex-col gap-2">
              <Skeleton className="h-10 w-48" />
              <Skeleton className="h-4 w-64 hidden sm:block" />
            </div>
            <Skeleton className="h-10 w-32 rounded-full hidden md:block" />
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex flex-col gap-3">
                <Skeleton className="w-full aspect-[4/5] rounded-3xl" />
                <div className="flex flex-col gap-2 mt-2">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
                <div className="flex gap-2 mt-1">
                  <Skeleton className="h-8 w-20 rounded-full" />
                  <Skeleton className="h-8 w-8 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
