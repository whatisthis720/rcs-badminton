/* ────────────────────────────────────────────────────────────────────── */
/* Philosophy — about the coach section                                  */
/* ────────────────────────────────────────────────────────────────────── */

import React from "react";
import { FONT_HEADING, FONT_BODY, INK, MUTED, ACCENT } from "../lib/tokens.js";
import { PILLARS } from "../lib/data.js";
import { FadeIn } from "./ui.jsx";

export default function Philosophy() {
  return (
    <section id="philosophy" className="bg-white pt-20 sm:pt-32 pb-16 sm:pb-20">
      <div className="max-w-6xl mx-auto px-8 sm:px-12">
        <div className="max-w-2xl mb-16">
          <FadeIn>
            <p
              className="text-xs uppercase tracking-[0.35em] mb-8"
              style={{ fontFamily: FONT_BODY, fontWeight: 500, color: ACCENT }}
            >
              About The Coach
            </p>
          </FadeIn>

          <FadeIn delay={150}>
            <h2
              className="text-5xl sm:text-6xl leading-[1.05]"
              style={{ fontFamily: FONT_HEADING, fontWeight: 800, letterSpacing: "-0.02em", color: INK }}
            >
              Discipline. Precision. Rigor.
            </h2>
          </FadeIn>
        </div>

        <div className="grid md:grid-cols-2 gap-16 md:gap-24">
          <FadeIn delay={300}>
            <div>
              <p
                className="text-base mb-6"
                style={{ fontFamily: FONT_BODY, fontWeight: 300, lineHeight: 1.8, color: MUTED }}
              >
                Professional badminton coach with 5+ years of elite
                experience. Former Air Force (AF) National Player.
              </p>
              <p
                className="text-base"
                style={{ fontFamily: FONT_BODY, fontWeight: 300, lineHeight: 1.8, color: MUTED }}
              >
                My coaching philosophy is built on the same discipline,
                precision, and tactical rigor that defined my career at the
                National level.
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={450}>
            <div style={{ borderTop: `1px solid ${INK}` }}>
              {PILLARS.map((p, i) => (
                <FadeIn key={p.label} delay={600 + i * 150}>
                  <div
                    className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-10 py-8"
                    style={{ borderBottom: `1px solid ${INK}` }}
                  >
                    <span
                      className="text-xs uppercase tracking-[0.2em] shrink-0 w-32"
                      style={{ fontFamily: FONT_BODY, fontWeight: 600, color: INK }}
                    >
                      {p.label}
                    </span>
                    <span
                      className="text-base"
                      style={{ fontFamily: FONT_BODY, fontWeight: 300, lineHeight: 1.8, color: MUTED }}
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
