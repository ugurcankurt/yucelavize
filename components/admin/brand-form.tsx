"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, ImagePlus } from "lucide-react";
import Image from "next/image";
import { createBrand, updateBrand } from "@/app/actions/brands";
import { convertToWebP } from "@/lib/utils/image";
import { Switch } from "@/components/ui/switch";

interface BrandFormProps {
  initialData?: any;
}

export function BrandForm({ initialData }: BrandFormProps) {
  const router = useRouter();
  const supabase = createClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(initialData?.image_url || null);
  const [isActive, setIsActive] = useState(initialData?.is_active ?? true);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;

    if (!name) {
      setError("Lütfen marka adını doldurun.");
      setIsSubmitting(false);
      return;
    }

    if (!initialData && !imageFile && !initialData?.image_url) {
      setError("Lütfen marka logosu yükleyin.");
      setIsSubmitting(false);
      return;
    }

    try {
      let finalImageUrl = initialData?.image_url;

      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('brands') 
          .upload(fileName, imageFile);

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage
          .from('brands')
          .getPublicUrl(fileName);
          
        finalImageUrl = publicUrlData.publicUrl;
      }

      formData.set("image_url", finalImageUrl);
      formData.set("is_active", isActive ? "true" : "false");

      if (initialData) {
        await updateBrand(initialData.id, formData);
      } else {
        await createBrand(formData);
      }

      router.push("/admin/brands");
      router.refresh();
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Marka kaydedilirken bir hata oluştu.");
      setIsSubmitting(false);
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsSubmitting(true);
      try {
        const webpFile = await convertToWebP(file, { maxWidth: 800, maxHeight: 800, quality: 0.8 });
        setImageFile(webpFile);
        setImagePreview(URL.createObjectURL(webpFile));
      } catch (err) {
        console.error(err);
        setError("Görsel dönüştürülürken bir hata oluştu.");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl">
      {error && (
        <div className="bg-destructive/10 text-destructive p-3 rounded-md text-sm">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <Label>Marka Logosu * (WebP formatında kaydedilecektir)</Label>
        <div className="flex items-center gap-4">
          <label 
            htmlFor="image_upload" 
            className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-lg cursor-pointer bg-muted hover:bg-muted/80 transition-colors relative overflow-hidden"
          >
            {imagePreview ? (
              <Image src={imagePreview} alt="Preview" fill sizes="(max-width: 768px) 100vw, 50vw" priority className="object-contain p-4" />
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
        <Label htmlFor="name">Marka Adı *</Label>
        <Input
          id="name"
          name="name"
          defaultValue={initialData?.name}
          placeholder="Örn: Yücel Avize"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="url">Yönlendirme URL (İsteğe bağlı)</Label>
        <Input
          id="url"
          name="url"
          defaultValue={initialData?.url}
          placeholder="Örn: https://example.com"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="sort_order">Sıralama</Label>
          <Input
            id="sort_order"
            name="sort_order"
            type="number"
            defaultValue={initialData?.sort_order ?? 0}
          />
        </div>
        <div className="space-y-2 flex flex-col justify-center pt-6">
          <div className="flex items-center space-x-2">
            <Switch
              id="is_active"
              checked={isActive}
              onCheckedChange={setIsActive}
            />
            <Label htmlFor="is_active">Aktif</Label>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-4 pt-4 border-t">
        <Link href="/admin/brands">
          <Button type="button" variant="outline" disabled={isSubmitting}>
            İptal
          </Button>
        </Link>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Kaydediliyor...
            </>
          ) : (
            "Kaydet"
          )}
        </Button>
      </div>
    </form>
  );
}
