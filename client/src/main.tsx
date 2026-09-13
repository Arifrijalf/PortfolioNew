import "./index.css";

// Let the pre-rendered document paint before downloading the interactive runtime.
// Starting an interaction requests hydration immediately instead of waiting for a frame.
let started = false;
function start() {
  if (started) return;
  started = true;
  window.removeEventListener("pointerdown", start);
  window.removeEventListener("keydown", start);
  void import("./bootstrap");
}
if (document.getElementById("root")?.hasChildNodes()) {
  window.addEventListener("pointerdown", start, { once: true, passive: true });
  window.addEventListener("keydown", start, { once: true });
  requestAnimationFrame(() => requestAnimationFrame(start));
} else {
  start();
}
