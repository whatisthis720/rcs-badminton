/* ────────────────────────────────────────────────────────────────────── */
/* Nav — sticky header with desktop + mobile menu                        */
/* ────────────────────────────────────────────────────────────────────── */

import React, { useEffect, useState } from "react";
import { X, Menu } from "lucide-react";
import { FONT_BODY, INK, ACCENT } from "../lib/tokens.js";
import { NAV_LINKS } from "../lib/data.js";
import { Mark, GhostButton } from "./ui.jsx";

export default function Nav({ onOpenModal }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className="fixed top-0 inset-x-0 z-50 transition-colors duration-500"
      style={{
        backgroundColor: scrolled ? "rgba(255,255,255,0.92)" : "transparent",
        backdropFilter: scrolled ? "blur(8px)" : "none",
        borderBottom: scrolled ? `1px solid ${INK}` : "1px solid transparent",
      }}
    >
      <div className="max-w-6xl mx-auto px-8 sm:px-12 py-6 flex items-center justify-between">
        <a href="#top"><Mark /></a>

        <nav className="hidden md:flex items-center gap-12">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="relative text-xs uppercase tracking-[0.2em] group"
              style={{ fontFamily: FONT_BODY, fontWeight: 500, color: INK }}
            >
              {link.label}
              <span
                className="absolute left-0 -bottom-1 h-px w-0 group-hover:w-full transition-all duration-300"
                style={{ background: ACCENT }}
              />
            </a>
          ))}
          <GhostButton onClick={onOpenModal}>Request Invitation</GhostButton>
        </nav>

        <button className="md:hidden" onClick={() => setMobileOpen((v) => !v)} aria-label="Menu" style={{ color: INK }}>
          {mobileOpen ? <X size={22} strokeWidth={1.25} /> : <Menu size={22} strokeWidth={1.25} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-white px-8 py-8 flex flex-col gap-6" style={{ borderTop: `1px solid ${INK}` }}>
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="text-xs uppercase tracking-[0.2em]"
              style={{ fontFamily: FONT_BODY, fontWeight: 500, color: INK }}
            >
              {link.label}
            </a>
          ))}
          <GhostButton onClick={() => { setMobileOpen(false); onOpenModal(); }} className="w-fit">
            Request Invitation
          </GhostButton>
        </div>
      )}
    </header>
  );
}
