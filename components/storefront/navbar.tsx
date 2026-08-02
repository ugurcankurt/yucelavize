"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import Link from "next/link";
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

import { createClient } from "@/lib/supabase/client";

interface NavbarProps {
  categories?: any[];
}
export function Navbar({ categories = [] }: NavbarProps) {
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const mobileSearchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const supabase = createClient();

    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        const { data } = await supabase.from("profiles").select("*").eq("id", session.user.id).single();
        setProfile(data);
      } else {
        setUser(null);
        setProfile(null);
      }
    };
    fetchUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setUser(session.user);
          const { data } = await supabase.from("profiles").select("*").eq("id", session.user.id).single();
          setProfile(data);
        } else {
          setUser(null);
          setProfile(null);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const loginUrl = pathname ? `/auth/login?next=${pathname}` : `/auth/login`;

  const currentCategorySlug = searchParams.get("category");
  const currentCategory = categories.find(
    (cat) => cat.slug === currentCategorySlug,
  );
  const categoryLabel = currentCategory
    ? currentCategory.name
    : "Tüm Kategoriler";

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
            <Link href="/" className="relative flex items-center justify-center flex-shrink-0 w-36 h-12 md:w-44 md:h-14">
              <Image src="/yucel_avize_logo.png" alt="Yücel Avize Logo" fill sizes="(max-width: 768px) 150px, 200px" className="object-contain z-0" priority />
              <div className="absolute inset-0 flex items-center justify-center text-[24px] md:text-[28px] font-black tracking-tighter leading-none drop-shadow-sm">
                <div className="relative">
                  <span aria-hidden="true" className="absolute inset-0 z-0 text-white [-webkit-text-stroke:3px_#ffffff] pointer-events-none select-none">
                    yücelavize
                  </span>
                  <span className="relative z-10 text-primary">
                    yücel<span className="text-foreground">avize</span>
                  </span>
                </div>
              </div>
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
                href={loginUrl}
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
          <Link href="/" className="relative flex items-center justify-center flex-shrink-0 w-32 h-14">
            <Image src="/yucel_avize_white_logo.png" alt="Yücel Avize Logo" fill sizes="150px" className="object-contain z-0" priority />
            <div className="absolute inset-0 flex items-center justify-center text-[28px] font-black tracking-tighter leading-none">
              <div className="relative">
                <span aria-hidden="true" className="absolute inset-0 z-0 text-primary [-webkit-text-stroke:4px_currentColor] pointer-events-none select-none">
                  yücelavize
                </span>
                <span className="relative z-10 text-white">
                  yücelavize
                </span>
              </div>
            </div>
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
