/**
 * Rasterize an SVG string to a high-resolution HTMLImageElement.
 * Renders at the SVG's intrinsic aspect ratio with the longest edge at
 * targetSize (default 2048px), so non-square artwork is never distorted
 * and downstream aspect-ratio validation still applies.
 */
export async function rasterizeSvg(
  svgText: string,
  targetSize: number = 2048
): Promise<HTMLImageElement> {
  const cleaned = cleanupSvg(svgText);
  const blob = new Blob([cleaned], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      // SVGs without width/height report 0x0 in some browsers — fall back to square
      const aspect =
        img.naturalWidth > 0 && img.naturalHeight > 0
          ? img.naturalWidth / img.naturalHeight
          : 1;
      const rasterW = aspect >= 1 ? targetSize : Math.round(targetSize * aspect);
      const rasterH = aspect >= 1 ? Math.round(targetSize / aspect) : targetSize;

      const canvas = document.createElement("canvas");
      canvas.width = rasterW;
      canvas.height = rasterH;
      const ctx = canvas.getContext("2d")!;
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(img, 0, 0, rasterW, rasterH);
      URL.revokeObjectURL(url);

      // Create a new image from the rasterized canvas
      const rasterImg = new Image();
      rasterImg.onload = () => resolve(rasterImg);
      rasterImg.onerror = () => reject(new Error("Failed to rasterize SVG"));
      rasterImg.src = canvas.toDataURL("image/png");
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load SVG"));
    };
    img.src = url;
  });
}

/**
 * Basic SVG cleanup: remove metadata, comments, XML declarations,
 * and normalize the viewBox if missing.
 */
export function cleanupSvg(svgText: string): string {
  let cleaned = svgText;

  // Remove XML declaration
  cleaned = cleaned.replace(/<\?xml[^?]*\?>\s*/g, "");

  // Remove comments
  cleaned = cleaned.replace(/<!--[\s\S]*?-->/g, "");

  // Remove <metadata> blocks
  cleaned = cleaned.replace(/<metadata[\s\S]*?<\/metadata>/gi, "");

  // Remove editor-specific elements (Inkscape, Illustrator)
  cleaned = cleaned.replace(/<sodipodi:[^>]*\/>/g, "");
  cleaned = cleaned.replace(/<sodipodi:[^>]*>[\s\S]*?<\/sodipodi:[^>]*>/g, "");

  // Remove empty <defs> blocks
  cleaned = cleaned.replace(/<defs\s*\/>/g, "");
  cleaned = cleaned.replace(/<defs>\s*<\/defs>/g, "");

  // Ensure viewBox exists — extract from width/height if missing
  if (!cleaned.includes("viewBox")) {
    const widthMatch = cleaned.match(/\bwidth="([^"]+)"/);
    const heightMatch = cleaned.match(/\bheight="([^"]+)"/);
    if (widthMatch && heightMatch) {
      const w = parseFloat(widthMatch[1]);
      const h = parseFloat(heightMatch[1]);
      if (!isNaN(w) && !isNaN(h)) {
        cleaned = cleaned.replace(/<svg/, `<svg viewBox="0 0 ${w} ${h}"`);
      }
    }
  }

  return cleaned;
}
