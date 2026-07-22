"use client";

import { useRef, useEffect, useCallback } from "react";
import { EditSettings } from "@/lib/constants";
import { renderIcon } from "@/lib/render-icon";

interface CanvasProps {
  imageUrl: string | null;
  settings: EditSettings;
  onImageElementReady: (img: HTMLImageElement) => void;
}

function getCheckerboardColors(): [string, string] {
  const style = getComputedStyle(document.documentElement);
  const a = style.getPropertyValue("--color-checkerboard-a").trim();
  const b = style.getPropertyValue("--color-checkerboard-b").trim();
  return [a || "#1C1C1E", b || "#222224"];
}

export default function Canvas({
  imageUrl,
  settings,
  onImageElementReady,
}: CanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);

  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const img = imageRef.current;
    if (!canvas || !img) return;

    const ctx = canvas.getContext("2d")!;
    // Render the backing store at device resolution so the preview isn't
    // upscaled (and blurred) on high-DPI displays; CSS pins it to 600px.
    const dpr = window.devicePixelRatio || 1;
    const size = Math.round(600 * dpr);
    canvas.width = size;
    canvas.height = size;

    ctx.clearRect(0, 0, size, size);

    // Theme-aware checkerboard (visible behind transparent areas in preview)
    const [colorA, colorB] = getCheckerboardColors();
    const tileSize = Math.round(15 * dpr);
    for (let y = 0; y < size; y += tileSize) {
      for (let x = 0; x < size; x += tileSize) {
        ctx.fillStyle =
          (Math.floor(x / tileSize) + Math.floor(y / tileSize)) % 2 === 0
            ? colorA
            : colorB;
        ctx.fillRect(x, y, tileSize, tileSize);
      }
    }

    ctx.drawImage(renderIcon(img, size, size, settings), 0, 0);
  }, [settings]);

  useEffect(() => {
    if (!imageUrl) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      imageRef.current = img;
      onImageElementReady(img);
      drawCanvas();
    };
    img.src = imageUrl;
  }, [imageUrl, onImageElementReady]);

  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  if (!imageUrl) {
    return (
      <div className="w-full aspect-square max-w-[600px] mx-auto bg-[var(--color-bg-surface)] rounded-2xl border border-[var(--color-border)] flex items-center justify-center">
        <div className="text-center text-[var(--color-text-faint)]">
          <svg
            className="w-16 h-16 mx-auto mb-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth="1"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
          <p className="text-sm text-[var(--color-text-muted)]">Upload an icon to get started</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center">
      <canvas
        ref={canvasRef}
        width={600}
        height={600}
        className="w-full max-w-[600px] rounded-xl border border-[var(--color-border)]"
      />
    </div>
  );
}
