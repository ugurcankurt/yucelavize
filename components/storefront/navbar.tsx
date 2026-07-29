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
    <header className="w-full flex flex-col font-sans sticky top-0 z-50 shadow-sm bg-background">
      {" "}
      {/* Main Navbar */}{" "}
      <div className="w-full border-b border-border bg-background">
        {" "}
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
            {" "}
            <form
              onSubmit={handleSearch}
              className="flex w-full items-center h-12 bg-muted rounded-full border border-border focus-within:border-primary focus-within:bg-background transition-all shadow-inner overflow-hidden"
            >
              {" "}
              <DropdownMenu>
                {" "}
                <DropdownMenuTrigger
                  nativeButton={false}
                  render={
                    <div className="flex items-center h-full px-4 border-r border-border bg-muted cursor-pointer hover:bg-muted transition-colors text-sm font-medium text-muted-foreground gap-2 min-w-max outline-none truncate max-w-[150px]">
                      {" "}
                      {categoryLabel}{" "}
                      <ChevronDown className="w-4 h-4 ml-1 flex-shrink-0" />{" "}
                    </div>
                  }
                />{" "}
                <DropdownMenuContent className="w-48 mt-2 rounded-xl border-border shadow-xl shadow-gray-200/50 p-1">
                  {" "}
                  <Link href="/products">
                    {" "}
                    <DropdownMenuItem className="cursor-pointer rounded-lg py-2 font-medium text-foreground">
                      {" "}
                      Tüm Ürünler{" "}
                    </DropdownMenuItem>{" "}
                  </Link>{" "}
                  {categories.length > 0 && (
                    <DropdownMenuSeparator className="bg-muted my-1" />
                  )}{" "}
                  {categories.map((cat) => (
                    <Link key={cat.id} href={`/products?category=${cat.slug}`}>
                      {" "}
                      <DropdownMenuItem className="cursor-pointer rounded-lg py-2 text-muted-foreground hover:text-foreground">
                        {" "}
                        {cat.name}{" "}
                      </DropdownMenuItem>{" "}
                    </Link>
                  ))}{" "}
                </DropdownMenuContent>{" "}
              </DropdownMenu>{" "}
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => {
                  if (searchQuery.trim().length > 1) setShowResults(true);
                }}
                placeholder="Ne aramıştınız?"
                className="flex-1 h-full bg-transparent px-4 outline-none text-sm text-foreground placeholder:text-muted-foreground"
              />{" "}
              <button
                type="submit"
                className="h-full px-5 text-muted-foreground hover:text-primary transition-colors flex items-center justify-center"
              >
                {" "}
                <Search className="w-5 h-5" />{" "}
              </button>{" "}
            </form>{" "}
            {/* Predictive Search Results */}{" "}
            {showResults && (
              <div className="absolute top-14 left-0 right-0 bg-background border border-border shadow-xl shadow-gray-200/50 rounded-2xl overflow-hidden z-50">
                {" "}
                {isSearching ? (
                  <div className="p-4 text-center text-sm text-muted-foreground">
                    Aranıyor...
                  </div>
                ) : searchResults.length > 0 ? (
                  <div className="flex flex-col">
                    {" "}
                    {searchResults.map((product) => (
                      <Link
                        key={product.id}
                        href={`/products/${product.slug}`}
                        onClick={() => {
                          setShowResults(false);
                          setSearchQuery("");
                        }}
                        className="flex items-center gap-3 p-3 hover:bg-muted transition-colors border-b border-gray-50 last:border-0"
                      >
                        {" "}
                        <div className="w-12 h-12 bg-muted rounded-lg overflow-hidden relative flex-shrink-0">
                          {" "}
                          {product.images?.[0] && (
                            <Image
                              src={product.images[0]}
                              alt={product.name}
                              fill
                              className="object-cover"
                              sizes="48px"
                            />
                          )}{" "}
                        </div>{" "}
                        <div className="flex-1 min-w-0">
                          {" "}
                          <p className="text-sm font-medium text-foreground truncate">
                            {product.name}
                          </p>{" "}
                          <p className="text-sm font-bold text-primary mt-0.5">
                            ₺{product.price}
                          </p>{" "}
                        </div>{" "}
                      </Link>
                    ))}{" "}
                    <Link
                      href={`/products?search=${encodeURIComponent(searchQuery)}`}
                      onClick={() => setShowResults(false)}
                      className="block p-3 text-center text-sm font-semibold text-primary hover:bg-muted transition-colors bg-muted"
                    >
                      {" "}
                      Tüm sonuçları gör{" "}
                    </Link>{" "}
                  </div>
                ) : (
                  <div className="p-4 text-center text-sm text-muted-foreground">
                    Sonuç bulunamadı.
                  </div>
                )}{" "}
              </div>
            )}{" "}
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
                          {" "}
                          {profile?.full_name?.split("")[0] ||
                            user.email?.split("@")[0] ||
                            "Hesabım"}{" "}
                          <ChevronDown className="w-3 h-3 text-muted-foreground group-hover:text-primary" />{" "}
                        </span>{" "}
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
        {/* Mobile Search Row */}{" "}
        <div className="lg:hidden container mx-auto px-4 pb-4">
          {" "}
          <div className="relative" ref={mobileSearchRef}>
            {" "}
            <form
              onSubmit={handleSearch}
              className="flex w-full items-center h-12 bg-muted rounded-full border border-border focus-within:border-primary focus-within:bg-background transition-all overflow-hidden px-4 shadow-inner"
            >
              {" "}
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => {
                  if (searchQuery.trim().length > 1) setShowResults(true);
                }}
                placeholder="Ürün veya marka ara..."
                className="flex-1 h-full bg-transparent outline-none text-[15px] text-foreground placeholder:text-muted-foreground"
              />{" "}
              <button
                type="submit"
                className="h-full pl-3 text-muted-foreground hover:text-primary transition-colors flex items-center justify-center"
              >
                {" "}
                <Search className="w-5 h-5" />{" "}
              </button>{" "}
            </form>{" "}
            {/* Predictive Search Results (Mobile) */}{" "}
            {showResults && (
              <div className="absolute top-14 left-0 right-0 bg-background border border-border shadow-xl shadow-gray-200/50 rounded-2xl overflow-hidden z-50">
                {" "}
                {isSearching ? (
                  <div className="p-4 text-center text-sm text-muted-foreground">
                    Aranıyor...
                  </div>
                ) : searchResults.length > 0 ? (
                  <div className="flex flex-col">
                    {" "}
                    {searchResults.map((product) => (
                      <Link
                        key={product.id}
                        href={`/products/${product.slug}`}
                        onClick={() => {
                          setShowResults(false);
                          setSearchQuery("");
                        }}
                        className="flex items-center gap-3 p-3 hover:bg-muted transition-colors border-b border-gray-50 last:border-0"
                      >
                        {" "}
                        <div className="w-12 h-12 bg-muted rounded-lg overflow-hidden relative flex-shrink-0">
                          {" "}
                          {product.images?.[0] && (
                            <Image
                              src={product.images[0]}
                              alt={product.name}
                              fill
                              className="object-cover"
                              sizes="48px"
                            />
                          )}{" "}
                        </div>{" "}
                        <div className="flex-1 min-w-0">
                          {" "}
                          <p className="text-sm font-medium text-foreground truncate">
                            {product.name}
                          </p>{" "}
                          <p className="text-sm font-bold text-primary mt-0.5">
                            ₺{product.price}
                          </p>{" "}
                        </div>{" "}
                      </Link>
                    ))}{" "}
                    <Link
                      href={`/products?search=${encodeURIComponent(searchQuery)}`}
                      onClick={() => setShowResults(false)}
                      className="block p-3 text-center text-sm font-semibold text-primary hover:bg-muted transition-colors bg-muted"
                    >
                      {" "}
                      Tüm sonuçları gör{" "}
                    </Link>{" "}
                  </div>
                ) : (
                  <div className="p-4 text-center text-sm text-muted-foreground">
                    Sonuç bulunamadı.
                  </div>
                )}{" "}
              </div>
            )}{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
    </header>
  );
}
