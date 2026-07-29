"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Loader2, ImagePlus } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function NewSlidePage() {
  const router = useRouter();
  const supabase = createClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const title = formData.get("title") as string;
    const subtitle = formData.get("subtitle") as string;
    const button_text = formData.get("button_text") as string;
    const link_url = formData.get("link_url") as string;
    const sort_order = parseInt(formData.get("sort_order") as string) || 0;

    if (!title || !imageFile) {
      setError("Lütfen başlık ve görsel alanlarını doldurun.");
      setIsSubmitting(false);
      return;
    }

    try {
      // 1. Upload Image
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('product-images') 
        .upload(`slides/${fileName}`, imageFile);

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from('product-images')
        .getPublicUrl(`slides/${fileName}`);

      // 2. Create Slide Record
      const { error: dbError } = await supabase
        .from("hero_slides")
        .insert({
          title,
          subtitle,
          button_text,
          link_url,
          image_url: publicUrlData.publicUrl,
          sort_order,
          is_active: true
        });

      if (dbError) throw dbError;

      router.push("/admin/slides");
      router.refresh();
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Slayt eklenirken bir hata oluştu.");
      setIsSubmitting(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/slides">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h2 className="text-2xl font-bold tracking-tight">Yeni Slayt Ekle</h2>
      </div>

      <div className="rounded-md border bg-card text-card-foreground p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-destructive/10 text-destructive p-3 rounded-md text-sm">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label>Slayt Görseli (Masaüstü için yatay, yüksek çözünürlük önerilir)</Label>
            <div className="flex items-center gap-4">
              <label 
                htmlFor="image_upload" 
                className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-lg cursor-pointer bg-muted hover:bg-muted/80 transition-colors relative overflow-hidden"
              >
                {imagePreview ? (
                  <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                ) : (
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <ImagePlus className="w-8 h-8 mb-3 text-muted-foreground" />
                    <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">Yüklemek için tıklayın</span></p>
                  </div>
                )}
                <input 
                  id="image_upload" 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleImageChange}
                />
              </label>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Ana Başlık *</Label>
            <Input
              id="title"
              name="title"
              placeholder="Örn: Evinizin Işıltısı"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="subtitle">Alt Başlık</Label>
            <Input
              id="subtitle"
              name="subtitle"
              placeholder="Örn: Premium Seri Avize Modelleri"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="button_text">Buton Metni</Label>
              <Input
                id="button_text"
                name="button_text"
                placeholder="Örn: Koleksiyonu Gör"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="link_url">Yönlendirilecek Link</Label>
              <Input
                id="link_url"
                name="link_url"
                placeholder="Örn: /products veya /products?category=modern"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="sort_order">Sıralama (Küçükten büyüğe)</Label>
            <Input
              id="sort_order"
              name="sort_order"
              type="number"
              defaultValue="0"
            />
          </div>

          <div className="flex justify-end gap-4">
            <Link href="/admin/slides">
              <Button type="button" variant="outline">
                İptal
              </Button>
            </Link>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Kaydediliyor...
                </>
              ) : (
                "Slaytı Kaydet"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
