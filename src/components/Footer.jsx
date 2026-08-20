/* ────────────────────────────────────────────────────────────────────── */
/* Footer / Contact                                                      */
/* ────────────────────────────────────────────────────────────────────── */

import React from "react";
import { ArrowUpRight } from "lucide-react";
import { FONT_HEADING, FONT_BODY, INK, MUTED } from "../lib/tokens.js";
import { FadeIn, GhostButton, Mark } from "./ui.jsx";

export default function Footer({ onOpenModal }) {
  return (
    <footer id="contact" className="bg-white pt-32 pb-14" style={{ borderTop: `1px solid ${INK}` }}>
      <div className="max-w-6xl mx-auto px-8 sm:px-12">
        <div className="grid md:grid-cols-2 gap-14 items-center mb-28">
          <FadeIn>
            <h2
              className="text-5xl sm:text-6xl leading-[1.05]"
              style={{ fontFamily: FONT_HEADING, fontWeight: 800, letterSpacing: "-0.02em", color: INK }}
            >
              Seats are limited each season.
            </h2>
          </FadeIn>
          <FadeIn delay={200} className="flex md:justify-end">
            <GhostButton onClick={() => onOpenModal()}>
              Request An Invitation <ArrowUpRight size={14} strokeWidth={1.25} />
            </GhostButton>
          </FadeIn>
        </div>

        <div
          className="pt-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-10"
          style={{ borderTop: `1px solid ${INK}` }}
        >
          <Mark />

          <div className="flex flex-wrap gap-x-12 gap-y-3">
            <a
              href="mailto:rcsbadminton@gmail.com"
              className="uppercase tracking-[0.1em] hover:opacity-50 transition-opacity duration-300"
              style={{ fontFamily: FONT_BODY, fontSize: "11px", color: MUTED }}
            >
              rcsbadminton@gmail.com
            </a>
            <a
              href="tel:+917709221174"
              className="uppercase tracking-[0.1em] hover:opacity-50 transition-opacity duration-300"
              style={{ fontFamily: FONT_BODY, fontSize: "11px", color: MUTED }}
            >
              +91 7709221174
            </a>
            <span
              className="uppercase tracking-[0.1em]"
              style={{ fontFamily: FONT_BODY, fontSize: "11px", color: MUTED }}
            >
              Pune, India
            </span>
            <a
              href="#"
              className="uppercase tracking-[0.1em] hover:opacity-50 transition-opacity duration-300"
              style={{ fontFamily: FONT_BODY, fontSize: "11px", color: MUTED }}
            >
              Instagram
            </a>
          </div>
        </div>

        <p className="text-[11px] tracking-[0.05em] mt-12" style={{ fontFamily: FONT_BODY, color: "#A3A3A3" }}>
          © {new Date().getFullYear()} Rc's — Racquets Cult. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
