"use client";

import { EditSettings } from "@/lib/constants";

interface ToolbarProps {
  settings: EditSettings;
  onSettingsChange: (settings: EditSettings) => void;
  hasImage: boolean;
}

const BG_MODES = [
  { value: "auto", label: "Auto", desc: "Edge color from your image" },
  { value: "blur", label: "Blur", desc: "Blurred image fill" },
  { value: "transparent", label: "None", desc: "Transparent — iOS output stays opaque (Apple requires it)" },
  { value: "custom", label: "Custom", desc: "Pick any color" },
] as const;

type BgMode = "auto" | "blur" | "transparent" | "custom";

function getBgMode(backgroundColor: string): BgMode {
  if (backgroundColor === "auto") return "auto";
  if (backgroundColor === "blur") return "blur";
  if (backgroundColor === "transparent") return "transparent";
  return "custom";
}

export default function Toolbar({
  settings,
  onSettingsChange,
  hasImage,
}: ToolbarProps) {
  if (!hasImage) return null;

  const update = (partial: Partial<EditSettings>) => {
    onSettingsChange({ ...settings, ...partial });
  };

  const bgMode = getBgMode(settings.backgroundColor);

  return (
    <div className="space-y-5 mt-6">
      {/* Fit Mode */}
      <div>
        <label className="text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider block mb-2">
          Fit Mode
        </label>
        <div className="flex gap-2">
          {(["fill", "fit"] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => update({ fitMode: mode })}
              className={`flex-1 px-3 py-2 text-xs rounded-lg border font-medium transition-colors ${
                settings.fitMode === mode
                  ? "bg-primary/10 text-primary border-primary/30"
                  : "border-[var(--color-border-hover)] text-[var(--color-text-muted)] hover:border-primary/30"
              }`}
            >
              {mode === "fill" ? "Fill" : "Fit"}
            </button>
          ))}
        </div>
        <p className="text-[10px] text-[var(--color-text-faint)] mt-1.5">
          {settings.fitMode === "fill"
            ? "Crops to fill the square"
            : "Shows the entire image"}
        </p>
      </div>

      {/* Background */}
      <div>
        <label className="text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider block mb-2">
          Background
        </label>
        <div className="grid grid-cols-2 gap-2">
          {BG_MODES.map((mode) => (
            <button
              key={mode.value}
              onClick={() => {
                if (mode.value === "custom") {
                  update({ backgroundColor: "#ffffff" });
                } else {
                  update({ backgroundColor: mode.value });
                }
              }}
              className={`px-3 py-2 text-xs rounded-lg border font-medium transition-colors ${
                bgMode === mode.value
                  ? "bg-primary/10 text-primary border-primary/30"
                  : "border-[var(--color-border-hover)] text-[var(--color-text-muted)] hover:border-primary/30"
              }`}
            >
              {mode.label}
            </button>
          ))}
        </div>
        <p className="text-[10px] text-[var(--color-text-faint)] mt-1.5">
          {BG_MODES.find((m) => m.value === bgMode)?.desc}
        </p>

        {/* Color picker — only shown for Custom */}
        {bgMode === "custom" && (
          <div className="mt-2">
            <input
              type="color"
              value={settings.backgroundColor}
              onChange={(e) => update({ backgroundColor: e.target.value })}
              className="w-9 h-9 rounded-lg border border-[var(--color-border)] cursor-pointer bg-transparent"
            />
          </div>
        )}
      </div>

      {/* Padding */}
      <div>
        <label className="text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider block mb-2">
          Padding{" "}
          <span className="text-[var(--color-text-faint)] normal-case">{settings.padding}%</span>
        </label>
        <input
          type="range"
          min="0"
          max="30"
          value={settings.padding}
          onChange={(e) => update({ padding: Number(e.target.value) })}
          className="w-full"
        />
      </div>

      {/* Rounded Corners */}
      <div>
        <label className="text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider block mb-2">
          Rounded Corners{" "}
          <span className="text-[var(--color-text-faint)] normal-case">{settings.borderRadius}px</span>
        </label>
        <input
          type="range"
          min="0"
          max="50"
          value={settings.borderRadius}
          onChange={(e) => update({ borderRadius: Number(e.target.value) })}
          className="w-full"
        />
      </div>

      {/* Rotate */}
      <div>
        <label className="text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider block mb-2">
          Rotate
        </label>
        <div className="flex gap-2">
          {[90, 180, 270].map((deg) => (
            <button
              key={deg}
              onClick={() =>
                update({ rotation: (settings.rotation + deg) % 360 })
              }
              className="flex-1 px-3 py-2 text-xs border border-[var(--color-border-hover)] rounded-lg text-[var(--color-text-muted)] hover:border-primary/30 hover:text-primary transition-colors font-medium"
            >
              {deg}&deg;
            </button>
          ))}
        </div>
      </div>

      {/* Brightness */}
      <div>
        <label className="text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider block mb-2">
          Brightness{" "}
          <span className="text-[var(--color-text-faint)] normal-case">{settings.brightness}</span>
        </label>
        <input
          type="range"
          min="-50"
          max="50"
          value={settings.brightness}
          onChange={(e) => update({ brightness: Number(e.target.value) })}
          className="w-full"
        />
      </div>

      {/* Contrast */}
      <div>
        <label className="text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider block mb-2">
          Contrast{" "}
          <span className="text-[var(--color-text-faint)] normal-case">{settings.contrast}</span>
        </label>
        <input
          type="range"
          min="-50"
          max="50"
          value={settings.contrast}
          onChange={(e) => update({ contrast: Number(e.target.value) })}
          className="w-full"
        />
      </div>

      {/* Reset */}
      <button
        onClick={() =>
          onSettingsChange({
            backgroundColor: "auto",
            padding: 10,
            borderRadius: 0,
            rotation: 0,
            brightness: 0,
            contrast: 0,
            fitMode: "fill",
          })
        }
        className="w-full py-2 text-xs border border-[var(--color-border-hover)] rounded-lg text-[var(--color-text-muted)] hover:border-red-500/30 hover:text-red-400 transition-colors font-medium"
      >
        Reset All Changes
      </button>
    </div>
  );
}
