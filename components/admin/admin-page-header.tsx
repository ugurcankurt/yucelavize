import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import React from "react";

interface AdminPageHeaderProps {
  title: string;
  action?: {
    href: string;
    label: string;
  };
  children?: React.ReactNode;
}

export function AdminPageHeader({ title, action, children }: AdminPageHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
      <div className="flex items-center gap-4">
        {children}
        {action && (
          <Button nativeButton={false} render={<Link href={action.href} />}>
            <Plus className="mr-2 h-4 w-4" /> {action.label}
          </Button>
        )}
      </div>
    </div>
  );
}
