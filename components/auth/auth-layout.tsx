import { ReactNode } from "react";
import { Lock } from "lucide-react";

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  icon?: React.ElementType;
  children: ReactNode;
}

export function AuthLayout({ title, subtitle, icon: Icon = Lock, children }: AuthLayoutProps) {
  return (
    <div className="w-full bg-muted font-sans min-h-[80vh] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md bg-background border border-border rounded-[32px] p-8 sm:p-10 shadow-xl shadow-gray-100/50">
        <div className="flex flex-col items-center text-center space-y-4 mb-8">
          <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-2">
            <Icon className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-black text-foreground tracking-tight">
            {title}
          </h1>
          <p className="text-sm font-medium text-muted-foreground">
            {subtitle}
          </p>
        </div>
        {children}
      </div>
    </div>
  );
}
