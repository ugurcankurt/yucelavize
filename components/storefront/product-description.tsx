"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductDescriptionProps {
  content: string;
}

export function ProductDescription({ content }: ProductDescriptionProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="w-full mt-4 mb-6">
      <h3 className="text-xl font-bold text-foreground mb-3">Ürün Açıklaması</h3>
      <div className="relative">
        <div
          className={cn(
            "prose dark:prose-invert max-w-none text-muted-foreground leading-relaxed transition-all duration-300",
            !isExpanded && "line-clamp-6 overflow-hidden"
          )}
          dangerouslySetInnerHTML={{ __html: content }}
        />
        
        {/* Fading overlay effect when not expanded */}
        {!isExpanded && (
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent pointer-events-none" />
        )}
      </div>

      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="mt-2 flex items-center gap-1 text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
      >
        {isExpanded ? (
          <>
            Küçült <ChevronUp className="w-4 h-4" />
          </>
        ) : (
          <>
            Devamını Gör <ChevronDown className="w-4 h-4" />
          </>
        )}
      </button>
    </div>
  );
}
