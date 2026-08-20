/* ────────────────────────────────────────────────────────────────────── */
/* Testimonials — Kinetic Athletic Member Endorsements                    */
/* ────────────────────────────────────────────────────────────────────── */

import React from "react";
import { FONT_HEADING, FONT_BODY, PAPER, MUTED_DARK, VOLT, STEEL } from "../lib/tokens.js";
import { TESTIMONIALS } from "../lib/data.js";
import { FadeIn } from "./ui.jsx";

export default function Testimonials() {
  return (
    <section id="testimonials" className="bg-[#0B0F14] pt-20 sm:pt-28 pb-32 sm:pb-44 border-t border-white/10 relative">
      <div className="max-w-4xl mx-auto px-8 sm:px-12 text-center">
        <FadeIn>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#1E88E5]/10 border border-[#1E88E5]/30 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#1E88E5] shadow-[0_0_8px_#1E88E5]" />
            <p
              className="text-xs uppercase tracking-[0.3em] font-semibold text-[#1E88E5]"
              style={{ fontFamily: FONT_BODY }}
            >
              In Their Words
            </p>
          </div>
        </FadeIn>

        <FadeIn delay={150}>
          <h2
            className="text-4xl sm:text-5xl md:text-6xl leading-[1.1] mb-24 font-black text-white tracking-tight"
            style={{ fontFamily: FONT_HEADING }}
          >
            Members speak for themselves.
          </h2>
        </FadeIn>

        <div className="space-y-24">
          {TESTIMONIALS.map((t, i) => (
            <FadeIn key={t.name} delay={i * 150} direction="up">
              <blockquote className="relative">
                <p
                  className="text-2xl sm:text-3xl md:text-4xl leading-relaxed mb-8 font-semibold text-white tracking-tight"
                  style={{ fontFamily: FONT_HEADING }}
                >
                  "{t.quote}"
                </p>
                <footer className="flex items-center justify-center gap-3">
                  <span
                    className="flex items-center justify-center w-9 h-9 rounded-full shrink-0 bg-[#131A24] border border-[#C8FF3D]/40 text-[#C8FF3D] font-bold text-xs shadow-[0_0_10px_rgba(200,255,61,0.15)]"
                    style={{ fontFamily: FONT_HEADING }}
                  >
                    {t.name.charAt(0)}
                  </span>
                  <span
                    className="text-xs uppercase tracking-[0.2em] font-medium text-[#B8BEC7]"
                    style={{ fontFamily: FONT_BODY }}
                  >
                    <span className="text-white font-semibold">{t.name}</span> <span className="text-[#C8FF3D]">·</span> {t.role}
                  </span>
                </footer>
              </blockquote>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
