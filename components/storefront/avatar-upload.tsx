"use client";
import { useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { updateAvatarUrl, removeAvatarUrl } from "@/app/actions/auth";
interface AvatarUploadProps {
  userId: string;
  currentAvatarUrl?: string | null;
}
export function AvatarUpload({ userId, currentAvatarUrl }: AvatarUploadProps) {
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    /* Validate size (max 5MB) */ if (file.size > 5 * 1024 * 1024) {
      alert("Dosya boyutu en fazla 5MB olabilir.");
      return;
    }
    setLoading(true);
    const fileExt = file.name.split(".").pop();
    const fileName = `${userId}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
    const filePath = `${userId}/${fileName}`;
    try {
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, { upsert: true });
      if (uploadError) throw uploadError;
      const {
        data: { publicUrl },
      } = supabase.storage.from("avatars").getPublicUrl(filePath);
      const result = await updateAvatarUrl(publicUrl);
      if (result.error) throw new Error(result.error);
    } catch (error) {
      console.error("Upload error:", error);
      alert(
        "Profil fotoğrafı yüklenirken bir hata oluştu. Lütfen bağlantınızı kontrol edin.",
      );
    } finally {
      setLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };
  const handleRemove = async () => {
    if (!confirm("Profil fotoğrafınızı kaldırmak istediğinize emin misiniz?"))
      return;
    setLoading(true);
    try {
      const result = await removeAvatarUrl();
      if (result.error) throw new Error(result.error);
    } catch (error) {
      console.error("Remove error:", error);
      alert("Profil fotoğrafı kaldırılırken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex gap-2 mb-4 relative">
      {" "}
      <input
        type="file"
        accept="image/png, image/jpeg, image/webp"
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileChange}
        disabled={loading}
      />{" "}
      <Button
        variant="outline"
        size="xs"
        className="rounded-full border-border font-semibold px-3 text-[10px]"
        onClick={() => fileInputRef.current?.click()}
        disabled={loading}
      >
        {" "}
        {loading ? "Yükleniyor..." : "Değiştir"}{" "}
      </Button>{" "}
      {currentAvatarUrl && (
        <Button
          variant="ghost"
          size="xs"
          className="rounded-full text-destructive hover:text-destructive hover:bg-destructive/10 font-semibold px-3 text-[10px]"
          onClick={handleRemove}
          disabled={loading}
        >
          {" "}
          Kaldır{" "}
        </Button>
      )}{" "}
    </div>
  );
}
