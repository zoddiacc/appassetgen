"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

function AboutDialogContent({ onClose }: { onClose: () => void }) {
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

      {/* Dialog Content */}
      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "28rem",
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

        {/* Logo */}
        <div
          style={{
            width: "4rem",
            height: "4rem",
            margin: "0 auto 1rem",
            borderRadius: "1rem",
            background: "linear-gradient(135deg, #0D9488, #0891B2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
          >
            <rect x="3" y="3" width="18" height="18" rx="4" />
            <circle cx="12" cy="12" r="4" />
          </svg>
        </div>

        {/* Title */}
        <h2
          style={{
            fontSize: "1.25rem",
            fontWeight: 700,
            color: "var(--color-text-primary)",
            textAlign: "center",
            marginBottom: "0.25rem",
          }}
        >
          VaanLabs
        </h2>
        <p
          style={{
            fontSize: "0.875rem",
            color: "var(--color-text-muted)",
            textAlign: "center",
            marginBottom: "1.25rem",
          }}
        >
          Tools for the Modern Creator
        </p>

        {/* Divider */}
        <div
          style={{
            height: "1px",
            backgroundColor: "var(--color-border)",
            marginBottom: "1.25rem",
          }}
        />

        {/* Content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.75rem",
            fontSize: "0.875rem",
            color: "var(--color-text-muted)",
            lineHeight: 1.625,
          }}
        >
          <p>
            <span style={{ fontWeight: 500, color: "var(--color-text-primary)" }}>
              AppAssetGen
            </span>{" "}
            is a product of{" "}
            <span style={{ fontWeight: 500, color: "var(--color-text-primary)" }}>
              VaanLabs
            </span>
            .
          </p>
          <p>
            We build accessible tools for developers and designers. Our mission
            is to eliminate tedious work so you can focus on creating something
            people love.
          </p>
          <p>Free forever. No watermarks, no limits.</p>
        </div>

        {/* Footer */}
        <div
          style={{
            marginTop: "1.25rem",
            paddingTop: "1rem",
            borderTop: "1px solid var(--color-border)",
            textAlign: "center",
          }}
        >
          <p style={{ fontSize: "0.75rem", color: "var(--color-text-faint)" }}>
            © {new Date().getFullYear()} VaanLabs
          </p>
        </div>
      </div>
    </div>
  );
}

export default function AboutDialog() {
  const [showDialog, setShowDialog] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      <button
        onClick={() => setShowDialog(true)}
        className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors"
      >
        About
      </button>

      {/* Render dialog at body level using portal */}
      {mounted &&
        showDialog &&
        createPortal(
          <AboutDialogContent onClose={() => setShowDialog(false)} />,
          document.body
        )}
    </>
  );
}
