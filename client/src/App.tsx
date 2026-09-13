// STYLE DIRECTION: Evidence-led field notes — calm editorial structure, warm paper surfaces, and verified engineering details over decorative effects.
import { Suspense, lazy, useEffect } from "react";
import { Route, Switch, useLocation } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { useContentMotion } from "./hooks/useContentMotion";
import { getPageMetadata, pageMetadata, siteOrigin } from "./data/pageMetadata";

const NotFound = lazy(() => import("@/pages/NotFound"));
const Home = lazy(() => import("@/pages/Home"));
const ProgressMicrocontroller = lazy(
  () => import("@/pages/ProgressMicrocontroller")
);
const ProgressDetail = lazy(() => import("@/pages/ProgressDetail"));

function Router() {
  const [location] = useLocation();
  useContentMotion(location);
  useEffect(() => {
    const path = location.replace(/\/$/, "") || "/";
    const meta = getPageMetadata(path);
    document.title = meta.title;
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute("content", meta.description);
    document
      .querySelector('meta[name="robots"]')
      ?.setAttribute(
        "content",
        pageMetadata[path] ? "index, follow" : "noindex, follow"
      );
    document
      .querySelector('link[rel="canonical"]')
      ?.setAttribute("href", `${siteOrigin}${path}`);
    for (const selector of [
      'meta[property="og:title"]',
      'meta[name="twitter:title"]',
    ])
      document.querySelector(selector)?.setAttribute("content", meta.title);
    for (const selector of [
      'meta[property="og:description"]',
      'meta[name="twitter:description"]',
    ])
      document
        .querySelector(selector)
        ?.setAttribute("content", meta.description);
    document
      .querySelector('meta[property="og:url"]')
      ?.setAttribute("content", `${siteOrigin}${path}`);
    if (!window.location.hash) {
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  }, [location]);
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route
        path="/progress-microcontroller"
        component={ProgressMicrocontroller}
      />
      <Route
        path="/progress-microcontroller/:slug"
        component={ProgressDetail}
      />
      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <Suspense
        fallback={
          <main id="main-content" className="route-loading" role="status">
            Loading page…
          </main>
        }
      >
        <ThemeProvider defaultTheme="light" switchable>
          <Router />
        </ThemeProvider>
      </Suspense>
    </ErrorBoundary>
  );
}
