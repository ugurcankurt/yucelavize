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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {" "}
        {/* Değerler Listesi */}{" "}
        <div className="flex flex-col gap-3">
          {" "}
          {height && (
            <div className="flex items-center justify-between p-3 bg-background rounded-lg border border-border shadow-sm">
              {" "}
              <span className="text-sm font-medium text-muted-foreground">
                Boy (Yükseklik)
              </span>{" "}
              <span className="font-bold text-foreground">
                {height} mm
              </span>{" "}
            </div>
          )}{" "}
          {width && (
            <div className="flex items-center justify-between p-3 bg-background rounded-lg border border-border shadow-sm">
              {" "}
              <span className="text-sm font-medium text-muted-foreground">
                En (Genişlik)
              </span>{" "}
              <span className="font-bold text-foreground">{width} mm</span>{" "}
            </div>
          )}{" "}
          {depth && (
            <div className="flex items-center justify-between p-3 bg-background rounded-lg border border-border shadow-sm">
              {" "}
              <span className="text-sm font-medium text-muted-foreground">
                Derinlik
              </span>{" "}
              <span className="font-bold text-foreground">{depth} mm</span>{" "}
            </div>
          )}{" "}
        </div>{" "}
        {/* Görsel Temsil (Basit CSS/SVG Çizim) */}{" "}
        <div className="relative w-full aspect-square max-w-[200px] mx-auto flex items-center justify-center">
          {" "}
          {/* 2D Çizim (Önden ve Üstten görünüm gibi soyut bir şema) */}{" "}
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full text-muted-foreground/70"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            {" "}
            {/* Yeni, Zarif ve İnce Avize Çizimi (Teknik Eskiz Hissiyatı) */}{" "}
            {/* --- AVİZE GÖVDESİ --- */}{" "}
            <g
              className="stroke-primary"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {" "}
              {/* Tavan Çizgisi */}{" "}
              <line
                x1="40"
                y1="10"
                x2="70"
                y2="10"
                strokeWidth="1"
                className="stroke-border dark:stroke-border"
              />{" "}
              {/* Tavan Aparatı */}{" "}
              <path
                d="M 50 10 L 60 10 L 58 14 L 52 14 Z"
                className="fill-primary stroke-none"
              />{" "}
              {/* Sarkan Kablo */}{" "}
              <line x1="55" y1="14" x2="55" y2="35" strokeWidth="1" />{" "}
              {/* Ana Çember (Modern Halka) */}{" "}
              <circle cx="55" cy="60" r="22" fill="none" />{" "}
              {/* İç Çapraz Halka 1 */}{" "}
              <ellipse
                cx="55"
                cy="60"
                rx="9"
                ry="26"
                transform="rotate(45 55 60)"
                fill="none"
              />{" "}
              {/* İç Çapraz Halka 2 */}{" "}
              <ellipse
                cx="55"
                cy="60"
                rx="9"
                ry="26"
                transform="rotate(-45 55 60)"
                fill="none"
              />{" "}
            </g>{" "}
            {/* --- ÖLÇÜ OKLARI --- */} {/* Yükseklik Oku (H) */}{" "}
            {height && (
              <g className="stroke-border dark:stroke-border">
                {" "}
                {/* Dikey kesik çizgi */}{" "}
                <line
                  x1="15"
                  y1="10"
                  x2="15"
                  y2="86"
                  strokeWidth="1"
                  strokeDasharray="2 3"
                />{" "}
                {/* Üst ok */}{" "}
                <path
                  d="M 12 15 L 15 10 L 18 15"
                  strokeWidth="1.2"
                  fill="none"
                />{" "}
                {/* Alt ok */}{" "}
                <path
                  d="M 12 81 L 15 86 L 18 81"
                  strokeWidth="1.2"
                  fill="none"
                />{" "}
                {/* Arka planı olan H harfi */}{" "}
                <text
                  x="15"
                  y="52"
                  className="text-[10px] font-bold fill-muted-foreground dark:fill-muted-foreground stroke-border dark:stroke-border"
                  strokeWidth="3"
                  paintOrder="stroke"
                  textAnchor="middle"
                >
                  H
                </text>{" "}
              </g>
            )}{" "}
            {/* Genişlik Oku (W) */}{" "}
            {width && (
              <g className="stroke-border dark:stroke-border">
                {" "}
                {/* Yatay kesik çizgi */}{" "}
                <line
                  x1="29"
                  y1="94"
                  x2="81"
                  y2="94"
                  strokeWidth="1"
                  strokeDasharray="2 3"
                />{" "}
                {/* Sol ok */}{" "}
                <path
                  d="M 34 91 L 29 94 L 34 97"
                  strokeWidth="1.2"
                  fill="none"
                />{" "}
                {/* Sağ ok */}{" "}
                <path
                  d="M 76 91 L 81 94 L 76 97"
                  strokeWidth="1.2"
                  fill="none"
                />{" "}
                <text
                  x="55"
                  y="97.5"
                  className="text-[10px] font-bold fill-muted-foreground dark:fill-muted-foreground stroke-border dark:stroke-border"
                  strokeWidth="3"
                  paintOrder="stroke"
                  textAnchor="middle"
                >
                  W
                </text>{" "}
              </g>
            )}{" "}
            {/* Derinlik Oku (D) */}{" "}
            {depth && (
              <g className="stroke-border dark:stroke-border">
                {" "}
                {/* Çapraz kesik çizgi */}{" "}
                <line
                  x1="75"
                  y1="78"
                  x2="90"
                  y2="63"
                  strokeWidth="1"
                  strokeDasharray="2 3"
                />{" "}
                {/* Alt-sol ok */}{" "}
                <path
                  d="M 78 81 L 75 78 L 72 75"
                  strokeWidth="1.2"
                  fill="none"
                />{" "}
                {/* Üst-sağ ok */}{" "}
                <path
                  d="M 87 60 L 90 63 L 93 66"
                  strokeWidth="1.2"
                  fill="none"
                />{" "}
                <text
                  x="86"
                  y="74"
                  className="text-[10px] font-bold fill-muted-foreground dark:fill-muted-foreground stroke-border dark:stroke-border"
                  strokeWidth="3"
                  paintOrder="stroke"
                  textAnchor="middle"
                >
                  D
                </text>{" "}
              </g>
            )}{" "}
          </svg>{" "}
        </div>{" "}
      </div>{" "}
    </div>
  );
}
