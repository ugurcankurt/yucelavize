import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import React from "react";

interface AdminFormLayoutProps {
  title: string;
  backHref: string;
  children: React.ReactNode;
  maxWidth?: "max-w-2xl" | "max-w-4xl" | "max-w-6xl" | "max-w-7xl" | "max-w-none";
  noWrapper?: boolean;
}

export function AdminFormLayout({ title, backHref, children, maxWidth = "max-w-2xl", noWrapper = false }: AdminFormLayoutProps) {
  return (
    <div className={`${maxWidth} mx-auto space-y-6 w-full`}>
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          nativeButton={false}
          render={<Link href={backHref} />}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
      </div>

      {noWrapper ? (
        children
      ) : (
        <div className="rounded-md border bg-white dark:bg-black p-6">
          {children}
        </div>
      )}
    </div>
  );
}
