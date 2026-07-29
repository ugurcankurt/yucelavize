"use client";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
interface ProductDetailsAccordionProps {
  description: string;
}
export function ProductDetailsAccordion({
  description,
}: ProductDetailsAccordionProps) {
  const [openSection, setOpenSection] = useState<string>("details");
  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? "" : section);
  };
  return (
    <div className="w-full mt-8 border-t border-border">
      {" "}
      {/* Detaylar */}{" "}
      <div className="border-b border-border">
        {" "}
        <button
          onClick={() => toggleSection("details")}
          className="flex w-full items-center justify-between py-5 text-left font-medium text-foreground hover:text-muted-foreground transition-colors"
        >
          {" "}
          <span className="text-lg">Ürün Açıklaması</span>{" "}
          <ChevronDown
            className={cn(
              "w-5 h-5 transition-transform duration-300",
              openSection === "details" && "rotate-180",
            )}
          />{" "}
        </button>{" "}
        <div
          className={cn(
            "grid transition-all duration-300 ease-in-out",
            openSection === "details"
              ? "grid-rows-[1fr] opacity-100 pb-5"
              : "grid-rows-[0fr] opacity-0",
          )}
        >
          {" "}
          <div className="overflow-hidden">
            {" "}
            <div
              className="prose dark:prose-invert max-w-none text-muted-foreground leading-relaxed"
              dangerouslySetInnerHTML={{ __html: description }}
            />{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
      {/* Teslimat ve İade */}{" "}
      <div className="border-b border-border">
        {" "}
        <button
          onClick={() => toggleSection("delivery")}
          className="flex w-full items-center justify-between py-5 text-left font-medium text-foreground hover:text-muted-foreground transition-colors"
        >
          {" "}
          <span className="text-lg">Teslimat & İade</span>{" "}
          <ChevronDown
            className={cn(
              "w-5 h-5 transition-transform duration-300",
              openSection === "delivery" && "rotate-180",
            )}
          />{" "}
        </button>{" "}
        <div
          className={cn(
            "grid transition-all duration-300 ease-in-out",
            openSection === "delivery"
              ? "grid-rows-[1fr] opacity-100 pb-5"
              : "grid-rows-[0fr] opacity-0",
          )}
        >
          {" "}
          <div className="overflow-hidden">
            {" "}
            <div className="text-muted-foreground space-y-4">
              {" "}
              <p>
                Siparişleriniz genellikle <strong>1-3 iş günü</strong>{" "}
                içerisinde özenle paketlenip kargoya teslim edilmektedir.
              </p>{" "}
              <ul className="list-disc pl-5 space-y-2">
                {" "}
                <li>Tüm Türkiye'ye ücretsiz kargo hizmeti.</li>{" "}
                <li>
                  Taşıma esnasında oluşabilecek hasarlara karşı siparişiniz %100
                  sigortalıdır.
                </li>{" "}
                <li>
                  Teslimat tarihinden itibaren 14 gün içerisinde koşulsuz iade
                  ve değişim hakkınız bulunmaktadır.
                </li>{" "}
              </ul>{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
      {/* Garanti */}{" "}
      <div className="border-b border-border">
        {" "}
        <button
          onClick={() => toggleSection("warranty")}
          className="flex w-full items-center justify-between py-5 text-left font-medium text-foreground hover:text-muted-foreground transition-colors"
        >
          {" "}
          <span className="text-lg">Garanti Kapsamı</span>{" "}
          <ChevronDown
            className={cn(
              "w-5 h-5 transition-transform duration-300",
              openSection === "warranty" && "rotate-180",
            )}
          />{" "}
        </button>{" "}
        <div
          className={cn(
            "grid transition-all duration-300 ease-in-out",
            openSection === "warranty"
              ? "grid-rows-[1fr] opacity-100 pb-5"
              : "grid-rows-[0fr] opacity-0",
          )}
        >
          {" "}
          <div className="overflow-hidden">
            {" "}
            <div className="text-muted-foreground space-y-2">
              {" "}
              <p>
                Tüm Yücel Avize ürünleri üretim ve montaj hatalarına karşı{" "}
                <strong>2 Yıl Resmi Garanti</strong> kapsamındadır.
              </p>{" "}
              <p>
                Kullanıcı kaynaklı kırılma veya deformasyonlar garanti kapsamı
                dışındadır. Ancak yedek parça temini konusunda firmamız her
                zaman destek sağlamaktadır.
              </p>{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
    </div>
  );
}
