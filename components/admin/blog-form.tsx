"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, ImagePlus } from "lucide-react";
import Image from "next/image";
import { createBlogPost, updateBlogPost } from "@/app/actions/blog";
import { convertToWebP } from "@/lib/utils/image";
import { Switch } from "@/components/ui/switch";
import { TiptapEditor } from "@/components/admin/tiptap-editor";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface BlogFormProps {
  initialData?: any;
}

export function BlogForm({ initialData }: BlogFormProps) {
  const router = useRouter();
  const supabase = createClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(initialData?.cover_image_url || null);
  const [isPublished, setIsPublished] = useState(initialData?.is_published ?? false);
  const [title, setTitle] = useState(initialData?.title || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [content, setContent] = useState(initialData?.content || "");

  // Otomatik slug oluşturma
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    
    // Eğer düzenleme modunda değilsek veya slug önceden başlıkla aynıysa (otomatik oluşturulmuşsa)
    if (!initialData) {
      const generatedSlug = newTitle
        .toLowerCase()
        .replace(/ğ/g, 'g')
        .replace(/ü/g, 'u')
        .replace(/ş/g, 's')
        .replace(/ı/g, 'i')
        .replace(/ö/g, 'o')
        .replace(/ç/g, 'c')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      setSlug(generatedSlug);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    formData.set("content", content);
    
    // Auto generate slug if empty
    let currentSlug = formData.get("slug") as string;
    if (!currentSlug) {
      currentSlug = (formData.get("title") as string).toLowerCase()
        .replace(/ğ/g, 'g')
        .replace(/ü/g, 'u')
        .replace(/ş/g, 's')
        .replace(/ı/g, 'i')
        .replace(/ö/g, 'o')
        .replace(/ç/g, 'c')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      formData.set("slug", currentSlug);
    }

    if (!title || !content) {
      setError("Lütfen başlık ve içerik alanlarını doldurun.");
      setIsSubmitting(false);
      return;
    }

    try {
      let finalImageUrl = initialData?.cover_image_url;

      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('blog-images') 
          .upload(fileName, imageFile);

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage
          .from('blog-images')
          .getPublicUrl(fileName);
          
        finalImageUrl = publicUrlData.publicUrl;
      }

      if (finalImageUrl) {
        // Just append it to formData since our server action doesn't specifically handle it yet, 
        // wait, I need to update the server action to handle cover_image_url! Let's do that next.
        formData.set("cover_image_url", finalImageUrl);
      }
      
      formData.set("is_published", isPublished ? "true" : "false");

      if (initialData) {
        await updateBlogPost(initialData.id, formData);
      } else {
        await createBlogPost(formData);
      }

    } catch (err: any) {
      console.error(err);
      setError(err.message || "Blog yazısı kaydedilirken bir hata oluştu.");
      setIsSubmitting(false);
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsSubmitting(true);
      try {
        const webpFile = await convertToWebP(file, { maxWidth: 1200, maxHeight: 630, quality: 0.8 });
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
    <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-8 w-full">
      {error && (
        <div className="bg-destructive/10 text-destructive p-3 rounded-md text-sm w-full lg:col-span-3">
          {error}
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 space-y-8 min-w-0">
        <Card className="shadow-sm border-border/50">
          <CardHeader>
            <CardTitle>Genel Bilgiler</CardTitle>
            <CardDescription>
              Blog yazınızın başlığını, URL yapısını ve okuyuculara sunulacak kısa özetini belirleyin.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="title" className="text-sm font-semibold">Başlık <span className="text-destructive">*</span></Label>
              <Input
                id="title"
                name="title"
                value={title}
                onChange={handleTitleChange}
                placeholder="Örn: 2026'nın En Trend Avize Modelleri"
                className="text-base h-11"
                required
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="slug" className="text-sm font-semibold">URL Yolu (Slug)</Label>
              <Input
                id="slug"
                name="slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="Boş bırakılırsa başlıktan otomatik oluşturulur"
                className="bg-muted/50"
              />
              <p className="text-[0.8rem] text-muted-foreground">URL'de görünecek olan benzersiz isim (örn: yucelavize.com/blog/<strong>trend-avizeler</strong>).</p>
            </div>

            <div className="space-y-3">
              <Label htmlFor="excerpt" className="text-sm font-semibold">Kısa Özet</Label>
              <Textarea
                id="excerpt"
                name="excerpt"
                defaultValue={initialData?.excerpt}
                placeholder="Blog listesinde ve sosyal medyada görünecek kısa açıklama..."
                rows={3}
                className="resize-none"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-border/50">
          <CardHeader>
            <CardTitle>İçerik Editörü</CardTitle>
            <CardDescription>
              Yazınızın tamamını burada oluşturun. Gelişmiş araçlarla metninizi zenginleştirebilirsiniz.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <TiptapEditor content={content} onChange={setContent} />
              <input type="hidden" name="content" value={content} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sticky Sidebar */}
      <div className="w-full lg:w-[350px] space-y-6">
        <div className="sticky top-6 space-y-6">
          <Card className="shadow-sm border-border/50">
            <CardHeader>
              <CardTitle>Yayınla</CardTitle>
              <CardDescription>Yazınızı kaydedin veya hemen yayınlayın.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/20">
                <div className="space-y-0.5">
                  <Label htmlFor="is_published" className="font-semibold text-base">Yayın Durumu</Label>
                  <p className="text-xs text-muted-foreground">
                    {isPublished ? "Yazı herkes tarafından görülebilir." : "Sadece yöneticiler görebilir."}
                  </p>
                </div>
                <Switch
                  id="is_published"
                  checked={isPublished}
                  onCheckedChange={setIsPublished}
                />
              </div>
            </CardContent>
            <Separator />
            <CardFooter className="flex items-center justify-between pt-6">
              <Link href="/admin/blog" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Vazgeç
              </Link>
              <Button type="submit" disabled={isSubmitting} className="min-w-[120px]">
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Kaydediliyor
                  </>
                ) : (
                  "Kaydet"
                )}
              </Button>
            </CardFooter>
          </Card>

          <Card className="shadow-sm border-border/50">
            <CardHeader>
              <CardTitle>Kapak Görseli</CardTitle>
              <CardDescription>Yazınızı temsil eden ana görsel.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                <label 
                  htmlFor="image_upload" 
                  className="flex flex-col items-center justify-center w-full aspect-video border-2 border-dashed rounded-xl cursor-pointer bg-muted/40 hover:bg-muted/80 transition-all relative overflow-hidden group"
                >
                  {imagePreview ? (
                    <>
                      <Image src={imagePreview} alt="Preview" fill sizes="(max-width: 768px) 100vw, 33vw" priority className="object-cover group-hover:opacity-60 transition-opacity" />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="bg-background/80 text-foreground px-3 py-1.5 rounded-md text-sm font-semibold backdrop-blur-sm shadow-sm">Görseli Değiştir</span>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center pt-5 pb-6 text-muted-foreground group-hover:text-foreground transition-colors">
                      <ImagePlus className="w-10 h-10 mb-3 opacity-50" />
                      <p className="mb-1 text-sm font-semibold">Tıklayıp Yükleyin</p>
                      <p className="text-xs opacity-70">PNG, JPG, WEBP</p>
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
                <p className="text-[0.8rem] text-muted-foreground text-center">Görsel otomatik olarak WebP formatına (1200x630) optimize edilecektir.</p>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-border/50">
            <CardHeader>
              <CardTitle>SEO Ayarları</CardTitle>
              <CardDescription>Arama motoru optimizasyonu (Opsiyonel).</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="seo_title" className="text-xs font-semibold">Meta Başlığı</Label>
                <Input
                  id="seo_title"
                  name="seo_title"
                  defaultValue={initialData?.seo_title}
                  placeholder="Başlıktan farklı olacaksa..."
                  className="text-sm h-9"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="seo_description" className="text-xs font-semibold">Meta Açıklaması</Label>
                <Textarea
                  id="seo_description"
                  name="seo_description"
                  defaultValue={initialData?.seo_description}
                  placeholder="Arama motorları için özel özet..."
                  rows={4}
                  className="text-sm resize-none"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
}
