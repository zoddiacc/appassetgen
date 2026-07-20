const features = [
  {
    tag: "ios",
    tagClass: "text-blue-400 bg-blue-500/10",
    title: "Xcode ready",
    description:
      "Complete AppIcon.appiconset with Contents.json — drag it straight into your asset catalog.",
  },
  {
    tag: "android",
    tagClass: "text-green-400 bg-green-500/10",
    title: "Android Studio ready",
    description:
      "Organized mipmap-* folders (mdpi through xxxhdpi) plus the 512px Play Store icon.",
  },
  {
    tag: "web",
    tagClass: "text-orange-400 bg-orange-500/10",
    title: "Favicons, PWA & .ico",
    description:
      "Favicons, apple-touch-icon, manifest icons, favicon.ico, and copy-paste HTML tags.",
  },
  {
    tag: "windows",
    tagClass: "text-purple-400 bg-purple-500/10",
    title: "Windows .ico bundle",
    description:
      "A multi-size icon.ico (16 to 256px) plus individual PNGs for any toolchain.",
  },
  {
    tag: "lint",
    tagClass: "text-rose-400 bg-rose-500/10",
    title: "Validation built in",
    description:
      "Warns about low resolution, non-square sources, safe-zone overflow, and weak contrast.",
  },
  {
    tag: "local",
    tagClass: "text-primary bg-primary/10",
    title: "100% client-side",
    description:
      "Everything runs in your browser. Your artwork never leaves your machine. Free forever.",
  },
];

export default function Features() {
  return (
    <section id="features" className="py-24 bg-[var(--color-bg)]">
      <div className="max-w-6xl mx-auto px-6">
        <p className="text-xs text-primary mb-3 tracking-widest uppercase">{"// features"}</p>
        <h2 className="text-2xl md:text-3xl font-bold mb-4 tracking-tight">
          Everything you need to ship icons
        </h2>
        <p className="text-sm text-[var(--color-text-muted)] mb-12 max-w-lg">
          Upload once, edit live, export for every platform.
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((feature) => (
            <div key={feature.tag} className="gradient-border p-5">
              <span
                className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded mb-4 uppercase tracking-wider ${feature.tagClass}`}
              >
                {feature.tag}
              </span>
              <h3 className="text-sm font-bold text-[var(--color-text-primary)] mb-1.5">
                {feature.title}
              </h3>
              <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
