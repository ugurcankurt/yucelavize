"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import { UploadCloud, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "@/components/ui/toast";
interface CategoryFormProps {
  initialData?: { id: string; name: string; slug: string; image_url?: string };
}
// Client-side WebP conversion function

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
        // 80% quality
      );
    });
  } catch (error) {
    throw new Error(`Görsel işlenemedi: ${(error as Error).message}`);
  }
};
export function CategoryForm({ initialData }: CategoryFormProps) {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<{ file?: File; preview: string } | null>(
    initialData?.image_url ? { preview: initialData.image_url } : null,
  );
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setLoading(true);
      const file = e.target.files[0];
      try {
        const webpFile = await convertToWebP(file);
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
    if (!name || !slug) {
      setLoading(false);
      return;
    }
    let finalImageUrl = initialData?.image_url || null;
    // 1. Upload new image if selected
    if (image?.file) {
      const fileName = `${slug}-${Date.now()}-${Math.random().toString(36).substring(7)}.webp`;
      const { data, error: uploadError } = await supabase.storage
        .from("category-images")
        .upload(fileName, image.file, { cacheControl: "3600", upsert: false });
      if (uploadError) {
        console.error("Görsel yüklenemedi:", uploadError);
        toast.add({
          title: "Yükleme Hatası",
          description:
            "Görsel yüklenirken bir hata oluştu:" + uploadError.message,
          type: "error",
        } as any);
        setLoading(false);
        return;
      }
      if (data) {
        const { data: publicUrlData } = supabase.storage
          .from("category-images")
          .getPublicUrl(data.path);
        finalImageUrl = publicUrlData.publicUrl;
      }
    } else if (!image) {
      // Image was removed
      finalImageUrl = null;
    }
    // 2. Save category to database
    const categoryData = { name, slug, image_url: finalImageUrl };
    let dbError;
    if (initialData) {
      const { error } = await supabase
        .from("categories")
        .update(categoryData)
        .eq("id", initialData.id);
      dbError = error;
    } else {
      const { error } = await supabase
        .from("categories")
        .insert([categoryData]);
      dbError = error;
    }
    setLoading(false);
    if (dbError) {
      toast.add({
        title: "Kayıt Hatası",
        description:
          "Kategori kaydedilirken bir hata oluştu:" + dbError.message,
        type: "error",
      } as any);
    } else {
      toast.add({
        title: "Başarılı",
        description: `Kategori başarıyla ${initialData ? "güncellendi" : "eklendi"}!`,
        type: "success",
      } as any);
      router.push("/admin/categories");
      router.refresh();
    }
  }
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {" "}
      <div className="space-y-4">
        {" "}
        <Label>Kategori Görseli (WebP Otomatik Dönüşüm)</Label>{" "}
        {!image ? (
          <div className="border-2 border-dashed border-border rounded-lg p-6 flex flex-col items-center justify-center gap-4 transition-colors hover:border-border">
            {" "}
            <div className="rounded-full bg-muted p-3">
              {" "}
              <UploadCloud className="w-6 h-6 text-muted-foreground" />{" "}
            </div>{" "}
            <div className="text-center">
              {" "}
              <p className="text-sm font-medium">Görsel seçin</p>{" "}
              <p className="text-xs text-muted-foreground mt-1">
                PNG, JPG formatları WebP'ye dönüştürülecektir
              </p>{" "}
            </div>{" "}
            <Input
              type="file"
              accept="image/*"
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
          </div>
        ) : (
          <div className="relative w-48 h-48 rounded-lg overflow-hidden border">
            {" "}
            <Image
              src={image.preview}
              alt="Kategori Görseli"
              fill
              sizes="192px"
              className="object-cover"
            />{" "}
            <button
              type="button"
              onClick={removeImage}
              className="absolute top-2 right-2 bg-background/50 hover:bg-background/70 text-foreground p-1.5 rounded-full transition-colors"
            >
              {" "}
              <X className="w-4 h-4" />{" "}
            </button>{" "}
            {image.file && (
              <div className="absolute bottom-2 left-2 bg-background/60 text-foreground text-[10px] px-1.5 py-0.5 rounded">
                {" "}
                WebP - {(image.file.size / 1024).toFixed(1)} KB{" "}
              </div>
            )}{" "}
          </div>
        )}{" "}
      </div>{" "}
      <div className="space-y-2">
        {" "}
        <Label htmlFor="name">Kategori Adı</Label>{" "}
        <Input
          id="name"
          name="name"
          defaultValue={initialData?.name}
          required
          placeholder="Örn: Avizeler"
        />{" "}
      </div>{" "}
      <div className="space-y-2">
        {" "}
        <Label htmlFor="slug">Slug (URL)</Label>{" "}
        <Input
          id="slug"
          name="slug"
          defaultValue={initialData?.slug}
          required
          placeholder="Örn: avizeler"
        />{" "}
        <p className="text-xs text-muted-foreground">
          URL'de görünecek isim. Sadece küçük harf ve tire kullanın.
        </p>{" "}
      </div>{" "}
      <div className="flex justify-end gap-4 pt-4">
        {" "}
        <Button
          variant="outline"
          type="button"
          nativeButton={false}
          render={<Link href="/admin/categories" />}
        >
          İptal
        </Button>{" "}
        <Button type="submit" disabled={loading}>
          {" "}
          {loading ? "Kaydediliyor..." : "Kaydet"}{" "}
        </Button>{" "}
      </div>{" "}
    </form>
  );
}
