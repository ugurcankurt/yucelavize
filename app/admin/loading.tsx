import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";

export default function AdminLoading() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6 w-full">
      <div className="flex items-center justify-between space-y-2">
        <Skeleton className="h-10 w-48 rounded-lg" />
        <div className="flex items-center space-x-2">
          <Skeleton className="h-10 w-32 rounded-md" />
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-xl border bg-card text-card-foreground shadow">
            <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-5 w-24 rounded-md" />
              <Skeleton className="h-4 w-4 rounded-full" />
            </div>
            <div className="p-6 pt-0">
              <Skeleton className="h-8 w-20 rounded-md mb-2" />
              <Skeleton className="h-4 w-32 rounded-md" />
            </div>
          </div>
        ))}
      </div>
      
      <div className="flex items-center justify-center min-h-[300px] border rounded-xl bg-card">
        <Spinner className="w-8 h-8 text-primary" />
      </div>
    </div>
  );
}
