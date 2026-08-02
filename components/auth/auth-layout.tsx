import { ReactNode } from "react";
import { PageHero } from "@/components/storefront/page-hero";

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: ReactNode;
}

export function AuthLayout({ title, subtitle, children }: AuthLayoutProps) {
  return (
    <div className="w-full bg-background font-sans min-h-screen">
      <PageHero 
        title={title} 
        description={subtitle}
        breadcrumbs={[{ label: title }]}
      />
      <div className="container mx-auto px-4 -mt-10 mb-20 relative z-20 flex justify-center">
        <div className="w-full max-w-md bg-card border border-border rounded-[32px] p-8 sm:p-10 shadow-xl shadow-primary/5">
        {children}
      </div>
      </div>
    </div>
  );
}
