"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/lib/supabase/client";
import { UploadCloud, X, Search, Check } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "@/components/ui/toast";
import { convertToWebP } from "@/lib/utils/image";
import { Switch } from "@/components/ui/switch";

interface CollectionFormProps {
  initialData?: { 
    id: string; 
    name: string; 
    slug: string; 
    description?: string;
    image_url?: string;
    is_active?: boolean;
  };
}

export function CollectionForm({ initialData }: CollectionFormProps) {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [isActive, setIsActive] = useState(initialData?.is_active ?? true);
  
  // Products Management
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [selectedProductIds, setSelectedProductIds] = useState<Set<string>>(new Set());
  const [productSearch, setProductSearch] = useState("");
  const [loadingProducts, setLoadingProducts] = useState(true);

  const [image, setImage] = useState<{ file?: File; preview: string } | null>(
    initialData?.image_url ? { preview: initialData.image_url } : null,
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function loadProducts() {
      setLoadingProducts(true);
      // Fetch all products
      const { data: products } = await supabase
        .from("products")
        .select("id, name, slug, price, images")
        .order("created_at", { ascending: false });
        
      if (products) setAllProducts(products);
      
      // If editing, fetch existing collection products
      if (initialData?.id) {
        const { data: colProducts } = await supabase
          .from("collection_products")
          .select("product_id")
          .eq("collection_id", initialData.id);
          
        if (colProducts) {
          const ids = new Set(colProducts.map((cp) => cp.product_id));
          setSelectedProductIds(ids);
        }
      }
      setLoadingProducts(false);
    }
    loadProducts();
  }, [initialData?.id, supabase]);

  const toggleProduct = (productId: string) => {
    const newSet = new Set(selectedProductIds);
    if (newSet.has(productId)) {
      newSet.delete(productId);
    } else {
      newSet.add(productId);
    }
    setSelectedProductIds(newSet);
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setLoading(true);
      const file = e.target.files[0];
      try {
        const webpFile = await convertToWebP(file, { maxWidth: 1200, maxHeight: 1200, quality: 0.8 });
        setImage({ file: webpFile, preview: URL.createObjectURL(webpFile) });
      } catch (error) {
        console.error("WebP dönüşüm hatası:", error);
        toast.add({
          title: "Hata",
          description: "Görsel WebP formatına dönüştürülemedi.",
          type: "error",
        } as any);
      }
      setLoading(false);
    }
  };

  const removeImage = () => {
    setImage(null);
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const slug = formData.get("slug") as string;
    const description = formData.get("description") as string;

    if (!name || !slug) {
      setLoading(false);
      return;
    }

    let finalImageUrl = initialData?.image_url || null;

    // 1. Upload new image if selected
    if (image?.file) {
      const fileName = `${slug}-${Date.now()}-${Math.random().toString(36).substring(7)}.webp`;
      const { data, error: uploadError } = await supabase.storage
        .from("collections")
        .upload(fileName, image.file, { cacheControl: "3600", upsert: false });

      if (uploadError) {
        console.error("Görsel yüklenemedi:", uploadError);
        toast.add({
          title: "Yükleme Hatası",
          description: "Görsel yüklenirken bir hata oluştu:" + uploadError.message,
          type: "error",
        } as any);
        setLoading(false);
        return;
      }
      if (data) {
        const { data: publicUrlData } = supabase.storage
          .from("collections")
          .getPublicUrl(data.path);
        finalImageUrl = publicUrlData.publicUrl;
      }
    } else if (!image) {
      finalImageUrl = null;
    }

    // 2. Save collection to database
    const collectionData = { 
      name, 
      slug, 
      description,
      image_url: finalImageUrl,
      is_active: isActive,
      updated_at: new Date().toISOString()
    };

    let dbError;
    let collectionId = initialData?.id;

    if (initialData) {
      const { error } = await supabase
        .from("collections")
        .update(collectionData)
        .eq("id", initialData.id);
      dbError = error;
    } else {
      const { data, error } = await supabase
        .from("collections")
        .insert([collectionData])
        .select("id")
        .single();
      dbError = error;
      if (data) collectionId = data.id;
    }

    if (dbError || !collectionId) {
      setLoading(false);
      toast.add({
        title: "Kayıt Hatası",
        description: "Koleksiyon kaydedilirken bir hata oluştu: " + dbError?.message,
        type: "error",
      } as any);
      return;
    }

    // 3. Save Collection Products (Delete all existing for this collection, then insert new ones)
    // First delete
    await supabase
      .from("collection_products")
      .delete()
      .eq("collection_id", collectionId);

    // Then insert
    if (selectedProductIds.size > 0) {
      const cpInserts = Array.from(selectedProductIds).map((pid) => ({
        collection_id: collectionId,
        product_id: pid,
      }));
      
      const { error: cpError } = await supabase
        .from("collection_products")
        .insert(cpInserts);
        
      if (cpError) {
         console.error("Collection products insert error", cpError);
      }
    }

    setLoading(false);
    toast.add({
      title: "Başarılı",
      description: `Koleksiyon başarıyla ${initialData ? "güncellendi" : "eklendi"}!`,
      type: "success",
    } as any);
    router.push("/admin/collections");
    router.refresh();
  }

  const filteredProducts = allProducts.filter(p => 
    p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
    p.slug.toLowerCase().includes(productSearch.toLowerCase())
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Basic Info Section */}
      <div className="space-y-6">
        <h3 className="text-lg font-bold border-b pb-2">Temel Bilgiler</h3>
        <div className="space-y-4">
          <Label>Koleksiyon Görseli (WebP Otomatik Dönüşüm)</Label>
          {!image ? (
            <div className="border-2 border-dashed border-border rounded-lg p-6 flex flex-col items-center justify-center gap-4 transition-colors hover:border-border">
              <div className="rounded-full bg-muted p-3">
                <UploadCloud className="w-6 h-6 text-muted-foreground" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium">Görsel seçin</p>
                <p className="text-xs text-muted-foreground mt-1">PNG, JPG formatları WebP'ye dönüştürülecektir</p>
              </div>
              <Input
                type="file"
                accept="image/*"
                className="hidden"
                ref={fileInputRef}
                onChange={handleImageChange}
              />
              <Button type="button" variant="secondary" onClick={() => fileInputRef.current?.click()}>Fotoğraf Seç</Button>
            </div>
          ) : (
            <div className="relative w-full max-w-sm aspect-[16/9] rounded-lg overflow-hidden border">
              <Image
                src={image.preview}
                alt="Koleksiyon Görseli"
                fill
                sizes="(max-width: 768px) 100vw, 400px"
                className="object-cover"
              />
              <button
                type="button"
                onClick={removeImage}
                className="absolute top-2 right-2 bg-background/50 hover:bg-background/70 text-foreground p-1.5 rounded-full transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="name">Koleksiyon Adı</Label>
            <Input id="name" name="name" defaultValue={initialData?.name} required placeholder="Örn: Yaz Fırsatları" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="slug">Slug (URL)</Label>
            <Input id="slug" name="slug" defaultValue={initialData?.slug} required placeholder="Örn: yaz-firsatlari" />
            <p className="text-xs text-muted-foreground">URL'de görünecek isim. Sadece küçük harf ve tire kullanın.</p>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Açıklama (Opsiyonel)</Label>
          <Textarea id="description" name="description" defaultValue={initialData?.description} rows={3} placeholder="Koleksiyon hakkında kısa bir açıklama..." />
        </div>

        <div className="flex items-center space-x-2 pt-2">
          <Switch 
            id="is_active" 
            checked={isActive} 
            onCheckedChange={setIsActive} 
          />
          <Label htmlFor="is_active">Aktif (Kullanıcılara gösterilir)</Label>
        </div>
      </div>

      {/* Products Selection Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b pb-2">
          <h3 className="text-lg font-bold">Koleksiyon Ürünleri</h3>
          <div className="text-sm text-muted-foreground bg-muted px-3 py-1 rounded-full">
            Seçili: {selectedProductIds.size}
          </div>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Ürün ara..." 
            className="pl-9"
            value={productSearch}
            onChange={(e) => setProductSearch(e.target.value)}
          />
        </div>

        <div className="border rounded-xl overflow-hidden h-[400px] flex flex-col bg-muted/10">
          {loadingProducts ? (
            <div className="flex items-center justify-center h-full">Yükleniyor...</div>
          ) : (
            <div className="overflow-y-auto p-4 space-y-2 h-full">
              {filteredProducts.map((product) => {
                const isSelected = selectedProductIds.has(product.id);
                return (
                  <div 
                    key={product.id}
                    onClick={() => toggleProduct(product.id)}
                    className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                      isSelected ? "border-primary bg-primary/5" : "border-border bg-card hover:bg-muted/50"
                    }`}
                  >
                    <div className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 ${
                      isSelected ? "bg-primary border-primary text-primary-foreground" : "border-muted-foreground/30"
                    }`}>
                      {isSelected && <Check className="w-3 h-3" />}
                    </div>
                    
                    {product.images?.[0] ? (
                      <div className="w-10 h-10 rounded bg-muted overflow-hidden shrink-0 relative border border-border/50">
                        <Image src={product.images[0]} alt={product.name} fill className="object-cover" sizes="40px" />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded bg-muted shrink-0 border border-border/50" />
                    )}
                    
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate">{product.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{product.slug}</p>
                    </div>
                    
                    <div className="text-sm font-bold text-primary">
                      ₺{product.price.toLocaleString("tr-TR")}
                    </div>
                  </div>
                );
              })}
              {filteredProducts.length === 0 && (
                <div className="text-center py-10 text-muted-foreground">Sonuç bulunamadı.</div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-4 pt-4 border-t">
        <Button variant="outline" type="button" nativeButton={false} render={<Link href="/admin/collections" />}>
          İptal
        </Button>
        <Button type="submit" disabled={loading} className="px-8">
          {loading ? "Kaydediliyor..." : "Kaydet"}
        </Button>
      </div>
    </form>
  );
}
