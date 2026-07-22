"use client";

import { useEffect, useState, useRef } from "react";
import { EditSettings } from "@/lib/constants";
import { renderIcon } from "@/lib/render-icon";
import { useDevicePixelRatio } from "@/lib/use-device-pixel-ratio";

interface DevicePreviewProps {
  imageUrl: string | null;
  settings: EditSettings;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

function drawIconOnCanvas(
  img: HTMLImageElement,
  size: number,
  settings: EditSettings,
  forceOpaque = false
): HTMLCanvasElement {
  const px = Math.round(size);
  return renderIcon(img, px, px, settings, { forceOpaque, blurRadius: 10 });
}

/**
 * Size a mockup canvas's backing store for the device pixel ratio and scale
 * the context so all drawing code stays in CSS-pixel coordinates. Without
 * this the mockups render blurry on high-DPI displays.
 */
function setupMockupCanvas(
  canvas: HTMLCanvasElement,
  cssW: number,
  cssH: number,
  dpr: number
): CanvasRenderingContext2D {
  canvas.width = Math.round(cssW * dpr);
  canvas.height = Math.round(cssH * dpr);
  canvas.style.width = `${cssW}px`;
  canvas.style.height = `${cssH}px`;
  const ctx = canvas.getContext("2d")!;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return ctx;
}

export default function DevicePreview({
  imageUrl,
  settings,
  darkMode,
  onToggleDarkMode,
}: DevicePreviewProps) {
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const iosCanvasRef = useRef<HTMLCanvasElement>(null);
  const androidCanvasRef = useRef<HTMLCanvasElement>(null);
  const faviconCanvasRef = useRef<HTMLCanvasElement>(null);
  const dpr = useDevicePixelRatio();

  useEffect(() => {
    if (!imageUrl) return;
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = () => setImg(image);
    image.src = imageUrl;
  }, [imageUrl]);

  useEffect(() => {
    if (!img) return;

    // iOS Home Screen mockup
    const iosCanvas = iosCanvasRef.current;
    if (iosCanvas) {
      const w = 140;
      const h = 120;
      const ctx = setupMockupCanvas(iosCanvas, w, h, dpr);
      ctx.clearRect(0, 0, w, h);

      // Background
      ctx.fillStyle = darkMode ? "#1c1c1e" : "#f2f2f7";
      ctx.fillRect(0, 0, w, h);

      // Draw icon with iOS rounded rect (iOS icons are always opaque)
      const iconSize = 60;
      const iconCanvas = drawIconOnCanvas(img, iconSize * dpr, settings, true);
      const ix = (w - iconSize) / 2;
      const iy = 30;

      ctx.save();
      ctx.beginPath();
      ctx.roundRect(ix, iy, iconSize, iconSize, 13);
      ctx.clip();
      ctx.drawImage(iconCanvas, ix, iy, iconSize, iconSize);
      ctx.restore();

      // Icon border
      ctx.strokeStyle = darkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)";
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.roundRect(ix, iy, iconSize, iconSize, 13);
      ctx.stroke();

      // Label
      ctx.fillStyle = darkMode ? "#ffffff" : "#000000";
      ctx.font = "9px -apple-system, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("My App", w / 2, iy + iconSize + 14);
    }

    // Android launcher mockup
    const androidCanvas = androidCanvasRef.current;
    if (androidCanvas) {
      const w = 140;
      const h = 120;
      const ctx = setupMockupCanvas(androidCanvas, w, h, dpr);
      ctx.clearRect(0, 0, w, h);

      ctx.fillStyle = darkMode ? "#121212" : "#fafafa";
      ctx.fillRect(0, 0, w, h);

      // Circle-masked icon
      const iconSize = 56;
      const iconCanvas = drawIconOnCanvas(img, iconSize * dpr, settings);
      const ix = (w - iconSize) / 2;
      const iy = 28;

      ctx.save();
      ctx.beginPath();
      ctx.arc(ix + iconSize / 2, iy + iconSize / 2, iconSize / 2, 0, Math.PI * 2);
      ctx.clip();
      ctx.drawImage(iconCanvas, ix, iy, iconSize, iconSize);
      ctx.restore();

      // Shadow
      ctx.shadowColor = "rgba(0,0,0,0.15)";
      ctx.shadowBlur = 4;
      ctx.shadowOffsetY = 2;
      ctx.beginPath();
      ctx.arc(ix + iconSize / 2, iy + iconSize / 2, iconSize / 2, 0, Math.PI * 2);
      ctx.strokeStyle = "transparent";
      ctx.stroke();
      ctx.shadowColor = "transparent";

      // Label
      ctx.fillStyle = darkMode ? "#e0e0e0" : "#212121";
      ctx.font = "9px Roboto, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("My App", w / 2, iy + iconSize + 14);
    }

    // Web favicon mockup
    const faviconCanvas = faviconCanvasRef.current;
    if (faviconCanvas) {
      const w = 200;
      const h = 36;
      const ctx = setupMockupCanvas(faviconCanvas, w, h, dpr);
      ctx.clearRect(0, 0, w, h);

      // Browser tab
      ctx.fillStyle = darkMode ? "#2d2d2d" : "#dee1e6";
      ctx.fillRect(0, 0, w, h);

      // Active tab
      const tabW = 120;
      const tabH = 28;
      const tabX = 8;
      const tabY = h - tabH;
      ctx.fillStyle = darkMode ? "#3c3c3c" : "#ffffff";
      ctx.beginPath();
      ctx.roundRect(tabX, tabY, tabW, tabH, [6, 6, 0, 0]);
      ctx.fill();

      // Favicon in tab
      const favSize = 14;
      const favX = tabX + 8;
      const favY = tabY + (tabH - favSize) / 2;
      const iconCanvas = drawIconOnCanvas(img, favSize * dpr, settings);
      ctx.drawImage(iconCanvas, favX, favY, favSize, favSize);

      // Tab title
      ctx.fillStyle = darkMode ? "#ccc" : "#5f6368";
      ctx.font = "10px -apple-system, sans-serif";
      ctx.textAlign = "left";
      ctx.fillText("My App", favX + favSize + 6, tabY + tabH / 2 + 3);
    }
  }, [img, settings, darkMode, dpr]);

  if (!imageUrl) {
    return (
      <div className="text-center text-[var(--color-text-faint)] py-12">
        <p className="text-sm">Upload an icon to see device previews</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider">
          Device Previews
        </label>
        <button
          onClick={onToggleDarkMode}
          className="text-[10px] px-2 py-1 rounded border border-[var(--color-border)] text-[var(--color-text-muted)] hover:border-[var(--color-border-hover)] transition-colors"
        >
          {darkMode ? "Light BG" : "Dark BG"}
        </button>
      </div>

      {/* iOS */}
      <div className="rounded-lg border border-[var(--color-border)] overflow-hidden">
        <div className="px-3 py-1.5 bg-[var(--color-bg-surface-light)] border-b border-[var(--color-border)]">
          <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">iOS Home Screen</span>
        </div>
        <div className="flex justify-center p-3">
          <canvas ref={iosCanvasRef} width={140} height={120} className="rounded" />
        </div>
      </div>

      {/* Android */}
      <div className="rounded-lg border border-[var(--color-border)] overflow-hidden">
        <div className="px-3 py-1.5 bg-[var(--color-bg-surface-light)] border-b border-[var(--color-border)]">
          <span className="text-[10px] font-bold text-green-400 uppercase tracking-wider">Android Launcher</span>
        </div>
        <div className="flex justify-center p-3">
          <canvas ref={androidCanvasRef} width={140} height={120} className="rounded" />
        </div>
      </div>

      {/* Web Favicon */}
      <div className="rounded-lg border border-[var(--color-border)] overflow-hidden">
        <div className="px-3 py-1.5 bg-[var(--color-bg-surface-light)] border-b border-[var(--color-border)]">
          <span className="text-[10px] font-bold text-orange-400 uppercase tracking-wider">Browser Tab</span>
        </div>
        <div className="flex justify-center p-3">
          <canvas ref={faviconCanvasRef} width={200} height={36} className="rounded" />
        </div>
      </div>
    </div>
  );
}
