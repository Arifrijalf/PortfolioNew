import { SiteHeader } from "@/components/SiteHeader";
import { ArrowUpRight } from "lucide-react";
import { Link } from "wouter";
import { projects } from "@/data/microcontrollerProgress";
import { SmoothSection } from "@/components/SmoothSection";
import { useSectionVisibility } from "@/hooks/useSectionVisibility";

export default function ProgressMicrocontroller() {
  const { ref, state } = useSectionVisibility();

  return (
    <div className="site-shell">
      <SiteHeader />

      <main id="main-content" tabIndex={-1}>
        <SmoothSection
          ref={ref}
          state={state}
          className="section-shell progress-index min-h-screen"
          id="progress"
        >
          <nav className="page-breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">Progress</span>
          </nav>
          <div className="section-heading mb-16">
            <div className="section-rail">
              <span>Log</span>
            </div>
            <div>
              <p className="section-overline">Microcontroller Gallery</p>
              <h1 className="progress-index-title">
                Weekly
                <br />
                <em>Progress.</em>
              </h1>
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
                  <Link
                    className="project-image-trigger"
                    href={`/progress-microcontroller/${project.slug}`}
                    aria-label={`Read the log for ${project.title}`}
                  >
                    <img
                      className="project-screenshot"
                      src={project.image}
                      srcSet={project.imageSrcSet}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px"
                      alt={project.title}
                      loading="lazy"
                    />
                  </Link>
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
                  <h2 className="progress-card-title">
                    <Link href={`/progress-microcontroller/${project.slug}`}>
                      {project.title}
                    </Link>
                  </h2>
                  <p className="latest-log">
                    Latest entry:{" "}
                    {project.weeks[project.weeks.length - 1]?.title}
                  </p>
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
