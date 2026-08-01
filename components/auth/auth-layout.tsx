import { ReactNode } from "react";
import { Lock } from "lucide-react";
import { PageHero } from "@/components/storefront/page-hero";

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  icon?: React.ElementType;
  children: ReactNode;
}

export function AuthLayout({ title, subtitle, icon: Icon = Lock, children }: AuthLayoutProps) {
  return (
    <div className="w-full bg-background font-sans min-h-screen">
      <PageHero 
        title={title} 
        description={subtitle}
        breadcrumbs={[{ label: title }]}
      />
      <div className="container mx-auto px-4 -mt-10 mb-20 relative z-20 flex justify-center">
        <div className="w-full max-w-md bg-card border border-border rounded-[32px] p-8 sm:p-10 shadow-xl shadow-primary/5">
          <div className="flex flex-col items-center text-center space-y-4 mb-8">
            <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-2">
              <Icon className="w-6 h-6" />
            </div>
          </div>
        {children}
      </div>
      </div>
    </div>
  );
}
