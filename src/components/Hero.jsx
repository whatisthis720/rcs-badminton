/* ────────────────────────────────────────────────────────────────────── */
/* GeometricHero — Premium Athletic-Editorial Hero Section               */
/* Choreographed reveal, trajectory flight, parallax & magnetic motion   */
/* ────────────────────────────────────────────────────────────────────── */

import React, { useEffect, useRef, useState, useCallback } from "react";
import { FONT_HEADING, FONT_BODY, INK, ACCENT } from "../lib/tokens.js";
import { GhostButton } from "./ui.jsx";

/* ── Badminton Court Background Blueprint ────────────────────────────── */
function CourtLines() {
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none select-none"
      viewBox="0 0 1200 800"
      preserveAspectRatio="xMidYMid slice"
      style={{ opacity: 0.08 }}
      aria-hidden="true"
    >
      {/* Outer Doubles Boundary */}
      <rect x="140" y="90" width="920" height="620" stroke={INK} strokeWidth="1.5" fill="none" />

      {/* Center Service Line */}
      <line x1="600" y1="90" x2="600" y2="710" stroke={INK} strokeWidth="1" />

      {/* Net Line with Gold Accent */}
      <line x1="140" y1="400" x2="1060" y2="400" stroke={ACCENT} strokeWidth="2" strokeDasharray="6 3" strokeOpacity="0.9" />

      {/* Short Service Lines */}
      <line x1="140" y1="230" x2="1060" y2="230" stroke={INK} strokeWidth="1" />
      <line x1="140" y1="570" x2="1060" y2="570" stroke={INK} strokeWidth="1" />

      {/* Singles Sidelines */}
      <line x1="240" y1="90" x2="240" y2="710" stroke={INK} strokeWidth="1" />
      <line x1="960" y1="90" x2="960" y2="710" stroke={INK} strokeWidth="1" />

      {/* Doubles Back Service Lines */}
      <line x1="140" y1="130" x2="1060" y2="130" stroke={INK} strokeWidth="0.75" strokeDasharray="4 4" />
      <line x1="140" y1="670" x2="1060" y2="670" stroke={INK} strokeWidth="0.75" strokeDasharray="4 4" />

      {/* Precision Court Corner Markers */}
      <circle cx="140" cy="90" r="3.5" fill={ACCENT} fillOpacity="0.8" />
      <circle cx="1060" cy="90" r="3.5" fill={ACCENT} fillOpacity="0.8" />
      <circle cx="140" cy="710" r="3.5" fill={ACCENT} fillOpacity="0.8" />
      <circle cx="1060" cy="710" r="3.5" fill={ACCENT} fillOpacity="0.8" />
      <circle cx="600" cy="400" r="4.5" fill={ACCENT} fillOpacity="0.9" />
    </svg>
  );
}

/* ── Minimalist Geometric Shuttlecock Vector ──────────────────────────── */
function ShuttlecockIcon({ size = 28, color = ACCENT }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      className="overflow-visible"
      aria-hidden="true"
    >
      {/* Aerodynamic Feather Skirt Ribs */}
      <path d="M 18 16 L 3 9" stroke={color} strokeWidth="1.25" strokeLinecap="round" strokeOpacity="0.85" />
      <path d="M 19 16 L 2 13" stroke={color} strokeWidth="1.25" strokeLinecap="round" strokeOpacity="0.95" />
      <path d="M 20 16 L 2 16" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M 19 16 L 2 19" stroke={color} strokeWidth="1.25" strokeLinecap="round" strokeOpacity="0.95" />
      <path d="M 18 16 L 3 23" stroke={color} strokeWidth="1.25" strokeLinecap="round" strokeOpacity="0.85" />

      {/* Cross Feather Binding Threads */}
      <path d="M 9 11.5 Q 7.5 16 9 20.5" stroke={color} strokeWidth="1.1" strokeLinecap="round" strokeOpacity="0.8" />
      <path d="M 14 13.5 Q 13 16 14 18.5" stroke={color} strokeWidth="1.1" strokeLinecap="round" strokeOpacity="0.9" />

      {/* Rounded Cork Base (Leading) */}
      <path
        d="M 20 13 C 23.5 13 26 14.2 26 16 C 26 17.8 23.5 19 20 19 Z"
        fill={color}
        stroke={INK}
        strokeWidth="0.8"
      />
      <circle cx="21" cy="16" r="1.2" fill={INK} />
    </svg>
  );
}

/* ── Hero-Scale Animated Shuttle Flight with Trailing Arc ─────────────── */
function HeroShuttleFlight() {
  const pathRef = useRef(null);
  const shuttleRef = useRef(null);
  const [flightPhase, setFlightPhase] = useState("launching");

  const trajectoryD = "M -40 480 C 280 60, 820 80, 1160 300";

  useEffect(() => {
    const pathEl = pathRef.current;
    const shuttleEl = shuttleRef.current;
    if (!pathEl || !shuttleEl) return;

    const length = pathEl.getTotalLength();
    pathEl.style.strokeDasharray = `${length}`;
    pathEl.style.strokeDashoffset = `${length}`;

    let startTime = null;
    let animId = null;
    const duration = 2000;
    const delay = 200;

    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

    const step = (timestamp) => {
      if (!startTime) startTime = timestamp + delay;
      const elapsed = timestamp - startTime;

      if (elapsed < 0) {
        animId = requestAnimationFrame(step);
        return;
      }

      const rawProgress = Math.min(1, elapsed / duration);
      const easedProgress = easeOutCubic(rawProgress);

      const currentOffset = length * (1 - easedProgress);
      pathEl.style.strokeDashoffset = `${currentOffset}`;

      const currentDist = easedProgress * length;
      const point = pathEl.getPointAtLength(currentDist);
      const nextPoint = pathEl.getPointAtLength(Math.min(length, currentDist + 2));

      const angleRad = Math.atan2(nextPoint.y - point.y, nextPoint.x - point.x);
      const angleDeg = (angleRad * 180) / Math.PI;

      shuttleEl.style.transform = `translate3d(${point.x - 16}px, ${point.y - 16}px, 0) rotate(${angleDeg}deg)`;
      shuttleEl.style.opacity = `${Math.min(1, rawProgress * 5)}`;

      if (rawProgress < 1) {
        animId = requestAnimationFrame(step);
      } else {
        setFlightPhase("settled");
      }
    };

    animId = requestAnimationFrame(step);

    return () => {
      if (animId) cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none" aria-hidden="true">
      <svg
        className="w-full h-full"
        viewBox="0 0 1200 800"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
      >
        {/* Animated Main Smash Trajectory Trail */}
        <path
          ref={pathRef}
          d={trajectoryD}
          stroke={ACCENT}
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeDasharray="6 4"
          className="transition-opacity duration-1000"
          style={{ opacity: flightPhase === "settled" ? 0.4 : 0.8 }}
        />

        {/* Ambient Subtle Secondary Trajectory Arc */}
        <path
          d="M 40 560 C 360 220, 880 180, 1180 440"
          stroke={ACCENT}
          strokeWidth="1"
          strokeLinecap="round"
          strokeDasharray="4 6"
          strokeOpacity="0.25"
        />
      </svg>

      {/* Flying Shuttlecock */}
      <div
        ref={shuttleRef}
        className="absolute top-0 left-0 will-change-transform"
        style={{
          opacity: 1,
          transform: "translate3d(1144px, 284px, 0) rotate(18deg)",
        }}
      >
        <div
          style={{
            animation: flightPhase === "settled" ? "heroShuttleSway 6s ease-in-out infinite alternate" : "none",
          }}
        >
          <ShuttlecockIcon size={28} color={ACCENT} />
        </div>
      </div>
    </div>
  );
}

/* ── Secondary Subtle Trajectory Arc ─────────────────────────────────── */
function AtmosphericArc({ d, delay = 0, className = "", strokeWidth = 1.25, opacity = 0.25 }) {
  const pathRef = useRef(null);

  useEffect(() => {
    const el = pathRef.current;
    if (!el) return;
    const length = el.getTotalLength();
    el.style.strokeDasharray = `${length}`;
    el.style.strokeDashoffset = `${length}`;
    const t = setTimeout(() => {
      el.style.transition = "stroke-dashoffset 2400ms cubic-bezier(0.16, 1, 0.3, 1)";
      el.style.strokeDashoffset = "0";
    }, delay * 1000);
    return () => clearTimeout(t);
  }, [delay]);

  return (
    <svg
      className={`absolute pointer-events-none select-none ${className}`}
      width="420"
      height="220"
      viewBox="0 0 420 220"
      fill="none"
      aria-hidden="true"
    >
      <path
        ref={pathRef}
        d={d}
        stroke={ACCENT}
        strokeWidth={strokeWidth}
        strokeOpacity={opacity}
        strokeLinecap="round"
      />
    </svg>
  );
}

/* ── Animated Gold Divider Line Reveal ────────────────────────────────── */
function GoldAccentReveal() {
  return (
    <div
      className="flex items-center justify-center gap-3 my-4 sm:my-5 pointer-events-none select-none"
      style={{
        animation: "heroFadeUp 1s cubic-bezier(0.16, 1, 0.3, 1) 0.75s backwards",
      }}
    >
      <div
        className="h-px w-14 sm:w-20"
        style={{
          background: `linear-gradient(90deg, transparent, ${ACCENT})`,
          opacity: 0.85,
        }}
      />
      <div
        className="w-1.5 h-1.5 rotate-45"
        style={{
          background: ACCENT,
        }}
      />
      <div
        className="h-px w-14 sm:w-20"
        style={{
          background: `linear-gradient(90deg, ${ACCENT}, transparent)`,
          opacity: 0.85,
        }}
      />
    </div>
  );
}

/* ── Magnetic Ghost CTA Button ────────────────────────────────────────── */
function MagneticCTAButton({ children, onClick }) {
  const containerRef = useRef(null);
  const [transformStyle, setTransformStyle] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = useCallback((e) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = e.clientX - centerX;
    const deltaY = e.clientY - centerY;

    const pullFactor = 0.35;
    const maxDisplacement = 16;

    const targetX = Math.max(-maxDisplacement, Math.min(maxDisplacement, deltaX * pullFactor));
    const targetY = Math.max(-maxDisplacement, Math.min(maxDisplacement, deltaY * pullFactor));

    setTransformStyle({ x: targetX, y: targetY });
  }, []);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    setTransformStyle({ x: 0, y: 0 });
  }, []);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="inline-block p-4 -m-4 relative z-20 cursor-pointer"
      style={{
        transform: `translate3d(${transformStyle.x}px, ${transformStyle.y}px, 0)`,
        transition: isHovered
          ? "transform 140ms cubic-bezier(0.25, 1, 0.5, 1)"
          : "transform 450ms cubic-bezier(0.25, 1, 0.5, 1)",
        willChange: "transform",
      }}
    >
      <GhostButton onClick={onClick}>
        {children}
      </GhostButton>
    </div>
  );
}

/* ── Main GeometricHero Component ─────────────────────────────────────── */
export default function GeometricHero({ onOpenModal }) {
  const heroRef = useRef(null);
  const courtLayerRef = useRef(null);
  const midLayerRef = useRef(null);
  const contentLayerRef = useRef(null);

  // Parallax smooth lerping state
  const targetPos = useRef({ x: 0, y: 0 });
  const currentPos = useRef({ x: 0, y: 0 });
  const rafId = useRef(null);

  // Scroll exit state
  const [scrollY, setScrollY] = useState(0);

  // Parallax requestAnimationFrame Loop
  useEffect(() => {
    let active = true;

    const loop = () => {
      if (!active) return;

      currentPos.current.x += (targetPos.current.x - currentPos.current.x) * 0.065;
      currentPos.current.y += (targetPos.current.y - currentPos.current.y) * 0.065;

      const cx = currentPos.current.x;
      const cy = currentPos.current.y;

      // Layer 1: Court lines (subtle inverse shift)
      if (courtLayerRef.current) {
        courtLayerRef.current.style.transform = `translate3d(${(cx * -22).toFixed(2)}px, ${(cy * -22).toFixed(2)}px, 0)`;
      }

      // Layer 2: Trajectory flight and arcs (distinct forward shift)
      if (midLayerRef.current) {
        midLayerRef.current.style.transform = `translate3d(${(cx * 34).toFixed(2)}px, ${(cy * 34).toFixed(2)}px, 0)`;
      }

      // Layer 3: Foreground typography & CTA (gentle foreground shift)
      if (contentLayerRef.current) {
        contentLayerRef.current.style.transform = `translate3d(${(cx * 10).toFixed(2)}px, ${(cy * 10).toFixed(2)}px, 0)`;
      }

      rafId.current = requestAnimationFrame(loop);
    };

    rafId.current = requestAnimationFrame(loop);

    const handleMouseMove = (e) => {
      if (!heroRef.current) return;
      const rect = heroRef.current.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > window.innerHeight) return;

      const normX = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
      const normY = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);

      targetPos.current = {
        x: Math.max(-1, Math.min(1, normX)),
        y: Math.max(-1, Math.min(1, normY)),
      };
    };

    const handleMouseLeave = () => {
      targetPos.current = { x: 0, y: 0 };
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mouseleave", handleMouseLeave, { passive: true });

    return () => {
      active = false;
      if (rafId.current) cancelAnimationFrame(rafId.current);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  // Scroll-Responsive Exit Interaction
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY || 0);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const heroH = typeof window !== "undefined" ? window.innerHeight : 800;
  const progress = Math.min(1, Math.max(0, scrollY / (heroH * 0.75)));
  const exitOpacity = Math.max(0, 1 - progress * 1.35);
  const exitScale = 1 - progress * 0.05;
  const exitTranslateY = -progress * 50;

  return (
    <section
      id="top"
      ref={heroRef}
      className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-white pt-20 pb-12 selection:bg-[#C5A059] selection:text-[#0A0A0A]"
    >
      <style>{`
        @keyframes heroFadeUp {
          0% {
            opacity: 0;
            transform: translateY(18px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes heroShuttleSway {
          0% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-8px) rotate(-3deg); }
          100% { transform: translateY(6px) rotate(3deg); }
        }
      `}</style>

      {/* ── Background Layer: Badminton Court Blueprint (Inverse Parallax) ── */}
      <div
        ref={courtLayerRef}
        className="absolute inset-0 pointer-events-none will-change-transform"
      >
        <CourtLines />
      </div>

      {/* ── Mid Layer: Hero Shuttle Flight & Trajectory Arcs (Positive Parallax) ── */}
      <div
        ref={midLayerRef}
        className="absolute inset-0 overflow-hidden pointer-events-none will-change-transform"
      >
        <HeroShuttleFlight />

        {/* Decorative Trajectory Arcs */}
        <AtmosphericArc
          d="M 10 190 Q 200 -30 400 160"
          delay={0.6}
          opacity={0.3}
          className="left-[-4%] top-[12%] md:top-[16%]"
        />
        <AtmosphericArc
          d="M 400 20 Q 220 130 10 170"
          delay={0.8}
          opacity={0.25}
          className="right-[-2%] bottom-[12%] md:bottom-[16%]"
        />
      </div>

      {/* ── Foreground Layer: Choreographed Hero Reveal Content ── */}
      <div
        ref={contentLayerRef}
        className="relative z-10 max-w-3xl mx-auto px-6 md:px-8 text-center will-change-transform"
        style={{
          opacity: exitOpacity,
          transform: `translate3d(0, ${exitTranslateY}px, 0) scale(${exitScale})`,
        }}
      >
        {/* Step 1: Kicker Reveal */}
        <div
          className="inline-block mb-6 sm:mb-8"
          style={{
            animation: "heroFadeUp 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.15s backwards",
          }}
        >
          <div
            className="inline-flex items-center gap-2.5 px-4 py-1.5"
            style={{
              background: "rgba(10,10,10,0.02)",
              border: "1px solid rgba(10,10,10,0.08)",
            }}
          >
            <span
              className="w-1.5 h-1.5 inline-block"
              style={{ background: ACCENT }}
            />
            <span
              className="text-xs uppercase tracking-[0.25em]"
              style={{
                fontFamily: FONT_BODY,
                fontWeight: 500,
                color: "rgba(10,10,10,0.65)",
              }}
            >
              Mastery, by invitation.
            </span>
          </div>
        </div>

        {/* Step 2 & 3: Headline Staggered Reveal */}
        <h1
          className="text-4xl sm:text-6xl md:text-7xl lg:text-[4.75rem] leading-[1.08] mb-2"
          style={{
            fontFamily: FONT_HEADING,
            fontWeight: 800,
            letterSpacing: "-0.02em",
          }}
        >
          <span
            className="block text-[#0A0A0A]"
            style={{
              animation: "heroFadeUp 1s cubic-bezier(0.16, 1, 0.3, 1) 0.35s backwards",
            }}
          >
            Racquets Cult
          </span>
          <span
            className="block text-[#0A0A0A] pb-1"
            style={{
              animation: "heroFadeUp 1s cubic-bezier(0.16, 1, 0.3, 1) 0.55s backwards",
            }}
          >
            Private Coaching
          </span>
        </h1>

        {/* Step 4: Animated Gold Accent Line Reveal */}
        <GoldAccentReveal />

        {/* Step 5: Subtext Reveal */}
        <p
          className="text-base sm:text-lg mb-8 max-w-xl mx-auto"
          style={{
            fontFamily: FONT_BODY,
            fontWeight: 300,
            lineHeight: 1.8,
            color: "rgba(10,10,10,0.6)",
            animation: "heroFadeUp 1s cubic-bezier(0.16, 1, 0.3, 1) 0.95s backwards",
          }}
        >
          Rc's is a private badminton coaching practice for players who
          train in silence and win in public.
        </p>

        {/* Step 6: Magnetic CTA Button Reveal */}
        <div
          style={{
            animation: "heroFadeUp 1s cubic-bezier(0.16, 1, 0.3, 1) 1.15s backwards",
          }}
        >
          <MagneticCTAButton onClick={onOpenModal}>
            Request An Invitation
          </MagneticCTAButton>
        </div>
      </div>

      {/* Bottom Subtle Gradient Fade to Next Section */}
      <div
        className="absolute inset-x-0 bottom-0 h-24 pointer-events-none select-none"
        style={{
          background: "linear-gradient(to top, #FFFFFF, rgba(255,255,255,0))",
        }}
        aria-hidden="true"
      />
    </section>
  );
}
