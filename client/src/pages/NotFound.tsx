import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { Link } from "wouter";
import { SiteHeader } from "@/components/SiteHeader";

export default function NotFound() {
  return (
    <div className="site-shell">
      <SiteHeader />
      <main
        id="main-content"
        tabIndex={-1}
        className="section-shell min-h-screen grid place-items-center"
      >
        <div>
          <p className="section-overline">404 / Page not found</p>
          <h1 className="progress-detail-title">This page is missing.</h1>
          <p className="text-[var(--ink-soft)] mb-8">
            Continue exploring the portfolio or return to the engineering
            logbook.
          </p>
          <div className="project-actions">
            <Link href="/" className="project-detail-button">
              <ArrowLeft size={16} /> Back home
            </Link>
            <Link href="/progress-microcontroller" className="project-link">
              Progress logs <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
