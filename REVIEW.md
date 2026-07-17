# Cosmic Portfolio review

This branch is intentionally local until Ishaan approves the complete review.
It preserves `/`, `/offline.html`, the résumé URL, portfolio anchors, and
`#cluster/<name>` deep links.

## Review commands

```sh
pnpm install --frozen-lockfile
pnpm check
pnpm audit --audit-level high
git diff --check origin/main...HEAD
git log --oneline --reverse origin/main..HEAD
```

To regenerate the untracked visual review set, start `pnpm serve` in one
terminal and run:

```sh
pnpm screenshots:review -- /absolute/output/directory
```

The script captures the desktop and mobile universe overviews, all five selected
worlds, and Escape Velocity idle, running, and game-over states in dark and light
themes. Generated screenshots, Playwright reports, traces, and test output stay
outside version control.

## Acceptance checklist

- [x] Unit and browser suites pass at 1440x900 and 390x844.
- [x] Axe reports no serious or critical issues in required universe/game states.
- [x] No console errors, failed same-origin resources, or horizontal overflow.
- [x] Mobile Jump, Duck, and Pause controls are at least 44px in both dimensions.
- [x] Universe selection, deep links, Escape, back, and focus restoration work.
- [x] Reduced motion removes camera/orbit movement and mobile vertical scroll remains available.
- [x] Escape Velocity start, jump, duck, pause, restart, theme, mute, signals, and persistence work.
- [ ] Chrome and Safari manual play checks cover collision fairness, touch, focus, audio, and a 15-minute run.
- [x] CSP, referrer policy, workflow pins, Dependabot, audit, and secret scan are reviewed.
- [x] `.DS_Store` is absent from the staged diff.

## Release gates

Do not push, open a pull request, change GitHub Pages, or merge from this branch
until Ishaan approves this local review. After that approval, enable **Enforce
HTTPS**, verify HTTP-to-HTTPS redirects, push the feature branch, and open a PR.
Pushing or merging to `main` requires separate explicit approval after checks.
