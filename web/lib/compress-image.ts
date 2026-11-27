/**
 * Хөтөч дээр зургийг шахаж, хэмжээг (px) нь тодорхойлно.
 * Server Action нэг хүсэлтэд 4.5 MB-аас ихийг хүлээж авдаггүй тул илгээхээс өмнө ашиглана.
 */

/** Зургийн урт талыг maxSide хүртэл жижигрүүлж JPEG болгоно. Жижиг файлыг хэвээр нь буцаана. */
export async function compressImage(file: File, maxSide = 2000, minBytes = 600 * 1024): Promise<File> {
  if (!file.type.startsWith("image/") || file.size < minBytes) return file;
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    canvas.getContext("2d")?.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.82));
    if (!blob || blob.size >= file.size) return file;
    return new File([blob], file.name.replace(/\.\w+$/, "") + ".jpg", { type: "image/jpeg" });
  } catch {
    return file;
  }
}

/** Зургийн өргөн, өндөр (px) */
export async function imageSize(file: File): Promise<{ width: number; height: number }> {
  const bitmap = await createImageBitmap(file);
  const size = { width: bitmap.width, height: bitmap.height };
  bitmap.close();
  return size;
}
