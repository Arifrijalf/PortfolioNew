import { ArrowLeft, ArrowUpRight, FileText, Github } from "lucide-react";
import { Link, useParams } from "wouter";
import { projects } from "@/data/microcontrollerProgress";
import { Mermaid } from "@/components/Mermaid";
import { SmoothSection } from "@/components/SmoothSection";
import { useSectionVisibility } from "@/hooks/useSectionVisibility";

export default function ProgressDetail() {
  const { slug } = useParams();
  const project = projects.find(p => p.slug === slug);
  const { ref, state } = useSectionVisibility();

  if (!project)
    return (
      <div className="site-shell">
        <main
          id="main-content"
          className="section-shell min-h-screen grid place-items-center"
        >
          <div className="text-center">
            <p className="section-overline">Not found</p>
            <h1 className="text-3xl font-bold tracking-tighter mb-8">
              No logbook for this project.
            </h1>
            <Link
              href="/progress-microcontroller"
              className="project-detail-button"
            >
              <ArrowLeft size={15} /> Back to logs
            </Link>
          </div>
        </main>
      </div>
    );

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
          <Link href="/progress-microcontroller">Logs</Link>
          <span className="text-[9px] uppercase tracking-widest text-[var(--ink-soft)]">
            /
          </span>
          <span className="text-[9px] uppercase tracking-widest text-[var(--accent)] font-mono truncate max-w-[120px]">
            {project.slug}
          </span>
        </nav>
      </header>

      <main id="main-content" className="pt-24">
        <SmoothSection
          ref={ref}
          state={state}
          className="section-shell"
          id="detail"
        >
          <Link
            href="/progress-microcontroller"
            className="inline-flex items-center gap-2 text-[10px] uppercase tracking-widest text-[var(--ink-soft)] hover:text-[var(--accent)] mb-8 transition-colors"
          >
            <ArrowLeft size={14} /> Back to logs
          </Link>

          <header className="mb-16 border-b border-[var(--line)] pb-12">
            <p className="section-overline">
              {project.type} · WEEK {project.weeks.length}
            </p>
            <h1 className="text-clamp-h1 font-bold tracking-tighter leading-[0.86] mb-8">
              {project.title}
            </h1>
            <div className="flex flex-wrap gap-4">
              <a
                href={project.repo}
                target="_blank"
                rel="noreferrer"
                className="header-cta bg-[var(--ink)] text-[var(--paper)]"
              >
                <Github size={15} /> GitHub Repository{" "}
                <ArrowUpRight size={14} />
              </a>
              {project.driveUrl && (
                <a
                  href={project.driveUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="header-cta drive-cta"
                >
                  <FileText size={15} /> Report (Drive){" "}
                  <ArrowUpRight size={14} />
                </a>
              )}
              <span
                className={`px-3 py-2 border border-[var(--line)] text-[10px] font-bold uppercase tracking-widest ${project.status === "done" ? "text-green-600" : "text-[var(--accent)]"}`}
              >
                {project.status}
              </span>
            </div>
          </header>

          <section className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-16 mb-24">
            <div>
              <h2 className="text-3xl font-bold tracking-tighter mb-6 uppercase">
                System Description
              </h2>
              <p className="text-lg text-[var(--ink-soft)] leading-relaxed mb-8">
                {project.summary}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div>
                  <h3 className="text-[10px] uppercase tracking-widest text-[var(--accent)] font-mono mb-4">
                    Objective
                  </h3>
                  <ul className="list-none p-0 m-0 space-y-3 text-sm">
                    {project.objectives.map((obj, i) => (
                      <li key={i} className="flex gap-3">
                        <span className="text-[var(--accent)]">—</span> {obj}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-[10px] uppercase tracking-widest text-[var(--accent)] font-mono mb-4">
                    Key Features
                  </h3>
                  <ul className="list-none p-0 m-0 space-y-3 text-sm">
                    {project.features.map((feat, i) => (
                      <li key={i} className="flex gap-3">
                        <span className="text-[var(--accent)]">—</span> {feat}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-12">
                <h3 className="text-[10px] uppercase tracking-widest text-[var(--accent)] font-mono mb-4">
                  Tech Stack
                </h3>
                <div className="flex flex-wrap gap-2">
                  {project.techStack.map(tech => (
                    <span
                      key={tech}
                      className="px-2 py-1 bg-[var(--paper-deep)] border border-[var(--line)] text-[10px] font-mono"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <aside className="border-l border-[var(--line)] pl-8 space-y-12">
              <div>
                <h3 className="text-[10px] uppercase tracking-widest text-[var(--accent)] font-mono mb-6">
                  Weekly Logbook
                </h3>
                <div className="space-y-6">
                  {project.weeks.map(w => (
                    <div
                      key={w.week}
                      className="border-b border-[var(--line)] pb-4"
                    >
                      <span className="block text-[9px] text-[var(--ink-soft)] mb-1">
                        {w.dateRange}
                      </span>
                      <h4 className="text-xs font-bold uppercase tracking-tight">
                        Week {w.week}: {w.title}
                      </h4>
                    </div>
                  ))}
                </div>
              </div>
            </aside>
          </section>

          <section className="mb-24">
            <h2 className="text-3xl font-bold tracking-tighter mb-8 uppercase">
              Architecture
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-1 gap-y-12">
              <div>
                <h3 className="text-[10px] uppercase tracking-widest text-[var(--accent)] font-mono mb-4">
                  Flowchart
                </h3>
                <Mermaid chart={project.mermaidFlowchart} />
              </div>
              <div>
                <h3 className="text-[10px] uppercase tracking-widest text-[var(--accent)] font-mono mb-4">
                  Block Diagram
                </h3>
                <Mermaid chart={project.mermaidBlock} />
              </div>
            </div>
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8 p-8 border border-[var(--line)] bg-[var(--paper-deep)]">
              <div>
                <h4 className="text-[9px] uppercase font-bold mb-3">
                  Components
                </h4>
                <ul className="text-xs space-y-2 opacity-80">
                  {project.architectureNotes.components.map((c, i) => (
                    <li key={i}>• {c}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-[9px] uppercase font-bold mb-3">
                  Data Flow
                </h4>
                <ul className="text-xs space-y-2 opacity-80">
                  {project.architectureNotes.dataFlow.map((d, i) => (
                    <li key={i}>• {d}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-[9px] uppercase font-bold mb-3">
                  Deployment
                </h4>
                <p className="text-xs opacity-80">
                  {project.architectureNotes.deployment}
                </p>
              </div>
            </div>
          </section>

          <section className="mb-24">
            <h2 className="text-3xl font-bold tracking-tighter mb-8 uppercase">
              Code Snippets
            </h2>
            <div className="space-y-12">
              <div>
                <h3 className="text-[10px] uppercase tracking-widest text-[var(--accent)] font-mono mb-4">
                  Folder Structure
                </h3>
                <pre className="p-6 bg-[var(--slate)] text-[var(--slate-fg)] font-mono text-xs overflow-x-auto">
                  {project.folderStructure}
                </pre>
              </div>
              {project.codeSnippets.map((snippet, i) => (
                <div key={i}>
                  <h3 className="text-[10px] uppercase tracking-widest text-[var(--accent)] font-mono mb-4">
                    {snippet.label}
                  </h3>
                  <pre className="p-6 bg-[var(--slate)] text-[var(--slate-fg)] font-mono text-xs overflow-x-auto">
                    <code>{snippet.code}</code>
                  </pre>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-24">
            <h2 className="text-3xl font-bold tracking-tighter mb-8 uppercase">
              Detailed Logs
            </h2>
            <div className="space-y-16">
              {project.weeks.map(w => (
                <article
                  key={w.week}
                  className="border-t-2 border-[var(--ink)] pt-8"
                >
                  <div className="flex flex-wrap justify-between items-baseline mb-8">
                    <h3 className="text-2xl font-bold uppercase tracking-tight">
                      Week {w.week}: {w.title}
                    </h3>
                    <span className="font-mono text-[10px] opacity-60">
                      {w.dateRange}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="space-y-8">
                      <div>
                        <h4 className="text-[9px] uppercase tracking-widest text-[var(--accent)] font-bold mb-4">
                          Progress
                        </h4>
                        <ul className="space-y-3 text-sm">
                          {w.progress.map((p, i) => (
                            <li key={i} className="flex gap-3">
                              <span className="text-[var(--accent)]">√</span>{" "}
                              {p}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-[9px] uppercase tracking-widest text-[var(--accent)] font-bold mb-4">
                          Challenges
                        </h4>
                        <ul className="space-y-3 text-sm">
                          {w.challenges.map((c, i) => (
                            <li key={i} className="flex gap-3">
                              <span className="text-[var(--accent)]">!</span>{" "}
                              {c}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <div className="space-y-8">
                      <div>
                        <h4 className="text-[9px] uppercase tracking-widest text-[var(--accent)] font-bold mb-4">
                          Self Evaluation
                        </h4>
                        <p className="text-sm italic border-l-2 border-[var(--line)] pl-4">
                          {w.selfEvaluation}
                        </p>
                      </div>
                      <div>
                        <h4 className="text-[9px] uppercase tracking-widest text-[var(--accent)] font-bold mb-4">
                          Next Plan
                        </h4>
                        <ul className="space-y-3 text-sm">
                          {w.nextPlan.map((n, i) => (
                            <li key={i} className="flex gap-3">
                              <span className="text-[var(--accent)]">→</span>{" "}
                              {n}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="pb-24 border-t border-[var(--line)] pt-12 flex flex-wrap gap-8">
            {project.links.map(link => (
              <a
                key={link.label}
                href={link.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest hover:text-[var(--accent)] transition-colors"
              >
                {link.label} <ArrowUpRight size={14} />
              </a>
            ))}
            {project.driveUrl && (
              <a
                href={project.driveUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest hover:text-[var(--accent)] transition-colors"
              >
                <FileText size={14} /> Report (Drive) <ArrowUpRight size={14} />
              </a>
            )}
          </section>
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
        <span>ARIF LOGBOOK</span>
      </footer>
    </div>
  );
}
