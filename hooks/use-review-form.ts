import { useState, useRef } from "react";
import { toast } from "@/components/ui/toast";
import { createClient } from "@/lib/supabase/client";
import { addReview } from "@/app/actions/reviews";

import { convertToWebP } from "@/lib/utils/image";

export function useReviewForm({ onSuccess }: { onSuccess?: () => void } = {}) {
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState("");
  const [images, setImages] = useState<{ file: File; preview: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  const resetForm = () => {
    setRating(5);
    setComment("");
    setImages([]);
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
          const webpFile = await convertToWebP(file, { maxWidth: 1200, maxHeight: 1200, quality: 0.8 });
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

  const submitReview = async (productId: string) => {
    if (rating < 1 || rating > 5) return;
    if (!comment.trim()) {
      toast.add({ title: "Uyarı", description: "Lütfen bir yorum yazın.", type: "error" } as any);
      return;
    }

    setLoading(true);
    
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
      if (onSuccess) onSuccess();
    }
    setLoading(false);
  };

  return {
    rating,
    setRating,
    comment,
    setComment,
    images,
    loading,
    fileInputRef,
    handleImageChange,
    removeImage,
    submitReview,
    resetForm,
  };
}
