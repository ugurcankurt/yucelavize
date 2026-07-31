"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/lib/supabase/client";
import { UploadCloud, X, Sparkles, Check } from "lucide-react";
import Image from "next/image";
// Preset colors

const COLOR_OPTIONS = [
  { id: "Siyah", hex: "#000000" },
  { id: "Beyaz", hex: "#FFFFFF" },
  { id: "Gri", hex: "#808080" },
  { id: "Gold", hex: "#FFD700" },
  { id: "Krom", hex: "#E8E9EB" },
  { id: "Eskitme", hex: "#C0905D" },
  { id: "Bakır", hex: "#B87333" },
  { id: "Şeffaf", hex: "transparent" },
];
const convertToWebP = async (file: File): Promise<File> => {
  try {
    const imageBitmap = await createImageBitmap(file);
    const canvas = document.createElement("canvas");
    canvas.width = imageBitmap.width;
    canvas.height = imageBitmap.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas context oluşturulamadı");
    ctx.drawImage(imageBitmap, 0, 0);
    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (!blob) return reject(new Error("WebP blob dönüştürme başarısız"));
          const newName = file.name.replace(/\.[^/.]+$/, "") + ".webp";
          resolve(new File([blob], newName, { type: "image/webp" }));
        },
        "image/webp",
        0.8,
      );
    });
  } catch (error) {
    throw new Error(`Görsel işlenemedi: ${(error as Error).message}`);
  }
};
export function ProductForm({ initialData = null }: { initialData?: any }) {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [images, setImages] = useState<{ file: File; preview: string }[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>(
    initialData?.images || [],
  );
  const [categories, setCategories] = useState<{ id: string; name: string }[]>(
    [],
  );
  const [generatingDesc, setGeneratingDesc] = useState(false);
  const [selectedColors, setSelectedColors] = useState<string[]>(
    initialData?.features?.colors || [],
  );
  const [colorMapping, setColorMapping] = useState<Record<string, string>>(
    initialData?.features?.colorMapping || {},
  );
  const fileInputRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const categoryRef = useRef<HTMLSelectElement>(null);
  const descRef = useRef<HTMLTextAreaElement>(null);
  const widthRef = useRef<HTMLInputElement>(null);
  const heightRef = useRef<HTMLInputElement>(null);
  const depthRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    async function fetchCategories() {
      const { data } = await supabase
        .from("categories")
        .select("id, name")
        .order("name");
      if (data) setCategories(data);
      setInitialLoading(false);
    }
    fetchCategories();
  }, [supabase]);
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setLoading(true);
      const newImages: { file: File; preview: string }[] = [];
      for (let i = 0; i < e.target.files.length; i++) {
        const file = e.target.files[i];
        try {
          const webpFile = await convertToWebP(file);
          newImages.push({
            file: webpFile,
            preview: URL.createObjectURL(webpFile),
          });
        } catch (error) {
          console.error("WebP dönüşüm hatası:", error);
        }
      }
      setImages((prev) => [...prev, ...newImages]);
      setLoading(false);
    }
  };
  const removeNewImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };
  const removeExistingImage = (index: number) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };
  const toggleColor = (colorId: string) => {
    setSelectedColors((prev) =>
      prev.includes(colorId)
        ? prev.filter((c) => c !== colorId)
        : [...prev, colorId],
    );
  };
  const generateAIDescription = async () => {
    const name = nameRef.current?.value;
    const catId = categoryRef.current?.value;
    if (!name || !catId) {
      alert(
        "Lütfen AI'ın açıklama yazabilmesi için önce 'Ürün Adı' ve 'Kategori' alanlarını doldurun.",
      );
      return;
    }
    const categoryName = categories.find((c) => c.id === catId)?.name || "";
    setGeneratingDesc(true);
    try {
      const res = await fetch("/api/generate-description", {
        method: "POST",
        body: JSON.stringify({
          productName: name,
          categoryName,
          width: widthRef.current?.value,
          height: heightRef.current?.value,
          depth: depthRef.current?.value,
        }),
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      if (descRef.current) descRef.current.value = data.description;
    } catch (err: any) {
      alert("Açıklama üretilirken hata oluştu:" + err.message);
    } finally {
      setGeneratingDesc(false);
    }
  };
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const slug =
      (formData.get("name") as string)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-") +
      (initialData ? "" : "-" + Date.now().toString().slice(-4));
    // add random suffix for new products to avoid collision

    // 1. Upload new images to Supabase Storage
    const newImageUrls: string[] = [];
    const previewToFinalUrlMap: Record<string, string> = {};
    for (const img of images) {
      const fileName = `${slug}-${Date.now()}-${Math.random().toString(36).substring(7)}.webp`;
      const { data, error: uploadError } = await supabase.storage
        .from("product-images")
        .upload(fileName, img.file, { cacheControl: "3600", upsert: false });
      if (uploadError) {
        console.error("Görsel yüklenemedi:", uploadError);
        continue;
      }
      if (data) {
        const { data: publicUrlData } = supabase.storage
          .from("product-images")
          .getPublicUrl(data.path);
        newImageUrls.push(publicUrlData.publicUrl);
        previewToFinalUrlMap[img.preview] = publicUrlData.publicUrl;
      }
    }
    const allImages = [...existingImages, ...newImageUrls];
    // Build final color mapping
    const finalColorMapping: Record<string, string> = {};
    for (const color of selectedColors) {
      const mappedVal = colorMapping[color];
      if (mappedVal) {
        finalColorMapping[color] = previewToFinalUrlMap[mappedVal] || mappedVal;
      }
    }
    // 2. Prepare payload
    const payload = {
      name: formData.get("name") as string,
      slug: initialData ? initialData.slug : slug,
      description: formData.get("description") as string,
      price: parseFloat(formData.get("price") as string),
      discounted_price: formData.get("discounted_price") ? parseFloat(formData.get("discounted_price") as string) : null,
      stock: parseInt(formData.get("stock") as string, 10),
      sku: formData.get("sku") as string,
      images: allImages,
      category_id: formData.get("category_id") as string,
      features: {
        ...(initialData?.features || {}),
        colors: selectedColors,
        colorMapping: finalColorMapping,
        dimensions: {
          width: widthRef.current?.value || null,
          height: heightRef.current?.value || null,
          depth: depthRef.current?.value || null,
        },
      },
    };
    let error;
    if (initialData) {
      const { error: updateError } = await supabase
        .from("products")
        .update(payload)
        .eq("id", initialData.id);
      error = updateError;
    } else {
      const { error: insertError } = await supabase
        .from("products")
        .insert(payload);
      error = insertError;
    }
    setLoading(false);
    if (error) {
      alert("Hata oluştu:" + error.message);
    } else {
      alert("Ürün başarıyla kaydedildi!");
      router.push("/admin/products");
      router.refresh();
    }
  }
  if (initialLoading) {
    return <div className="p-8 text-center animate-pulse">Yükleniyor...</div>;
  }
  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-8 bg-background p-6 rounded-lg border border-border shadow-sm"
    >
      {" "}
      <div className="space-y-4">
        {" "}
        <Label>Ürün Görselleri (Sınırsız - Otomatik WebP Dönüşümü)</Label>{" "}
        <div className="border-2 border-dashed border-border rounded-lg p-8 flex flex-col items-center justify-center gap-4 transition-colors hover:border-border bg-muted">
          {" "}
          <div className="rounded-full bg-muted p-3 shadow-sm">
            {" "}
            <UploadCloud className="w-6 h-6 text-muted-foreground" />{" "}
          </div>{" "}
          <div className="text-center">
            {" "}
            <p className="text-sm font-medium">
              Yeni görseller ekleyin veya sürükleyip bırakın
            </p>{" "}
            <p className="text-xs text-muted-foreground mt-1">
              PNG, JPG formatları yüksek performans için otomatik WebP'ye
              dönüştürülecektir.
            </p>{" "}
          </div>{" "}
          <Input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
          />{" "}
          <Button
            type="button"
            variant="secondary"
            onClick={() => fileInputRef.current?.click()}
          >
            {" "}
            Fotoğraf Seç{" "}
          </Button>{" "}
        </div>{" "}
        {/* Preview grid */}{" "}
        {(existingImages.length > 0 || images.length > 0) && (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-4">
            {" "}
            {existingImages.map((img, index) => (
              <div
                key={`existing-${index}`}
                className="relative group aspect-square rounded-lg overflow-hidden border border-border shadow-sm"
              >
                {" "}
                <Image
                  src={img}
                  alt="Preview"
                  fill
                  sizes="(max-width: 768px) 50vw, 20vw"
                  className="object-cover"
                />{" "}
                <button
                  type="button"
                  onClick={() => removeExistingImage(index)}
                  className="absolute top-1 right-1 bg-background/60 text-destructive-foreground p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-destructive"
                >
                  {" "}
                  <X className="w-4 h-4" />{" "}
                </button>{" "}
                <div className="absolute bottom-1 left-1 bg-primary/90 text-primary-foreground text-[10px] px-1.5 py-0.5 rounded shadow-sm">
                  {" "}
                  Mevcut{" "}
                </div>{" "}
              </div>
            ))}{" "}
            {images.map((img, index) => (
              <div
                key={`new-${index}`}
                className="relative group aspect-square rounded-lg overflow-hidden border border-border shadow-sm"
              >
                {" "}
                <Image
                  src={img.preview}
                  alt="Preview"
                  fill
                  sizes="(max-width: 768px) 50vw, 20vw"
                  className="object-cover"
                />{" "}
                <button
                  type="button"
                  onClick={() => removeNewImage(index)}
                  className="absolute top-1 right-1 bg-background/60 text-destructive-foreground p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-destructive"
                >
                  {" "}
                  <X className="w-4 h-4" />{" "}
                </button>{" "}
                <div className="absolute bottom-1 left-1 bg-success/90 text-success-foreground text-[10px] px-1.5 py-0.5 rounded shadow-sm">
                  {" "}
                  Yeni ({(img.file.size / 1024).toFixed(0)} KB){" "}
                </div>{" "}
              </div>
            ))}{" "}
          </div>
        )}{" "}
      </div>{" "}
      <div className="space-y-6 pt-6 border-t border-border">
        {" "}
        <div className="grid md:grid-cols-2 gap-6">
          {" "}
          <div className="space-y-2">
            {" "}
            <Label htmlFor="name">Ürün Adı</Label>{" "}
            <Input
              id="name"
              name="name"
              ref={nameRef}
              defaultValue={initialData?.name}
              required
              placeholder="Örn: Kristal Modern Avize"
            />{" "}
          </div>{" "}
          <div className="space-y-2">
            {" "}
            <Label htmlFor="category_id">Kategori</Label>{" "}
            <select
              id="category_id"
              name="category_id"
              ref={categoryRef}
              required
              defaultValue={initialData?.category_id || ""}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {" "}
              <option value="">Kategori Seçin</option>{" "}
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}{" "}
            </select>{" "}
          </div>{" "}
        </div>{" "}
        {/* Renk Seçenekleri */}{" "}
        <div className="space-y-3">
          {" "}
          <Label>Renk Seçenekleri</Label>{" "}
          <div className="flex flex-wrap gap-3">
            {" "}
            {COLOR_OPTIONS.map((color) => {
              const isSelected = selectedColors.includes(color.id);
              return (
                <button
                  key={color.id}
                  type="button"
                  onClick={() => toggleColor(color.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-full border text-sm font-medium transition-all ${isSelected ? "border-primary bg-indigo-50 text-primary " : "border-border hover:border-border bg-background text-muted-foreground "}`}
                >
                  {" "}
                  <span
                    className="w-4 h-4 rounded-full border border-border shadow-sm flex items-center justify-center"
                    style={{ backgroundColor: color.hex }}
                  >
                    {" "}
                    {isSelected && (
                      <Check className="w-3 h-3 text-foreground mix-blend-difference" />
                    )}{" "}
                  </span>{" "}
                  {color.id}{" "}
                </button>
              );
            })}{" "}
          </div>{" "}
          <p className="text-xs text-muted-foreground">
            Müşterileriniz ürün detay sayfasında bu renkleri seçebilecektir.
          </p>{" "}
          {selectedColors.length > 0 &&
            (existingImages.length > 0 || images.length > 0) && (
              <div className="mt-4 p-4 bg-muted rounded-lg border border-border space-y-4">
                {" "}
                <div>
                  {" "}
                  <h4 className="text-sm font-semibold text-foreground">
                    Renk ve Görsel Eşleştirme
                  </h4>{" "}
                  <p className="text-xs text-muted-foreground mt-1">
                    Müşteri bir renge tıkladığında galerinin otomatik olarak
                    hangi görsele kayacağını seçin.
                  </p>{" "}
                </div>{" "}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {" "}
                  {selectedColors.map((colorId) => (
                    <div
                      key={colorId}
                      className="flex items-center justify-between p-3 bg-background rounded-md border border-border shadow-sm"
                    >
                      {" "}
                      <span className="text-sm font-medium flex items-center gap-2">
                        {" "}
                        <span
                          className="w-3 h-3 rounded-full border shadow-sm"
                          style={{
                            backgroundColor: COLOR_OPTIONS.find(
                              (c) => c.id === colorId,
                            )?.hex,
                          }}
                        />{" "}
                        {colorId}{" "}
                      </span>{" "}
                      <select
                        value={colorMapping[colorId] || ""}
                        onChange={(e) =>
                          setColorMapping((prev) => ({
                            ...prev,
                            [colorId]: e.target.value,
                          }))
                        }
                        className="text-sm border border-border rounded-md bg-muted px-2 py-1.5 w-[140px] focus:outline-none focus:ring-1 focus:ring-primary"
                      >
                        {" "}
                        <option value="">Görsel Seçin</option>{" "}
                        {existingImages.map((img, idx) => (
                          <option key={`ext-${idx}`} value={img}>
                            Mevcut Görsel {idx + 1}
                          </option>
                        ))}{" "}
                        {images.map((img, idx) => (
                          <option key={`new-${idx}`} value={img.preview}>
                            Yeni Görsel {idx + 1}
                          </option>
                        ))}{" "}
                      </select>{" "}
                    </div>
                  ))}{" "}
                </div>{" "}
              </div>
            )}{" "}
        </div>{" "}
        <div className="space-y-2">
          {" "}
          <div className="flex items-center justify-between">
            {" "}
            <Label htmlFor="description">
              Ürün Açıklaması (SEO Uyumlu HTML)
            </Label>{" "}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={generateAIDescription}
              disabled={generatingDesc}
              className="gap-2 text-primary border-primary/30 hover:bg-primary/10"
            >
              {" "}
              <Sparkles className="w-4 h-4" />{" "}
              {generatingDesc ? "Yazılıyor..." : "✨ AI ile Üret"}{" "}
            </Button>{" "}
          </div>{" "}
          <Textarea
            id="description"
            name="description"
            ref={descRef}
            defaultValue={initialData?.description}
            required
            placeholder="Ürün özelliklerini detaylıca yazın veya AI ile oluşturun..."
            className="min-h-[160px] font-mono text-sm"
          />{" "}
        </div>{" "}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="space-y-2">
            <Label htmlFor="price">Normal Fiyat (₺)</Label>
            <Input
              id="price"
              name="price"
              type="number"
              step="0.01"
              defaultValue={initialData?.price}
              required
              placeholder="3500.00"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="discounted_price">İndirimli Fiyat (₺) (Opsiyonel)</Label>
            <Input
              id="discounted_price"
              name="discounted_price"
              type="number"
              step="0.01"
              defaultValue={initialData?.discounted_price}
              placeholder="3000.00"
            />
          </div>
          <div className="space-y-2">
            {" "}
            <Label htmlFor="stock">Stok Adedi</Label>{" "}
            <Input
              id="stock"
              name="stock"
              type="number"
              defaultValue={initialData?.stock}
              required
              placeholder="10"
            />{" "}
          </div>{" "}
          <div className="space-y-2">
            {" "}
            <Label htmlFor="sku">Stok Kodu (SKU)</Label>{" "}
            <Input
              id="sku"
              name="sku"
              defaultValue={initialData?.sku}
              required
              placeholder="Örn: YCL-AVZ-001"
            />{" "}
          </div>{" "}
        </div>{" "}
        <div className="pt-6 border-t border-border">
          {" "}
          <h3 className="text-lg font-semibold mb-4 text-foreground">
            Ürün Ölçüleri (Santimetre)
          </h3>{" "}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-muted p-4 rounded-lg border border-border">
            {" "}
            <div className="space-y-2">
              {" "}
              <Label htmlFor="width">En / Genişlik (cm)</Label>{" "}
              <Input
                id="width"
                name="width"
                ref={widthRef}
                defaultValue={initialData?.features?.dimensions?.width || ""}
                type="number"
                placeholder="Örn: 500"
                className="bg-background"
              />{" "}
            </div>{" "}
            <div className="space-y-2">
              {" "}
              <Label htmlFor="height">Boy / Yükseklik (cm)</Label>{" "}
              <Input
                id="height"
                name="height"
                ref={heightRef}
                defaultValue={initialData?.features?.dimensions?.height || ""}
                type="number"
                placeholder="Örn: 1200"
                className="bg-background"
              />{" "}
            </div>{" "}
            <div className="space-y-2">
              {" "}
              <Label htmlFor="depth">Derinlik (cm)</Label>{" "}
              <Input
                id="depth"
                name="depth"
                ref={depthRef}
                defaultValue={initialData?.features?.dimensions?.depth || ""}
                type="number"
                placeholder="Örn: 200"
                className="bg-background"
              />{" "}
            </div>{" "}
          </div>{" "}
          <p className="text-xs text-muted-foreground mt-3">
            {" "}
            Ölçüler, ürün detay sayfasında şık bir teknik şema ile müşterilere
            gösterilecektir.{" "}
          </p>{" "}
        </div>{" "}
      </div>{" "}
      <div className="pt-6">
        {" "}
        <Button
          type="submit"
          disabled={loading}
          className="w-full h-12 text-lg shadow-md hover:shadow-lg transition-shadow"
        >
          {" "}
          {loading
            ? "Kaydediliyor..."
            : initialData
              ? "Değişiklikleri Kaydet"
              : "Ürünü Oluştur"}{" "}
        </Button>{" "}
      </div>{" "}
    </form>
  );
}
