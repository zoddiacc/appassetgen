"use client";

import { useEffect, useState } from "react";
import { IOS_SIZES, ANDROID_SIZES, WEB_SIZES, WINDOWS_SIZES, IconSize, EditSettings, CustomSize } from "@/lib/constants";
import { renderIcon } from "@/lib/render-icon";
import { useDevicePixelRatio } from "@/lib/use-device-pixel-ratio";

interface PreviewGridProps {
  imageUrl: string | null;
  settings: EditSettings;
  customSizes: CustomSize[];
}

function generatePreview(
  img: HTMLImageElement,
  size: IconSize,
  settings: EditSettings,
  dpr: number
): string {
  // Cap scales with devicePixelRatio so thumbnails stay sharp on high-DPI
  // displays. Sizes below the cap still render at their native resolution
  // (the true-pixel preview for small favicons relies on that).
  const displaySize = Math.min(size.width, Math.round(80 * dpr));
  const canvas = renderIcon(img, displaySize, displaySize, settings, {
    forceOpaque: size.platform === "ios",
    blurRadius: 10,
  });
  return canvas.toDataURL("image/png");
}

const platformConfig: { key: string; label: string; sizes: IconSize[]; badgeClass: string }[] = [
  { key: "ios",     label: "iOS",     sizes: IOS_SIZES,     badgeClass: "bg-blue-500/10 text-blue-400" },
  { key: "android", label: "Android", sizes: ANDROID_SIZES, badgeClass: "bg-green-500/10 text-green-400" },
  { key: "web",     label: "Web",     sizes: WEB_SIZES,     badgeClass: "bg-orange-500/10 text-orange-400" },
  { key: "windows", label: "Windows", sizes: WINDOWS_SIZES, badgeClass: "bg-purple-500/10 text-purple-400" },
];

export default function PreviewGrid({ imageUrl, settings, customSizes }: PreviewGridProps) {
  const [previews, setPreviews] = useState<Map<string, string>>(new Map());
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const dpr = useDevicePixelRatio();

  useEffect(() => {
    if (!imageUrl) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const newPreviews = new Map<string, string>();
      const allSizes: IconSize[] = [];

      // Always generate all platform previews
      for (const pc of platformConfig) {
        allSizes.push(...pc.sizes);
      }

      for (const cs of customSizes) {
        allSizes.push({
          width: cs.width,
          height: cs.height,
          label: "Custom",
          platform: "web",
          purpose: `Custom ${cs.width}x${cs.height}`,
          folder: "custom",
          filename: `icon-${cs.width}x${cs.height}.png`,
        });
      }

      allSizes.forEach((size) => {
        const key = `${size.platform}-${size.width}-${size.label}`;
        if (!newPreviews.has(key)) {
          newPreviews.set(key, generatePreview(img, size, settings, dpr));
        }
      });
      setPreviews(newPreviews);
    };
    img.src = imageUrl;
  }, [imageUrl, settings, customSizes, dpr]);

  if (!imageUrl) {
    return (
      <div className="text-center text-[var(--color-text-faint)] py-12">
        <p className="text-sm">Upload an icon to see previews</p>
      </div>
    );
  }

  const toggleCollapse = (key: string) => {
    setCollapsed((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const renderSizeCard = (size: IconSize, keyPrefix: string) => {
    const key = `${size.platform}-${size.width}-${size.label}`;
    const preview = previews.get(key);
    const isSmall = size.width <= 48;

    return (
      <div
        key={`${keyPrefix}-${key}`}
        className="bg-[var(--color-bg-surface-light)] border border-[var(--color-border)] rounded-lg p-3 text-center hover:border-[var(--color-border-hover)] transition-colors"
      >
        <div className="w-11 h-11 mx-auto mb-2 checkerboard rounded-md overflow-hidden flex items-center justify-center">
          {preview ? (
            <img
              src={preview}
              alt={`${size.width}x${size.height}`}
              className="max-w-full max-h-full object-contain"
              style={isSmall ? { width: size.width, height: size.height, imageRendering: "pixelated" } : undefined}
            />
          ) : (
            <div className="w-7 h-7 bg-[var(--color-border)] rounded animate-pulse" />
          )}
        </div>
        <p className="text-[11px] font-semibold text-[var(--color-text-secondary)]">
          {size.width}x{size.height}
        </p>
        <p className="text-[10px] text-[var(--color-text-muted)] font-medium">{size.label}</p>
        <p className="text-[9px] text-[var(--color-text-faint)] mt-0.5">{size.purpose}</p>
      </div>
    );
  };

  return (
    <div className="space-y-3 w-full min-w-0">
      {platformConfig.map((pc) => {
        const isCollapsed = collapsed[pc.key] ?? false;
        return (
          <div key={pc.key} className="w-full rounded-lg border border-[var(--color-border)] overflow-hidden">
            <button
              onClick={() => toggleCollapse(pc.key)}
              className="w-full flex items-center justify-between px-3 py-2 bg-[var(--color-bg-surface-light)] hover:bg-[var(--color-bg-surface)] transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${pc.badgeClass}`}>
                  {pc.label}
                </span>
                <span className="text-[10px] text-[var(--color-text-faint)]">
                  {pc.sizes.length} sizes
                </span>
              </div>
              <svg
                className={`w-3.5 h-3.5 text-[var(--color-text-faint)] transition-transform ${isCollapsed ? "" : "rotate-180"}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth="2"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {!isCollapsed && (
              <div className="grid grid-cols-2 gap-2 p-3">
                {pc.sizes.map((size) => renderSizeCard(size, pc.key))}
              </div>
            )}
          </div>
        );
      })}

      {customSizes.length > 0 && (
        <div className="w-full rounded-lg border border-[var(--color-border)] overflow-hidden">
          <button
            onClick={() => toggleCollapse("custom")}
            className="w-full flex items-center justify-between px-3 py-2 bg-[var(--color-bg-surface-light)] hover:bg-[var(--color-bg-surface)] transition-colors"
          >
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold bg-primary/10 text-primary px-2 py-0.5 rounded uppercase tracking-wider">
                Custom
              </span>
              <span className="text-[10px] text-[var(--color-text-faint)]">
                {customSizes.length} sizes
              </span>
            </div>
            <svg
              className={`w-3.5 h-3.5 text-[var(--color-text-faint)] transition-transform ${collapsed["custom"] ? "" : "rotate-180"}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth="2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {!collapsed["custom"] && (
            <div className="grid grid-cols-2 gap-2 p-3">
              {customSizes.map((cs) => {
                const size: IconSize = {
                  width: cs.width,
                  height: cs.height,
                  label: "Custom",
                  platform: "web",
                  purpose: `Custom ${cs.width}x${cs.height}`,
                  folder: "custom",
                  filename: `icon-${cs.width}x${cs.height}.png`,
                };
                return renderSizeCard(size, `custom-${cs.id}`);
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
