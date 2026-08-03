"use client";

import { useEffect } from "react";
import { trackMetaEvent } from "@/lib/meta-pixel";

interface PixelViewContentProps {
  product: {
    id: string;
    name: string;
    price: number;
  };
}

export function PixelViewContent({ product }: PixelViewContentProps) {
  useEffect(() => {
    trackMetaEvent("ViewContent", {
      content_name: product.name,
      content_ids: [product.id],
      content_type: "product",
      value: product.price,
      currency: "TRY",
    });
  }, [product.id, product.name, product.price]);

  return null;
}
