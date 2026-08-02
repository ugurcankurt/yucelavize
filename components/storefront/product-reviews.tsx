"use client";

import { useState, useEffect } from "react";
import { Star, MessageSquare, ImagePlus, X, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { useReviewForm } from "@/hooks/use-review-form";

interface Review {
  id: string;
  user_id: string;
  user_name: string;
  rating: number;
  comment: string;
  created_at: string;
  images?: string[];
  user_avatar?: string | null;
}

import { checkReviewEligibility } from "@/app/actions/reviews";

interface ProductReviewsProps {
  productId: string;
  reviews: Review[];
}

export function ProductReviews({ productId, reviews }: ProductReviewsProps) {
  const getMaskedName = (name: string) => {
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return name;
    const firstName = parts.slice(0, -1).join(" ");
    const lastName = parts[parts.length - 1];
    return `${firstName} ${lastName.charAt(0)}***`;
  };

  const [showForm, setShowForm] = useState(false);
  const {
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
  } = useReviewForm({
    onSuccess: () => setShowForm(false)
  });

  const [isEligible, setIsEligible] = useState(false);
  useEffect(() => {
    checkReviewEligibility(productId).then(setIsEligible);
  }, [productId]);

  // Lightbox State
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImages, setLightboxImages] = useState<string[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitReview(productId);
  };

  const openLightbox = (imgs: string[], index: number) => {
    setLightboxImages(imgs);
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLightboxIndex((prev) => (prev + 1) % lightboxImages.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLightboxIndex((prev) => (prev - 1 + lightboxImages.length) % lightboxImages.length);
  };

  const averageRating = reviews.length > 0
    ? reviews.reduce((acc, rev) => acc + rev.rating, 0) / reviews.length
    : 0;

  return (
    <div className="w-full mt-12 mb-12" id="reviews">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-2">
            <MessageSquare className="w-6 h-6" /> Ürün Değerlendirmeleri
          </h2>
          {reviews.length > 0 && (
            <div className="flex items-center gap-2 mt-2">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={cn(
                      "w-5 h-5",
                      star <= Math.round(averageRating) ? "fill-amber-400 text-amber-400" : "fill-muted text-muted"
                    )}
                  />
                ))}
              </div>
              <span className="font-bold text-foreground">{averageRating.toFixed(1)}</span>
              <span className="text-muted-foreground text-sm">({reviews.length} değerlendirme)</span>
            </div>
          )}
        </div>

        {isEligible && !showForm && (
          <Button onClick={() => setShowForm(true)} className="rounded-xl px-6 bg-primary text-primary-foreground font-bold shadow-md shadow-primary/20">
            Yorum Yap
          </Button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-muted/30 border border-border p-6 rounded-2xl mb-8 animate-in fade-in duration-300">
          <h3 className="font-bold text-lg mb-4">Ürünü Değerlendir</h3>

          <div className="mb-6">
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
                      star <= rating ? "fill-amber-400 text-amber-400 hover:fill-amber-500 hover:text-amber-500" : "fill-muted text-muted hover:fill-amber-200 hover:text-amber-200"
                    )}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold mb-2">Yorumunuz</label>
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Ürün hakkındaki düşüncelerinizi paylaşın..."
              className="resize-none min-h-[120px] rounded-xl bg-background"
              required
            />
          </div>

          <div className="mb-6">
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
                className="rounded-xl mb-4 border-dashed border-2 hover:bg-muted"
                disabled={loading}
              >
                <ImagePlus className="w-4 h-4 mr-2" /> Fotoğraf Seç
              </Button>
            )}

            {images.length > 0 && (
              <div className="flex flex-wrap gap-4 mt-2">
                {images.map((img, idx) => (
                  <div key={idx} className="relative w-24 h-24 rounded-lg overflow-hidden border border-border shadow-sm group">
                    <Image src={img.preview} alt="Preview" fill sizes="96px" className="object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => setShowForm(false)} className="rounded-xl">
              İptal
            </Button>
            <Button type="submit" disabled={loading} className="rounded-xl px-6 bg-primary font-bold shadow-md">
              {loading ? "Gönderiliyor..." : "Gönder"}
            </Button>
          </div>
        </form>
      )}

      {reviews.length === 0 ? (
        <div className="text-center py-12 bg-muted/20 rounded-3xl border border-dashed border-border">
          <MessageSquare className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
          <p className="text-muted-foreground">Bu ürün için henüz yorum yapılmamış.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reviews.map((review) => (
            <Card key={review.id} className="relative border-border/50 shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-card to-muted/20 group">
              <div className="absolute top-4 right-4 text-muted/20 group-hover:text-primary/10 transition-colors pointer-events-none">
                <MessageSquare className="w-24 h-24 rotate-12" strokeWidth={1} />
              </div>
              <CardHeader className="pb-2 relative z-10">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <Link href={`/user/${review.user_id}`} className="relative shrink-0 group/user block">
                      <div className="absolute inset-0 bg-gradient-to-tr from-primary to-primary/40 rounded-full blur-md opacity-40 group-hover/user:opacity-80 transition-opacity"></div>
                      <Avatar className="h-14 w-14 border-2 border-background shadow-sm relative z-10 transition-transform group-hover/user:scale-105">
                        {review.user_avatar && <AvatarImage src={review.user_avatar} alt={review.user_name} className="object-cover" />}
                        <AvatarFallback className="bg-gradient-to-br from-primary/10 to-primary/5 text-primary font-bold text-xl">
                          {review.user_name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </Link>
                    <div className="flex flex-col">
                      <Link href={`/user/${review.user_id}`} className="group/user block w-fit">
                        <h4 className="font-bold text-foreground text-lg leading-none mb-1.5 group-hover/user:text-primary transition-colors group-hover/user:underline underline-offset-4">{getMaskedName(review.user_name)}</h4>
                      </Link>
                      <div className="flex items-center gap-2">
                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={cn(
                                "w-3.5 h-3.5",
                                star <= review.rating ? "fill-amber-400 text-amber-400" : "fill-muted text-muted"
                              )}
                            />
                          ))}
                        </div>
                        <span className="text-[11px] font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                          {new Date(review.created_at).toLocaleDateString('tr-TR')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-4 relative z-10">
                <p className="text-foreground/90 leading-relaxed text-[15px] font-medium italic">
                  &quot;{review.comment}&quot;
                </p>

                {/* Review Images */}
                {review.images && review.images.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-5 pt-4 border-t border-border/40">
                    {review.images.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => openLightbox(review.images!, idx)}
                        className="relative w-16 h-16 rounded-lg overflow-hidden border-2 border-border/50 cursor-pointer hover:border-primary/50 transition-colors shadow-sm"
                      >
                        <Image src={img} alt="Müşteri Görseli" fill sizes="64px" className="object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Lightbox Modal */}
      {lightboxImages.length > 0 && (
        <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
          <DialogContent
            showCloseButton={false}
            className="sm:max-w-5xl bg-transparent border-none shadow-none text-white p-0 overflow-visible ring-0"
          >
            <div className="relative w-full h-[70vh] sm:h-[85vh] flex items-center justify-center">
              <Image
                src={lightboxImages[lightboxIndex]}
                alt="Büyütülmüş Görsel"
                fill
                sizes="100vw"
                className="object-contain"
                unoptimized
              />
            </div>

            <button
              className="absolute -top-12 right-0 md:-right-12 text-white/70 hover:text-white bg-black/40 p-2 rounded-full backdrop-blur transition-colors z-50"
              onClick={() => setLightboxOpen(false)}
            >
              <X className="w-6 h-6" />
            </button>

            {lightboxImages.length > 1 && (
              <>
                <button
                  className="absolute left-2 md:-left-12 top-1/2 -translate-y-1/2 text-white/70 hover:text-white bg-black/40 p-3 rounded-full backdrop-blur transition-colors z-50"
                  onClick={prevImage}
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  className="absolute right-2 md:-right-12 top-1/2 -translate-y-1/2 text-white/70 hover:text-white bg-black/40 p-3 rounded-full backdrop-blur transition-colors z-50"
                  onClick={nextImage}
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}

            <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 text-white/80 bg-black/40 px-4 py-1 rounded-full backdrop-blur text-sm font-medium z-50">
              {lightboxIndex + 1} / {lightboxImages.length}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
