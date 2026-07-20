import JSZip from "jszip";
import { saveAs } from "file-saver";
import { GeneratedIcon } from "./icon-generator";
import { IOS_CONTENTS_JSON_ENTRIES, ExportPlatforms } from "./constants";
import { buildIco } from "./ico-builder";

export async function createAndDownloadZip(
  icons: GeneratedIcon[],
  platforms?: ExportPlatforms
) {
  const zip = new JSZip();
  const activePlatforms = platforms || { ios: true, android: true, web: true, windows: true };

  // iOS icons
  const iosIcons = icons.filter((i) => i.size.platform === "ios");
  if (activePlatforms.ios && iosIcons.length > 0) {
    const iosFolder = zip.folder("ios")!.folder("AppIcon.appiconset")!;
    for (const icon of iosIcons) {
      iosFolder.file(icon.size.filename, icon.blob);
    }
    const contentsJson = generateContentsJson();
    iosFolder.file("Contents.json", JSON.stringify(contentsJson, null, 2));
  }

  // Android icons
  const androidIcons = icons.filter((i) => i.size.platform === "android");
  if (activePlatforms.android && androidIcons.length > 0) {
    const androidRes = zip.folder("android")!.folder("res")!;
    for (const icon of androidIcons) {
      const folder = icon.size.folder!;
      androidRes.folder(folder)!.file(icon.size.filename, icon.blob);
    }
  }

  // Web / PWA icons
  const webIcons = icons.filter((i) => i.size.platform === "web" && i.size.folder === "web");
  if (activePlatforms.web && webIcons.length > 0) {
    const webFolder = zip.folder("web")!;
    for (const icon of webIcons) {
      webFolder.file(icon.size.filename, icon.blob);
    }
    const faviconSources = webIcons.filter((i) => [16, 32, 48].includes(i.size.width));
    if (faviconSources.length > 0) {
      const faviconIco = await buildIco(
        faviconSources.map((i) => ({ size: i.size.width, blob: i.blob }))
      );
      webFolder.file("favicon.ico", faviconIco);
    }
    webFolder.file("site.webmanifest", generateWebManifest());
    webFolder.file("favicon.html", generateFaviconHtml());
  }

  // Windows icons
  const windowsIcons = icons.filter((i) => i.size.platform === "windows");
  if (activePlatforms.windows && windowsIcons.length > 0) {
    const windowsFolder = zip.folder("windows")!;
    for (const icon of windowsIcons) {
      windowsFolder.file(icon.size.filename, icon.blob);
    }
    const windowsIco = await buildIco(
      windowsIcons.map((i) => ({ size: i.size.width, blob: i.blob }))
    );
    windowsFolder.file("icon.ico", windowsIco);
  }

  // Custom sizes
  const customIcons = icons.filter((i) => i.size.folder === "custom");
  if (customIcons.length > 0) {
    const customFolder = zip.folder("custom")!;
    for (const icon of customIcons) {
      customFolder.file(icon.size.filename, icon.blob);
    }
  }

  // README
  zip.file("README.txt", generateReadme(activePlatforms));

  const blob = await zip.generateAsync({ type: "blob" });
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
  saveAs(blob, `app-icons-${timestamp}.zip`);
}

function generateContentsJson() {
  return {
    images: IOS_CONTENTS_JSON_ENTRIES.map((entry) => {
      const result: Record<string, string> = {
        filename: entry.filename,
        idiom: entry.idiom,
        scale: entry.scale,
        size: entry.size,
      };
      return result;
    }),
    info: {
      author: "appassetgen",
      version: 1,
    },
  };
}

function generateWebManifest(): string {
  const manifest = {
    name: "My App",
    short_name: "MyApp",
    icons: [
      { src: "icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "icon-512.png", sizes: "512x512", type: "image/png", purpose: "any maskable" },
      { src: "icon-144.png", sizes: "144x144", type: "image/png" },
      { src: "icon-96.png", sizes: "96x96", type: "image/png" },
      { src: "icon-48.png", sizes: "48x48", type: "image/png" },
    ],
    theme_color: "#ffffff",
    background_color: "#ffffff",
    display: "standalone",
  };
  return JSON.stringify(manifest, null, 2);
}

function generateFaviconHtml(): string {
  return `<!-- Favicon & PWA Icons — paste into your <head> -->
<link rel="icon" href="/favicon.ico" sizes="any">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16.png">
<link rel="icon" type="image/png" sizes="96x96" href="/icon-96.png">
<link rel="icon" type="image/png" sizes="48x48" href="/icon-48.png">
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
<meta name="theme-color" content="#ffffff">
`;
}

export function getFaviconHtmlSnippet(): string {
  return generateFaviconHtml();
}

function generateReadme(platforms: ExportPlatforms): string {
  const now = new Date().toLocaleString();
  const sections: string[] = [];

  sections.push(`AppAssetGen - Icon Export\nGenerated: ${now}\n`);

  if (platforms.ios) {
    sections.push(`IOS INSTALLATION:
1. Open your Xcode project
2. Navigate to your project's asset catalog (Assets.xcassets)
3. Delete the existing AppIcon.appiconset if present
4. Drag the entire "AppIcon.appiconset" folder into the asset catalog
5. Xcode will automatically detect all icon sizes via Contents.json
6. The 1024x1024 icon is used for App Store submission`);
  }

  if (platforms.android) {
    sections.push(`ANDROID INSTALLATION:
1. Navigate to your Android project: app/src/main/
2. Copy all mipmap-* folders into the res/ directory
3. If asked to merge or replace, choose "Replace"
4. Your AndroidManifest.xml should have: android:icon="@mipmap/ic_launcher"
5. Upload icon-512.png to Google Play Console when publishing`);
  }

  if (platforms.web) {
    sections.push(`WEB / PWA INSTALLATION:
1. Copy the contents of the /web folder to your public directory
2. Open favicon.html and paste the <link> tags into your HTML <head>
3. favicon.ico bundles the 16/32/48px sizes for legacy browsers
4. The site.webmanifest file provides PWA icon metadata
5. For PWA support, ensure the manifest is linked in your HTML:
   <link rel="manifest" href="/site.webmanifest">`);
  }

  if (platforms.windows) {
    sections.push(`WINDOWS INSTALLATION:
1. icon.ico bundles all sizes (16-256px) — use it as your application icon
2. Individual PNGs are included if your toolchain needs them
3. icon-256.png is for high-DPI Explorer views
4. icon-48.png is the standard Explorer icon size
5. icon-16.png is used in the title bar`);
  }

  sections.push(`Need help? Visit https://github.com/zoddiacc/appassetgen`);

  return sections.join("\n\n");
}
