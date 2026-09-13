import { renderToReadableStream } from "react-dom/server";
import { Router } from "wouter";
import App from "./App";
export { pageMetadata, getPageMetadata, siteOrigin } from "./data/pageMetadata";

export async function render(path: string) {
  const errors: unknown[] = [];
  const stream = await renderToReadableStream(
    <Router ssrPath={path}>
      <App />
    </Router>,
    {
      onError: error => {
        errors.push(error);
      },
    }
  );
  await stream.allReady;
  if (errors.length) throw errors[0];
  return new Response(stream).text();
}
