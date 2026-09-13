import { createRoot, hydrateRoot } from "react-dom/client";
import { Router } from "wouter";
import App from "./App";

const root = document.getElementById("root")!;
const path = window.location.pathname.replace(/\/$/, "") || "/";
if (
  root.hasChildNodes() &&
  (root.dataset.route === path || root.dataset.route === "404")
) {
  hydrateRoot(
    root,
    <Router ssrPath={root.dataset.route === "404" ? "/404" : path}>
      <App />
    </Router>
  );
} else {
  createRoot(root).render(<App />);
}
