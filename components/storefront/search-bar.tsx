"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";

interface SearchBarProps {
  variant?: "desktop" | "mobile";
  onMobileClose?: () => void;
  isMobileOpen?: boolean;
}

export function SearchBar({ variant = "desktop", onMobileClose, isMobileOpen = false }: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

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
      router.push(`/products?search=${encodeURIComponent(searchQuery)}`);
    } else {
      router.push(`/products`);
    }
    if (onMobileClose) onMobileClose();
  };

  if (variant === "mobile") {
    return (
      <div 
        className={`relative w-full transition-all duration-300 ease-in-out ${
          isMobileOpen ? "max-h-[500px] opacity-100 mt-3 overflow-visible" : "max-h-0 opacity-0 mt-0 overflow-hidden"
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
            onFocus={() => {
              if (searchQuery.trim().length > 1) setShowResults(true);
            }}
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
  );
}
