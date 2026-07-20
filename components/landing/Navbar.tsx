import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";
import CoffeeButton from "@/components/CoffeeButton";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-3">
        <div className="bg-[var(--color-bg-nav)] backdrop-blur-xl border border-[var(--color-border)] rounded-lg px-4 md:px-5 py-2.5 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded border border-primary/40 bg-primary/10 flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-primary">
                <rect x="3" y="3" width="18" height="18" rx="4" />
              </svg>
            </div>
            <span className="text-[var(--color-text-primary)] font-bold text-sm md:text-base tracking-tight">
              appasset<span className="text-primary">gen</span>
              <span className="text-[var(--color-text-faint)] font-normal">_</span>
            </span>
          </Link>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-6 text-xs">
            <a href="#features" className="text-[var(--color-text-muted)] hover:text-primary transition-colors">
              ./features
            </a>
            <a href="#how-it-works" className="text-[var(--color-text-muted)] hover:text-primary transition-colors">
              ./how-it-works
            </a>
          </div>

          {/* Coffee Button + Theme Toggle + CTA */}
          <div className="flex items-center gap-1.5 md:gap-2">
            <CoffeeButton variant="icon" />
            <ThemeToggle />
            <Link
              href="/editor"
              className="border border-primary/40 bg-primary/10 text-primary text-xs font-bold px-4 py-2 rounded hover:bg-primary/20 transition-colors ml-1"
            >
              open editor
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
