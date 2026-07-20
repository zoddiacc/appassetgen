import { EditSettings, IconSize, ExportPlatforms, CustomSize, getSizesForPlatforms } from "./constants";
import { renderIcon } from "./render-icon";

export interface GeneratedIcon {
  size: IconSize;
  blob: Blob;
}

export interface GenerationResult {
  icons: GeneratedIcon[];
  durationMs: number;
}

export async function generateAllSizes(
  sourceImage: HTMLImageElement,
  settings: EditSettings,
  platforms?: ExportPlatforms,
  customSizes?: CustomSize[]
): Promise<GenerationResult> {
  const start = performance.now();
  const sizes = platforms
    ? getSizesForPlatforms(platforms, customSizes)
    : getSizesForPlatforms({ ios: true, android: true, web: true, windows: true }, customSizes);

  const results: GeneratedIcon[] = [];

  for (const size of sizes) {
    const blob = await generateSingleIcon(sourceImage, size, settings);
    results.push({ size, blob });
  }

  const durationMs = Math.round(performance.now() - start);
  return { icons: results, durationMs };
}

export async function generateSingleIcon(
  sourceImage: HTMLImageElement,
  size: IconSize,
  settings: EditSettings
): Promise<Blob> {
  // Apple rejects app icons with an alpha channel — iOS output is always opaque.
  // Every other platform honors the "transparent" background and rounded corners.
  const canvas = renderIcon(sourceImage, size.width, size.height, settings, {
    forceOpaque: size.platform === "ios",
  });

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Failed to generate icon"));
      },
      "image/png",
      1.0
    );
  });
}
