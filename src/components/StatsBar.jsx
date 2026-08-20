/* ────────────────────────────────────────────────────────────────────── */
/* StatsBar — Kinetic Athletic Performance Credentials                   */
/* Charcoal (#0B0F14), Volt (#C8FF3D), Steel Blue (#1E88E5)               */
/* ────────────────────────────────────────────────────────────────────── */

import React from "react";
import { FONT_HEADING, FONT_BODY, VOLT, STEEL, MUTED_DARK, PAPER } from "../lib/tokens.js";
import { STATS } from "../lib/data.js";
import { FadeIn } from "./ui.jsx";

export default function StatsBar() {
  return (
    <section className="bg-[#10161F] py-12 sm:py-16 border-y border-white/10 relative overflow-hidden">
      {/* Subtle background glow */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          background: "radial-gradient(ellipse at center, rgba(200, 255, 61, 0.15) 0%, transparent 70%)",
        }}
      />

      <div className="max-w-6xl mx-auto px-8 sm:px-12 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 relative z-10">
        {STATS.map((s, i) => (
          <FadeIn key={s.label} delay={i * 120} direction="up" className="text-center md:text-left">
            <div
              className="text-3xl sm:text-4xl mb-1.5 font-extrabold text-[#C8FF3D] tracking-tight"
              style={{
                fontFamily: FONT_HEADING,
                textShadow: "0 0 20px rgba(200, 255, 61, 0.25)",
              }}
            >
              {s.value}
            </div>
            <div
              className="text-[11px] uppercase tracking-[0.2em] font-semibold text-[#B8BEC7]"
              style={{ fontFamily: FONT_BODY }}
            >
              {s.label}
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}
