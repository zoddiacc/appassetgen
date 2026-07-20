export type Platform = "ios" | "android" | "web" | "windows";

export interface IconSize {
  width: number;
  height: number;
  label: string;
  platform: Platform;
  purpose: string;
  folder?: string;
  filename: string;
}

export interface ContentsJsonEntry {
  filename: string;
  idiom: string;
  scale: string;
  size: string;
  platform?: string;
}

export interface ImageMetadata {
  width: number;
  height: number;
  fileSize: number;
  format: string;
  colorType: string;
}

export interface ValidationWarning {
  type: "aspect-ratio" | "low-resolution" | "safe-zone" | "contrast";
  severity: "warn" | "error";
  message: string;
}

export interface ExportPlatforms {
  ios: boolean;
  android: boolean;
  web: boolean;
  windows: boolean;
}

export const DEFAULT_EXPORT_PLATFORMS: ExportPlatforms = {
  ios: true,
  android: true,
  web: true,
  windows: true,
};

export interface CustomSize {
  width: number;
  height: number;
  id: string;
}

// ─── iOS Icon Sizes (2026) ───────────────────────────────────────
// Streamlined set: @2x and @3x only. No legacy @1x sizes.
// Unique pixel sizes only — Contents.json maps multiple entries to shared files.

export const IOS_SIZES: IconSize[] = [
  // App Store (required master icon)
  { width: 1024, height: 1024, label: "App Store",        purpose: "App Store listing (1024pt @1x)", platform: "ios", filename: "icon-1024.png" },
  // iPhone
  { width: 180, height: 180,   label: "iPhone @3x",       purpose: "Home Screen (60pt @3x)",         platform: "ios", filename: "icon-180.png" },
  { width: 120, height: 120,   label: "iPhone @2x",       purpose: "Home Screen (60pt @2x) / Spotlight (40pt @3x)", platform: "ios", filename: "icon-120.png" },
  { width: 87,  height: 87,    label: "iPhone @3x",       purpose: "Settings (29pt @3x)",            platform: "ios", filename: "icon-87.png" },
  { width: 80,  height: 80,    label: "iPhone/iPad @2x",  purpose: "Spotlight (40pt @2x)",           platform: "ios", filename: "icon-80.png" },
  { width: 60,  height: 60,    label: "iPhone @3x",       purpose: "Notifications (20pt @3x)",       platform: "ios", filename: "icon-60.png" },
  { width: 58,  height: 58,    label: "iPhone/iPad @2x",  purpose: "Settings (29pt @2x)",            platform: "ios", filename: "icon-58.png" },
  { width: 40,  height: 40,    label: "iPhone/iPad @2x",  purpose: "Notifications (20pt @2x)",       platform: "ios", filename: "icon-40.png" },
  // iPad
  { width: 167, height: 167,   label: "iPad Pro @2x",     purpose: "Home Screen (83.5pt @2x)",       platform: "ios", filename: "icon-167.png" },
  { width: 152, height: 152,   label: "iPad @2x",         purpose: "Home Screen (76pt @2x)",         platform: "ios", filename: "icon-152.png" },
];

// Contents.json entries — Xcode asset catalog mapping (2026, no @1x).
// Multiple entries can reference the same file (same pixel dimensions).
export const IOS_CONTENTS_JSON_ENTRIES: ContentsJsonEntry[] = [
  // App Store
  { filename: "icon-1024.png", idiom: "ios-marketing", scale: "1x", size: "1024x1024" },
  // iPhone
  { filename: "icon-180.png",  idiom: "iphone", scale: "3x", size: "60x60" },
  { filename: "icon-120.png",  idiom: "iphone", scale: "2x", size: "60x60" },
  { filename: "icon-120.png",  idiom: "iphone", scale: "3x", size: "40x40" },
  { filename: "icon-87.png",   idiom: "iphone", scale: "3x", size: "29x29" },
  { filename: "icon-80.png",   idiom: "iphone", scale: "2x", size: "40x40" },
  { filename: "icon-60.png",   idiom: "iphone", scale: "3x", size: "20x20" },
  { filename: "icon-58.png",   idiom: "iphone", scale: "2x", size: "29x29" },
  { filename: "icon-40.png",   idiom: "iphone", scale: "2x", size: "20x20" },
  // iPad
  { filename: "icon-167.png",  idiom: "ipad",   scale: "2x", size: "83.5x83.5" },
  { filename: "icon-152.png",  idiom: "ipad",   scale: "2x", size: "76x76" },
  { filename: "icon-80.png",   idiom: "ipad",   scale: "2x", size: "40x40" },
  { filename: "icon-58.png",   idiom: "ipad",   scale: "2x", size: "29x29" },
  { filename: "icon-40.png",   idiom: "ipad",   scale: "2x", size: "20x20" },
];

// ─── Android Icon Sizes ──────────────────────────────────────────

export const ANDROID_SIZES: IconSize[] = [
  { width: 512, height: 512,   label: "Play Store",  purpose: "Google Play listing",   platform: "android", folder: "playstore",        filename: "icon-512.png" },
  { width: 192, height: 192,   label: "xxxhdpi",     purpose: "Launcher (640 dpi)",    platform: "android", folder: "mipmap-xxxhdpi",    filename: "ic_launcher.png" },
  { width: 144, height: 144,   label: "xxhdpi",      purpose: "Launcher (480 dpi)",    platform: "android", folder: "mipmap-xxhdpi",     filename: "ic_launcher.png" },
  { width: 96,  height: 96,    label: "xhdpi",       purpose: "Launcher (320 dpi)",    platform: "android", folder: "mipmap-xhdpi",      filename: "ic_launcher.png" },
  { width: 72,  height: 72,    label: "hdpi",        purpose: "Launcher (240 dpi)",    platform: "android", folder: "mipmap-hdpi",       filename: "ic_launcher.png" },
  { width: 48,  height: 48,    label: "mdpi",        purpose: "Launcher (160 dpi)",    platform: "android", folder: "mipmap-mdpi",       filename: "ic_launcher.png" },
];

// ─── Web / PWA Icon Sizes ────────────────────────────────────────

export const WEB_SIZES: IconSize[] = [
  { width: 512, height: 512,   label: "PWA 512",     purpose: "PWA splash / install",    platform: "web", folder: "web", filename: "icon-512.png" },
  { width: 180, height: 180,   label: "Apple Touch", purpose: "iOS Safari home screen",  platform: "web", folder: "web", filename: "apple-touch-icon.png" },
  { width: 192, height: 192,   label: "PWA 192",     purpose: "PWA manifest icon",       platform: "web", folder: "web", filename: "icon-192.png" },
  { width: 144, height: 144,   label: "PWA 144",     purpose: "PWA manifest icon",       platform: "web", folder: "web", filename: "icon-144.png" },
  { width: 96,  height: 96,    label: "Favicon 96",  purpose: "Large favicon",           platform: "web", folder: "web", filename: "icon-96.png" },
  { width: 48,  height: 48,    label: "Favicon 48",  purpose: "Standard favicon",        platform: "web", folder: "web", filename: "icon-48.png" },
  { width: 32,  height: 32,    label: "Favicon 32",  purpose: "Browser tab favicon",     platform: "web", folder: "web", filename: "favicon-32.png" },
  { width: 16,  height: 16,    label: "Favicon 16",  purpose: "Smallest favicon",        platform: "web", folder: "web", filename: "favicon-16.png" },
];

// ─── Windows Icon Sizes ──────────────────────────────────────────

export const WINDOWS_SIZES: IconSize[] = [
  { width: 256, height: 256,   label: "Win 256",     purpose: "Explorer large view",     platform: "windows", folder: "windows", filename: "icon-256.png" },
  { width: 64,  height: 64,    label: "Win 64",      purpose: "Explorer medium view",    platform: "windows", folder: "windows", filename: "icon-64.png" },
  { width: 48,  height: 48,    label: "Win 48",      purpose: "Explorer default",        platform: "windows", folder: "windows", filename: "icon-48.png" },
  { width: 32,  height: 32,    label: "Win 32",      purpose: "Taskbar icon",            platform: "windows", folder: "windows", filename: "icon-32.png" },
  { width: 24,  height: 24,    label: "Win 24",      purpose: "Toolbar icon",            platform: "windows", folder: "windows", filename: "icon-24.png" },
  { width: 16,  height: 16,    label: "Win 16",      purpose: "Title bar icon",          platform: "windows", folder: "windows", filename: "icon-16.png" },
];

export const ALL_SIZES: IconSize[] = [...IOS_SIZES, ...ANDROID_SIZES, ...WEB_SIZES, ...WINDOWS_SIZES];

export function getSizesForPlatforms(platforms: ExportPlatforms, customSizes: CustomSize[] = []): IconSize[] {
  const sizes: IconSize[] = [];
  if (platforms.ios) sizes.push(...IOS_SIZES);
  if (platforms.android) sizes.push(...ANDROID_SIZES);
  if (platforms.web) sizes.push(...WEB_SIZES);
  if (platforms.windows) sizes.push(...WINDOWS_SIZES);

  for (const cs of customSizes) {
    sizes.push({
      width: cs.width,
      height: cs.height,
      label: `Custom`,
      platform: "web",
      purpose: `Custom ${cs.width}x${cs.height}`,
      folder: "custom",
      filename: `icon-${cs.width}x${cs.height}.png`,
    });
  }

  return sizes;
}

// ─── Edit Settings ───────────────────────────────────────────────

export interface EditSettings {
  backgroundColor: string;
  padding: number;
  borderRadius: number;
  rotation: number;
  brightness: number;
  contrast: number;
  fitMode: "fill" | "fit";
}

export const DEFAULT_SETTINGS: EditSettings = {
  backgroundColor: "auto",
  padding: 10,
  borderRadius: 0,
  rotation: 0,
  brightness: 0,
  contrast: 0,
  fitMode: "fill",
};
