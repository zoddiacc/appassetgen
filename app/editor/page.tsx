"use client";

import { useState, useCallback, useMemo } from "react";
import Link from "next/link";
import ImageUpload from "@/components/editor/ImageUpload";
import Canvas from "@/components/editor/Canvas";
import Toolbar from "@/components/editor/Toolbar";
import PreviewGrid from "@/components/editor/PreviewGrid";
import ExportPanel from "@/components/editor/ExportPanel";
import ValidationPanel from "@/components/editor/ValidationPanel";
import DevicePreview from "@/components/editor/DevicePreview";
import ThemeToggle from "@/components/ThemeToggle";
import CoffeeButton from "@/components/CoffeeButton";
import {
  EditSettings,
  DEFAULT_SETTINGS,
  ImageMetadata,
  ValidationWarning,
  ExportPlatforms,
  DEFAULT_EXPORT_PLATFORMS,
  CustomSize,
} from "@/lib/constants";
import { validateImage, checkContrast, checkSafeZone } from "@/lib/validation";

export default function EditorPage() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [settings, setSettings] = useState<EditSettings>(DEFAULT_SETTINGS);
  const [imageElement, setImageElement] = useState<HTMLImageElement | null>(null);

  // V2 state
  const [imageMetadata, setImageMetadata] = useState<ImageMetadata | null>(null);
  const [exportPlatforms, setExportPlatforms] = useState<ExportPlatforms>(DEFAULT_EXPORT_PLATFORMS);
  const [customSizes, setCustomSizes] = useState<CustomSize[]>([]);
  const [previewMode, setPreviewMode] = useState<"grid" | "device">("grid");
  const [deviceDarkMode, setDeviceDarkMode] = useState(false);

  const handleImageUpload = useCallback((_file: File, dataUrl: string) => {
    setImageUrl(dataUrl);
    setSettings(DEFAULT_SETTINGS);
    setImageElement(null);
  }, []);

  const handleNewIcon = useCallback(() => {
    setImageUrl(null);
    setSettings(DEFAULT_SETTINGS);
    setImageElement(null);
    setImageMetadata(null);
    setCustomSizes([]);
  }, []);

  const handleImageElementReady = useCallback((img: HTMLImageElement) => {
    setImageElement(img);
  }, []);

  const handleMetadataReady = useCallback((metadata: ImageMetadata) => {
    setImageMetadata(metadata);
  }, []);

  // Validation is pure derived state from the image, its metadata, and the padding
  const { validationWarnings, contrastScore } = useMemo(() => {
    if (!imageElement || !imageMetadata) {
      return { validationWarnings: [] as ValidationWarning[], contrastScore: undefined };
    }
    const warnings = validateImage(imageElement, imageMetadata);
    const contrast = checkContrast(imageElement);
    if (contrast.warning) {
      warnings.push({ type: "contrast", severity: "warn", message: contrast.warning });
    }
    if (checkSafeZone(imageElement, settings.padding)) {
      warnings.push({
        type: "safe-zone",
        severity: "warn",
        message:
          "Icon content extends beyond the circular safe zone. Android launchers and circular masks may crop it — consider more padding.",
      });
    }
    return { validationWarnings: warnings, contrastScore: contrast.score };
  }, [imageElement, imageMetadata, settings.padding]);

  return (
    <div className="h-screen flex flex-col bg-[var(--color-bg)]">
      {/* Header */}
      <header className="bg-[var(--color-bg-surface)] border-b border-[var(--color-border)] px-6 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded border border-primary/40 bg-primary/10 flex items-center justify-center">
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                className="text-primary"
              >
                <rect x="3" y="3" width="18" height="18" rx="4" />
              </svg>
            </div>
            <span className="font-bold text-base text-[var(--color-text-primary)] tracking-tight">
              appasset<span className="text-primary">gen</span>
              <span className="text-[var(--color-text-faint)] font-normal">_</span>
            </span>
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <CoffeeButton variant="icon" />
          <ThemeToggle />
          <button
            onClick={handleNewIcon}
            className="px-4 py-2 text-sm border border-[var(--color-border-hover)] rounded-lg text-[var(--color-text-muted)] hover:border-primary/50 hover:text-primary transition-colors font-medium ml-1"
          >
            New Icon
          </button>
        </div>
      </header>

      {/* Editor Layout */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Left Sidebar */}
        <aside className="w-full md:w-[300px] bg-[var(--color-bg-surface)] md:border-r border-[var(--color-border)] p-4 md:p-5 overflow-y-auto md:shrink-0 order-2 md:order-1">
          <ImageUpload
            onImageUpload={handleImageUpload}
            onMetadataReady={handleMetadataReady}
            currentImage={imageUrl}
            metadata={imageMetadata}
          />
          {imageUrl && imageMetadata && (
            <ValidationPanel
              warnings={validationWarnings}
              contrastScore={contrastScore}
            />
          )}
          <Toolbar
            settings={settings}
            onSettingsChange={setSettings}
            hasImage={!!imageUrl}
          />
        </aside>

        {/* Center Canvas */}
        <main className="flex-1 flex items-center justify-center p-4 md:p-6 overflow-auto order-1 md:order-2">
          <Canvas
            imageUrl={imageUrl}
            settings={settings}
            onImageElementReady={handleImageElementReady}
          />
        </main>

        {/* Right Sidebar */}
        <aside className="w-full md:w-[350px] bg-[var(--color-bg-surface)] md:border-l border-[var(--color-border)] flex flex-col md:shrink-0 order-3">
          {/* Preview mode toggle */}
          <div className="p-4 md:p-5 border-b border-[var(--color-border)] flex items-center justify-between">
            <h2 className="font-semibold text-[var(--color-text-primary)] text-sm">
              {previewMode === "grid" ? "Icon Sizes Preview" : "Device Preview"}
            </h2>
            <div className="flex rounded-lg border border-[var(--color-border)] overflow-hidden">
              <button
                onClick={() => setPreviewMode("grid")}
                className={`px-3 py-1 text-[10px] font-medium transition-colors ${
                  previewMode === "grid"
                    ? "bg-primary/10 text-primary"
                    : "text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]"
                }`}
              >
                Grid
              </button>
              <button
                onClick={() => setPreviewMode("device")}
                className={`px-3 py-1 text-[10px] font-medium transition-colors ${
                  previewMode === "device"
                    ? "bg-primary/10 text-primary"
                    : "text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]"
                }`}
              >
                Device
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto px-3 py-4 md:px-4 md:py-5">
            {previewMode === "grid" ? (
              <PreviewGrid
                imageUrl={imageUrl}
                settings={settings}
                customSizes={customSizes}
              />
            ) : (
              <DevicePreview
                imageUrl={imageUrl}
                settings={settings}
                darkMode={deviceDarkMode}
                onToggleDarkMode={() => setDeviceDarkMode((v) => !v)}
              />
            )}
          </div>
          <div className="p-4 md:p-5 border-t border-[var(--color-border)]">
            <ExportPanel
              imageElement={imageElement}
              settings={settings}
              exportPlatforms={exportPlatforms}
              onExportPlatformsChange={setExportPlatforms}
              customSizes={customSizes}
              onCustomSizesChange={setCustomSizes}
            />
          </div>
        </aside>
      </div>
    </div>
  );
}
