/* ────────────────────────────────────────────────────────────────────── */
/* Testimonials — sparse, centered, text-only editorial layout           */
/* ────────────────────────────────────────────────────────────────────── */

import React from "react";
import { FONT_HEADING, FONT_BODY, INK, MUTED, ACCENT } from "../lib/tokens.js";
import { TESTIMONIALS } from "../lib/data.js";
import { FadeIn } from "./ui.jsx";

export default function Testimonials() {
  return (
    <section id="testimonials" className="bg-white pt-16 sm:pt-20 pb-32 sm:pb-48" style={{ borderTop: `1px solid ${INK}` }}>
      <div className="max-w-4xl mx-auto px-8 sm:px-12 text-center">
        <FadeIn>
          <p
            className="text-xs uppercase tracking-[0.35em] mb-8"
            style={{ fontFamily: FONT_BODY, fontWeight: 500, color: ACCENT }}
          >
            In Their Words
          </p>
        </FadeIn>

        <FadeIn delay={150}>
          <h2
            className="text-4xl sm:text-5xl leading-[1.1] mb-24"
            style={{ fontFamily: FONT_HEADING, fontWeight: 800, letterSpacing: "-0.02em", color: INK }}
          >
            Members speak for themselves.
          </h2>
        </FadeIn>

        <div className="space-y-24">
          {TESTIMONIALS.map((t, i) => (
            <FadeIn key={t.name} delay={i * 150}>
              <blockquote>
                <p
                  className="text-2xl sm:text-3xl leading-[1.5] mb-8"
                  style={{ fontFamily: FONT_HEADING, fontWeight: 500, letterSpacing: "-0.01em", color: INK }}
                >
                  "{t.quote}"
                </p>
                <footer className="flex items-center justify-center gap-3">
                  <span
                    className="flex items-center justify-center w-8 h-8 rounded-full shrink-0"
                    style={{ border: `1px solid ${INK}`, fontFamily: FONT_HEADING, fontSize: "12px", fontWeight: 700, color: INK }}
                  >
                    {t.name.charAt(0)}
                  </span>
                  <span
                    className="text-xs uppercase tracking-[0.2em]"
                    style={{ fontFamily: FONT_BODY, fontWeight: 500, color: MUTED }}
                  >
                    {t.name} <span style={{ color: "#C7C7C7" }}>·</span> {t.role}
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
