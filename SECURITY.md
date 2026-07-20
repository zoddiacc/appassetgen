# Security Policy

## Supported versions

Only the latest version on `main` is supported.

## Reporting a vulnerability

Please report vulnerabilities privately via [GitHub Security Advisories](../../security/advisories/new) ("Report a vulnerability" on the repo's Security tab). Do **not** open a public issue for security reports.

You can expect an initial response within 7 days.

## Scope notes

AppAssetGen is a fully client-side application: it has no backend, no API, no database, and processes images entirely in the user's browser. The most relevant vulnerability classes are XSS (e.g., via crafted SVG uploads), dependency vulnerabilities, and supply-chain issues.
