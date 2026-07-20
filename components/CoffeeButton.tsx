"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

interface CoffeeButtonProps {
  variant?: "icon" | "full";
}

function CoffeeDialog({ onClose }: { onClose: () => void }) {
  // Lock body scroll when dialog is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 99999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Simple dark overlay - no blur */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "rgba(0, 0, 0, 0.6)",
        }}
        onClick={onClose}
      />

      {/* Dialog Content - perfectly centered */}
      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "24rem",
          margin: "0 1rem",
          backgroundColor: "var(--color-bg-surface)",
          border: "1px solid var(--color-border)",
          borderRadius: "1rem",
          padding: "1.5rem",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "0.75rem",
            right: "0.75rem",
            width: "2rem",
            height: "2rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "0.5rem",
            color: "var(--color-text-muted)",
            background: "transparent",
            border: "none",
            cursor: "pointer",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor =
              "var(--color-bg-surface-light)";
            e.currentTarget.style.color = "var(--color-text-primary)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "transparent";
            e.currentTarget.style.color = "var(--color-text-muted)";
          }}
          aria-label="Close"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* Coffee Icon with app gradient */}
        <div
          style={{
            width: "4rem",
            height: "4rem",
            margin: "0 auto 1.25rem",
            borderRadius: "1rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background:
              "linear-gradient(135deg, rgb(var(--primary-rgb) / 0.15) 0%, rgb(var(--accent-rgb) / 0.15) 100%)",
            border: "1px solid rgb(var(--primary-rgb) / 0.3)",
          }}
        >
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="url(#coffeeGradient)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <defs>
              <linearGradient
                id="coffeeGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#0D9488" />
                <stop offset="100%" stopColor="#0891B2" />
              </linearGradient>
            </defs>
            <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
            <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
            <line x1="6" y1="1" x2="6" y2="4" />
            <line x1="10" y1="1" x2="10" y2="4" />
            <line x1="14" y1="1" x2="14" y2="4" />
          </svg>
        </div>

        {/* Title */}
        <h3
          style={{
            fontSize: "1.125rem",
            fontWeight: 700,
            color: "var(--color-text-primary)",
            textAlign: "center",
            marginBottom: "0.5rem",
          }}
        >
          Support AppAssetGen
        </h3>

        {/* Message */}
        <p
          style={{
            fontSize: "0.875rem",
            color: "var(--color-text-muted)",
            textAlign: "center",
            lineHeight: 1.625,
            marginBottom: "1.25rem",
          }}
        >
          Built by{" "}
          <span
            style={{
              fontWeight: 500,
              background: "linear-gradient(135deg, rgb(var(--primary-rgb)), rgb(var(--accent-rgb)))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            VaanLabs
          </span>
          . If this tool saved you time, consider supporting our work.
        </p>

        {/* Support Button - match hero primary button styling */}
        <button
          disabled
          className="btn-gradient text-white font-semibold px-8 py-3.5 rounded-xl w-full cursor-not-allowed"
          style={{ border: "none", opacity: 1 }}
        >
          Coming Soon
        </button>

        {/* Close text button */}
        <button
          onClick={onClose}
          style={{
            width: "100%",
            marginTop: "0.75rem",
            fontSize: "0.75rem",
            color: "var(--color-text-muted)",
            background: "transparent",
            border: "none",
            cursor: "pointer",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "var(--color-text-primary)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "var(--color-text-muted)";
          }}
        >
          Maybe later
        </button>
      </div>
    </div>
  );
}

export default function CoffeeButton({ variant = "icon" }: CoffeeButtonProps) {
  const [showDialog, setShowDialog] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      {variant === "icon" ? (
        <button
          onClick={() => setShowDialog(true)}
          className="w-9 h-9 flex items-center justify-center rounded border border-[var(--color-border)] hover:border-primary hover:text-primary transition-colors text-[var(--color-text-muted)]"
          aria-label="Support this project"
          title="Support the project"
        >
          {/* Coffee Cup Icon */}
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
            <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
            <line x1="6" y1="1" x2="6" y2="4" />
            <line x1="10" y1="1" x2="10" y2="4" />
            <line x1="14" y1="1" x2="14" y2="4" />
          </svg>
        </button>
      ) : (
        <button
          onClick={() => setShowDialog(true)}
          className="flex items-center gap-2 px-4 py-2 rounded border border-[var(--color-border)] hover:border-primary text-[var(--color-text-muted)] hover:text-primary transition-colors text-sm font-medium"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
            <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
            <line x1="6" y1="1" x2="6" y2="4" />
            <line x1="10" y1="1" x2="10" y2="4" />
            <line x1="14" y1="1" x2="14" y2="4" />
          </svg>
          <span>Support</span>
        </button>
      )}

      {/* Render dialog at body level using portal */}
      {mounted &&
        showDialog &&
        createPortal(
          <CoffeeDialog onClose={() => setShowDialog(false)} />,
          document.body
        )}
    </>
  );
}
