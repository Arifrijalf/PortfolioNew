import {
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  X,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import type { PortfolioProject } from "@/pages/Home";

type Props = {
  detailProject: PortfolioProject | null;
  lightbox: { project: PortfolioProject; index: number } | null;
  setDetailProject: (project: PortfolioProject | null) => void;
  setLightbox: (
    value: { project: PortfolioProject; index: number } | null
  ) => void;
  openLightbox: (project: PortfolioProject, index?: number) => void;
  shiftLightbox: (direction: number) => void;
};
export default function ProjectDialogs({
  detailProject,
  lightbox,
  setDetailProject,
  setLightbox,
  openLightbox,
  shiftLightbox,
}: Props) {
  return (
    <>
      <Dialog
        open={Boolean(detailProject)}
        onOpenChange={open => !open && setDetailProject(null)}
      >
        <DialogContent className="project-dialog" showCloseButton={false}>
          {detailProject && (
            <>
              <div className="project-dialog-header">
                <div>
                  <p className="dialog-kicker">{detailProject.type}</p>
                  <DialogTitle>{detailProject.title}</DialogTitle>
                </div>
                <button
                  className="modal-close"
                  type="button"
                  onClick={() => setDetailProject(null)}
                  aria-label="Close project details"
                >
                  <X size={19} />
                </button>
              </div>
              <DialogDescription className="project-dialog-description">
                {detailProject.description}
              </DialogDescription>
              <div className="modal-gallery">
                {detailProject.gallery.map((image, imageIndex) => (
                  <button
                    type="button"
                    className="modal-gallery-item"
                    key={image.src}
                    onClick={() => openLightbox(detailProject, imageIndex)}
                  >
                    <img
                      src={image.src}
                      alt={image.alt}
                      loading="lazy"
                      decoding="async"
                      width="800"
                      height="450"
                    />
                    <span>
                      {image.caption}
                      <Maximize2 size={14} />
                    </span>
                  </button>
                ))}
              </div>
              <div className="project-dialog-footer">
                <dl className="modal-evidence">
                  {detailProject.evidence.map(([label, value]) => (
                    <div key={label}>
                      <dt>{label}</dt>
                      <dd>{value}</dd>
                    </div>
                  ))}
                </dl>
                <a
                  href={detailProject.repo}
                  target="_blank"
                  rel="noreferrer"
                  className="modal-repository-link"
                >
                  Open repository <ArrowUpRight size={16} />
                </a>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Dialog
        open={Boolean(lightbox)}
        onOpenChange={open => !open && setLightbox(null)}
      >
        <DialogContent className="lightbox-dialog" showCloseButton={false}>
          {lightbox && (
            <>
              <DialogTitle className="sr-only">
                {lightbox.project.title} image gallery
              </DialogTitle>
              <DialogDescription className="sr-only">
                Browse project photos using the previous and next buttons.
              </DialogDescription>
              <div className="lightbox-header">
                <span>
                  {lightbox.project.title} · {lightbox.index + 1}/
                  {lightbox.project.gallery.length}
                </span>
                <button
                  className="modal-close"
                  type="button"
                  onClick={() => setLightbox(null)}
                  aria-label="Close image gallery"
                >
                  <X size={19} />
                </button>
              </div>
              <div className="lightbox-stage">
                {lightbox.project.gallery.length > 1 && (
                  <button
                    className="lightbox-nav lightbox-previous"
                    type="button"
                    onClick={() => shiftLightbox(-1)}
                    aria-label="Previous image"
                  >
                    <ChevronLeft size={22} />
                  </button>
                )}
                <img
                  key={lightbox.index}
                  src={lightbox.project.gallery[lightbox.index].src}
                  alt={lightbox.project.gallery[lightbox.index].alt}
                  decoding="async"
                  width="1200"
                  height="675"
                />
                {lightbox.project.gallery.length > 1 && (
                  <button
                    className="lightbox-nav lightbox-next"
                    type="button"
                    onClick={() => shiftLightbox(1)}
                    aria-label="Next image"
                  >
                    <ChevronRight size={22} />
                  </button>
                )}
              </div>
              <p className="lightbox-caption">
                {lightbox.project.gallery[lightbox.index].caption}
              </p>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
