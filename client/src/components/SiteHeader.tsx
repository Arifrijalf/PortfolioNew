import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Menu, Moon, Sun, X } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useTheme } from "@/contexts/ThemeContext";

export function SiteHeader() {
  const [location] = useLocation();
  const isHome = location === "/";
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const header = useRef<HTMLElement>(null);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    if (!menuOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        menuButton.current?.focus();
      }
    };
    const closeOutside = (event: PointerEvent) => {
      if (!header.current?.contains(event.target as Node)) setMenuOpen(false);
    };
    document.addEventListener("keydown", closeOnEscape);
    document.addEventListener("pointerdown", closeOutside);
    return () => {
      document.removeEventListener("keydown", closeOnEscape);
      document.removeEventListener("pointerdown", closeOutside);
    };
  }, [menuOpen]);

  return (
    <header
      className="site-header"
      ref={header}
      onBlur={event => {
        if (!event.currentTarget.contains(event.relatedTarget))
          setMenuOpen(false);
      }}
    >
      <Link
        className="brand-lockup"
        href="/"
        aria-label="Arif Rijal Fadhilah — Home"
        onClick={() => setMenuOpen(false)}
      >
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
      <button
        ref={menuButton}
        className="mobile-menu-toggle"
        type="button"
        onClick={() => setMenuOpen(open => !open)}
        aria-label={menuOpen ? "Close menu" : "Open menu"}
        aria-expanded={menuOpen}
        aria-controls="primary-navigation"
      >
        {menuOpen ? <X size={19} /> : <Menu size={19} />}
      </button>
      <nav
        id="primary-navigation"
        className={`primary-nav ${menuOpen ? "is-open" : ""}`}
        aria-label="Primary navigation"
        onClick={() => setMenuOpen(false)}
      >
        <a href={isHome ? "#about" : "/#about"}>About</a>
        <a href={isHome ? "#work" : "/#work"}>Work</a>
        <Link
          href="/progress-microcontroller"
          aria-current={
            location.startsWith("/progress-microcontroller")
              ? "location"
              : undefined
          }
        >
          Progress
        </Link>
        <a href={isHome ? "#practice" : "/#practice"}>Practice</a>
        <a href={isHome ? "#contact" : "/#contact"}>Contact</a>
      </nav>
      <div className="header-actions">
        <button
          className="theme-toggle"
          type="button"
          onClick={toggleTheme}
          aria-label={
            theme === "dark" ? "Switch to light theme" : "Switch to dark theme"
          }
        >
          {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
        </button>
        <a className="header-cta" href={isHome ? "#contact" : "/#contact"}>
          Say hello <ArrowUpRight size={15} />
        </a>
      </div>
    </header>
  );
}
