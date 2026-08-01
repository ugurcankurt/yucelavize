import { Spinner } from "@/components/ui/spinner";

export default function StorefrontLoading() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[50vh] w-full gap-4">
      <Spinner className="w-8 h-8 text-primary" />
      <p className="text-sm text-muted-foreground animate-pulse">Yükleniyor...</p>
    </div>
  );
}
