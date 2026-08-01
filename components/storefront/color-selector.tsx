"use client";
import { Check } from "lucide-react";

interface ColorSelectorProps {
  colors?: string[];
  selectedColor: string | null;
  onSelectColor: (color: string) => void;
}

export function ColorSelector({
  colors,
  selectedColor,
  onSelectColor,
}: ColorSelectorProps) {
  if (!colors || colors.length === 0) return null;

  return (
    <div className="mb-2">
      <h3 className="text-sm font-medium text-foreground mb-3">
        Seçenek:{" "}
        {selectedColor ? (
          <span className="text-primary font-semibold ml-1">
            {selectedColor}
          </span>
        ) : (
          <span className="text-destructive font-normal ml-1">
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
              className={`relative flex items-center justify-center px-4 py-2 rounded-lg border-2 transition-all hover:bg-muted ${isSelected ? "border-primary bg-primary/5 shadow-md" : "border-border bg-background"}`}
              title={color}
            >
              {isSelected && (
                <Check className="w-4 h-4 mr-2 text-primary" />
              )}
              <span className={`text-sm font-medium ${isSelected ? "text-primary" : "text-foreground"}`}>
                {color}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
