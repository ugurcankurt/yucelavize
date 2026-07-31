import { Box } from "lucide-react";
interface ProductDimensionsProps {
  width?: string | number | null;
  height?: string | number | null;
  depth?: string | number | null;
}
export function ProductDimensions({
  width,
  height,
  depth,
}: ProductDimensionsProps) {
  if (!width && !height && !depth) return null;
  return (
    <div className="flex flex-col gap-4 mt-8 bg-muted p-6 rounded-2xl border border-border">
      {" "}
      <div className="flex items-center gap-2 font-semibold text-foreground text-lg">
        {" "}
        <Box className="w-5 h-5 text-primary" /> Ürün Ölçüleri{" "}
      </div>{" "}
      <div className="w-full">
        {" "}
        {/* Değerler Listesi */}{" "}
        <div className="flex flex-col sm:flex-row gap-4 w-full">
          {" "}
          {height && (
            <div className="flex items-center justify-between p-3 bg-background rounded-lg border border-border shadow-sm">
              {" "}
              <span className="text-sm font-medium text-muted-foreground">
                Boy (Yükseklik)
              </span>{" "}
              <span className="font-bold text-foreground">
                {height} cm
              </span>{" "}
            </div>
          )}{" "}
          {width && (
            <div className="flex items-center justify-between p-3 bg-background rounded-lg border border-border shadow-sm">
              {" "}
              <span className="text-sm font-medium text-muted-foreground">
                En (Genişlik)
              </span>{" "}
              <span className="font-bold text-foreground">{width} cm</span>{" "}
            </div>
          )}{" "}
          {depth && (
            <div className="flex items-center justify-between p-3 bg-background rounded-lg border border-border shadow-sm">
              {" "}
              <span className="text-sm font-medium text-muted-foreground">
                Derinlik
              </span>{" "}
              <span className="font-bold text-foreground">{depth} cm</span>{" "}
            </div>
          )}{" "}
        </div>
      </div>{" "}
    </div>
  );
}
