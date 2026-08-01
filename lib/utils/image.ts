export interface WebPOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
}

/**
 * Converts an image File to WebP format, resizes it if it exceeds max dimensions,
 * and handles HEIC format conversion if necessary.
 */
export const convertToWebP = async (file: File, options: WebPOptions = {}): Promise<File> => {
  const { maxWidth = 1200, maxHeight = 1200, quality = 0.8 } = options;
  
  try {
    let sourceFile: Blob = file;

    // Handle HEIC images from Apple devices
    const isHeic = file.type === "image/heic" || file.type === "image/heif" || file.name.toLowerCase().endsWith(".heic");
    if (isHeic) {
      // Dynamically import heic2any to avoid bloating the initial bundle
      const heic2any = (await import("heic2any")).default;
      const converted = await heic2any({
        blob: file,
        toType: "image/jpeg",
        quality: 1
      });
      sourceFile = Array.isArray(converted) ? converted[0] : converted;
    }

    const imageBitmap = await createImageBitmap(sourceFile);
    
    // Calculate new dimensions while preserving aspect ratio
    let width = imageBitmap.width;
    let height = imageBitmap.height;

    if (width > maxWidth || height > maxHeight) {
      const ratio = Math.min(maxWidth / width, maxHeight / height);
      width = Math.round(width * ratio);
      height = Math.round(height * ratio);
    }

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas context oluşturulamadı");
    
    // Draw and resize
    ctx.drawImage(imageBitmap, 0, 0, width, height);
    
    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (!blob) return reject(new Error("WebP blob dönüştürme başarısız"));
          const newName = file.name.replace(/\.[^/.]+$/, "") + ".webp";
          resolve(new File([blob], newName, { type: "image/webp" }));
        },
        "image/webp",
        quality
      );
    });
  } catch (error) {
    console.error("Görsel dönüştürme hatası:", error);
    throw error;
  }
};
