// STYLE DIRECTION: Evidence-led field notes — use a quiet personal portrait, real engineering details, restrained vermilion, and documentation-like hierarchy.
import { ArrowDownRight, ArrowUp, ArrowUpRight, ChevronLeft, ChevronRight, LoaderCircle, Maximize2, Menu, Moon, Sun, X } from "lucide-react";
import { toast } from "sonner";
import { type FormEvent, useEffect, useState } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { useSectionVisibility } from "@/hooks/useSectionVisibility";
import { SmoothSection } from "@/components/SmoothSection";

const projects = [
  {
    title: "Smart Baby Incubator",
    type: "ESP32 / PID CONTROL",
    category: "College Projects",
    technologies: ["ESP32", "PID"],
    note: "Thermal control record",
    repo: "https://github.com/Arifrijalf/InkubatorBayi",
    image: "/assets/smart-baby-incubator_270318b2.webp",
    imageAlt: "Smart Baby Incubator prototype with an integrated PID control display",
    gallery: [
      { src: "/assets/smart-baby-incubator_270318b2.webp", alt: "Smart Baby Incubator prototype with PID control display", caption: "Prototype and integrated control display" },
      { src: "/assets/incubator-dashboard-preview_a884462a.webp", alt: "PID temperature control dashboard for the Smart Baby Incubator", caption: "PID dashboard preview with temperature and actuator controls" },
    ],
    description:
      "A temperature-regulation system for neonatal care. The project uses a PID loop on ESP32 hardware to keep thermal conditions stable while making each control decision measurable.",
    evidence: [
      ["Control", "PID thermal loop"],
      ["Controller", "ESP32"],
      ["Observed", "<0.2°C variance"],
    ],
  },
  {
    title: "ESP32 IoT Monitoring Dashboard",
    type: "MQTT / REACT / TELEMETRY",
    category: "ESP",
    technologies: ["ESP32", "MQTT", "React"],
    note: "Telemetry record",
    repo: "https://github.com/Arifrijalf/Dashboard-cloudflare",
    image: "/assets/esp32-iot-dashboard-control-center_894421e8.webp",
    imageAlt: "Steel Plant Control Center monitoring screen for the ESP32 IoT dashboard project",
    gallery: [
      { src: "/assets/esp32-iot-dashboard-control-center_894421e8.webp", alt: "Steel Plant Control Center monitoring screen", caption: "Live monitoring and relay-control view" },
      { src: "/assets/esp32-iot-dashboard_777f1689.webp", alt: "ESP32 IoT dashboard shown on a tablet in a workspace", caption: "Dashboard interface in a connected hardware workspace" },
    ],
    description:
      "A connected monitoring setup that moves readings from distributed ESP32 nodes through MQTT into a real-time React dashboard for device state and environmental data.",
    evidence: [
      ["Transport", "MQTT"],
      ["Nodes", "Distributed ESP32"],
      ["Interface", "React dashboard"],
    ],
  },
  {
    title: "Universal Sensor Diagnostic Tool",
    type: "ARDUINO / ESP32 / CALIBRATION",
    category: "Arduino",
    technologies: ["Arduino", "ESP32"],
    note: "Sensor test record",
    repo: "https://github.com/Arifrijalf/Program-Calibration-Sensor",
    image: "/assets/sensor-tool-esp32-pinout_4f764215.webp",
    imageAlt: "ESP32 development board pinout reference used by the sensor diagnostic tool",
    gallery: [
      { src: "/assets/sensor-tool-esp32-pinout_4f764215.webp", alt: "ESP32 development board pinout reference", caption: "ESP32 pinout reference for sensor wiring and testing" },
      { src: "/assets/sensor-tool-arduino-pinout_9f93273c.webp", alt: "Arduino Uno pinout reference", caption: "Arduino Uno pinout reference for cross-platform sensor checks" },
    ],
    description:
      "A practical tool for fast sensor sanity checks and calibration across Arduino Uno and ESP32, covering ultrasonic, servo, analog, and digital modules.",
    evidence: [
      ["Platforms", "Arduino / ESP32"],
      ["Inputs", "Analog / digital"],
      ["Coverage", "Sensors + servo"],
    ],
  },
] as const;

const projectFilters = ["All", "Arduino", "ESP", "College Projects"] as const;
const FORMSPREE_ENDPOINT = "https://formspree.io/f/xljebedn";
const MESSAGE_MAX_LENGTH = 1000;
const SUBMIT_COOLDOWN_MS = 5000;
type ProjectFilter = (typeof projectFilters)[number];

const practices = [
  {
    title: "Firmware & interfaces",
    text: "Writing close to the hardware, then testing the details that make device behavior reliable.",
    tools: "ESP32 · STM32 · Arduino · C/C++ · I²C · SPI · UART",
  },
  {
    title: "Telemetry & dashboards",
    text: "Carrying useful measurements from a device to a clear, dependable interface.",
    tools: "MQTT · React · Node.js · InfluxDB · AWS IoT",
  },
  {
    title: "Circuits & documentation",
    text: "Prototyping, measuring, and documenting so the next iteration starts with evidence.",
    tools: "KiCad · Altium · SolidWorks · Linux · Docker",
  },
] as const;

const timeline = [
  ["2024—now", "Electronics Engineering", "Padang State Polytechnic"],
  ["2023", "Firmware & testing internship", "PT. Sat Nusapersada Tbk"],
  ["2020—now", "IoT development projects", "Independent / freelance work"],
] as const;

function NameMarquee() {
  const names = Array.from({ length: 6 }, (_, index) => <span key={index}>ARIF RIJAL FADHILAH</span>);

  return (
    <div className="name-marquee hero-fade-in hero-fade-in--delayed" aria-hidden="true">
      <div className="marquee-track">
        <div className="marquee-set">{names}</div>
        <div className="marquee-set" aria-hidden="true">{names}</div>
      </div>
    </div>
  );
}

export default function Home() {
  const { ref: aboutRef, state: aboutState } = useSectionVisibility();
  const { ref: workRef, state: workState } = useSectionVisibility();
  const { ref: practiceRef, state: practiceState } = useSectionVisibility();
  const { ref: experienceRef, state: experienceState } = useSectionVisibility();
  const { ref: contactRef, state: contactState } = useSectionVisibility();
  const [menuOpen, setMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const [detailProject, setDetailProject] = useState<(typeof projects)[number] | null>(null);
  const [lightbox, setLightbox] = useState<{ project: (typeof projects)[number]; index: number } | null>(null);
  const [activeFilter, setActiveFilter] = useState<ProjectFilter>("All");
  const [contactForm, setContactForm] = useState({ name: "", email: "", message: "" });
  const [contactFormStatus, setContactFormStatus] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastSubmitTimestamp, setLastSubmitTimestamp] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const meta = document.querySelector('meta[name="theme-color"]');
    meta?.setAttribute("content", theme === "dark" ? "#171715" : "#f4f0e8");
  }, [theme]);

  useEffect(() => {
    const handleScroll = () => setShowBackToTop(window.scrollY > 620);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.documentElement.classList.add("motion-ready");
    return () => document.documentElement.classList.remove("motion-ready");
  }, []);

  const closeMenu = () => setMenuOpen(false);
  const openLightbox = (project: (typeof projects)[number], index = 0) => setLightbox({ project, index });
  const shiftLightbox = (direction: number) => {
    setLightbox((current) => {
      if (!current) return null;
      const nextIndex = (current.index + direction + current.project.gallery.length) % current.project.gallery.length;
      return { ...current, index: nextIndex };
    });
  };

  const filteredProjects = projects.filter((project) =>
    activeFilter === "All" || project.category === activeFilter || project.technologies.some((technology) => technology === activeFilter),
  );
  const remainingCharacters = MESSAGE_MAX_LENGTH - contactForm.message.length;

  const handleContactSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;

    const normalizedEmail = contactForm.email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      setEmailError("Please enter a valid email address.");
      toast.error("Check your email", { description: "Use a format such as name@example.com." });
      return;
    }

    const now = Date.now();
    if (now - lastSubmitTimestamp < SUBMIT_COOLDOWN_MS) {
      const waitTime = Math.ceil((SUBMIT_COOLDOWN_MS - (now - lastSubmitTimestamp)) / 1000);
      toast.error("Message rate limit", { description: `Please wait ${waitTime}s before sending another message.` });
      return;
    }

    setLastSubmitTimestamp(now);
    setIsSubmitting(true);
    setContactFormStatus("Sending your message...");
    const loadingToast = toast.loading("Sending message", { description: "Connecting to the contact form..." });

    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({
          name: contactForm.name.trim(),
          email: contactForm.email.trim(),
          message: contactForm.message.trim(),
          _subject: `Portfolio inquiry from ${contactForm.name.trim()}`,
        }),
      });
      const payload = await response.json().catch(() => null) as { errors?: Array<{ message?: string }> } | null;

      if (!response.ok) {
        const detail = payload?.errors?.map((item) => item.message).filter(Boolean).join(" ");
        throw new Error(detail || "Formspree could not accept the message.");
      }

      setContactForm({ name: "", email: "", message: "" });
      setEmailError("");
      setContactFormStatus("Message sent successfully.");
      toast.dismiss(loadingToast);
      toast.success("Message sent", { description: "Thanks for reaching out. I'll get back to you soon." });
    } catch (error) {
      const detail = error instanceof Error ? error.message : "Please try again in a moment.";
      setContactFormStatus("Message could not be sent.");
      toast.dismiss(loadingToast);
      toast.error("Message not sent", { description: detail });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="site-shell">
      <header className="site-header">
        <a className="brand-lockup" href="#top" onClick={closeMenu} aria-label="ARIF RIJAL FADHILAH home">
          <span className="brand-mark" aria-hidden="true"><span className="signal-symbol"><i /><i /><i /></span></span>
          <span className="brand-wordmark"><strong>ARIF</strong><small>RIJAL FADHILAH</small></span>
        </a>

        <button className="mobile-menu-toggle" type="button" onClick={() => setMenuOpen((open) => !open)} aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen}>
          {menuOpen ? <X size={19} /> : <Menu size={19} />}
        </button>

        <nav className={`primary-nav ${menuOpen ? "is-open" : ""}`} aria-label="Primary navigation">
          <a href="#about" onClick={closeMenu}>About</a>
          <a href="#work" onClick={closeMenu}>Work</a>
          <a href="#practice" onClick={closeMenu}>Practice</a>
          <a href="#contact" onClick={closeMenu}>Contact</a>
        </nav>

        <div className="header-actions">
          <button className="theme-toggle" type="button" onClick={toggleTheme} aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}>
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <a className="header-cta" href="#contact" onClick={closeMenu}>Say hello <ArrowUpRight size={15} /></a>
        </div>
      </header>

      <main>
        <section className="opening-slide" id="top" aria-label="Portrait of Arif Rijal Fadilah">
          <div className="opening-canvas">
            <NameMarquee />
            <img className="opening-photo hero-fade-in" src="/assets/arif-profile-avatar_321c33ab.webp" alt="Arif Rijal Fadilah" loading="eager" fetchPriority="high" decoding="async" width="630" height="665" />
            <p className="opening-context"><span>Electronics Engineering</span><strong>Embedded systems · firmware · IoT telemetry</strong></p>
            <a className="opening-link" href="#about">Read profile <ArrowDownRight size={15} /></a>
          </div>
        </section>

        <SmoothSection ref={aboutRef} state={aboutState} className="about-intro section-shell" id="about" aria-labelledby="about-title">
          <div className="section-rail"><span>About</span></div>
          <div className="about-intro-copy">
            <p className="section-overline">Electronics Engineering · Padang State Polytechnic</p>
            <h1 id="about-title">Firmware, hardware,<br />and the work <em>between.</em></h1>
            <p className="lede">I&apos;m Arif Rijal Fadilah, an Electronics Engineering student working across sensor interfaces, microcontroller firmware, and IoT telemetry—from the first reading at the bench to a dashboard someone can use.</p>
          </div>
          <dl className="about-facts">
            <div><dt>Studying</dt><dd>Electronics Engineering, 2024—present</dd></div>
            <div><dt>Working with</dt><dd>Embedded systems, connected devices, and technical documentation</dd></div>
            <div><dt>Based in</dt><dd>Padang, Indonesia</dd></div>
          </dl>
        </SmoothSection>

        <SmoothSection ref={workRef} state={workState} className="work-section section-shell" id="work" aria-labelledby="work-title">
          <div className="section-heading">
            <div className="section-rail"><span>Selected work</span></div>
            <div>
              <p className="section-overline">System-level projects</p>
              <h2 id="work-title">A few things<br />I&apos;ve <em>tested.</em></h2>
            </div>
            <p className="section-intro">These are projects where the useful work happens in the connection between hardware, software, measurement, and iteration.</p>
          </div>

          <div className="project-filter-bar">
            <div className="filter-label"><span>Filter by</span><strong>Technology / category</strong></div>
            <div className="project-filters" role="group" aria-label="Filter projects by technology or category">
              {projectFilters.map((filter) => (
                <button key={filter} type="button" className={activeFilter === filter ? "is-active" : ""} aria-pressed={activeFilter === filter} onClick={() => setActiveFilter(filter)}>{filter}</button>
              ))}
            </div>
            <p className="filter-result" aria-live="polite">Showing {filteredProjects.length} of {projects.length} projects</p>
          </div>

          <div className="project-list">
            {filteredProjects.map((project) => {
              const projectIndex = projects.indexOf(project);
              return (
              <article className={`project-card project-card-${projectIndex + 1}`} key={project.title}>
                <div className="project-evidence" aria-label={`${project.title} project evidence`}>
                  <button className="project-image-trigger" type="button" onClick={() => openLightbox(project)} aria-label={`Open ${project.title} image gallery`}>
                    <img className="project-screenshot" src={project.image} alt={project.imageAlt} loading="lazy" decoding="async" width="800" height="600" sizes="(max-width: 760px) 100vw, 50vw" />
                    <span className="image-hover-description">{project.description}</span>
                    <span className="image-hover-cue"><Maximize2 size={15} /> View gallery</span>
                  </button>
                  <a className="image-hover-detail" href={project.repo} target="_blank" rel="noreferrer">View details <ArrowUpRight size={14} /></a>
                  <span className="evidence-label">{project.note}</span>
                  <dl>
                    {project.evidence.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}
                  </dl>
                </div>
                <div className="project-copy">
                  <p className="project-type">{project.type}</p>
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                  <div className="project-actions">
                    <button className="project-detail-button" type="button" onClick={() => setDetailProject(project)}>View details <ArrowUpRight size={15} /></button>
                    <a href={project.repo} target="_blank" rel="noreferrer" className="project-link">Open repository <ArrowUpRight size={15} /></a>
                  </div>
                </div>
              </article>
              );
            })}
          </div>
        </SmoothSection>

        <SmoothSection ref={practiceRef} state={practiceState} className="practice-section section-shell" id="practice" aria-labelledby="practice-title">
          <div className="section-heading">
            <div className="section-rail"><span>Practice</span></div>
            <div>
              <p className="section-overline">How I work</p>
              <h2 id="practice-title">Across the<br /><em>whole signal.</em></h2>
            </div>
            <p className="section-intro">Comfortable moving between a datasheet, a bench test, a firmware loop, and the interface that makes the data useful.</p>
          </div>
          <div className="practice-list">
            {practices.map((practice) => (
              <article className="practice-item" key={practice.title}>
                <h3>{practice.title}</h3>
                <p>{practice.text}</p>
                <span>{practice.tools}</span>
              </article>
            ))}
          </div>
        </SmoothSection>

        <SmoothSection ref={experienceRef} state={experienceState} className="experience-section section-shell" aria-labelledby="experience-title">
          <div className="section-rail"><span>Path so far</span></div>
          <div className="experience-main">
            <p className="section-overline">Education and experience</p>
            <h2 id="experience-title">Keep the<br /><em>notes.</em></h2>
            <p className="experience-lede">The technical details matter because they make the next iteration clearer. I try to leave a system, test, and explanation that someone else can pick up.</p>
          </div>
          <ol className="timeline">
            {timeline.map(([date, role, place]) => <li key={role}><time>{date}</time><strong>{role}</strong><span>{place}</span></li>)}
          </ol>
        </SmoothSection>

        <SmoothSection ref={contactRef} state={contactState} className="contact-section" id="contact" aria-labelledby="contact-title">
          <div className="contact-heading">
            <p className="section-overline">For projects, ideas, and practical questions</p>
            <h2 id="contact-title">Got a project<br />worth <em>building?</em></h2>
            <a className="contact-cta" href="mailto:arifrijalfadhilah@gmail.com">Drop me a line <ArrowUpRight size={19} /></a>
          </div>
          <div className="contact-grid">
            <div><span>Email</span><a href="mailto:arifrijalfadhilah@gmail.com">arifrijalfadhilah@gmail.com</a></div>
            <div><span>WhatsApp</span><a href="https://wa.me/6289519777498" target="_blank" rel="noreferrer">+62 895-1977-7498 <ArrowUpRight size={13} /></a></div>
            <div><span>GitHub</span><a href="https://github.com/arifrijalf" target="_blank" rel="noreferrer">github.com/arifrijalf <ArrowUpRight size={13} /></a></div>
            <div><span>Instagram</span><a href="https://instagram.com/aarifrijal_" target="_blank" rel="noreferrer">@aarifrijal_ <ArrowUpRight size={13} /></a></div>
            <div><span>LinkedIn</span><a href="https://linkedin.com/in/arif-rijal-fadhilah" target="_blank" rel="noreferrer">arif-rijal-fadhilah <ArrowUpRight size={13} /></a></div>
          </div>
          <div className="contact-form-shell">
            <div className="contact-form-intro"><span>Drop a note</span><h3>Got a question<br />or an idea?</h3><p>Shoot me a quick message here. I'll get back to you soon.</p></div>
            <form className="contact-form" onSubmit={handleContactSubmit}>
              <label className="contact-field"><span>Name</span><input type="text" name="name" autoComplete="name" placeholder="What's your name?" value={contactForm.name} onChange={(event) => setContactForm((current) => ({ ...current, name: event.target.value }))} required /></label>
              <label className="contact-field"><span>Email</span><input id="contact-email" type="email" name="email" autoComplete="email" placeholder="you@example.com" value={contactForm.email} aria-invalid={Boolean(emailError)} aria-describedby={emailError ? "contact-email-error" : undefined} onChange={(event) => { const value = event.target.value; setContactForm((current) => ({ ...current, email: value })); setEmailError(value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()) ? "Please enter a valid email address." : ""); }} onBlur={(event) => { const value = event.target.value.trim(); setEmailError(value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? "Please enter a valid email address." : ""); }} required />{emailError && <span id="contact-email-error" className="contact-field-error" role="alert">{emailError}</span>}</label>
              <label className="contact-field"><span>Message</span><textarea name="message" placeholder="Tell me what you're working on..." value={contactForm.message} maxLength={MESSAGE_MAX_LENGTH} aria-describedby="message-count" onChange={(event) => setContactForm((current) => ({ ...current, message: event.target.value }))} required /><span id="message-count" className={`message-count${remainingCharacters < 100 ? " is-near-limit" : ""}`} aria-live="polite">{remainingCharacters} characters remaining</span></label>
              <div className="contact-form-actions"><button className="contact-form-submit" type="submit" disabled={isSubmitting} aria-busy={isSubmitting}>{isSubmitting ? <LoaderCircle className="submit-spinner" size={16} aria-hidden="true" /> : <ArrowUpRight size={16} />} {isSubmitting ? "Sending..." : "Send it"}</button>{contactFormStatus && <p className="contact-form-status" role="status" aria-live="polite">{contactFormStatus}</p>}</div>
            </form>
          </div>
        </SmoothSection>
      </main>

      {showBackToTop && <button className="back-to-top" type="button" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} aria-label="Back to top"><ArrowUp size={15} /></button>}

      <Dialog open={Boolean(detailProject)} onOpenChange={(open) => !open && setDetailProject(null)}>
        <DialogContent className="project-dialog" showCloseButton={false}>
          {detailProject && (
            <>
              <div className="project-dialog-header">
                <div><p className="dialog-kicker">{detailProject.type}</p><DialogTitle>{detailProject.title}</DialogTitle></div>
                <button className="modal-close" type="button" onClick={() => setDetailProject(null)} aria-label="Close project details"><X size={19} /></button>
              </div>
              <DialogDescription className="project-dialog-description">{detailProject.description}</DialogDescription>
              <div className="modal-gallery">
                {detailProject.gallery.map((image, imageIndex) => (
                  <button type="button" className="modal-gallery-item" key={image.src} onClick={() => openLightbox(detailProject, imageIndex)}>
                    <img src={image.src} alt={image.alt} loading="lazy" decoding="async" width="800" height="450" />
                    <span>{image.caption}<Maximize2 size={14} /></span>
                  </button>
                ))}
              </div>
              <div className="project-dialog-footer">
                <dl className="modal-evidence">
                  {detailProject.evidence.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}
                </dl>
                <a href={detailProject.repo} target="_blank" rel="noreferrer" className="modal-repository-link">Open repository <ArrowUpRight size={16} /></a>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(lightbox)} onOpenChange={(open) => !open && setLightbox(null)}>
        <DialogContent className="lightbox-dialog" showCloseButton={false}>
          {lightbox && (
            <>
              <div className="lightbox-header">
                <span>{lightbox.project.title} · {lightbox.index + 1}/{lightbox.project.gallery.length}</span>
                <button className="modal-close" type="button" onClick={() => setLightbox(null)} aria-label="Close image gallery"><X size={19} /></button>
              </div>
              <div className="lightbox-stage">
                {lightbox.project.gallery.length > 1 && <button className="lightbox-nav lightbox-previous" type="button" onClick={() => shiftLightbox(-1)} aria-label="Previous image"><ChevronLeft size={22} /></button>}
                <img src={lightbox.project.gallery[lightbox.index].src} alt={lightbox.project.gallery[lightbox.index].alt} decoding="async" width="1200" height="675" />
                {lightbox.project.gallery.length > 1 && <button className="lightbox-nav lightbox-next" type="button" onClick={() => shiftLightbox(1)} aria-label="Next image"><ChevronRight size={22} /></button>}
              </div>
              <p className="lightbox-caption">{lightbox.project.gallery[lightbox.index].caption}</p>
            </>
          )}
        </DialogContent>
      </Dialog>

      <footer className="site-footer">
        <span className="footer-identity"><span className="footer-mark" aria-hidden="true"><span className="signal-symbol"><i /><i /><i /></span></span><span>© 2026 ARIF RIJAL FADHILAH</span></span>
        <span>BUILT FROM NOTES, TESTS, AND ITERATION</span>
      </footer>
    </div>
  );
}
