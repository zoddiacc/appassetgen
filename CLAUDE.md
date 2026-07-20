# AppAssetGen - Project Context & Progress

## What Is This App?

A client-side web app that generates all required iOS, Android, Web/PWA, and Windows app icon sizes from a single uploaded image. Users upload an icon (PNG/JPG/SVG), apply edits (padding, background, corners, rotation, brightness/contrast), preview all sizes and device mockups, and download an organized ZIP ready for Xcode, Android Studio, the web, and Windows.

**Architecture**: 100% frontend. No backend, no API routes, no database, no auth.

## Tech Stack

- **Next.js 14** (App Router, TypeScript) — frontend framework
- **Tailwind CSS v3** — styling (accent colors via CSS variable RGB channels so opacity modifiers work per-theme)
- **JetBrains Mono** — sole typeface, loaded via `next/font/google`
- **HTML Canvas API** — image manipulation and icon generation
- **JSZip** — in-browser ZIP creation
- **file-saver** — trigger file downloads
- **Sonner** — toast notifications

## Key Files

| File | Purpose |
|------|---------|
| `app/page.tsx` | Landing page (Navbar + Hero + Features + HowItWorks + Footer) |
| `app/editor/page.tsx` | Main editor — state management, 3-column layout, validation wiring |
| `components/editor/Canvas.tsx` | Real-time canvas preview (checkerboard + shared renderer) |
| `components/editor/Toolbar.tsx` | Editing controls (fit, background incl. transparent, sliders) |
| `components/editor/ImageUpload.tsx` | Drag-drop upload, validation, SVG rasterization, metadata |
| `components/editor/PreviewGrid.tsx` | All icon sizes with live previews, grouped per platform |
| `components/editor/DevicePreview.tsx` | iOS home screen / Android launcher / browser tab mockups |
| `components/editor/ExportPanel.tsx` | Platform toggles, custom sizes, ZIP export, single-size download |
| `components/editor/ValidationPanel.tsx` | Shows validation warnings |
| `lib/constants.ts` | Icon size definitions (all platforms), EditSettings type, defaults |
| `lib/render-icon.ts` | **The single rendering pipeline** — every preview and export draws through `renderIcon()` |
| `lib/icon-generator.ts` | Thin wrapper: renders each size to a PNG blob (iOS forced opaque) |
| `lib/ico-builder.ts` | Builds .ico files (PNG-embedded) for favicon.ico and Windows icon.ico |
| `lib/zip-builder.ts` | ZIP with iOS/Android/Web/Windows folders, Contents.json, manifests, README |
| `lib/svg-utils.ts` | SVG cleanup + rasterization (aspect-ratio preserving) |
| `lib/validation.ts` | Aspect-ratio, resolution, contrast, and safe-zone checks |
| `lib/color-utils.ts` | Edge-color sampling, blurred background fill |

## Build & Run

```bash
npm install       # Install dependencies
npm run dev       # Dev server at http://localhost:3000
npm run build     # Production build
```

## Rendering Rules (important)

- **All drawing goes through `lib/render-icon.ts` → `renderIcon()`.** Do not reimplement the background/clip/padding/rotate/filter/fit pipeline in components — that caused drift bugs before consolidation.
- **iOS is always opaque** (`forceOpaque: true`): Apple rejects icons with alpha. White base + background fill across the full canvas; rounded corners only clip the artwork.
- **All other platforms honor transparency**: the "None" background mode and rounded corners produce genuinely transparent pixels (clip is applied before the background is painted).
- Edge-color sampling for the "Auto" background is memoized per image (WeakMap).

## Progress Tracker

### V1 — Initial Build (done)
- [x] Landing page, 3-column editor, drag-drop upload, live canvas preview
- [x] Editing tools (background, padding, corners, rotation, brightness, contrast, fit/fill)
- [x] iOS AppIcon.appiconset + Contents.json, Android mipmaps, ZIP export, README.txt

### V2 — Multi-platform + validation (done)
- [x] SVG upload with cleanup + aspect-ratio-preserving rasterization
- [x] Upload metadata display (dimensions, file size, format)
- [x] Validation: non-square, low-res, contrast, adaptive-icon safe zone (padding-aware)
- [x] Web/PWA sizes (favicons, apple-touch-icon, manifest icons) + site.webmanifest + favicon.html snippet
- [x] favicon.ico and Windows multi-size icon.ico (PNG-embedded ICO builder)
- [x] Per-platform export toggles + custom size input
- [x] Single-size download with size picker
- [x] Copy favicon HTML tags to clipboard
- [x] Device previews (iOS home screen, Android launcher, browser tab) with dark/light toggle
- [x] App-wide dark/light theme
- [x] Transparent background support (non-iOS), rounded corners with real transparency
- [x] Shared rendering pipeline (`lib/render-icon.ts`)
- [x] UI revamp: JetBrains Mono, IDE/terminal aesthetic, teal/cyan accent

### Not Yet Done
- [ ] Crop tool
- [ ] Undo/redo
- [ ] Keyboard shortcuts
- [ ] Android adaptive icons (foreground/background layers)
- [ ] Git repo initialization
- [ ] Vercel deployment
- [ ] Automated tests

## Design Decisions

1. **Single render pipeline**: every preview surface and the exporter call `renderIcon()` from `lib/render-icon.ts`. Previously four copies of the draw logic existed and drifted apart.
2. **No Fabric.js**: native Canvas API only. (A stale unused `fabric` dependency was removed 2026-07.)
3. **No shadcn/ui**: native HTML + Tailwind keeps the bundle small.
4. **Data URL approach**: uploaded images become data URLs passed through React state; SVGs are rasterized to a 2048px-max PNG first.
5. **PNG-embedded ICO**: `.ico` files embed PNG data directly (valid since Windows Vista, standard for favicons) — no BMP encoding needed.
6. **Theme accents as RGB channel variables** (`--primary-rgb`): lets Tailwind `primary/10`-style opacity utilities work while the hue adapts to light/dark theme.
7. **Design language**: JetBrains Mono everywhere, terminal/IDE-inspired landing (terminal-window hero, `//` section labels), teal (`#0D9488`/`#2DD4BF`) + cyan accents, sharp small radii.

## Icon Size Specifications

### iOS (10 unique files, 14 Contents.json entries) — 2026 Streamlined Spec

All @2x/@3x only. No legacy @1x sizes. Always exported fully opaque.

| Size | Label | Purpose |
|------|-------|---------|
| 1024x1024 | App Store | App Store listing (ios-marketing idiom) |
| 180x180 | iPhone @3x | Home Screen (60pt @3x) |
| 167x167 | iPad Pro @2x | Home Screen (83.5pt @2x) |
| 152x152 | iPad @2x | Home Screen (76pt @2x) |
| 120x120 | iPhone @2x | Home Screen (60pt @2x) / Spotlight (40pt @3x) |
| 87x87 | iPhone @3x | Settings (29pt @3x) |
| 80x80 | iPhone/iPad @2x | Spotlight (40pt @2x) |
| 60x60 | iPhone @3x | Notifications (20pt @3x) |
| 58x58 | iPhone/iPad @2x | Settings (29pt @2x) |
| 40x40 | iPhone/iPad @2x | Notifications (20pt @2x) |

The Contents.json maps 14 entries (iPhone + iPad + App Store) to these 10 files.

### Android (6 sizes)
| Size | Density | Folder |
|------|---------|--------|
| 512x512 | Play Store | playstore/ |
| 192x192 | xxxhdpi | mipmap-xxxhdpi/ |
| 144x144 | xxhdpi | mipmap-xxhdpi/ |
| 96x96 | xhdpi | mipmap-xhdpi/ |
| 72x72 | hdpi | mipmap-hdpi/ |
| 48x48 | mdpi | mipmap-mdpi/ |

### Web (8 PNGs + favicon.ico)
512, 192, 144 (PWA) · 180 (apple-touch-icon.png) · 96, 48, 32, 16 (favicons) · favicon.ico bundles 16/32/48 · plus site.webmanifest + favicon.html snippet

### Windows (6 PNGs + icon.ico)
256, 64, 48, 32, 24, 16 · icon.ico bundles all six

## Troubleshooting

- **ESLint version warning**: Using ESLint 8 for Next.js 14 compatibility. ESLint 9 has breaking changes with `useEslintrc`.
- **`<img>` warning**: PreviewGrid/ImageUpload use `<img>` intentionally — images are data URLs from canvas, not remote assets.
- **Tailwind v3**: Using Tailwind CSS v3 (not v4) for stability with the Next.js 14 + PostCSS setup.
- **`canvas.filter` in Safari < 17.4**: brightness/contrast edits and blur backgrounds are silently ignored there (no fallback implemented).
