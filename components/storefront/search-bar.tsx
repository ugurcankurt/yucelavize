"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";
import { trackMetaEvent } from "@/lib/meta-pixel";
import { trackGAEvent } from "@/lib/google-analytics";

interface SearchBarProps {
  variant?: "desktop" | "mobile";
  onMobileClose?: () => void;
  isMobileOpen?: boolean;
}

export function SearchBar({ variant = "desktop", onMobileClose, isMobileOpen = false }: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [popularProducts, setPopularProducts] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  const popularSearches = ["avize", "aplik", "sarkıt"];

  useEffect(() => {
    async function fetchPopular() {
      const { data } = await supabase
        .from("products")
        .select("id, name, slug, price, images")
        .eq("is_active", true)
        .order("created_at", { ascending: false })
        .limit(3);
      if (data) setPopularProducts(data);
    }
    fetchPopular();
  }, [supabase]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.trim().length > 1) {
        setIsSearching(true);
        setShowResults(true);
        const term = searchQuery.trim();
        
        // Find matching categories first
        const { data: matchedCategories } = await supabase
          .from("categories")
          .select("id")
          .ilike("name", `%${term}%`);
          
        const categoryIds = matchedCategories?.map(c => c.id) || [];
        let orQuery = `name.ilike.%${term}%,description.ilike.%${term}%`;
        if (categoryIds.length > 0) {
          orQuery += `,category_id.in.(${categoryIds.join(",")})`;
        }

        const { data, error } = await supabase
          .from("products")
          .select("id, name, slug, price, images")
          .or(orQuery)
          .limit(5);
          
        if (!error && data) {
          setSearchResults(data);
        }
        setIsSearching(false);
      } else {
        setSearchResults([]);
        // Do not set showResults to false here so we can show popular products
      }
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, supabase]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
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
      trackMetaEvent("Search", { search_string: searchQuery });
      trackGAEvent("search", { search_term: searchQuery });
      router.push(`/products?search=${encodeURIComponent(searchQuery)}`);
    } else {
      router.push(`/products`);
    }
    if (onMobileClose) onMobileClose();
  };

  if (variant === "mobile") {
    return (
      <div
        className={`relative w-full transition-all duration-300 ease-in-out ${isMobileOpen ? "max-h-[500px] opacity-100 mt-3 overflow-visible" : "max-h-0 opacity-0 mt-0 overflow-hidden"
          }`}
        ref={searchRef}
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
            onFocus={() => setShowResults(true)}
            placeholder="Ürün veya marka ara..."
            className="flex-1 h-full bg-transparent outline-none text-[16px] md:text-[14px] text-foreground placeholder:text-muted-foreground ml-3 min-w-0"
          />
        </form>

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
                            if (onMobileClose) onMobileClose();
                          }}
                          className="flex items-center gap-3 p-3 mx-1 my-1 rounded-xl hover:bg-muted transition-colors border border-transparent hover:border-border/50 text-foreground"
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
                            if (onMobileClose) onMobileClose();
                          }}
                          className="flex items-center justify-center w-full p-3 rounded-xl text-[14px] font-bold text-primary hover:bg-muted transition-colors bg-primary/5"
                        >
                          Tüm sonuçları gör
                        </Link>
                      </div>
                    </div>
                  ) : searchQuery.trim().length > 1 ? (
                    <div className="p-6 text-center text-sm text-muted-foreground">
                      Sonuç bulunamadı.
                    </div>
                  ) : (
                    <div className="p-4 animate-in fade-in duration-300">
                      <div className="mb-6">
                        <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">
                          Popüler Aramalar
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {popularSearches.map((term) => (
                            <button
                              type="button"
                              key={term}
                              onClick={(e) => {
                                e.preventDefault();
                                setSearchQuery(term);
                              }}
                              className="px-3 py-1.5 bg-muted/50 hover:bg-primary/10 hover:text-primary text-foreground text-[13px] font-medium rounded-full transition-colors border border-border/50 hover:border-primary/20"
                            >
                              {term}
                            </button>
                          ))}
                        </div>
                      </div>

                      {popularProducts.length > 0 && (
                        <div>
                          <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">
                            Sizin İçin Seçtiklerimiz
                          </h4>
                          <div className="flex flex-col gap-1">
                            {popularProducts.map((product) => (
                              <Link
                                key={product.id}
                                href={`/products/${product.slug}`}
                                onClick={() => {
                                  setShowResults(false);
                                  if (onMobileClose) onMobileClose();
                                }}
                                className="flex items-center gap-3 p-2 rounded-xl hover:bg-muted transition-colors border border-transparent text-foreground"
                              >
                                <div className="w-10 h-10 bg-muted rounded-lg overflow-hidden relative flex-shrink-0">
                                  {product.images?.[0] && (
                                    <Image
                                      src={product.images[0]}
                                      alt={product.name}
                                      fill
                                      className="object-cover"
                                      sizes="40px"
                                    />
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-[13px] font-medium text-foreground truncate">
                                    {product.name}
                                  </p>
                                  <p className="text-[13px] font-bold text-primary mt-0.5">
                                    ₺{product.price}
                                  </p>
                                </div>
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    );
  }

  return (
    <div
      className="hidden lg:flex flex-1 max-w-2xl mx-auto items-center relative"
      ref={searchRef}
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
          onFocus={() => setShowResults(true)}
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
                        className="flex items-center gap-3 p-3 mx-1 my-1 rounded-xl hover:bg-muted transition-colors border border-transparent hover:border-border/50 text-foreground"
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
                ) : searchQuery.trim().length > 1 ? (
                  <div className="p-6 text-center text-sm text-muted-foreground">
                    Sonuç bulunamadı.
                  </div>
                ) : (
                  <div className="p-6 flex flex-col md:flex-row gap-8 animate-in fade-in duration-300">
                    <div className="flex-1">
                      <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4">
                        Popüler Aramalar
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {popularSearches.map((term) => (
                          <button
                            type="button"
                            key={term}
                            onClick={(e) => {
                              e.preventDefault();
                              setSearchQuery(term);
                            }}
                            className="px-4 py-2 bg-muted/50 hover:bg-primary/10 hover:text-primary text-foreground text-[14px] font-medium rounded-full transition-colors border border-border/50 hover:border-primary/20"
                          >
                            {term}
                          </button>
                        ))}
                      </div>
                    </div>

                    {popularProducts.length > 0 && (
                      <div className="flex-1 border-t md:border-t-0 md:border-l border-border/50 pt-6 md:pt-0 md:pl-8">
                        <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4">
                          Sizin İçin Seçtiklerimiz
                        </h4>
                        <div className="flex flex-col gap-2">
                          {popularProducts.map((product) => (
                            <Link
                              key={product.id}
                              href={`/products/${product.slug}`}
                              onClick={() => setShowResults(false)}
                              className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-muted transition-colors border border-transparent text-foreground"
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
                                <p className="text-[14px] font-bold text-primary mt-0.5">
                                  ₺{product.price}
                                </p>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
