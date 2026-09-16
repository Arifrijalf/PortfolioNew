# Performance and PageSpeed verification

## Audit scope

Local production build, audited with Lighthouse 13.4.1 and headless Chrome 152.0.7977.83 on Windows. Mobile uses Lighthouse's default simulated mobile throttling. Desktop uses its desktop configuration. These are local lab measurements, not published PageSpeed Insights or CrUX field results.

The target is 100 for Performance, Accessibility, Best Practices, and SEO. Agentic Browsing reports applicable checks passed, rather than a 0-100 category score. WebMCP checks can be not applicable without the experimental API enabled; that does not establish WebMCP support.

## Production changes

- Pre-rendered HTML for the homepage, progress index, project log, and 404 page.
- Route-specific metadata, canonical URLs, robots directives, sitemap, and llms.txt.
- Critical CSS included in each HTML document; the interactive React runtime starts after the first paint, or immediately on keyboard/pointer interaction.
- One shared variable Space Grotesk font URL instead of downloading identical files for several weights.
- Responsive 720px portrait asset and eager, high-priority loading of the first progress image.
- Explicit diagram dimensions reserve layout space for the supplied flowchart PNG and crisp vector block diagram SVG.
- Accessible label consistency and stronger contrast for logbook text.
- Persistent theme state restored after hydration, without markup mismatches.
- Initial content stays visible; expressive route, hover, filter, gallery, and scroll effects respect reduced motion.

## Repeating the checks

1. Use Node 22.19 or newer and Chrome 150 or newer.
2. Run `pnpm build`, then `pnpm preview` in a separate terminal.
3. Use Lighthouse in Chrome DevTools against each URL below. Test both Mobile and Desktop. For the current Agentic Browsing category, use Lighthouse 13.4.1 or later.
4. Alternatively run the pinned CLI (PowerShell uses `npx.cmd`):

   ```powershell
   New-Item -ItemType Directory -Force tmp/pagespeed | Out-Null
   npx.cmd --yes lighthouse@13.4.1 http://127.0.0.1:4173/ --only-categories=performance,accessibility,best-practices,seo,agentic-browsing --output=html --output=json --output-path=./tmp/pagespeed/home-mobile --chrome-flags="--headless"
   ```

   Add `--preset=desktop` and change the output filename for desktop. Repeat for all public routes. Reports remain local in the ignored `tmp/` directory.
5. Avoid concurrent builds or browser tests during performance measurement. Run three times and compare the median, rather than choosing the best run.

| Page | Path |
| --- | --- |
| Homepage | `/` |
| Progress index | `/progress-microcontroller` |
| Fan controller log | `/progress-microcontroller/ds18b20-3-speed-fan` |

`lighthouserc.cjs` also covers all three production routes and writes reports to local filesystem storage. Its bundled Lighthouse version is older; use the current CLI above for Agentic Browsing.

## Deployment and PageSpeed Insights

Publish only `dist/public` to Cloudflare Pages. Do not reintroduce a wildcard rewrite to the homepage: it would replace route-specific pre-rendered HTML. The generated `404.html` handles unknown URLs.

After deployment, enter each public URL at https://pagespeed.web.dev/ and test Mobile and Desktop. Hosting latency, cache state, Chrome/Lighthouse versions, and test variability can change scores. CrUX field data reflects real users over time and is separate from these lab audits. A local 100 is not a guarantee of 100 on every remote run.

Reference: https://developer.chrome.com/docs/lighthouse/agentic-browsing/scoring
