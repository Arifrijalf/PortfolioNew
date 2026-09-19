# Release checklist for AI agents

This checklist is project policy. Complete it before every GitHub push or
Cloudflare Pages deployment.

1. Run `npm.cmd run verify:release`.
2. Start `npm.cmd run preview` from the repository root.
3. Audit every route in `docs/PERFORMANCE.md` on Mobile and Desktop.
4. Run three samples per route/profile and compare medians with the previous
   verified baseline.
5. Fix every regression before release. The required gates are Accessibility,
   Best Practices, and SEO at 100; Agentic Browsing fully passing; and
   Performance no lower than baseline.
6. Confirm the deployment directory is `dist/public` and route-specific HTML
   files are present.
7. Report the checks and scores before pushing or deploying.

The local audit is a lab check. After Cloudflare deployment, repeat the same
routes in PageSpeed Insights because network conditions, cache state, and field
data can differ from local Lighthouse results.
