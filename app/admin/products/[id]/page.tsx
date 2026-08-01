"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { ProductForm } from "@/components/admin/product-form";
import { createClient } from "@/lib/supabase/client";
import { AdminFormLayout } from "@/components/admin/admin-form-layout";

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
    <AdminFormLayout title="Ürün Düzenle" backHref="/admin/products" maxWidth="max-w-4xl">
      <ProductForm initialData={product} />
    </AdminFormLayout>
  );
}
