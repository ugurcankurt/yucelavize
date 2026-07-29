"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
interface ProductsFilterProps {
  count: number;
}
export function ProductsFilter({ count }: ProductsFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      return params.toString();
    },
    [searchParams],
  );
  const handleSort = (sortValue: string) => {
    router.push(`?${createQueryString("sort", sortValue)}`);
  };
  const currentSort = searchParams.get("sort") || "newest";
  const sortLabel =
    currentSort === "price-asc"
      ? "Fiyat (Artan)"
      : currentSort === "price-desc"
        ? "Fiyat (Azalan)"
        : "En Yeniler";
  return (
    <div className="flex flex-col sm:flex-row justify-between items-center mb-10 gap-4">
      {" "}
      <div className="flex items-center gap-3">
        {" "}
        <div className="h-4 w-px bg-secondary mx-2 hidden sm:block"></div>{" "}
        <p className="text-sm font-medium text-muted-foreground hidden sm:block">
          {" "}
          <span className="font-bold text-foreground">{count}</span> ürün
          listeleniyor{" "}
        </p>{" "}
      </div>{" "}
      <div className="flex items-center gap-2">
        {" "}
        <span className="text-sm font-medium text-muted-foreground">
          Sırala:
        </span>{" "}
        <DropdownMenu>
          {" "}
          <DropdownMenuTrigger
            render={
              <Button
                variant="ghost"
                className="h-10 px-4 rounded-full font-semibold hover:bg-muted transition-colors"
              />
            }
          >
            {" "}
            {sortLabel} <SlidersHorizontal className="w-4 h-4 ml-2" />{" "}
          </DropdownMenuTrigger>{" "}
          <DropdownMenuContent align="end" className="w-[180px]">
            {" "}
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => handleSort("newest")}
            >
              En Yeniler
            </DropdownMenuItem>{" "}
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => handleSort("price-asc")}
            >
              Fiyat (Artan)
            </DropdownMenuItem>{" "}
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => handleSort("price-desc")}
            >
              Fiyat (Azalan)
            </DropdownMenuItem>{" "}
          </DropdownMenuContent>{" "}
        </DropdownMenu>{" "}
      </div>{" "}
    </div>
  );
}
