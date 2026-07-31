"use client";

import { useState, useRef } from "react";
import { Star, MessageSquare, ImagePlus, X, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";
import { addReview } from "@/app/actions/reviews";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface OrderItem {
  id: string;
  product_id: string;
  product: {
    name: string;
    slug: string;
    images: string[];
  };
}

const convertToWebP = async (file: File): Promise<File> => {
  try {
    let sourceFile: Blob = file;

    if (
      file.type === "image/heic" || 
      file.type === "image/heif" || 
      file.name.toLowerCase().endsWith(".heic") ||
      file.name.toLowerCase().endsWith(".heif")
    ) {
      const heic2any = (await import("heic2any")).default;
      const converted = await heic2any({
        blob: file,
        toType: "image/jpeg",
        quality: 0.8
      });
      sourceFile = Array.isArray(converted) ? converted[0] : converted;
    }

    const imageBitmap = await createImageBitmap(sourceFile);
    const canvas = document.createElement("canvas");
    canvas.width = imageBitmap.width;
    canvas.height = imageBitmap.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas context oluşturulamadı");
    ctx.drawImage(imageBitmap, 0, 0);
    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (!blob) return reject(new Error("WebP dönüşüm hatası"));
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

export function OrderReviewDialog({ orderItems }: { orderItems: OrderItem[] }) {
  const [open, setOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<OrderItem["product"] | null>(null);
  
  // Form State
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState("");
  const [images, setImages] = useState<{ file: File; preview: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  if (!orderItems || orderItems.length === 0) return null;

  const resetForm = () => {
    setSelectedProduct(null);
    setRating(5);
    setComment("");
    setImages([]);
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      setTimeout(resetForm, 300);
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      if (images.length + e.target.files.length > 5) {
        toast.add({ title: "Uyarı", description: "En fazla 5 görsel yükleyebilirsiniz.", type: "error" } as any);
        return;
      }
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

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent, productId: string) => {
    e.preventDefault();
    if (rating < 1 || rating > 5) return;
    if (!comment.trim()) {
      toast.add({ title: "Uyarı", description: "Lütfen bir yorum yazın.", type: "error" } as any);
      return;
    }

    setLoading(true);
    
    // Upload Images
    const uploadedUrls: string[] = [];
    if (images.length > 0) {
      for (const img of images) {
        const fileName = `${productId}-${Date.now()}-${Math.random().toString(36).substring(7)}.webp`;
        const { data, error } = await supabase.storage
          .from("review-images")
          .upload(fileName, img.file, { cacheControl: "3600", upsert: false });
        
        if (error) {
          console.error("Görsel yüklenemedi:", error);
        } else if (data) {
          const { data: publicUrlData } = supabase.storage
            .from("review-images")
            .getPublicUrl(data.path);
          uploadedUrls.push(publicUrlData.publicUrl);
        }
      }
    }

    const result = await addReview(productId, rating, comment, uploadedUrls);
    
    if (result.error) {
      toast.add({ title: "Hata", description: result.error, type: "error" } as any);
    } else {
      toast.add({ title: "Başarılı", description: "Yorumunuz başarıyla eklendi.", type: "success" } as any);
      resetForm();
      setOpen(false);
    }
    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger
        render={
          <Button
            variant="default"
            className="rounded-xl px-6 font-bold shadow-md bg-amber-500 hover:bg-amber-600 text-white shrink-0 w-full sm:w-auto"
          >
            <Star className="w-4 h-4 mr-2 fill-white" />
            Değerlendir
          </Button>
        }
      />
      <DialogContent className="sm:max-w-md rounded-3xl p-6 gap-6 bg-card border-border">
        {!selectedProduct ? (
          <>
            <DialogHeader>
              <DialogTitle className="text-xl font-bold flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-primary" />
                Hangi Ürünü Değerlendireceksiniz?
              </DialogTitle>
            </DialogHeader>
            
            <div className="flex flex-col gap-4 max-h-[60vh] overflow-y-auto pr-2">
              {orderItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 border border-border/60 rounded-2xl bg-muted/20 hover:bg-muted/40 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-white border border-border/50 shrink-0">
                      <Image 
                        src={item.product?.images?.[0] || "/placeholder.jpg"} 
                        alt={item.product?.name || "Ürün"} 
                        fill 
                        sizes="48px"
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm line-clamp-2">{item.product?.name}</h4>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    className="rounded-xl bg-primary hover:bg-primary/90 font-bold shrink-0 ml-4 h-9 text-primary-foreground"
                    onClick={() => setSelectedProduct(item.product)}
                  >
                    Yorum Yap
                  </Button>
                </div>
              ))}
            </div>
          </>
        ) : (
          <form onSubmit={(e) => handleSubmit(e, orderItems.find(i => i.product.slug === selectedProduct.slug)!.product_id)} className="flex flex-col gap-5">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold flex items-center gap-2">
                <button type="button" onClick={() => setSelectedProduct(null)} className="mr-1 hover:bg-muted p-1 rounded-full transition-colors">
                  <ChevronLeft className="w-5 h-5 text-muted-foreground" />
                </button>
                Ürünü Değerlendir
              </DialogTitle>
            </DialogHeader>

            <div className="flex items-center gap-4 bg-muted/30 p-3 rounded-2xl border border-border/60">
              <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-white border border-border/50 shrink-0">
                <Image src={selectedProduct.images?.[0] || "/placeholder.jpg"} alt={selectedProduct.name} fill sizes="56px" className="object-cover" />
              </div>
              <h4 className="font-semibold text-sm line-clamp-2">{selectedProduct.name}</h4>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Puanınız</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="focus:outline-none"
                  >
                    <Star 
                      className={cn(
                        "w-8 h-8 transition-colors",
                        star <= rating ? "fill-amber-400 text-amber-400 hover:fill-amber-500" : "fill-muted text-muted hover:fill-amber-200"
                      )} 
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Yorumunuz</label>
              <Textarea 
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Ürün hakkındaki düşüncelerinizi paylaşın..."
                className="resize-none min-h-[100px] rounded-xl bg-background"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Görsel Ekle (En fazla 5 adet)</label>
              <input 
                type="file" 
                accept="image/*" 
                multiple 
                className="hidden" 
                ref={fileInputRef} 
                onChange={handleImageChange}
              />
              {images.length < 5 && (
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => fileInputRef.current?.click()} 
                  className="rounded-xl w-full mb-3 border-dashed border-2 hover:bg-muted"
                  disabled={loading}
                >
                  <ImagePlus className="w-4 h-4 mr-2" /> Fotoğraf Seç
                </Button>
              )}
              
              {images.length > 0 && (
                <div className="flex flex-wrap gap-3">
                  {images.map((img, idx) => (
                    <div key={idx} className="relative w-16 h-16 rounded-lg overflow-hidden border border-border shadow-sm group">
                      <Image src={img.preview} alt="Preview" fill className="object-cover" />
                      <button 
                        type="button" 
                        onClick={() => removeImage(idx)} 
                        className="absolute top-0.5 right-0.5 bg-black/60 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Button type="submit" disabled={loading} className="rounded-xl w-full h-12 bg-primary font-bold shadow-md text-primary-foreground mt-2">
              {loading ? "Gönderiliyor..." : "Yorumu Gönder"}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
