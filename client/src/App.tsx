// STYLE DIRECTION: Evidence-led field notes — calm editorial structure, warm paper surfaces, and verified engineering details over decorative effects.
import { Suspense, lazy } from "react";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";

const Toaster = lazy(() =>
  import("@/components/ui/sonner").then((module) => ({ default: module.Toaster })),
);
const NotFound = lazy(() => import("@/pages/NotFound"));

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light" switchable>
        <Suspense fallback={<div style={{ minHeight: "100svh" }} aria-hidden="true" />}>
          <Toaster />
          <Router />
        </Suspense>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
