"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function AuthSyncPage() {
  const router = useRouter();

  useEffect(() => {
    const nextUrl = window.localStorage.getItem("next-redirect");
    if (nextUrl) {
      window.localStorage.removeItem("next-redirect");
      router.push(nextUrl);
    } else {
      router.push("/");
    }
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-4">
      <Loader2 className="w-10 h-10 animate-spin text-primary" />
      <p className="text-muted-foreground font-medium animate-pulse">Yönlendiriliyor...</p>
    </div>
  );
}
