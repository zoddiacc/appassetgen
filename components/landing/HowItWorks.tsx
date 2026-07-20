const steps = [
  {
    number: "01",
    command: "upload",
    title: "Upload your icon",
    description:
      "Drag and drop a high-res PNG, JPG, or SVG (up to 10MB). Metadata and quality checks run instantly.",
  },
  {
    number: "02",
    command: "edit",
    title: "Edit & customize",
    description:
      "Padding, background (auto, blur, transparent, custom), rounded corners, rotation, brightness, contrast — with live previews for every size and device.",
  },
  {
    number: "03",
    command: "export",
    title: "Download everything",
    description:
      "One ZIP with iOS, Android, Web, and Windows folders — including Contents.json and .ico bundles. Or grab a single size.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 bg-[var(--color-bg)] grid-bg">
      <div className="max-w-6xl mx-auto px-6">
        <p className="text-xs text-primary mb-3 tracking-widest uppercase">{"// how it works"}</p>
        <h2 className="text-2xl md:text-3xl font-bold mb-4 tracking-tight">
          Three steps, thirty icons
        </h2>
        <p className="text-sm text-[var(--color-text-muted)] mb-12 max-w-lg">
          No design tools, no plugins, no accounts.
        </p>

        <div className="grid md:grid-cols-3 gap-4">
          {steps.map((step) => (
            <div key={step.number} className="gradient-border p-6">
              <div className="flex items-center justify-between mb-5">
                <span className="text-xs text-primary">
                  $ {step.command}
                </span>
                <span className="text-2xl font-bold text-[var(--color-text-faint)]/40">
                  {step.number}
                </span>
              </div>
              <h3 className="text-sm font-bold text-[var(--color-text-primary)] mb-2">
                {step.title}
              </h3>
              <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
