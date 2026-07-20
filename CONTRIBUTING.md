# Contributing to AppAssetGen

Thanks for your interest! Contributions are welcome.

## Ground rules

- **`main` is protected.** All changes land via pull request — direct pushes and force pushes are blocked.
- Keep the app 100% client-side: no backends, API routes, databases, or telemetry.
- All drawing must go through `renderIcon()` in `lib/render-icon.ts` — do not reimplement the background/clip/padding/rotate/filter pipeline in components.
- iOS icons must stay fully opaque (Apple rejects icons with alpha).

## Workflow

1. Fork the repo and create a branch from `main`.
2. `npm install && npm run dev`
3. Make your change. Run `npm run build` — it must pass with no type or lint errors.
4. Open a PR with a clear description of what changed and why. Screenshots/GIFs appreciated for UI changes.

## Reporting bugs & requesting features

Open a GitHub issue with reproduction steps (for bugs) or the use case (for features). For security issues, see [SECURITY.md](SECURITY.md) — do not open public issues.
