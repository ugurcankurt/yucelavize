"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { ProductForm } from "@/components/admin/product-form";
import { createClient } from "@/lib/supabase/client";

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const supabase = createClient();

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProduct() {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();

      if (data) {
        setProduct(data);
      } else {
        alert("Ürün bulunamadı!");
        router.push("/admin/products");
      }
      setLoading(false);
    }

    fetchProduct();
  }, [id, supabase, router]);

  if (loading) {
    return (
      <div className="p-8 text-center animate-pulse">Ürün yükleniyor...</div>
    );
  }

  if (!product) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-2xl font-bold tracking-tight text-foreground dark:text-zinc-100">
          Ürün Düzenle
        </h2>
      </div>

      <ProductForm initialData={product} />
    </div>
  );
}
