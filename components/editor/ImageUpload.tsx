"use client";

import { useCallback, useState, useRef } from "react";
import { toast } from "sonner";
import { ImageMetadata } from "@/lib/constants";
import { rasterizeSvg } from "@/lib/svg-utils";

interface ImageUploadProps {
  onImageUpload: (file: File, dataUrl: string) => void;
  onMetadataReady?: (metadata: ImageMetadata) => void;
  currentImage: string | null;
  metadata?: ImageMetadata | null;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ACCEPTED_TYPES = ["image/png", "image/jpeg", "image/jpg", "image/svg+xml"];

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function detectFormat(file: File): string {
  if (file.type === "image/svg+xml") return "SVG";
  if (file.type === "image/png") return "PNG";
  if (file.type === "image/jpeg" || file.type === "image/jpg") return "JPEG";
  return file.name.split(".").pop()?.toUpperCase() || "Unknown";
}

export default function ImageUpload({
  onImageUpload,
  onMetadataReady,
  currentImage,
  metadata,
}: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const extractMetadata = useCallback(
    (file: File, img: HTMLImageElement) => {
      if (!onMetadataReady) return;
      const meta: ImageMetadata = {
        width: img.naturalWidth,
        height: img.naturalHeight,
        fileSize: file.size,
        format: detectFormat(file),
        colorType: "RGBA",
      };
      onMetadataReady(meta);
    },
    [onMetadataReady]
  );

  const validateAndUpload = useCallback(
    async (file: File) => {
      if (!ACCEPTED_TYPES.includes(file.type)) {
        toast.error("Invalid file type. Please upload a PNG, JPG, or SVG file.");
        return;
      }
      if (file.size > MAX_FILE_SIZE) {
        toast.error("File too large. Maximum size is 10MB.");
        return;
      }

      // SVG files need special handling — rasterize first
      if (file.type === "image/svg+xml") {
        try {
          const svgText = await file.text();
          const rasterImg = await rasterizeSvg(svgText);
          const dataUrl = rasterImg.src;
          extractMetadata(file, rasterImg);
          onImageUpload(file, dataUrl);
          toast.success("SVG uploaded and rasterized!");
        } catch {
          toast.error("Failed to process SVG file. Please try again.");
        }
        return;
      }

      // Raster images — read as data URL
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        const img = new Image();
        img.onload = () => {
          extractMetadata(file, img);
          onImageUpload(file, dataUrl);
          toast.success("Image uploaded successfully!");
        };
        img.onerror = () => {
          onImageUpload(file, dataUrl);
          toast.success("Image uploaded successfully!");
        };
        img.src = dataUrl;
      };
      reader.onerror = () => {
        toast.error("Failed to read file. Please try again.");
      };
      reader.readAsDataURL(file);
    },
    [onImageUpload, extractMetadata]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) validateAndUpload(file);
    },
    [validateAndUpload]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) validateAndUpload(file);
    },
    [validateAndUpload]
  );

  if (currentImage) {
    return (
      <div className="space-y-3">
        <label className="text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider">
          Current Icon
        </label>
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-xl overflow-hidden border border-[var(--color-border)] checkerboard">
            <img
              src={currentImage}
              alt="Uploaded icon"
              className="w-full h-full object-contain"
            />
          </div>
          <div className="flex-1 min-w-0">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="text-sm text-primary hover:text-primary-hover font-medium transition-colors"
            >
              Upload New
            </button>
            {metadata && (
              <div className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5">
                <span className="text-[10px] text-[var(--color-text-muted)]">
                  {metadata.width}x{metadata.height}
                </span>
                <span className="text-[10px] text-[var(--color-text-muted)]">
                  {formatFileSize(metadata.fileSize)}
                </span>
                <span className="text-[10px] text-[var(--color-text-muted)]">
                  {metadata.format}
                </span>
              </div>
            )}
          </div>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept=".png,.jpg,.jpeg,.svg"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>
    );
  }

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onClick={() => fileInputRef.current?.click()}
      className={`upload-zone rounded-xl p-8 text-center cursor-pointer ${
        isDragging ? "dragging" : ""
      }`}
    >
      <svg
        className="w-10 h-10 mx-auto mb-3 text-[var(--color-text-faint)]"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
        />
      </svg>
      <p className="text-sm font-medium text-[var(--color-text-secondary)] mb-1">
        Drag & drop your icon here
      </p>
      <p className="text-xs text-[var(--color-text-muted)]">or click to browse</p>
      <p className="text-xs text-[var(--color-text-faint)] mt-2">PNG, JPG, SVG (max 10MB)</p>
      <input
        ref={fileInputRef}
        type="file"
        accept=".png,.jpg,.jpeg,.svg"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
}
