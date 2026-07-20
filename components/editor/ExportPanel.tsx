"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";
import { generateAllSizes, generateSingleIcon } from "@/lib/icon-generator";
import { createAndDownloadZip, getFaviconHtmlSnippet } from "@/lib/zip-builder";
import { EditSettings, ExportPlatforms, CustomSize, getSizesForPlatforms } from "@/lib/constants";
import { saveAs } from "file-saver";

interface ExportPanelProps {
  imageElement: HTMLImageElement | null;
  settings: EditSettings;
  exportPlatforms: ExportPlatforms;
  onExportPlatformsChange: (platforms: ExportPlatforms) => void;
  customSizes: CustomSize[];
  onCustomSizesChange: (sizes: CustomSize[]) => void;
}

const platformOptions: { key: keyof ExportPlatforms; label: string; color: string }[] = [
  { key: "ios", label: "iOS", color: "text-blue-400" },
  { key: "android", label: "Android", color: "text-green-400" },
  { key: "web", label: "Web", color: "text-orange-400" },
  { key: "windows", label: "Windows", color: "text-purple-400" },
];

export default function ExportPanel({
  imageElement,
  settings,
  exportPlatforms,
  onExportPlatformsChange,
  customSizes,
  onCustomSizesChange,
}: ExportPanelProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [lastDuration, setLastDuration] = useState<number | null>(null);
  const [customW, setCustomW] = useState("");
  const [customH, setCustomH] = useState("");
  const [singleIndex, setSingleIndex] = useState(0);

  const activeSizes = getSizesForPlatforms(exportPlatforms, customSizes);
  const totalCount = activeSizes.length;

  const handleTogglePlatform = useCallback(
    (key: keyof ExportPlatforms) => {
      onExportPlatformsChange({ ...exportPlatforms, [key]: !exportPlatforms[key] });
    },
    [exportPlatforms, onExportPlatformsChange]
  );

  const handleAddCustomSize = useCallback(() => {
    const w = parseInt(customW);
    const h = parseInt(customH);
    if (isNaN(w) || isNaN(h) || w < 1 || h < 1 || w > 4096 || h > 4096) {
      toast.error("Enter a valid size (1-4096px).");
      return;
    }
    const id = `${w}x${h}-${Date.now()}`;
    onCustomSizesChange([...customSizes, { width: w, height: h, id }]);
    setCustomW("");
    setCustomH("");
    toast.success(`Added custom size ${w}x${h}`);
  }, [customW, customH, customSizes, onCustomSizesChange]);

  const handleRemoveCustomSize = useCallback(
    (id: string) => {
      onCustomSizesChange(customSizes.filter((cs) => cs.id !== id));
    },
    [customSizes, onCustomSizesChange]
  );

  const handleExportAll = useCallback(async () => {
    if (!imageElement) {
      toast.error("Please upload an icon first.");
      return;
    }

    setIsExporting(true);
    try {
      toast.info("Generating icons...");
      const result = await generateAllSizes(imageElement, settings, exportPlatforms, customSizes);
      await createAndDownloadZip(result.icons, exportPlatforms);
      setLastDuration(result.durationMs);
      toast.success(`Icons downloaded! (${result.durationMs}ms)`);
    } catch (error) {
      console.error("Export failed:", error);
      toast.error("Failed to generate icons. Please try again.");
    } finally {
      setIsExporting(false);
    }
  }, [imageElement, settings, exportPlatforms, customSizes]);

  const handleDownloadSingle = useCallback(async () => {
    if (!imageElement) {
      toast.error("Upload an icon first.");
      return;
    }
    const size = activeSizes[Math.min(singleIndex, activeSizes.length - 1)];
    if (!size) return;

    try {
      const blob = await generateSingleIcon(imageElement, size, settings);
      saveAs(blob, size.filename);
      toast.success(`Downloaded ${size.filename}`);
    } catch {
      toast.error("Failed to download icon.");
    }
  }, [imageElement, settings, activeSizes, singleIndex]);

  const handleCopyManifestTags = useCallback(() => {
    const snippet = getFaviconHtmlSnippet();
    navigator.clipboard.writeText(snippet).then(
      () => toast.success("Favicon HTML tags copied to clipboard!"),
      () => toast.error("Failed to copy to clipboard.")
    );
  }, []);

  return (
    <div className="space-y-4">
      {/* Platform toggles */}
      <div>
        <label className="text-[10px] font-medium text-[var(--color-text-muted)] uppercase tracking-wider mb-2 block">
          Platforms ({totalCount} icons)
        </label>
        <div className="grid grid-cols-2 gap-1.5">
          {platformOptions.map((p) => (
            <button
              key={p.key}
              onClick={() => handleTogglePlatform(p.key)}
              className={`text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors ${
                exportPlatforms[p.key]
                  ? `${p.color} border-current/30 bg-current/5`
                  : "text-[var(--color-text-faint)] border-[var(--color-border)] hover:border-[var(--color-border-hover)]"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Custom size input */}
      <div>
        <label className="text-[10px] font-medium text-[var(--color-text-muted)] uppercase tracking-wider mb-1.5 block">
          Custom Size
        </label>
        <div className="flex gap-1.5">
          <input
            type="number"
            placeholder="W"
            value={customW}
            onChange={(e) => setCustomW(e.target.value)}
            className="w-16 px-2 py-1.5 text-xs rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text-primary)] focus:border-primary/50 outline-none"
            min="1"
            max="4096"
          />
          <span className="text-[var(--color-text-faint)] text-xs self-center">x</span>
          <input
            type="number"
            placeholder="H"
            value={customH}
            onChange={(e) => setCustomH(e.target.value)}
            className="w-16 px-2 py-1.5 text-xs rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text-primary)] focus:border-primary/50 outline-none"
            min="1"
            max="4096"
          />
          <button
            onClick={handleAddCustomSize}
            className="px-3 py-1.5 text-xs font-medium rounded-lg border border-primary/30 text-primary hover:bg-primary/10 transition-colors"
          >
            Add
          </button>
        </div>
        {customSizes.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {customSizes.map((cs) => (
              <span
                key={cs.id}
                className="inline-flex items-center gap-1 text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded"
              >
                {cs.width}x{cs.height}
                <button
                  onClick={() => handleRemoveCustomSize(cs.id)}
                  className="hover:text-primary-hover ml-0.5"
                >
                  x
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Download All */}
      <button
        onClick={handleExportAll}
        disabled={!imageElement || isExporting || totalCount === 0}
        className="w-full py-3 btn-gradient text-white font-semibold rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 text-sm"
      >
        {isExporting ? (
          <>
            <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Generating...
          </>
        ) : (
          <>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12M12 16.5V3" />
            </svg>
            Download All ({totalCount})
          </>
        )}
      </button>

      {/* Duration indicator */}
      {lastDuration !== null && (
        <p className="text-[10px] text-[var(--color-text-faint)] text-center">
          Generated in {lastDuration}ms
        </p>
      )}

      {/* Single-size download */}
      <div>
        <label className="text-[10px] font-medium text-[var(--color-text-muted)] uppercase tracking-wider mb-1.5 block">
          Single Size
        </label>
        <div className="flex gap-1.5">
          <select
            value={Math.min(singleIndex, Math.max(totalCount - 1, 0))}
            onChange={(e) => setSingleIndex(Number(e.target.value))}
            className="flex-1 min-w-0 px-2 py-1.5 text-xs rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text-primary)] focus:border-primary/50 outline-none"
          >
            {activeSizes.map((size, i) => (
              <option key={`${size.platform}-${size.width}-${size.label}-${i}`} value={i}>
                {size.width}x{size.height} — {size.platform} {size.label}
              </option>
            ))}
          </select>
          <button
            onClick={handleDownloadSingle}
            disabled={!imageElement || totalCount === 0}
            className="px-3 py-1.5 text-xs font-medium rounded-lg border border-[var(--color-border)] text-[var(--color-text-muted)] hover:border-[var(--color-border-hover)] hover:text-[var(--color-text-secondary)] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Download
          </button>
        </div>
      </div>

      {/* Utility buttons */}
      {exportPlatforms.web && (
        <button
          onClick={handleCopyManifestTags}
          className="w-full py-2 text-xs font-medium rounded-lg border border-[var(--color-border)] text-[var(--color-text-muted)] hover:border-[var(--color-border-hover)] hover:text-[var(--color-text-secondary)] transition-colors"
        >
          Copy Favicon Tags
        </button>
      )}
    </div>
  );
}
