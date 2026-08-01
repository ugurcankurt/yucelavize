"use client";

import { useState, useEffect, use } from "react";
import { createClient } from "@/lib/supabase/client";
import { Loader2 } from "lucide-react";
import { AdminFormLayout } from "@/components/admin/admin-form-layout";
import { SlideForm } from "@/components/admin/slide-form";

export default function EditSlidePage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = createClient();
  const resolvedParams = use(params);
  
  const [isLoading, setIsLoading] = useState(true);
  const [slide, setSlide] = useState<any>(null);

  useEffect(() => {
    const fetchSlide = async () => {
      const { data, error } = await supabase
        .from("hero_slides")
        .select("*")
        .eq("id", resolvedParams.id)
        .single();
        
      if (!error) {
        setSlide(data);
      }
      setIsLoading(false);
    };
    
    fetchSlide();
  }, [resolvedParams.id, supabase]);

  if (isLoading) {
    return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  return (
    <AdminFormLayout title="Slayt Düzenle" backHref="/admin/slides">
      {slide ? (
        <SlideForm initialData={slide} />
      ) : (
        <div className="bg-destructive/10 text-destructive p-3 rounded-md text-sm">
          Slayt bulunamadı.
        </div>
      )}
    </AdminFormLayout>
  );
}
