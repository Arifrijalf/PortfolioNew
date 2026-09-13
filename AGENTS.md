# Project agent rules

These instructions apply to every AI coding agent working in this repository.

## Required release gate

Before **any** of the following actions, the agent must complete the full release
check described in [`docs/PERFORMANCE.md`](docs/PERFORMANCE.md):

- `git push` to any remote
- Cloudflare Pages deployment, preview deployment, or production publish

The gate is required even when the change appears unrelated to the UI. If a
check is unavailable, the agent must stop before pushing or deploying and report
the missing check.

Run these checks against the production build:

```powershell
npm.cmd run verify:release
npm.cmd run preview
```

With the preview server running, audit all public routes on both Mobile and
Desktop using Lighthouse 13.4.1 or newer. Run three samples and compare the
median scores:

- `/`
- `/progress-microcontroller`
- `/progress-microcontroller/ds18b20-3-speed-fan`

The required score gates are:

- Performance: must not be lower than the previous verified baseline; fix any
  regression before release.
- Accessibility: 100.
- Best Practices: 100.
- SEO: 100.
- Agentic Browsing: all applicable checks must pass. Report this as a pass ratio,
  not as a conventional 0–100 Lighthouse category.

If any score drops, do not push or deploy. Identify the failing audit, fix the
implementation, repeat the complete gate, and only then continue. Record the
routes, device profiles, scores, Lighthouse/Chrome versions, and any known
variability in the handoff or final response.

Cloudflare Pages must publish `dist/public`. Preserve the route-specific
pre-rendered files and do not add a wildcard rewrite to the homepage.

