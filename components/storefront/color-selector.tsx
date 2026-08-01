"use client";
import { Check } from "lucide-react";

interface ColorSelectorProps {
  colors?: string[];
  selectedColor: string | null;
  onSelectColor: (color: string) => void;
  variant?: "default" | "navbar";
}

export function ColorSelector({
  colors,
  selectedColor,
  onSelectColor,
  variant = "default",
}: ColorSelectorProps) {
  if (!colors || colors.length === 0) return null;

  return (
    <div className="mb-2">
      <h3 className={`text-sm font-medium mb-3 ${variant === "navbar" ? "text-primary-foreground/90" : "text-foreground"}`}>
        Seçenek:{" "}
        {selectedColor ? (
          <span className={`font-semibold ml-1 ${variant === "navbar" ? "text-primary-foreground" : "text-primary"}`}>
            {selectedColor}
          </span>
        ) : (
          <span className={`font-normal ml-1 ${variant === "navbar" ? "text-primary-foreground/70" : "text-destructive"}`}>
            Lütfen Seçiniz
          </span>
        )}
      </h3>
      <div className="flex flex-wrap gap-2">
        {colors.map((color) => {
          const isSelected = selectedColor === color;
          return (
              <button
                key={color}
                onClick={() => onSelectColor(color)}
                className={`relative flex items-center justify-center px-4 py-2 rounded-lg border-2 transition-all hover:opacity-90 ${
                  isSelected 
                    ? (variant === "navbar" ? "border-primary-foreground bg-primary-foreground text-primary shadow-md" : "border-primary bg-primary/5 text-primary shadow-md") 
                    : (variant === "navbar" ? "border-primary-foreground/40 bg-transparent text-primary-foreground" : "border-border bg-background text-foreground")
                }`}
                title={color}
              >
                {isSelected && (
                  <Check className={`w-4 h-4 mr-2 ${variant === "navbar" ? "text-primary" : "text-primary"}`} />
                )}
                <span className={`text-sm font-medium`}>
                  {color}
                </span>
              </button>
          );
        })}
      </div>
    </div>
  );
}
