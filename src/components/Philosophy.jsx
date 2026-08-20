/* ────────────────────────────────────────────────────────────────────── */
/* Philosophy — About The Coach (Kinetic Athletic Redesign)               */
/* ────────────────────────────────────────────────────────────────────── */

import React from "react";
import { FONT_HEADING, FONT_BODY, PAPER, MUTED_DARK, VOLT, STEEL } from "../lib/tokens.js";
import { PILLARS } from "../lib/data.js";
import { FadeIn } from "./ui.jsx";

export default function Philosophy() {
  return (
    <section id="philosophy" className="bg-[#0B0F14] pt-24 sm:pt-36 pb-20 sm:pb-28 relative">
      <div className="max-w-6xl mx-auto px-8 sm:px-12">
        <div className="max-w-3xl mb-20">
          <FadeIn>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#1E88E5]/10 border border-[#1E88E5]/30 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1E88E5] shadow-[0_0_8px_#1E88E5]" />
              <p
                className="text-xs uppercase tracking-[0.3em] font-semibold text-[#1E88E5]"
                style={{ fontFamily: FONT_BODY }}
              >
                About The Coach
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={150}>
            <h2
              className="text-5xl sm:text-6xl md:text-7xl leading-[1.05] font-black text-white tracking-tight"
              style={{ fontFamily: FONT_HEADING }}
            >
              Discipline. Precision. Rigor.
            </h2>
          </FadeIn>
        </div>

        <div className="grid md:grid-cols-2 gap-16 md:gap-24 items-start">
          <FadeIn delay={250}>
            <div className="space-y-6 text-base font-normal leading-relaxed text-[#B8BEC7]" style={{ fontFamily: FONT_BODY }}>
              <p className="text-lg text-white font-medium">
                Professional badminton coach with 5+ years of elite
                experience. Former Air Force (AF) National Player.
              </p>
              <p>
                My coaching philosophy is built on the same discipline,
                precision, and tactical rigor that defined my career at the
                National level.
              </p>
              <div className="pt-4 flex items-center gap-4 text-xs uppercase tracking-widest text-[#C8FF3D] font-semibold">
                <span className="w-8 h-px bg-[#C8FF3D]" />
                <span>Elite High-Performance Standards</span>
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={400}>
            <div className="border-t border-white/10">
              {PILLARS.map((p, i) => (
                <FadeIn key={p.label} delay={500 + i * 120} direction="up">
                  <div
                    className="flex flex-col sm:flex-row sm:items-baseline gap-3 sm:gap-10 py-7 border-b border-white/10 group hover:border-[#C8FF3D]/40 transition-colors duration-300"
                  >
                    <span
                      className="text-xs uppercase tracking-[0.2em] shrink-0 w-36 font-bold text-[#C8FF3D] group-hover:text-white transition-colors"
                      style={{ fontFamily: FONT_BODY }}
                    >
                      {p.label}
                    </span>
                    <span
                      className="text-sm sm:text-base font-normal text-[#B8BEC7] leading-relaxed group-hover:text-[#FFFFFF] transition-colors"
                      style={{ fontFamily: FONT_BODY }}
                    >
                      {p.desc}
                    </span>
                  </div>
                </FadeIn>
              ))}
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
