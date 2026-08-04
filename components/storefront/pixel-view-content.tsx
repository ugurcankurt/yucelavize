"use client";

import { useEffect } from "react";
import { trackMetaEvent } from "@/lib/meta-pixel";
import { trackGAEvent } from "@/lib/google-analytics";

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

    trackGAEvent("view_item", {
      currency: "TRY",
      value: product.price,
      items: [
        {
          item_id: product.id,
          item_name: product.name,
          price: product.price,
          quantity: 1,
        }
      ]
    });
  }, [product.id, product.name, product.price]);

  return null;
}
