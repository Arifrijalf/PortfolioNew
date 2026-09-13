// STYLE DIRECTION: Evidence-led field notes — calm editorial structure, warm paper surfaces, and verified engineering details over decorative effects.
import { Suspense, lazy, useEffect } from "react";
import { Route, Switch, useLocation } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";

const Toaster = lazy(() =>
  import("@/components/ui/sonner").then(module => ({ default: module.Toaster }))
);
const NotFound = lazy(() => import("@/pages/NotFound"));
const ProgressMicrocontroller = lazy(
  () => import("@/pages/ProgressMicrocontroller")
);
const ProgressDetail = lazy(() => import("@/pages/ProgressDetail"));

function Router() {
  const [location] = useLocation();
  useEffect(() => {
    document.title =
      location === "/"
        ? "Arif Rijal Fadhilah — Electronics Engineering"
        : location === "/progress-microcontroller"
          ? "Microcontroller Progress — Arif Rijal Fadhilah"
          : "Engineering Logbook — Arif Rijal Fadhilah";
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
      <ThemeProvider defaultTheme="light" switchable>
        <Suspense
          fallback={
            <main id="main-content" className="route-loading" role="status">
              Loading page…
            </main>
          }
        >
          <Toaster />
          <Router />
        </Suspense>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
