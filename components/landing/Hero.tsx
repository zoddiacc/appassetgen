import Link from "next/link";

const terminalOutput = [
  { text: "$ appassetgen ./icon.svg --platforms all", cls: "text-[#7BDCB5]" },
  { text: "", cls: "" },
  { text: "  reading source ......... icon.svg (1024x1024)", cls: "text-[#9DB2AC]" },
  { text: "  validating ............. ok, all checks passed", cls: "text-[#9DB2AC]" },
  { text: "", cls: "" },
  { text: "  ✓ ios/AppIcon.appiconset     10 files + Contents.json", cls: "text-[#E8EDEB]" },
  { text: "  ✓ android/res/mipmap-*        6 files", cls: "text-[#E8EDEB]" },
  { text: "  ✓ web/                        8 files + favicon.ico", cls: "text-[#E8EDEB]" },
  { text: "  ✓ windows/                    6 files + icon.ico", cls: "text-[#E8EDEB]" },
  { text: "", cls: "" },
  { text: "  30 icons, 2 .ico bundles → app-icons.zip (412ms)", cls: "text-[#7BDCB5]" },
];

export default function Hero() {
  return (
    <section className="hero-glow grid-bg min-h-screen flex items-center pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-6 w-full">
        <div className="grid lg:grid-cols-2 gap-14 items-center">
          {/* Left — Text */}
          <div>
            <p className="text-xs text-primary mb-4 tracking-widest uppercase">{"// icon generator for developers"}
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.15] tracking-tight">
              Every app icon.
              <br />
              One upload.
              <span className="cursor-blink ml-2" aria-hidden="true" />
            </h1>

            <p className="mt-6 text-sm md:text-base text-[var(--color-text-muted)] max-w-md leading-relaxed">
              Drop in a single image — get all iOS, Android, Web, and Windows
              sizes in an organized ZIP. Xcode and Android Studio ready.
              100% client-side.
            </p>

            {/* Buttons */}
            <div className="mt-8 md:mt-10 flex items-center gap-4 flex-wrap">
              <Link
                href="/editor"
                className="btn-gradient text-white font-bold px-7 py-3 rounded text-sm flex items-center gap-2"
              >
                <span aria-hidden="true">▶</span> start generating
              </Link>
              <a
                href="#how-it-works"
                className="text-sm text-[var(--color-text-muted)] hover:text-primary transition-colors border border-[var(--color-border)] hover:border-primary/40 px-6 py-3 rounded"
              >
                how it works
              </a>
            </div>

            {/* Format Tags */}
            <div className="mt-10 flex items-center gap-2.5 flex-wrap">
              <span className="text-xs text-[var(--color-text-faint)]">in:</span>
              <span className="format-tag">png</span>
              <span className="format-tag">jpg</span>
              <span className="format-tag">svg</span>
              <span className="text-xs text-[var(--color-text-faint)] ml-2">out:</span>
              <span className="format-tag">png</span>
              <span className="format-tag">ico</span>
              <span className="format-tag">zip</span>
            </div>
          </div>

          {/* Right — Terminal mockup */}
          <div className="hidden lg:block relative">
            <div className="terminal-window">
              {/* Title bar */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5">
                <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
                <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
                <div className="w-3 h-3 rounded-full bg-[#28CA41]" />
                <span className="text-[11px] text-[#5C6663] ml-3">
                  appassetgen — zsh
                </span>
              </div>
              {/* Output */}
              <div className="p-5">
                {terminalOutput.map((line, i) => (
                  <span key={i} className={`terminal-line ${line.cls}`}>
                    {line.text || " "}
                  </span>
                ))}
                <span className="terminal-line text-[#7BDCB5]">
                  $ <span className="cursor-blink" aria-hidden="true" />
                </span>
              </div>
            </div>

            {/* Floating badge */}
            <div className="absolute -bottom-4 -left-4 bg-[var(--color-bg-surface)] border border-[var(--color-border)] rounded px-4 py-2.5 flex items-center gap-3 shadow-2xl">
              <span className="text-primary text-lg" aria-hidden="true">✓</span>
              <div>
                <p className="text-xs font-bold text-[var(--color-text-primary)]">30+ icons</p>
                <p className="text-[10px] text-[var(--color-text-muted)]">4 platforms, one ZIP</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
