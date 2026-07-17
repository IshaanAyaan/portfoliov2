# Security policy

## Supported deployment

The portfolio is a static GitHub Pages site. It has no account system, backend,
cookie-based session, or user-submitted data. Escape Velocity progress stays in
the browser under the versioned `ishaan.cosmicRun.v1` local-storage key.

## Browser protections

Both public pages declare a restrictive Content Security Policy before any
scripts, use `strict-origin-when-cross-origin`, upgrade insecure requests, and
limit executable code to same-origin files plus the configured Google Analytics
loader. Canvas and game audio are generated locally. Links that open a new tab
use `rel="noopener"`; the referrer policy prevents full cross-origin path
disclosure.

GitHub Pages does not let this repository set arbitrary response headers. The
following protections therefore cannot be guaranteed from source alone:

- `Strict-Transport-Security`
- `X-Content-Type-Options: nosniff`
- `Permissions-Policy`
- CSP `frame-ancestors` (this directive is ignored in a CSP meta element)

After the local change set is approved and deployed, enable GitHub Pages
**Enforce HTTPS** and verify that the HTTP site redirects to HTTPS. This is a
release step, not an implementation step.

## Dependency and workflow policy

Production remains framework-free and build-free. Playwright and Axe are pinned
development-only test dependencies with a lockfile. GitHub Actions are pinned
to commit SHAs, job permissions are scoped to the one job that updates
`data/now.json`, and Dependabot checks Actions and npm dependencies weekly.

## Reporting a vulnerability

Please report a suspected vulnerability privately to
`ishaanranjan15@gmail.com`. Include the affected URL, reproduction steps, and
impact. Do not include credentials or personal data in a public issue.
