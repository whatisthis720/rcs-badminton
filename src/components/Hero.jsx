/* ────────────────────────────────────────────────────────────────────── */
/* GeometricHero — sport-specific hero with court lines & shuttle trails */
/* ────────────────────────────────────────────────────────────────────── */

import React, { useEffect, useRef, useState, useCallback } from "react";
import { FONT_HEADING, FONT_BODY, INK, ACCENT } from "../lib/tokens.js";
import { FadeIn, GhostButton } from "./ui.jsx";

/* ── Court diagram background ────────────────────────────────────────── */
function CourtLines() {
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox="0 0 1200 800"
      preserveAspectRatio="xMidYMid slice"
      style={{ opacity: 0.05 }}
    >
      <rect x="140" y="90" width="920" height="620" stroke={INK} strokeWidth="1.5" fill="none" />
      <line x1="140" y1="400" x2="1060" y2="400" stroke={ACCENT} strokeWidth="2" />
      <line x1="140" y1="230" x2="1060" y2="230" stroke={INK} strokeWidth="1" />
      <line x1="140" y1="570" x2="1060" y2="570" stroke={INK} strokeWidth="1" />
      <line x1="600" y1="90" x2="600" y2="710" stroke={INK} strokeWidth="1" />
      <line x1="240" y1="90" x2="240" y2="710" stroke={INK} strokeWidth="1" />
      <line x1="960" y1="90" x2="960" y2="710" stroke={INK} strokeWidth="1" />
    </svg>
  );
}

/* ── Animated shuttle trajectory arc ──────────────────────────────────── */
function ShuttleTrail({ d, delay = 0, className = "", width = 500, height = 260, strokeWidth = 1.5, opacity = 0.4 }) {
  const pathRef = useRef(null);

  useEffect(() => {
    const el = pathRef.current;
    if (!el) return;
    const length = el.getTotalLength();
    el.style.strokeDasharray = `${length}`;
    el.style.strokeDashoffset = `${length}`;
    const t = setTimeout(() => {
      el.style.transition = "stroke-dashoffset 2200ms cubic-bezier(0.23,0.86,0.39,0.96)";
      el.style.strokeDashoffset = "0";
    }, delay * 1000 + 50);
    return () => clearTimeout(t);
  }, [delay]);

  return (
    <svg
      className={`absolute ${className}`}
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      style={{ animation: "shapeFloat 14s ease-in-out infinite" }}
    >
      <path ref={pathRef} d={d} stroke={ACCENT} strokeWidth={strokeWidth} strokeOpacity={opacity} strokeLinecap="round" />
    </svg>
  );
}

/* ── Animated gold geometric accent line ──────────────────────────────── */
function AccentDrawLine({ delay = 0.95 }) {
  const pathRef = useRef(null);

  useEffect(() => {
    const el = pathRef.current;
    if (!el) return;
    const length = el.getTotalLength();
    el.style.strokeDasharray = `${length}`;
    el.style.strokeDashoffset = `${length}`;
    const t = setTimeout(() => {
      el.style.transition = "stroke-dashoffset 1400ms cubic-bezier(0.16, 1, 0.3, 1)";
      el.style.strokeDashoffset = "0";
    }, delay * 1000);
    return () => clearTimeout(t);
  }, [delay]);

  return (
    <div className="flex justify-center items-center my-4 pointer-events-none">
      <svg width="120" height="2" viewBox="0 0 120 2" fill="none" className="overflow-visible">
        <path
          ref={pathRef}
          d="M0 1 L120 1"
          stroke={ACCENT}
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

/* ── Magnetic CTA Button Wrapper ─────────────────────────────────────── */
function MagneticButton({ children, onClick }) {
  const buttonRef = useRef(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = useCallback((e) => {
    const el = buttonRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const deltaX = e.clientX - centerX;
    const deltaY = e.clientY - centerY;
    // Restrained pull (max ~8-10px)
    setOffset({
      x: deltaX * 0.2,
      y: deltaY * 0.2,
    });
  }, []);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    setOffset({ x: 0, y: 0 });
  }, []);

  return (
    <div
      ref={buttonRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="inline-block"
      style={{
        transform: `translate3d(${offset.x}px, ${offset.y}px, 0)`,
        transition: isHovered
          ? "transform 180ms cubic-bezier(0.25, 1, 0.5, 1)"
          : "transform 500ms cubic-bezier(0.25, 1, 0.5, 1)",
        willChange: "transform",
      }}
    >
      <GhostButton onClick={onClick}>{children}</GhostButton>
    </div>
  );
}

export default function GeometricHero({ onOpenModal }) {
  const heroRef = useRef(null);
  const courtLayerRef = useRef(null);
  const trailsLayerRef = useRef(null);
  const contentLayerRef = useRef(null);

  // Parallax lerp state
  const targetPos = useRef({ x: 0, y: 0 });
  const currentPos = useRef({ x: 0, y: 0 });
  const rafId = useRef(null);

  useEffect(() => {
    let active = true;

    const loop = () => {
      if (!active) return;
      // Smooth lerp easing factor 0.055
      currentPos.current.x += (targetPos.current.x - currentPos.current.x) * 0.055;
      currentPos.current.y += (targetPos.current.y - currentPos.current.y) * 0.055;

      const cx = currentPos.current.x;
      const cy = currentPos.current.y;

      if (courtLayerRef.current) {
        courtLayerRef.current.style.transform = `translate3d(${(cx * -10).toFixed(2)}px, ${(cy * -10).toFixed(2)}px, 0)`;
      }
      if (trailsLayerRef.current) {
        trailsLayerRef.current.style.transform = `translate3d(${(cx * 16).toFixed(2)}px, ${(cy * 16).toFixed(2)}px, 0)`;
      }
      if (contentLayerRef.current) {
        contentLayerRef.current.style.transform = `translate3d(${(cx * 6).toFixed(2)}px, ${(cy * 6).toFixed(2)}px, 0)`;
      }

      rafId.current = requestAnimationFrame(loop);
    };

    rafId.current = requestAnimationFrame(loop);

    return () => {
      active = false;
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, []);

  const handleHeroMouseMove = useCallback((e) => {
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    targetPos.current = {
      x: Math.max(-1, Math.min(1, x)),
      y: Math.max(-1, Math.min(1, y)),
    };
  }, []);

  const handleHeroMouseLeave = useCallback(() => {
    targetPos.current = { x: 0, y: 0 };
  }, []);

  return (
    <section
      id="top"
      ref={heroRef}
      onMouseMove={handleHeroMouseMove}
      onMouseLeave={handleHeroMouseLeave}
      className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-white"
    >
      {/* Background layer: court lines with inverse parallax */}
      <div ref={courtLayerRef} className="absolute inset-0 pointer-events-none will-change-transform">
        <CourtLines />
      </div>

      {/* Mid layer: floating shuttle trails with positive parallax */}
      <div ref={trailsLayerRef} className="absolute inset-0 overflow-hidden pointer-events-none will-change-transform">
        <ShuttleTrail
          delay={0.35}
          width={560}
          height={280}
          opacity={0.4}
          d="M10 260 Q 280 -60 550 220"
          className="left-[-8%] md:left-[-4%] top-[8%] md:top-[10%]"
        />
        <ShuttleTrail
          delay={0.55}
          width={380}
          height={200}
          opacity={0.3}
          d="M370 10 Q 140 140 10 190"
          className="right-[-4%] md:right-[2%] bottom-[10%] md:bottom-[14%]"
        />
        <ShuttleTrail
          delay={0.7}
          width={260}
          height={150}
          opacity={0.35}
          strokeWidth={1.25}
          d="M10 20 Q 130 90 250 30"
          className="left-[10%] md:left-[16%] bottom-[6%] md:bottom-[8%]"
        />
      </div>

      {/* Foreground layer: hero content with gentle foreground parallax */}
      <div ref={contentLayerRef} className="relative z-10 max-w-3xl mx-auto px-6 md:px-8 text-center will-change-transform">
        <FadeIn delay={500}>
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-10"
            style={{ background: "rgba(10,10,10,0.03)", border: "1px solid rgba(10,10,10,0.08)" }}
          >
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: ACCENT }} />
            <span
              className="text-xs uppercase tracking-[0.25em]"
              style={{ fontFamily: FONT_BODY, fontWeight: 500, color: "rgba(10,10,10,0.6)" }}
            >
              Mastery, by invitation.
            </span>
          </div>
        </FadeIn>

        <FadeIn delay={700}>
          <h1
            className="text-5xl sm:text-7xl md:text-8xl leading-[1.12] mb-4"
            style={{ fontFamily: FONT_HEADING, fontWeight: 800, letterSpacing: "-0.02em" }}
          >
            <span className="block" style={{ color: INK }}>Racquets Cult</span>
            <span
              className="block bg-clip-text text-transparent pb-2"
              style={{ backgroundImage: `linear-gradient(90deg, ${INK} 0%, ${ACCENT} 50%, ${INK} 100%)` }}
            >
              Private Coaching
            </span>
          </h1>
        </FadeIn>

        <FadeIn delay={850}>
          <AccentDrawLine delay={0.95} />
        </FadeIn>

        <FadeIn delay={950}>
          <p
            className="text-base sm:text-lg mb-10 max-w-xl mx-auto"
            style={{ fontFamily: FONT_BODY, fontWeight: 300, lineHeight: 1.8, color: "rgba(10,10,10,0.5)" }}
          >
            Rc's is a private badminton coaching practice for players who
            train in silence and win in public.
          </p>
        </FadeIn>

        <FadeIn delay={1100}>
          <MagneticButton onClick={onOpenModal}>
            Request An Invitation
          </MagneticButton>
        </FadeIn>
      </div>

      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "linear-gradient(to top, #FFFFFF, transparent, rgba(255,255,255,0.7))" }}
      />
    </section>
  );
}
