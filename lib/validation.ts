import { ImageMetadata, ValidationWarning } from "./constants";

/**
 * Validate an uploaded image and return any quality warnings.
 */
export function validateImage(
  img: HTMLImageElement,
  metadata: ImageMetadata
): ValidationWarning[] {
  const warnings: ValidationWarning[] = [];

  // Non-square ratio detection
  const ratio = metadata.width / metadata.height;
  if (ratio < 0.95 || ratio > 1.05) {
    warnings.push({
      type: "aspect-ratio",
      severity: "warn",
      message: `Image is not square (${metadata.width}x${metadata.height}). Icons will be cropped or letterboxed.`,
    });
  }

  // Low-resolution warning
  const minDimension = Math.min(metadata.width, metadata.height);
  if (minDimension < 512) {
    warnings.push({
      type: "low-resolution",
      severity: "error",
      message: `Source image is only ${minDimension}px. Recommend at least 1024x1024 for sharp icons.`,
    });
  } else if (minDimension < 1024) {
    warnings.push({
      type: "low-resolution",
      severity: "warn",
      message: `Source image is ${minDimension}px. Recommend 1024x1024 or larger for best quality.`,
    });
  }

  return warnings;
}

/**
 * Check contrast between center content and edges.
 * Returns a score from 0 (no contrast) to 1 (max contrast) and an optional warning.
 */
export function checkContrast(img: HTMLImageElement): {
  score: number;
  warning?: string;
} {
  const canvas = document.createElement("canvas");
  const size = 64;
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(img, 0, 0, size, size);
  const data = ctx.getImageData(0, 0, size, size).data;

  // Sample center region (inner 50%)
  let centerR = 0, centerG = 0, centerB = 0, centerCount = 0;
  const q1 = Math.floor(size * 0.25);
  const q3 = Math.floor(size * 0.75);

  for (let y = q1; y < q3; y++) {
    for (let x = q1; x < q3; x++) {
      const idx = (y * size + x) * 4;
      centerR += data[idx];
      centerG += data[idx + 1];
      centerB += data[idx + 2];
      centerCount++;
    }
  }

  // Sample edge region
  let edgeR = 0, edgeG = 0, edgeB = 0, edgeCount = 0;
  for (let x = 0; x < size; x++) {
    for (const y of [0, size - 1]) {
      const idx = (y * size + x) * 4;
      edgeR += data[idx];
      edgeG += data[idx + 1];
      edgeB += data[idx + 2];
      edgeCount++;
    }
  }
  for (let y = 1; y < size - 1; y++) {
    for (const x of [0, size - 1]) {
      const idx = (y * size + x) * 4;
      edgeR += data[idx];
      edgeG += data[idx + 1];
      edgeB += data[idx + 2];
      edgeCount++;
    }
  }

  const cAvg = [centerR / centerCount, centerG / centerCount, centerB / centerCount];
  const eAvg = [edgeR / edgeCount, edgeG / edgeCount, edgeB / edgeCount];

  // Calculate luminance difference
  const cLum = 0.299 * cAvg[0] + 0.587 * cAvg[1] + 0.114 * cAvg[2];
  const eLum = 0.299 * eAvg[0] + 0.587 * eAvg[1] + 0.114 * eAvg[2];

  const score = Math.abs(cLum - eLum) / 255;

  if (score < 0.05) {
    return {
      score,
      warning: "Very low contrast between icon content and edges. May be hard to see on some backgrounds.",
    };
  }

  return { score };
}

/**
 * Check if important content extends outside the adaptive icon safe zone (66% circle).
 */
export function checkSafeZone(img: HTMLImageElement, padding: number): boolean {
  const canvas = document.createElement("canvas");
  const size = 64;
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(img, 0, 0, size, size);
  const data = ctx.getImageData(0, 0, size, size).data;

  const center = size / 2;
  const safeRadius = (size * 0.66) / 2;
  const paddingPx = (padding / 100) * size;

  let outsideContent = 0;
  let outsideTotal = 0;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const dist = Math.sqrt((x - center) ** 2 + (y - center) ** 2);
      if (dist > safeRadius && x >= paddingPx && x < size - paddingPx && y >= paddingPx && y < size - paddingPx) {
        outsideTotal++;
        const idx = (y * size + x) * 4;
        const alpha = data[idx + 3];
        // Check if pixel has significant content (not transparent/near-white)
        const lum = 0.299 * data[idx] + 0.587 * data[idx + 1] + 0.114 * data[idx + 2];
        if (alpha > 128 && lum < 240) {
          outsideContent++;
        }
      }
    }
  }

  // If more than 15% of outside-safe-zone pixels have content, flag it
  return outsideTotal > 0 && outsideContent / outsideTotal > 0.15;
}
