import AboutDialog from "@/components/AboutDialog";

export default function Footer() {
  return (
    <footer className="bg-[var(--color-bg)] border-t border-[var(--color-border)] py-10">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-5">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded border border-primary/40 bg-primary/10 flex items-center justify-center">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-primary">
                <rect x="3" y="3" width="18" height="18" rx="4" />
              </svg>
            </div>
            <span className="text-[var(--color-text-primary)] font-bold text-xs">
              appasset<span className="text-primary">gen</span>
              <span className="text-[var(--color-text-faint)] font-normal">_</span>
            </span>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6 text-xs text-[var(--color-text-muted)]">
            <AboutDialog />
          </div>

          {/* Copyright */}
          <div className="text-center md:text-right">
            <p className="text-[11px] text-[var(--color-text-faint)]">
              &copy; {new Date().getFullYear()} VaanLabs
            </p>
            <p className="text-[10px] text-[var(--color-text-faint)]/60 mt-0.5">
              runs entirely in your browser — nothing is uploaded
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
