/* ────────────────────────────────────────────────────────────────────── */
/* Nav — Kinetic Athletic Navigation Bar                                 */
/* Charcoal (#0B0F14), Volt (#C8FF3D), Steel Blue (#1E88E5)               */
/* ────────────────────────────────────────────────────────────────────── */

import React, { useEffect, useState } from "react";
import { X, Menu } from "lucide-react";
import { FONT_BODY, PAPER, MUTED_DARK, VOLT, STEEL, CHARCOAL } from "../lib/tokens.js";
import { NAV_LINKS } from "../lib/data.js";
import { Mark, GhostButton } from "./ui.jsx";

export default function Nav({ onOpenModal }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className="fixed top-0 inset-x-0 z-50 transition-all duration-300"
      style={{
        backgroundColor: scrolled ? "rgba(11, 15, 20, 0.92)" : "rgba(11, 15, 20, 0.65)",
        backdropFilter: "blur(12px)",
        borderBottom: `1px solid ${scrolled ? "rgba(200, 255, 61, 0.15)" : "rgba(255, 255, 255, 0.06)"}`,
      }}
    >
      <div className="max-w-6xl mx-auto px-6 sm:px-12 py-5 flex items-center justify-between">
        <a href="#top" aria-label="Racquets Cult Home">
          <Mark />
        </a>

        <nav className="hidden md:flex items-center gap-10">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="relative text-xs uppercase tracking-[0.2em] font-medium transition-colors duration-200 group text-[#B8BEC7] hover:text-[#FFFFFF]"
              style={{ fontFamily: FONT_BODY }}
            >
              {link.label}
              <span
                className="absolute left-0 -bottom-1 h-0.5 w-0 group-hover:w-full transition-all duration-300 bg-[#C8FF3D] shadow-[0_0_8px_#C8FF3D]"
              />
            </a>
          ))}
          <GhostButton onClick={onOpenModal} className="!py-3 !px-6">
            Request Invitation
          </GhostButton>
        </nav>

        <button
          className="md:hidden p-2 text-white hover:text-[#C8FF3D] transition-colors"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle navigation menu"
        >
          {mobileOpen ? <X size={24} strokeWidth={1.5} /> : <Menu size={24} strokeWidth={1.5} />}
        </button>
      </div>

      {mobileOpen && (
        <div
          className="md:hidden px-8 py-8 flex flex-col gap-6"
          style={{
            backgroundColor: "#0B0F14",
            borderTop: "1px solid rgba(200, 255, 61, 0.2)",
            borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="text-xs uppercase tracking-[0.2em] font-medium text-[#B8BEC7] hover:text-[#C8FF3D] transition-colors"
              style={{ fontFamily: FONT_BODY }}
            >
              {link.label}
            </a>
          ))}
          <GhostButton
            onClick={() => {
              setMobileOpen(false);
              onOpenModal();
            }}
            className="w-full justify-center mt-2"
          >
            Request Invitation
          </GhostButton>
        </div>
      )}
    </header>
  );
}
