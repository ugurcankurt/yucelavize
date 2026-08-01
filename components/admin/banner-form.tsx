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
import { createBanner, updateBanner } from "@/app/actions/banners";

interface BannerFormProps {
  initialData?: any;
}

export function BannerForm({ initialData }: BannerFormProps) {
  const router = useRouter();
  const supabase = createClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(initialData?.image_url || null);
  const [isLarge, setIsLarge] = useState(initialData?.is_large ?? false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const title = formData.get("title") as string;

    if (!title) {
      setError("Lütfen başlık alanını doldurun.");
      setIsSubmitting(false);
      return;
    }

    if (!initialData && !imageFile && !initialData?.image_url) {
      setError("Lütfen görsel yükleyin.");
      setIsSubmitting(false);
      return;
    }

    try {
      let finalImageUrl = initialData?.image_url;

      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('banners') 
          .upload(fileName, imageFile);

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage
          .from('banners')
          .getPublicUrl(fileName);
          
        finalImageUrl = publicUrlData.publicUrl;
      }

      formData.set("image_url", finalImageUrl);
      formData.set("is_large", isLarge ? "true" : "false");
      formData.set("is_active", "true"); // Always keep active unless toggled elsewhere or add a switch

      if (initialData) {
        await updateBanner(initialData.id, formData);
      } else {
        await createBanner(formData);
      }

      router.push("/admin/banners");
      router.refresh();
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Banner kaydedilirken bir hata oluştu.");
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
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="bg-destructive/10 text-destructive p-3 rounded-md text-sm">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <Label>Banner Görseli</Label>
        <div className="flex items-center gap-4">
          <label 
            htmlFor="image_upload" 
            className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-lg cursor-pointer bg-muted hover:bg-muted/80 transition-colors relative overflow-hidden"
          >
            {imagePreview ? (
              <Image src={imagePreview} alt="Preview" fill sizes="(max-width: 768px) 100vw, 50vw" priority className="object-cover" />
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
        <Label htmlFor="pre_title">Üst Başlık (Örn: Modern Koleksiyon)</Label>
        <Input
          id="pre_title"
          name="pre_title"
          defaultValue={initialData?.pre_title}
          placeholder="İsteğe bağlı üst başlık"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="title">Ana Başlık * (Alt satıra geçmek için &lt;br/&gt; kullanabilirsiniz)</Label>
        <Input
          id="title"
          name="title"
          defaultValue={initialData?.title}
          placeholder="Örn: Tarzınızı<br/>Yansıtın"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="subtitle">Alt Başlık</Label>
        <Input
          id="subtitle"
          name="subtitle"
          defaultValue={initialData?.subtitle}
          placeholder="İsteğe bağlı alt başlık"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="button_text">Buton Metni</Label>
          <Input
            id="button_text"
            name="button_text"
            defaultValue={initialData?.button_text}
            placeholder="Örn: İncele"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="link_url">Yönlendirilecek Link</Label>
          <Input
            id="link_url"
            name="link_url"
            defaultValue={initialData?.link_url}
            placeholder="Örn: /products veya /products?category=modern"
          />
        </div>
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
          <label className="flex items-center gap-2 cursor-pointer">
            <input 
              type="checkbox" 
              name="is_large" 
              checked={isLarge}
              onChange={(e) => setIsLarge(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300"
            />
            <span className="text-sm font-medium">Büyük Sol Banner Yap</span>
          </label>
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <Link href="/admin/banners">
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
            "Banner'ı Kaydet"
          )}
        </Button>
      </div>
    </form>
  );
}
