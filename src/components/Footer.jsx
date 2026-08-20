/* ────────────────────────────────────────────────────────────────────── */
/* Footer / Contact — Kinetic Athletic Redesign                           */
/* ────────────────────────────────────────────────────────────────────── */

import React from "react";
import { ArrowUpRight } from "lucide-react";
import { FONT_HEADING, FONT_BODY, PAPER, MUTED_DARK, VOLT, STEEL, CHARCOAL } from "../lib/tokens.js";
import { FadeIn, GhostButton, Mark } from "./ui.jsx";

export default function Footer({ onOpenModal }) {
  return (
    <footer id="contact" className="bg-[#080B0F] pt-28 pb-14 border-t border-white/10 relative overflow-hidden">
      {/* Ambient background glow */}
      <div
        className="absolute bottom-0 right-0 w-[500px] h-[300px] pointer-events-none opacity-10"
        style={{
          background: "radial-gradient(ellipse at bottom right, rgba(200, 255, 61, 0.25) 0%, transparent 70%)",
        }}
      />

      <div className="max-w-6xl mx-auto px-8 sm:px-12 relative z-10">
        <div className="grid md:grid-cols-2 gap-14 items-center mb-28">
          <FadeIn>
            <h2
              className="text-5xl sm:text-6xl md:text-7xl leading-[1.05] font-black text-white tracking-tight"
              style={{ fontFamily: FONT_HEADING }}
            >
              Seats are limited each season.
            </h2>
          </FadeIn>
          <FadeIn delay={200} className="flex md:justify-end">
            <GhostButton onClick={() => onOpenModal()} className="!px-8 !py-4.5 font-bold text-sm">
              Request An Invitation <ArrowUpRight size={16} strokeWidth={1.75} className="ml-1" />
            </GhostButton>
          </FadeIn>
        </div>

        <div
          className="pt-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-10 border-t border-white/10"
        >
          <Mark />

          <div className="flex flex-wrap gap-x-10 gap-y-3">
            <a
              href="mailto:rcsbadminton@gmail.com"
              className="uppercase tracking-[0.15em] font-medium text-xs text-[#B8BEC7] hover:text-[#C8FF3D] transition-colors duration-200"
              style={{ fontFamily: FONT_BODY }}
            >
              rcsbadminton@gmail.com
            </a>
            <a
              href="tel:+917709221174"
              className="uppercase tracking-[0.15em] font-medium text-xs text-[#B8BEC7] hover:text-[#C8FF3D] transition-colors duration-200"
              style={{ fontFamily: FONT_BODY }}
            >
              +91 7709221174
            </a>
            <span
              className="uppercase tracking-[0.15em] font-medium text-xs text-[#1E88E5]"
              style={{ fontFamily: FONT_BODY }}
            >
              Pune, India
            </span>
            <a
              href="#"
              className="uppercase tracking-[0.15em] font-medium text-xs text-[#B8BEC7] hover:text-[#C8FF3D] transition-colors duration-200"
              style={{ fontFamily: FONT_BODY }}
            >
              Instagram
            </a>
          </div>
        </div>

        <p className="text-[11px] tracking-[0.1em] uppercase font-medium mt-12 text-[#64748B]" style={{ fontFamily: FONT_BODY }}>
          © {new Date().getFullYear()} Rc's — Racquets Cult. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
