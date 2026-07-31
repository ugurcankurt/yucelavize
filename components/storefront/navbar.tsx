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

interface NavbarProps {
  user?: any;
  profile?: any;
  categories?: any[];
}
export function Navbar({ user, profile, categories = [] }: NavbarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const desktopSearchRef = useRef<HTMLDivElement>(null);
  const mobileSearchRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();
  const currentCategorySlug = searchParams.get("category");
  const currentCategory = categories.find(
    (cat) => cat.slug === currentCategorySlug,
  );
  const categoryLabel = currentCategory
    ? currentCategory.name
    : "Tüm Kategoriler";
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.trim().length > 1) {
        setIsSearching(true);
        setShowResults(true);
        const { data, error } = await supabase
          .from("products")
          .select("id, name, slug, price, images")
          .ilike("name", `%${searchQuery.trim()}%`)
          .limit(5);
        if (!error && data) {
          setSearchResults(data);
        }
        setIsSearching(false);
      } else {
        setSearchResults([]);
        setShowResults(false);
      }
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, supabase]);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const isOutsideDesktop =
        desktopSearchRef.current && !desktopSearchRef.current.contains(target);
      const isOutsideMobile =
        mobileSearchRef.current && !mobileSearchRef.current.contains(target);
      if (isOutsideDesktop && isOutsideMobile) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  
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
        setShowResults(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isMobileSearchOpen]);
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setShowResults(false);
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery)}`);
    } else {
      router.push(`/products`);
    }
  };
  return (
    <header className="w-full flex flex-col font-sans sticky top-0 z-50 lg:shadow-sm lg:bg-background">
      {/* Main Navbar (Desktop) */}
      <div className="hidden lg:block w-full border-b border-border bg-background">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between gap-4 lg:gap-6">
          {" "}
          {/* Logo */}{" "}
          <Link href="/" className="flex items-center flex-shrink-0">
            {" "}
            <span className="text-[22px] md:text-[26px] font-black tracking-tighter text-primary">
              {" "}
              yücel<span className="text-foreground">avize</span>{" "}
            </span>{" "}
          </Link>{" "}
          {/* Desktop Search Bar */}{" "}
          <div
            className="hidden lg:flex flex-1 max-w-2xl mx-auto items-center relative"
            ref={desktopSearchRef}
          >
            <form
              onSubmit={handleSearch}
              className={`flex w-full items-center h-12 text-foreground transition-all duration-300 ease-out relative z-[52] ${showResults
                ? "rounded-t-[24px] rounded-b-none ring-2 ring-primary/20 shadow-none bg-background"
                : "rounded-[24px] bg-muted border border-border focus-within:border-primary focus-within:bg-background focus-within:ring-2 focus-within:ring-primary/20 shadow-inner"
                }`}
            >
              <div className="pl-5 pr-2 text-muted-foreground flex items-center justify-center">
                <Search className="w-5 h-5" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => {
                  if (searchQuery.trim().length > 1) setShowResults(true);
                }}
                placeholder="Ne aramıştınız?"
                className="flex-1 h-full bg-transparent pr-4 outline-none text-[16px] lg:text-[15px] text-foreground placeholder:text-muted-foreground"
              />
            </form>

            {/* Predictive Search Results */}
            {showResults && (
              <>
                <div
                  className="fixed inset-0 z-[50] bg-black/20 animate-in fade-in duration-300"
                  onClick={() => setShowResults(false)}
                />
                <div className="absolute top-12 left-0 right-0 z-[51] overflow-hidden rounded-b-[24px]">
                  <div className="bg-background border-b border-x border-border shadow-2xl pt-2 pb-2 rounded-b-[24px] animate-in slide-in-from-top-full duration-300 ease-out">
                    <div className="flex-1 overflow-y-auto px-2 pb-2 max-h-[60vh]">
                      {isSearching ? (
                        <div className="p-6 text-center text-sm text-muted-foreground">
                          Aranıyor...
                        </div>
                      ) : searchResults.length > 0 ? (
                        <div className="flex flex-col">
                          {searchResults.map((product) => (
                            <Link
                              key={product.id}
                              href={`/products/${product.slug}`}
                              onClick={() => {
                                setShowResults(false);
                                setSearchQuery("");
                              }}
                              className="flex items-center gap-3 p-3 mx-1 my-1 rounded-xl hover:bg-muted transition-colors border border-transparent hover:border-border/50"
                            >
                              <div className="w-12 h-12 bg-muted rounded-lg overflow-hidden relative flex-shrink-0">
                                {product.images?.[0] && (
                                  <Image
                                    src={product.images[0]}
                                    alt={product.name}
                                    fill
                                    className="object-cover"
                                    sizes="48px"
                                  />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-[14px] font-medium text-foreground truncate">
                                  {product.name}
                                </p>
                                <p className="text-[14px] font-bold text-primary mt-1">
                                  ₺{product.price}
                                </p>
                              </div>
                            </Link>
                          ))}
                          <div className="p-2 mt-1">
                            <Link
                              href={`/products?search=${encodeURIComponent(searchQuery)}`}
                              onClick={() => setShowResults(false)}
                              className="flex items-center justify-center w-full p-3 rounded-xl text-[14px] font-bold text-primary hover:bg-muted transition-colors bg-primary/5"
                            >
                              Tüm sonuçları gör
                            </Link>
                          </div>
                        </div>
                      ) : (
                        <div className="p-6 text-center text-sm text-muted-foreground">
                          Sonuç bulunamadı.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>{" "}
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
                if (isMobileSearchOpen) setShowResults(false);
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
            />
          </div>
        </div>

        <div 
          className={`relative w-full transition-all duration-300 ease-in-out ${
            isMobileSearchOpen ? "max-h-[500px] opacity-100 mt-3 overflow-visible" : "max-h-0 opacity-0 mt-0 overflow-hidden"
          }`} 
          ref={mobileSearchRef}
        >
          <form
            onSubmit={handleSearch}
            className={`flex w-full items-center h-12 bg-background text-foreground transition-all duration-300 ease-out px-4 relative z-[52] ${showResults
              ? "rounded-t-[24px] rounded-b-none ring-2 ring-primary-foreground/30"
              : "rounded-[24px] shadow-inner focus-within:ring-2 focus-within:ring-primary-foreground/30"
              }`}
          >
            <Search className="w-5 h-5 text-muted-foreground shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => {
                if (searchQuery.trim().length > 1) setShowResults(true);
              }}
              placeholder="Ürün veya marka ara..."
              className="flex-1 h-full bg-transparent outline-none text-[16px] md:text-[14px] text-foreground placeholder:text-muted-foreground ml-3 min-w-0"
            />
          </form>

          {/* Predictive Search Results (Mobile) */}
          {showResults && (
            <>
              <div
                className="fixed inset-0 z-[50] bg-black/40 animate-in fade-in duration-300"
                onClick={() => setShowResults(false)}
              />
              <div className="absolute top-12 left-0 right-0 z-[51] overflow-hidden rounded-b-[24px]">
                <div className="bg-background border-b border-x border-border shadow-2xl pt-2 pb-2 rounded-b-[24px] animate-in slide-in-from-top-full duration-300 ease-out">
                  <div className="flex-1 overflow-y-auto px-2 pb-2 max-h-[60vh]">
                    {isSearching ? (
                      <div className="p-6 text-center text-sm text-muted-foreground">
                        Aranıyor...
                      </div>
                    ) : searchResults.length > 0 ? (
                      <div className="flex flex-col">
                        {searchResults.map((product) => (
                          <Link
                            key={product.id}
                            href={`/products/${product.slug}`}
                            onClick={() => {
                              setShowResults(false);
                              setSearchQuery("");
                              setIsMobileSearchOpen(false);
                            }}
                            className="flex items-center gap-3 p-3 mx-1 my-1 rounded-xl hover:bg-muted transition-colors border border-transparent hover:border-border/50"
                          >
                            <div className="w-12 h-12 bg-muted rounded-lg overflow-hidden relative flex-shrink-0">
                              {product.images?.[0] && (
                                <Image
                                  src={product.images[0]}
                                  alt={product.name}
                                  fill
                                  className="object-cover"
                                  sizes="48px"
                                />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-[14px] font-medium text-foreground truncate">
                                {product.name}
                              </p>
                              <p className="text-[14px] font-bold text-primary mt-1">
                                ₺{product.price}
                              </p>
                            </div>
                          </Link>
                        ))}
                        <div className="p-2 mt-1">
                          <Link
                            href={`/products?search=${encodeURIComponent(searchQuery)}`}
                            onClick={() => {
                              setShowResults(false);
                              setIsMobileSearchOpen(false);
                            }}
                            className="flex items-center justify-center w-full p-3 rounded-xl text-[14px] font-bold text-primary hover:bg-muted transition-colors bg-primary/5"
                          >
                            Tüm sonuçları gör
                          </Link>
                        </div>
                      </div>
                    ) : (
                      <div className="p-6 text-center text-sm text-muted-foreground">
                        Sonuç bulunamadı.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
