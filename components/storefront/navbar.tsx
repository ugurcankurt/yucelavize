"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";
import {
  Search,
  Heart,
  ChevronDown,
  User,
  Package,
  MapPinIcon,
  Settings,
  LogOut,
} from "lucide-react";
import { CartIcon } from "@/components/storefront/cart-icon";
import { UserAvatar } from "@/components/storefront/user-avatar";
import { logout } from "@/app/actions/auth";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { SearchBar } from "./search-bar";

interface NavbarProps {
  user?: any;
  profile?: any;
  categories?: any[];
}
export function Navbar({ user, profile, categories = [] }: NavbarProps) {
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const mobileSearchRef = useRef<HTMLDivElement>(null);

  const currentCategorySlug = searchParams.get("category");
  const currentCategory = categories.find(
    (cat) => cat.slug === currentCategorySlug,
  );
  const categoryLabel = currentCategory
    ? currentCategory.name
    : "Tüm Kategoriler";;
  
  // Close mobile search on scroll with a grace period to prevent instant closing due to layout shifts
  useEffect(() => {
    if (!isMobileSearchOpen) return;
    
    let isActive = false;
    // 300ms grace period to allow expansion animation without triggering scroll close
    const timer = setTimeout(() => {
      isActive = true;
    }, 300);

    const handleScroll = () => {
      if (isActive) {
        // Prevent closing if the scroll is triggered by the on-screen keyboard
        // bringing the focused input into view.
        if (
          document.activeElement?.tagName === "INPUT" &&
          mobileSearchRef.current?.contains(document.activeElement)
        ) {
          return;
        }

        setIsMobileSearchOpen(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isMobileSearchOpen]);
  return (
    <header className="w-full flex flex-col font-sans sticky top-0 z-50 lg:shadow-sm lg:bg-background">
      {/* Main Navbar (Desktop) */}
      <div className="hidden lg:block w-full border-b border-border bg-background">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between gap-4 lg:gap-6">
          <div className="flex items-center gap-6">
            {/* Logo */}
            <Link href="/" className="flex items-center flex-shrink-0">
              <span className="text-[22px] md:text-[26px] font-black tracking-tighter text-primary">
                yücel<span className="text-foreground">avize</span>
              </span>
            </Link>
            
            {/* Nav Links */}
            <nav className="hidden lg:flex items-center gap-6 text-sm font-medium">
              <Link href="/categories" className="text-muted-foreground hover:text-primary transition-colors">
                Koleksiyonlar
              </Link>
              <Link href="/blog" className="text-muted-foreground hover:text-primary transition-colors">
                Blog
              </Link>
            </nav>
          </div>
          <SearchBar variant="desktop" />
          {/* Right Actions */}{" "}
          <div className="flex items-center gap-3 md:gap-5 lg:gap-7">
            {" "}
            {/* Wishlist */}{" "}
            <Link
              href="/account/favorites"
              className="hidden sm:flex relative text-muted-foreground hover:text-primary transition-colors flex-col items-center gap-1 group"
            >
              {" "}
              <div className="relative">
                {" "}
                <Heart className="w-6 h-6 group-hover:fill-primary/20" />{" "}
              </div>{" "}
            </Link>{" "}
            {/* Profile Dropdown */}{" "}
            {user ? (
              <DropdownMenu>
                {" "}
                <DropdownMenuTrigger
                  nativeButton={false}
                  render={
                    <div className="flex items-center gap-2 sm:gap-3 cursor-pointer group outline-none">
                      {" "}
                      <UserAvatar
                        user={user}
                        profile={profile}
                        className="w-8 h-8 sm:w-9 sm:h-9 border border-primary/20"
                        fallbackClassName="bg-primary/10 text-primary font-bold text-sm"
                      />{" "}
                      <div className="hidden lg:flex flex-col text-sm text-left">
                        {" "}
                        <span className="text-muted-foreground text-xs font-medium">
                          Hoş geldin,
                        </span>{" "}
                        <span className="font-bold text-foreground group-hover:text-primary transition-colors flex items-center gap-1">
                          {profile?.full_name?.split(" ")[0] ||
                            user.email?.split("@")[0] ||
                            "Hesabım"}
                          <ChevronDown className="w-3 h-3 ml-1 text-muted-foreground group-hover:text-primary" />
                        </span>
                      </div>{" "}
                    </div>
                  }
                />{" "}
                <DropdownMenuContent className="w-56 mt-2 rounded-2xl border-border shadow-xl shadow-gray-200/50 p-2">
                  {" "}
                  <div className="flex flex-col space-y-1 p-2 border-b border-gray-50 mb-2">
                    {" "}
                    <p className="text-sm font-bold leading-none text-foreground">
                      {profile?.full_name || user.email?.split("@")[0]}
                    </p>{" "}
                    <p className="text-xs leading-none text-muted-foreground mt-2">
                      {user.email}
                    </p>{" "}
                  </div>{" "}
                  <Link href="/account">
                    {" "}
                    <DropdownMenuItem className="cursor-pointer rounded-xl py-2.5 hover:bg-muted">
                      {" "}
                      <Package className="mr-2 h-4 w-4 text-muted-foreground" />{" "}
                      <span className="font-medium text-muted-foreground">
                        Siparişlerim
                      </span>{" "}
                    </DropdownMenuItem>{" "}
                  </Link>{" "}
                  <Link href="/account/favorites">
                    {" "}
                    <DropdownMenuItem className="cursor-pointer rounded-xl py-2.5 hover:bg-muted">
                      {" "}
                      <Heart className="mr-2 h-4 w-4 text-muted-foreground" />{" "}
                      <span className="font-medium text-muted-foreground">
                        Favorilerim
                      </span>{" "}
                    </DropdownMenuItem>{" "}
                  </Link>{" "}
                  <Link href="/account/addresses">
                    {" "}
                    <DropdownMenuItem className="cursor-pointer rounded-xl py-2.5 hover:bg-muted">
                      {" "}
                      <MapPinIcon className="mr-2 h-4 w-4 text-muted-foreground" />{" "}
                      <span className="font-medium text-muted-foreground">
                        Adreslerim
                      </span>{" "}
                    </DropdownMenuItem>{" "}
                  </Link>{" "}
                  <Link href="/account/settings">
                    {" "}
                    <DropdownMenuItem className="cursor-pointer rounded-xl py-2.5 hover:bg-muted">
                      {" "}
                      <Settings className="mr-2 h-4 w-4 text-muted-foreground" />{" "}
                      <span className="font-medium text-muted-foreground">
                        Hesap Ayarları
                      </span>{" "}
                    </DropdownMenuItem>{" "}
                  </Link>{" "}
                  <DropdownMenuSeparator className="my-2 bg-muted" />{" "}
                  <form action={logout}>
                    {" "}
                    <button type="submit" className="w-full">
                      {" "}
                      <DropdownMenuItem className="cursor-pointer rounded-xl py-2.5 text-destructive hover:bg-destructive/10 hover:text-destructive">
                        {" "}
                        <LogOut className="mr-2 h-4 w-4" />{" "}
                        <span className="font-medium">Çıkış Yap</span>{" "}
                      </DropdownMenuItem>{" "}
                    </button>{" "}
                  </form>{" "}
                </DropdownMenuContent>{" "}
              </DropdownMenu>
            ) : (
              <Link
                href="/auth/login"
                className="flex items-center gap-2 sm:gap-3 cursor-pointer group"
              >
                {" "}
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-muted border border-border flex items-center justify-center overflow-hidden group-hover:bg-primary/10 group-hover:border-primary/20 transition-colors">
                  {" "}
                  <User className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground group-hover:text-primary transition-colors" />{" "}
                </div>{" "}
                <div className="hidden lg:flex flex-col">
                  {" "}
                  <span className="text-[11px] text-muted-foreground font-medium">
                    Hesabınız yok mu?
                  </span>{" "}
                  <div className="flex items-center gap-1 text-sm font-semibold text-muted-foreground group-hover:text-primary transition-colors">
                    {" "}
                    Giriş Yap <ChevronDown className="w-3.5 h-3.5" />{" "}
                  </div>{" "}
                </div>{" "}
              </Link>
            )}{" "}
            {/* Cart */}{" "}
            <div className="flex items-center">
              {" "}
              <CartIcon />{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
      </div>
      {/* Mobile Header (App-like) */}
      <div className="lg:hidden flex flex-col w-full bg-primary text-primary-foreground rounded-b-[24px] pt-3 pb-3 px-4 shadow-md relative z-20 transition-all duration-300">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center flex-shrink-0">
            <span className="text-[22px] font-black tracking-tighter text-primary-foreground">
              yücel<span className="text-primary-foreground/70">avize</span>
            </span>
          </Link>

          {/* Actions (Search Toggle, Cart) */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => {
                setIsMobileSearchOpen(!isMobileSearchOpen);
              }}
              className="relative w-9 h-9 rounded-full bg-primary-foreground/10 flex items-center justify-center transition-colors hover:bg-primary-foreground/20 text-primary-foreground"
              aria-label="Arama"
            >
              <Search className="w-[18px] h-[18px]" />
            </button>
            <CartIcon
              className="relative w-9 h-9 rounded-full bg-primary-foreground/10 flex items-center justify-center transition-colors hover:bg-primary-foreground/20 text-primary-foreground hover:text-primary-foreground"
              iconClassName="w-[18px] h-[18px]"
              badgeClassName="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-[10px] font-bold text-white flex items-center justify-center border border-primary"
              hideDrawer={true}
            />
          </div>
        </div>

        <div ref={mobileSearchRef}>
          <SearchBar 
            variant="mobile" 
            isMobileOpen={isMobileSearchOpen} 
            onMobileClose={() => setIsMobileSearchOpen(false)} 
          />
        </div>
      </div>
    </header>
  );
}
