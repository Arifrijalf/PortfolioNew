import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import {
  render,
  pageMetadata,
  getPageMetadata,
  siteOrigin,
} from "../dist/server/entry-server.js";

const output = path.resolve("dist/public");
const template = await readFile(path.join(output, "index.html"), "utf8");
const escape = value =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
for (const route of [...Object.keys(pageMetadata), "/404"]) {
  const meta = getPageMetadata(route);
  let html = template.replace(
    /<title>.*?<\/title>/s,
    `<title>${escape(meta.title)}</title>`
  );
  for (const [key, value] of Object.entries({
    description: meta.description,
    "og:title": meta.title,
    "og:description": meta.description,
    "twitter:title": meta.title,
    "twitter:description": meta.description,
    "og:url": siteOrigin + route,
    robots: route === "/404" ? "noindex, follow" : "index, follow",
  })) {
    const pattern = new RegExp(
      `<meta\\s+(?:name|property)="${key}"[^>]*>`,
      "g"
    );
    html = html.replace(pattern, tag =>
      tag.replace(/content="[^"]*"/, `content="${escape(value)}"`)
    );
  }
  html = html.replace(
    /(<link rel="canonical" href=")[^"]*/,
    `$1${siteOrigin}${route}`
  );
  // Only preload the portrait on the page that actually displays it.
  if (route !== "/")
    html = html.replace(/<link\s+rel="preload"\s+as="image"[\s\S]*?\/>/g, "");
  // Ship critical styles with the document, removing a render-blocking round trip.
  for (const match of html.matchAll(
    /<link[^>]*rel="stylesheet"[^>]*href="([^"]+)"[^>]*>/g
  )) {
    const css = await readFile(path.join(output, match[1]), "utf8");
    html = html.replace(match[0], `<style>${css}</style>`);
  }
  html = html.replace(
    '<div id="root"></div>',
    `<div id="root" data-route="${route === "/404" ? "404" : route}">${await render(route)}</div>`
  );
  const destination =
    route === "/404"
      ? path.join(output, "404.html")
      : route === "/"
        ? path.join(output, "index.html")
        : path.join(output, `${route}.html`);
  await mkdir(path.dirname(destination), { recursive: true });
  await writeFile(destination, html);
  console.log(`Pre-rendered ${route}`);
}
