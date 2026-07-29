"use client";
import { Check } from "lucide-react";
const COLOR_MAP: Record<string, string> = {
  Siyah: "bg-foreground",
  Beyaz: "bg-background",
  Gri: "bg-muted",
  Gold: "bg-warning",
  Krom: "bg-border",
  Eskitme: "bg-accent",
  Bakır: "bg-primary",
  Şeffaf: "bg-transparent border-dashed",
};
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
      {" "}
      <h3 className="text-sm font-medium text-foreground mb-3">
        {" "}
        Renk Seçeneği:{" "}
        {selectedColor ? (
          <span className="text-primary font-semibold ml-1">
            {selectedColor}
          </span>
        ) : (
          <span className="text-destructive font-normal ml-1">
            Lütfen Seçiniz
          </span>
        )}{" "}
      </h3>{" "}
      <div className="flex flex-wrap gap-3">
        {" "}
        {colors.map((color) => {
          const bgClass = COLOR_MAP[color] || "bg-muted";
          /* default gray if unknown */ const isSelected =
            selectedColor === color;
          return (
            <button
              key={color}
              onClick={() => onSelectColor(color)}
              className={`relative flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all hover:scale-110 ${isSelected ? "border-primary scale-110 shadow-md" : "border-transparent ring-1 ring-border"}`}
              title={color}
            >
              {" "}
              <span
                className={`w-8 h-8 rounded-full shadow-inner border border-border/5 flex items-center justify-center ${bgClass}`}
              >
                {" "}
                {isSelected && (
                  <Check
                    className={`w-4 h-4 ${["Beyaz", "Krom", "Şeffaf", "Gri", "Gold"].includes(color) ? "text-foreground" : "text-background"}`}
                  />
                )}{" "}
              </span>{" "}
            </button>
          );
        })}{" "}
      </div>{" "}
    </div>
  );
}
