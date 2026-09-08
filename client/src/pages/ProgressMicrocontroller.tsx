import { ArrowUpRight, Moon, Sun } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { Link } from "wouter";
import { projects } from "@/data/microcontrollerProgress";
import { SmoothSection } from "@/components/SmoothSection";
import { useSectionVisibility } from "@/hooks/useSectionVisibility";

export default function ProgressMicrocontroller() {
  const { ref, state } = useSectionVisibility();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="site-shell">
      <header className="site-header">
        <Link className="brand-lockup" href="/">
          <span className="brand-mark" aria-hidden="true">
            <span className="signal-symbol">
              <i />
              <i />
              <i />
            </span>
          </span>
          <span className="brand-wordmark">
            <strong>ARIF</strong>
            <small>RIJAL FADHILAH</small>
          </span>
        </Link>
<nav className="primary-nav" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span className="text-[9px] uppercase tracking-widest text-[var(--ink-soft)]">
            /
          </span>
          <span className="text-[9px] uppercase tracking-widest text-[var(--accent)] font-mono">
            Progress Log
          </span>
        </nav>
        <div className="header-actions">
          <button
            className="theme-toggle"
            type="button"
            onClick={toggleTheme}
            aria-label={
              theme === "dark"
                ? "Switch to light theme"
                : "Switch to dark theme"
            }
          >
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>
      </header>

      <main id="main-content" tabIndex={-1}>
        <SmoothSection
          ref={ref}
          state={state}
          className="section-shell min-h-screen"
          id="progress"
        >
          <div className="section-heading mb-16">
            <div className="section-rail">
              <span>Log</span>
            </div>
            <div>
              <p className="section-overline">Microcontroller Gallery</p>
              <h2>
                Weekly
                <br />
                <em>Progress.</em>
              </h2>
            </div>
            <p className="section-intro">
              Detailed engineering logs, challenges, and iterative plans for
              embedded systems projects.
            </p>
          </div>

          <div className="project-list border-t border-[var(--line)]">
            {projects.map((project, index) => (
              <article
                className={`project-card project-card-${(index % 2) + 1}`}
                key={project.slug}
              >
                <div className="project-evidence">
                  <div className="project-image-trigger cursor-default">
                    <img
                      className="project-screenshot"
                      src={project.image}
                      srcSet={project.imageSrcSet}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px"
                      alt={project.title}
                      loading="lazy"
                    />
                  </div>
                  <span className="evidence-label">
                    {project.status === "ongoing"
                      ? "Work in Progress"
                      : "Completed Record"}
                  </span>
                  <dl>
                    <div>
                      <dt>Weeks</dt>
                      <dd>{project.weeks.length}</dd>
                    </div>
                    <div>
                      <dt>Tech</dt>
                      <dd>{project.technologies[0]}</dd>
                    </div>
                    <div>
                      <dt>Type</dt>
                      <dd>Log</dd>
                    </div>
                  </dl>
                </div>
                <div className="project-copy">
                  <p className="project-type">
                    Project {index + 1} — {project.type}
                  </p>
                  <h3>{project.title}</h3>
                  <p>{project.summary}</p>
                  <div className="project-actions">
                    <Link
                      href={`/progress-microcontroller/${project.slug}`}
                      className="project-detail-button"
                    >
                      View full log <ArrowUpRight size={15} />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </SmoothSection>
      </main>

      <footer className="site-footer">
        <span className="footer-identity">
          <span className="footer-mark" aria-hidden="true">
            <span className="signal-symbol">
              <i />
              <i />
              <i />
            </span>
          </span>
          <span>© 2026 ARIF RIJAL FADHILAH</span>
        </span>
        <span>ENGINEERING LOGBOOK</span>
      </footer>
    </div>
  );
}
