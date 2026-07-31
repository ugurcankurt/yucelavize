"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Package, Heart, MapPin, Settings, LogOut, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { logout } from "@/app/actions/auth";

const navItems = [
  {
    name: "Siparişlerim",
    href: "/account",
    icon: Package,
  },
  {
    name: "Favorilerim",
    href: "/account/favorites",
    icon: Heart,
  },
  {
    name: "Adreslerim",
    href: "/account/addresses",
    icon: MapPin,
  },
  {
    name: "Hesap Ayarları",
    href: "/account/settings",
    icon: Settings,
  },
];

export function AccountNav() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Determine active item
  const activeItem = navItems.find(
    (item) => pathname === item.href || (item.href === "/account" && pathname.startsWith("/account/orders"))
  ) || navItems[0];
  const ActiveIcon = activeItem.icon;

  return (
    <>
      {/* Mobile View: Collapsible Accordion */}
      <div className="lg:hidden w-full flex flex-col">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="w-full flex items-center justify-between bg-primary text-primary-foreground font-semibold px-4 py-3.5 rounded-2xl shadow-sm transition-all active:scale-[0.98]"
        >
          <div className="flex items-center gap-3">
            <ActiveIcon className="w-5 h-5" />
            <span>{activeItem.name}</span>
          </div>
          <ChevronDown className={cn("w-5 h-5 transition-transform duration-300", isMobileMenuOpen && "rotate-180")} />
        </button>

        {/* Dropdown Menu (In-flow to prevent clipping) */}
        <div 
          className={cn(
            "w-full overflow-hidden transition-all duration-300 ease-in-out",
            isMobileMenuOpen ? "max-h-[500px] opacity-100 mt-2" : "max-h-0 opacity-0 mt-0"
          )}
        >
          <div className="bg-muted/10 border border-border/50 rounded-2xl flex flex-col p-2 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.href === activeItem.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "group flex items-center gap-3 px-4 py-3 font-semibold rounded-xl transition-all",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <Icon className={cn("w-5 h-5 transition-transform", !isActive && "group-hover:scale-110")} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
            
            <div className="pt-1 mt-1 border-t border-border/40">
              <form action={logout} onSubmit={() => setIsMobileMenuOpen(false)}>
                <button
                  type="submit"
                  className="w-full group flex items-center gap-3 px-4 py-3 font-semibold rounded-xl transition-all text-destructive hover:bg-destructive/10"
                >
                  <LogOut className="w-5 h-5 transition-transform group-hover:scale-110" />
                  <span>Çıkış Yap</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop View: Vertical Sidebar List */}
      <div className="hidden lg:flex flex-col space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.href === activeItem.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 px-4 py-3.5 font-semibold rounded-2xl transition-all",
                isActive
                  ? "bg-primary text-primary-foreground shadow-md hover:bg-primary/90"
                  : "text-muted-foreground hover:bg-primary/10 hover:text-primary"
              )}
            >
              <Icon className={cn("w-5 h-5 transition-transform", !isActive && "group-hover:scale-110")} />
              <span>{item.name}</span>
            </Link>
          );
        })}
        
        {/* Logout Button */}
        <div className="pt-2 mt-2 border-t border-border/40">
          <form action={logout}>
            <button
              type="submit"
              className="w-full group flex items-center gap-3 px-4 py-3.5 font-semibold rounded-2xl transition-all text-destructive hover:bg-destructive/10"
            >
              <LogOut className="w-5 h-5 transition-transform group-hover:scale-110" />
              <span>Çıkış Yap</span>
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
