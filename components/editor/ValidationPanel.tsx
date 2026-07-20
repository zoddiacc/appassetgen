"use client";

import { ValidationWarning } from "@/lib/constants";

interface ValidationPanelProps {
  warnings: ValidationWarning[];
  contrastScore?: number;
}

export default function ValidationPanel({
  warnings,
  contrastScore,
}: ValidationPanelProps) {
  if (warnings.length === 0 && (contrastScore === undefined || contrastScore >= 0.05)) {
    return (
      <div className="mt-4 p-3 rounded-lg bg-green-500/5 border border-green-500/20">
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-green-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-xs text-green-400 font-medium">All checks passed</span>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-4 space-y-2">
      <label className="text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider">
        Validation
      </label>
      {warnings.map((warning, i) => (
        <div
          key={`${warning.type}-${i}`}
          className={`p-3 rounded-lg border text-xs leading-relaxed ${
            warning.severity === "error"
              ? "bg-red-500/5 border-red-500/20 text-red-400"
              : "bg-yellow-500/5 border-yellow-500/20 text-yellow-400"
          }`}
        >
          <div className="flex items-start gap-2">
            {warning.severity === "error" ? (
              <svg className="w-3.5 h-3.5 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
            ) : (
              <svg className="w-3.5 h-3.5 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
            )}
            <span>{warning.message}</span>
          </div>
        </div>
      ))}
      {contrastScore !== undefined && contrastScore < 0.05 && (
        <div className="p-3 rounded-lg border bg-yellow-500/5 border-yellow-500/20 text-yellow-400 text-xs leading-relaxed">
          <div className="flex items-start gap-2">
            <svg className="w-3.5 h-3.5 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
            <span>Low contrast between icon content and edges. May be hard to see on some backgrounds.</span>
          </div>
        </div>
      )}
    </div>
  );
}
