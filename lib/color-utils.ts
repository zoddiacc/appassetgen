/**
 * Samples pixels along the edges of an image and returns the average color as a hex string.
 */
export function sampleEdgeColor(img: HTMLImageElement): string {
  const canvas = document.createElement("canvas");
  const sampleSize = 64; // small canvas for performance
  canvas.width = sampleSize;
  canvas.height = sampleSize;
  const ctx = canvas.getContext("2d")!;

  ctx.drawImage(img, 0, 0, sampleSize, sampleSize);
  const imageData = ctx.getImageData(0, 0, sampleSize, sampleSize);
  const data = imageData.data;

  let r = 0, g = 0, b = 0, count = 0;

  for (let x = 0; x < sampleSize; x++) {
    // Top edge
    const topIdx = (0 * sampleSize + x) * 4;
    r += data[topIdx]; g += data[topIdx + 1]; b += data[topIdx + 2]; count++;

    // Bottom edge
    const botIdx = ((sampleSize - 1) * sampleSize + x) * 4;
    r += data[botIdx]; g += data[botIdx + 1]; b += data[botIdx + 2]; count++;
  }

  for (let y = 1; y < sampleSize - 1; y++) {
    // Left edge
    const leftIdx = (y * sampleSize + 0) * 4;
    r += data[leftIdx]; g += data[leftIdx + 1]; b += data[leftIdx + 2]; count++;

    // Right edge
    const rightIdx = (y * sampleSize + (sampleSize - 1)) * 4;
    r += data[rightIdx]; g += data[rightIdx + 1]; b += data[rightIdx + 2]; count++;
  }

  r = Math.round(r / count);
  g = Math.round(g / count);
  b = Math.round(b / count);

  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

/**
 * Draws a blurred, scaled-to-cover version of the image onto the given canvas context.
 * This fills the entire square with a soft blurred background.
 */
export function drawBlurredBackground(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  width: number,
  height: number = width,
  blurRadius: number = 30
): void {
  ctx.save();
  ctx.filter = `blur(${blurRadius}px) brightness(0.9)`;

  // Scale to cover — draw image larger than canvas so blur edges don't show through
  const overflow = blurRadius * 2;
  const coverW = width + overflow * 2;
  const coverH = height + overflow * 2;
  const imgAspect = img.naturalWidth / img.naturalHeight;

  let dw: number, dh: number;
  if (imgAspect > coverW / coverH) {
    dh = coverH;
    dw = dh * imgAspect;
  } else {
    dw = coverW;
    dh = dw / imgAspect;
  }

  const dx = (width - dw) / 2;
  const dy = (height - dh) / 2;

  ctx.drawImage(img, dx, dy, dw, dh);
  ctx.restore();
}
