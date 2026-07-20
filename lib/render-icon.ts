import { EditSettings } from "./constants";
import { sampleEdgeColor, drawBlurredBackground } from "./color-utils";

export interface RenderOptions {
  /**
   * Always produce a fully opaque square (white base, background across the
   * full canvas, rounded corners only clip the artwork). Required for iOS —
   * Apple rejects icons with an alpha channel and applies its own mask.
   */
  forceOpaque?: boolean;
  /** Blur radius for the "blur" background. Use a smaller value for tiny previews. */
  blurRadius?: number;
}

// Edge color depends only on the source image — cache per image element so
// previews and exports don't resample it for every size.
const edgeColorCache = new WeakMap<HTMLImageElement, string>();

function getEdgeColor(img: HTMLImageElement): string {
  let color = edgeColorCache.get(img);
  if (!color) {
    color = sampleEdgeColor(img);
    edgeColorCache.set(img, color);
  }
  return color;
}

/**
 * The single rendering pipeline for every icon the app draws — exports,
 * the main canvas, the size grid, and device mockups all go through here.
 *
 * Draw order:
 *   1. forceOpaque: white base + background over the full canvas
 *   2. rounded-corner clip (when not forceOpaque this clips the background
 *      too, so corners come out transparent)
 *   3. background inside the clip (skipped for "transparent")
 *   4. artwork with padding, rotation, brightness/contrast, fit/fill
 */
export function renderIcon(
  img: HTMLImageElement,
  width: number,
  height: number,
  settings: EditSettings,
  options: RenderOptions = {}
): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d")!;
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  const { forceOpaque = false, blurRadius = 30 } = options;
  const bg = settings.backgroundColor;
  const radius =
    settings.borderRadius > 0
      ? (settings.borderRadius / 50) * (Math.min(width, height) / 2)
      : 0;

  const paintBackground = () => {
    if (bg === "blur") {
      drawBlurredBackground(ctx, img, width, height, blurRadius);
    } else if (bg === "auto") {
      ctx.fillStyle = getEdgeColor(img);
      ctx.fillRect(0, 0, width, height);
    } else if (bg !== "transparent") {
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, width, height);
    }
  };

  if (forceOpaque) {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);
    paintBackground();
  }

  if (radius > 0) {
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(0, 0, width, height, radius);
    ctx.clip();
  }

  if (!forceOpaque) {
    paintBackground();
  }

  const paddingPx = (settings.padding / 100) * Math.min(width, height);
  const drawWidth = width - paddingPx * 2;
  const drawHeight = height - paddingPx * 2;

  ctx.save();

  if (settings.rotation !== 0) {
    ctx.translate(width / 2, height / 2);
    ctx.rotate((settings.rotation * Math.PI) / 180);
    ctx.translate(-width / 2, -height / 2);
  }

  if (settings.brightness !== 0 || settings.contrast !== 0) {
    const brightnessVal = 1 + settings.brightness / 100;
    const contrastVal = 1 + settings.contrast / 100;
    ctx.filter = `brightness(${brightnessVal}) contrast(${contrastVal})`;
  }

  const imgAspect = img.naturalWidth / img.naturalHeight;
  const targetAspect = drawWidth / drawHeight;

  if (settings.fitMode === "fit") {
    // Contain: scale entire image to fit, center it
    let dw: number, dh: number;
    if (imgAspect > targetAspect) {
      dw = drawWidth;
      dh = drawWidth / imgAspect;
    } else {
      dh = drawHeight;
      dw = drawHeight * imgAspect;
    }
    const dx = paddingPx + (drawWidth - dw) / 2;
    const dy = paddingPx + (drawHeight - dh) / 2;
    ctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight, dx, dy, dw, dh);
  } else {
    // Cover: crop center to fill
    let sx = 0,
      sy = 0,
      sw = img.naturalWidth,
      sh = img.naturalHeight;
    if (imgAspect > targetAspect) {
      sw = img.naturalHeight * targetAspect;
      sx = (img.naturalWidth - sw) / 2;
    } else {
      sh = img.naturalWidth / targetAspect;
      sy = (img.naturalHeight - sh) / 2;
    }
    ctx.drawImage(img, sx, sy, sw, sh, paddingPx, paddingPx, drawWidth, drawHeight);
  }

  ctx.restore();

  if (radius > 0) {
    ctx.restore();
  }

  return canvas;
}
