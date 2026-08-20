/* ────────────────────────────────────────────────────────────────────── */
/* GeometricHero — Kinetic Athletic Hero Section                         */
/* Charcoal (#0B0F14), Volt Green (#C8FF3D), Steel Blue (#1E88E5)        */
/* With Biomechanical Line-Art Player Silhouettes & Motion Capture Nodes  */
/* ────────────────────────────────────────────────────────────────────── */

import React, { useEffect, useRef, useState, useCallback } from "react";
import { FONT_HEADING, FONT_BODY, PAPER, MUTED_DARK, VOLT, STEEL, CHARCOAL } from "../lib/tokens.js";
import { GhostButton } from "./ui.jsx";

/* ── Biomechanical Smash Player Silhouette (Left Backcourt) ──────────── */
function SmashPlayerSilhouette({ className = "" }) {
  return (
    <svg
      className={`absolute pointer-events-none select-none overflow-visible ${className}`}
      width="380"
      height="480"
      viewBox="0 0 380 480"
      fill="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="smashVoltFade" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={VOLT} stopOpacity="0.8" />
          <stop offset="100%" stopColor={STEEL} stopOpacity="0.3" />
        </linearGradient>
      </defs>

      <g className="smash-player-group" style={{ opacity: 0.22 }}>
        {/* ── Kinetic Motion Tracking Arcs (Swing Plane) ── */}
        <path
          d="M 230 40 C 270 90, 260 180, 190 240"
          stroke={VOLT}
          strokeWidth="1.2"
          strokeDasharray="4 4"
          strokeOpacity="0.6"
          className="animate-pulse"
        />
        <path
          d="M 210 20 C 285 70, 280 200, 160 260"
          stroke={STEEL}
          strokeWidth="0.75"
          strokeDasharray="2 4"
          strokeOpacity="0.4"
        />

        {/* ── Kinetic Velocity Measurement Annotation ── */}
        <text
          x="280"
          y="85"
          fill={VOLT}
          fillOpacity="0.7"
          fontSize="8"
          fontFamily={FONT_BODY}
          letterSpacing="0.2em"
          fontWeight="600"
        >
          RELEASE: 382 KM/H
        </text>
        <line x1="245" y1="82" x2="275" y2="82" stroke={VOLT} strokeWidth="0.75" strokeOpacity="0.5" />

        {/* ── Head & Gaze Vector ── */}
        <circle cx="160" cy="115" r="14" stroke={VOLT} strokeWidth="1.5" />
        <circle cx="160" cy="115" r="5" fill={VOLT} fillOpacity="0.4" />
        {/* Gaze tracking crosshair */}
        <line x1="174" y1="110" x2="210" y2="90" stroke={VOLT} strokeWidth="1" strokeDasharray="3 3" strokeOpacity="0.8" />

        {/* ── Spine & Torso Core ── */}
        <line x1="160" y1="129" x2="148" y2="185" stroke={PAPER} strokeWidth="2" strokeLinecap="round" />
        <line x1="148" y1="185" x2="135" y2="245" stroke={PAPER} strokeWidth="2" strokeLinecap="round" />
        {/* Torso cage ribs in technical steel */}
        <line x1="145" y1="150" x2="175" y2="145" stroke={STEEL} strokeWidth="1" strokeOpacity="0.7" />
        <line x1="140" y1="175" x2="168" y2="170" stroke={STEEL} strokeWidth="1" strokeOpacity="0.7" />
        <line x1="130" y1="210" x2="155" y2="205" stroke={STEEL} strokeWidth="1" strokeOpacity="0.7" />

        {/* ── Counter-Balance Non-Racquet Arm (Left) ── */}
        <line x1="155" y1="145" x2="110" y2="175" stroke={STEEL} strokeWidth="1.5" strokeLinecap="round" />
        <line x1="110" y1="175" x2="70" y2="195" stroke={STEEL} strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="110" cy="175" r="3" fill={STEEL} />
        <circle cx="70" cy="195" r="2.5" fill={STEEL} />

        {/* ── Racquet Swing Arm (Right) — Follow-Through Kinematics ── */}
        <g className="smash-arm-motion">
          <line x1="165" y1="145" x2="215" y2="110" stroke={VOLT} strokeWidth="2" strokeLinecap="round" />
          <line x1="215" y1="110" x2="255" y2="70" stroke={VOLT} strokeWidth="2" strokeLinecap="round" />
          
          {/* Racquet Shaft & Head */}
          <line x1="255" y1="70" x2="305" y2="30" stroke={VOLT} strokeWidth="1.75" strokeLinecap="round" />
          <ellipse cx="325" cy="14" rx="28" ry="16" transform="rotate(-38 325 14)" stroke={VOLT} strokeWidth="1.5" />
          {/* Racquet String Grid Accents */}
          <line x1="312" y1="5" x2="338" y2="25" stroke={VOLT} strokeWidth="0.6" strokeOpacity="0.6" />
          <line x1="318" y1="-2" x2="344" y2="18" stroke={VOLT} strokeWidth="0.6" strokeOpacity="0.6" />
          <line x1="310" y1="20" x2="335" y2="-5" stroke={VOLT} strokeWidth="0.6" strokeOpacity="0.6" />

          {/* Joint Nodes with Kinetic Glow */}
          <circle cx="165" cy="145" r="3.5" fill={VOLT} className="shadow-[0_0_8px_#C8FF3D]" />
          <circle cx="215" cy="110" r="3.5" fill={VOLT} />
          <circle cx="255" cy="70" r="3" fill={PAPER} />
        </g>

        {/* ── Pelvis & Airborne Jump Legs ── */}
        {/* Hip crossbar */}
        <line x1="120" y1="245" x2="150" y2="245" stroke={PAPER} strokeWidth="2" />
        <circle cx="135" cy="245" r="4" fill={STEEL} />

        {/* Front Driving Leg (Left) */}
        <line x1="145" y1="245" x2="170" y2="320" stroke={STEEL} strokeWidth="1.75" strokeLinecap="round" />
        <line x1="170" y1="320" x2="160" y2="400" stroke={STEEL} strokeWidth="1.75" strokeLinecap="round" />
        <circle cx="170" cy="320" r="3.5" fill={STEEL} />
        <circle cx="160" cy="400" r="3" fill={STEEL} />
        {/* Foot vector */}
        <line x1="160" y1="400" x2="180" y2="425" stroke={STEEL} strokeWidth="1.5" strokeLinecap="round" />

        {/* Trailing Jump Leg (Right Scissor Kick) */}
        <line x1="125" y1="245" x2="80" y2="305" stroke={VOLT} strokeWidth="1.75" strokeLinecap="round" />
        <line x1="80" y1="305" x2="50" y2="385" stroke={VOLT} strokeWidth="1.75" strokeLinecap="round" />
        <circle cx="80" cy="305" r="3.5" fill={VOLT} />
        <circle cx="50" cy="385" r="3" fill={VOLT} />
        {/* Trailing Foot */}
        <line x1="50" y1="385" x2="30" y2="405" stroke={VOLT} strokeWidth="1.5" strokeLinecap="round" />

        {/* ── Biomechanical Joint Degree Indicators ── */}
        <path d="M 160 300 A 20 20 0 0 1 175 330" stroke={VOLT} strokeWidth="0.75" fill="none" strokeDasharray="2 2" />
        <text x="182" y="315" fill={VOLT} fillOpacity="0.7" fontSize="7" fontFamily={FONT_BODY}>136°</text>

        <path d="M 95 295 A 18 18 0 0 0 75 320" stroke={STEEL} strokeWidth="0.75" fill="none" strokeDasharray="2 2" />
        <text x="50" y="310" fill={STEEL} fillOpacity="0.7" fontSize="7" fontFamily={FONT_BODY}>118°</text>
      </g>
    </svg>
  );
}

/* ── Biomechanical Defensive Lunge Player Silhouette (Right Forecourt) ── */
function LungePlayerSilhouette({ className = "" }) {
  return (
    <svg
      className={`absolute pointer-events-none select-none overflow-visible ${className}`}
      width="420"
      height="380"
      viewBox="0 0 420 380"
      fill="none"
      aria-hidden="true"
    >
      <g className="lunge-player-group" style={{ opacity: 0.18 }}>
        {/* ── Kinetic Tracking Arc (Reach Vector) ── */}
        <path
          d="M 110 160 C 60 200, 40 260, 20 310"
          stroke={VOLT}
          strokeWidth="1.2"
          strokeDasharray="4 4"
          strokeOpacity="0.5"
        />

        {/* ── Dimension Annotation ── */}
        <text
          x="30"
          y="150"
          fill={STEEL}
          fillOpacity="0.7"
          fontSize="8"
          fontFamily={FONT_BODY}
          letterSpacing="0.2em"
          fontWeight="600"
        >
          REACH SPAN: 2.15M
        </text>
        <line x1="25" y1="158" x2="125" y2="158" stroke={STEEL} strokeWidth="0.75" strokeOpacity="0.4" />

        {/* ── Head & Focus Vector ── */}
        <circle cx="210" cy="95" r="13" stroke={STEEL} strokeWidth="1.5" />
        <circle cx="210" cy="95" r="4.5" fill={STEEL} fillOpacity="0.4" />
        {/* Low Net Focus Vector */}
        <line x1="198" y1="100" x2="120" y2="140" stroke={STEEL} strokeWidth="1" strokeDasharray="3 3" strokeOpacity="0.7" />

        {/* ── Low Aerodynamic Torso / Spine ── */}
        <line x1="210" y1="108" x2="245" y2="155" stroke={PAPER} strokeWidth="2" strokeLinecap="round" />
        <line x1="245" y1="155" x2="280" y2="205" stroke={PAPER} strokeWidth="2" strokeLinecap="round" />
        {/* Rib markings */}
        <line x1="220" y1="130" x2="242" y2="120" stroke={VOLT} strokeWidth="1" strokeOpacity="0.6" />
        <line x1="240" y1="160" x2="262" y2="150" stroke={VOLT} strokeWidth="1" strokeOpacity="0.6" />

        {/* ── Non-Racquet Counterbalance Arm (Up/Back) ── */}
        <line x1="230" y1="130" x2="285" y2="100" stroke={STEEL} strokeWidth="1.5" strokeLinecap="round" />
        <line x1="285" y1="100" x2="335" y2="75" stroke={STEEL} strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="285" cy="100" r="3" fill={STEEL} />
        <circle cx="335" cy="75" r="2.5" fill={STEEL} />

        {/* ── Low Reaching Racquet Arm (Forward Under Net) ── */}
        <g className="lunge-reach-motion">
          <line x1="215" y1="130" x2="160" y2="165" stroke={VOLT} strokeWidth="2" strokeLinecap="round" />
          <line x1="160" y1="165" x2="105" y2="195" stroke={VOLT} strokeWidth="2" strokeLinecap="round" />
          
          {/* Racquet Shaft & Low Frame */}
          <line x1="105" y1="195" x2="50" y2="215" stroke={VOLT} strokeWidth="1.75" strokeLinecap="round" />
          <ellipse cx="28" cy="225" rx="24" ry="14" transform="rotate(22 28 225)" stroke={VOLT} strokeWidth="1.5" />
          {/* Strings */}
          <line x1="18" y1="218" x2="38" y2="232" stroke={VOLT} strokeWidth="0.6" strokeOpacity="0.6" />
          <line x1="22" y1="212" x2="42" y2="226" stroke={VOLT} strokeWidth="0.6" strokeOpacity="0.6" />

          {/* Joint Nodes */}
          <circle cx="215" cy="130" r="3.5" fill={VOLT} />
          <circle cx="160" cy="165" r="3.5" fill={VOLT} />
          <circle cx="105" cy="195" r="3" fill={PAPER} />
        </g>

        {/* ── Pelvis & Deep Athletic Lunge Stance ── */}
        <circle cx="280" cy="205" r="4.5" fill={STEEL} />

        {/* Front Deep Lunging Leg (Left Forward) */}
        <line x1="280" y1="205" x2="200" y2="245" stroke={VOLT} strokeWidth="2" strokeLinecap="round" />
        <line x1="200" y1="245" x2="195" y2="335" stroke={VOLT} strokeWidth="2" strokeLinecap="round" />
        <circle cx="200" cy="245" r="4" fill={VOLT} />
        <circle cx="195" cy="335" r="3.5" fill={VOLT} />
        {/* Planted Foot Base */}
        <line x1="180" y1="340" x2="220" y2="340" stroke={VOLT} strokeWidth="2.5" strokeLinecap="round" />

        {/* Back Extended Anchor Leg (Right Trailing) */}
        <line x1="280" y1="205" x2="355" y2="270" stroke={STEEL} strokeWidth="1.75" strokeLinecap="round" />
        <line x1="355" y1="270" x2="410" y2="335" stroke={STEEL} strokeWidth="1.75" strokeLinecap="round" />
        <circle cx="355" cy="270" r="3.5" fill={STEEL} />
        <circle cx="410" cy="335" r="3" fill={STEEL} />
        {/* Trailing Toe Contact */}
        <line x1="410" y1="335" x2="425" y2="342" stroke={STEEL} strokeWidth="1.75" strokeLinecap="round" />

        {/* Joint Flexion Angle */}
        <path d="M 220 235 A 22 22 0 0 1 195 265" stroke={VOLT} strokeWidth="0.75" fill="none" strokeDasharray="2 2" />
        <text x="210" y="270" fill={VOLT} fillOpacity="0.7" fontSize="7" fontFamily={FONT_BODY}>88° LUNGE</text>
      </g>
    </svg>
  );
}

/* ── Badminton Court Background Blueprint (Kinetic Athletic) ─────────── */
function CourtLines() {
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none select-none"
      viewBox="0 0 1200 800"
      preserveAspectRatio="xMidYMid slice"
      fill="none"
      aria-hidden="true"
    >
      <defs>
        {/* Subtle athletic net grid pattern */}
        <pattern id="kineticNetMesh" width="16" height="16" patternUnits="userSpaceOnUse">
          <path d="M 0 8 L 8 0 M 8 16 L 16 8 M 0 8 L 8 16 M 8 0 L 16 8" stroke={STEEL} strokeWidth="0.5" strokeOpacity="0.25" />
        </pattern>

        <linearGradient id="netVoltSteel" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={STEEL} stopOpacity="0.2" />
          <stop offset="40%" stopColor={VOLT} stopOpacity="0.85" />
          <stop offset="60%" stopColor={VOLT} stopOpacity="0.85" />
          <stop offset="100%" stopColor={STEEL} stopOpacity="0.2" />
        </linearGradient>
      </defs>

      {/* ── Net Mesh Subtle Pattern Zones ── */}
      <rect x="600" y="90" width="360" height="140" fill="url(#kineticNetMesh)" />
      <rect x="240" y="570" width="360" height="140" fill="url(#kineticNetMesh)" />

      {/* ── Outer Tramlines & Boundary Framing ── */}
      <rect x="120" y="70" width="960" height="660" stroke={STEEL} strokeWidth="0.75" strokeOpacity="0.2" />
      <rect x="140" y="90" width="920" height="620" stroke={STEEL} strokeWidth="1.75" strokeOpacity="0.35" />
      <rect x="144" y="94" width="912" height="612" stroke={VOLT} strokeWidth="0.5" strokeOpacity="0.3" />

      {/* ── Center Service Line ── */}
      <line x1="600" y1="90" x2="600" y2="710" stroke={STEEL} strokeWidth="1.25" strokeOpacity="0.3" />
      <line x1="600" y1="230" x2="600" y2="570" stroke={VOLT} strokeWidth="1" strokeOpacity="0.6" strokeDasharray="8 6" />

      {/* ── Center Net Line with High-Energy Volt Gradient Accent ── */}
      <line x1="100" y1="400" x2="1100" y2="400" stroke="url(#netVoltSteel)" strokeWidth="2.5" strokeDasharray="8 4" />
      <line x1="140" y1="396" x2="1060" y2="396" stroke={STEEL} strokeWidth="0.75" strokeOpacity="0.25" />
      <line x1="140" y1="404" x2="1060" y2="404" stroke={STEEL} strokeWidth="0.75" strokeOpacity="0.25" />

      {/* ── Short Service Lines (Front Court) ── */}
      <line x1="140" y1="230" x2="1060" y2="230" stroke={STEEL} strokeWidth="1.25" strokeOpacity="0.3" />
      <line x1="140" y1="570" x2="1060" y2="570" stroke={STEEL} strokeWidth="1.25" strokeOpacity="0.3" />
      <line x1="240" y1="230" x2="960" y2="230" stroke={VOLT} strokeWidth="1" strokeOpacity="0.5" strokeDasharray="4 4" />
      <line x1="240" y1="570" x2="960" y2="570" stroke={VOLT} strokeWidth="1" strokeOpacity="0.5" strokeDasharray="4 4" />

      {/* ── Singles Sidelines ── */}
      <line x1="240" y1="90" x2="240" y2="710" stroke={STEEL} strokeWidth="1.2" strokeOpacity="0.25" />
      <line x1="960" y1="90" x2="960" y2="710" stroke={STEEL} strokeWidth="1.2" strokeOpacity="0.25" />
      <line x1="236" y1="90" x2="236" y2="710" stroke={VOLT} strokeWidth="0.5" strokeOpacity="0.3" />
      <line x1="964" y1="90" x2="964" y2="710" stroke={VOLT} strokeWidth="0.5" strokeOpacity="0.3" />

      {/* ── Doubles Back Service Lines ── */}
      <line x1="140" y1="130" x2="1060" y2="130" stroke={STEEL} strokeWidth="0.8" strokeDasharray="6 6" strokeOpacity="0.25" />
      <line x1="140" y1="670" x2="1060" y2="670" stroke={STEEL} strokeWidth="0.8" strokeDasharray="6 6" strokeOpacity="0.25" />

      {/* ── Precision Athletic Registration Crosshairs ── */}
      <g stroke={VOLT} strokeWidth="1.2" strokeOpacity="0.9">
        <line x1="590" y1="400" x2="610" y2="400" />
        <line x1="600" y1="390" x2="600" y2="410" />
        <circle cx="600" cy="400" r="4.5" fill="none" strokeWidth="0.8" stroke={VOLT} strokeOpacity="0.8" />
      </g>
      <g stroke={STEEL} strokeWidth="1" strokeOpacity="0.75">
        <line x1="593" y1="230" x2="607" y2="230" /><line x1="600" y1="223" x2="600" y2="237" />
        <line x1="593" y1="570" x2="607" y2="570" /><line x1="600" y1="563" x2="600" y2="577" />
      </g>
      <g stroke={VOLT} strokeWidth="1" strokeOpacity="0.65">
        <line x1="132" y1="90" x2="148" y2="90" /><line x1="140" y1="82" x2="140" y2="98" />
        <line x1="1052" y1="90" x2="1068" y2="90" /><line x1="1060" y1="82" x2="1060" y2="98" />
        <line x1="132" y1="710" x2="148" y2="710" /><line x1="140" y1="702" x2="140" y2="718" />
        <line x1="1052" y1="710" x2="1068" y2="710" /><line x1="1060" y1="702" x2="1060" y2="718" />
      </g>

      {/* ── Corner Nodes in Volt ── */}
      <circle cx="140" cy="90" r="3" fill={VOLT} fillOpacity="0.9" />
      <circle cx="1060" cy="90" r="3" fill={VOLT} fillOpacity="0.9" />
      <circle cx="140" cy="710" r="3" fill={VOLT} fillOpacity="0.9" />
      <circle cx="1060" cy="710" r="3" fill={VOLT} fillOpacity="0.9" />

      {/* ── Technical Athletic Blueprint Dimension Labels ── */}
      <text
        x="150"
        y="82"
        fill={STEEL}
        fillOpacity="0.75"
        fontSize="8.5"
        fontFamily={FONT_BODY}
        letterSpacing="0.2em"
        fontWeight="600"
      >
        DIM: 13.40M × 6.10M [KINETIC SYS]
      </text>
      <text
        x="1050"
        y="82"
        textAnchor="end"
        fill={VOLT}
        fillOpacity="0.8"
        fontSize="8.5"
        fontFamily={FONT_BODY}
        letterSpacing="0.25em"
        fontWeight="600"
      >
        COURT 01 // PERFORMANCE TRACKING
      </text>
      <text
        x="150"
        y="392"
        fill={VOLT}
        fillOpacity="0.75"
        fontSize="8"
        fontFamily={FONT_BODY}
        letterSpacing="0.2em"
        fontWeight="600"
      >
        NET ELEVATION 1.55M
      </text>
      <text
        x="1050"
        y="392"
        textAnchor="end"
        fill={STEEL}
        fillOpacity="0.7"
        fontSize="8"
        fontFamily={FONT_BODY}
        letterSpacing="0.2em"
        fontWeight="600"
      >
        CENTER SERVICE VECTOR
      </text>
    </svg>
  );
}

/* ── Minimalist Geometric Shuttlecock Vector in Volt/White ────────────── */
function ShuttlecockIcon({ size = 28 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      className="overflow-visible"
      aria-hidden="true"
    >
      <path d="M 18 16 L 3 9" stroke={VOLT} strokeWidth="1.3" strokeLinecap="round" strokeOpacity="0.9" />
      <path d="M 19 16 L 2 13" stroke={PAPER} strokeWidth="1.3" strokeLinecap="round" strokeOpacity="0.95" />
      <path d="M 20 16 L 2 16" stroke={VOLT} strokeWidth="1.6" strokeLinecap="round" />
      <path d="M 19 16 L 2 19" stroke={PAPER} strokeWidth="1.3" strokeLinecap="round" strokeOpacity="0.95" />
      <path d="M 18 16 L 3 23" stroke={VOLT} strokeWidth="1.3" strokeLinecap="round" strokeOpacity="0.9" />

      <path d="M 9 11.5 Q 7.5 16 9 20.5" stroke={STEEL} strokeWidth="1.2" strokeLinecap="round" strokeOpacity="0.9" />
      <path d="M 14 13.5 Q 13 16 14 18.5" stroke={VOLT} strokeWidth="1.2" strokeLinecap="round" />

      <path
        d="M 20 13 C 23.5 13 26 14.2 26 16 C 26 17.8 23.5 19 20 19 Z"
        fill={VOLT}
        stroke={PAPER}
        strokeWidth="0.8"
      />
      <circle cx="21" cy="16" r="1.2" fill={CHARCOAL} />
    </svg>
  );
}

/* ── Hero-Scale Animated Shuttle Flight with Trailing Volt Arc ────────── */
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
        {/* Animated Main Smash Trajectory Trail in Volt Accent */}
        <path
          ref={pathRef}
          d={trajectoryD}
          stroke={VOLT}
          strokeWidth="2.25"
          strokeLinecap="round"
          strokeDasharray="8 4"
          className="transition-opacity duration-1000"
          style={{
            opacity: flightPhase === "settled" ? 0.6 : 0.95,
            filter: "drop-shadow(0 0 6px rgba(200, 255, 61, 0.4))",
          }}
        />

        {/* Multi-Scale Atmospheric Trajectory Arcs */}
        <path
          d="M -80 340 C 320 -20, 880 -10, 1260 240"
          stroke={VOLT}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeDasharray="6 6"
          strokeOpacity="0.3"
        />
        <path
          d="M 40 560 C 380 200, 880 160, 1180 420"
          stroke={STEEL}
          strokeWidth="1.35"
          strokeLinecap="round"
          strokeDasharray="5 7"
          strokeOpacity="0.4"
        />
        <path
          d="M -20 180 Q 220 380 160 680"
          stroke={STEEL}
          strokeWidth="1.25"
          strokeLinecap="round"
          strokeDasharray="6 4"
          strokeOpacity="0.35"
        />
        <path
          d="M 1240 500 Q 940 320 820 620"
          stroke={VOLT}
          strokeWidth="1"
          strokeLinecap="round"
          strokeDasharray="3 5"
          strokeOpacity="0.3"
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
          <ShuttlecockIcon size={28} />
        </div>
      </div>
    </div>
  );
}

/* ── Secondary Animated Trajectory Arc ───────────────────────────────── */
function AtmosphericArc({ d, delay = 0, className = "", strokeWidth = 1.5, opacity = 0.35, color = STEEL }) {
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
      width="460"
      height="240"
      viewBox="0 0 460 240"
      fill="none"
      aria-hidden="true"
    >
      <path
        ref={pathRef}
        d={d}
        stroke={color}
        strokeWidth={strokeWidth}
        strokeOpacity={opacity}
        strokeLinecap="round"
      />
    </svg>
  );
}

/* ── Animated Volt Accent Line Reveal ────────────────────────────────── */
function VoltAccentReveal() {
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
          background: `linear-gradient(90deg, transparent, ${VOLT})`,
          opacity: 0.85,
        }}
      />
      <div
        className="w-1.5 h-1.5 rotate-45 bg-[#C8FF3D] shadow-[0_0_8px_#C8FF3D]"
      />
      <div
        className="h-px w-14 sm:w-20"
        style={{
          background: `linear-gradient(90deg, ${VOLT}, transparent)`,
          opacity: 0.85,
        }}
      />
    </div>
  );
}

/* ── Magnetic Volt CTA Button ─────────────────────────────────────────── */
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
      <GhostButton onClick={onClick} className="!px-10 !py-4.5 text-sm font-bold">
        {children}
      </GhostButton>
    </div>
  );
}

/* ── Main GeometricHero Component ─────────────────────────────────────── */
export default function GeometricHero({ onOpenModal }) {
  const heroRef = useRef(null);
  const courtLayerRef = useRef(null);
  const playerLayerRef = useRef(null);
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

      // Layer 2: Player Silhouettes (medium shift with depth)
      if (playerLayerRef.current) {
        playerLayerRef.current.style.transform = `translate3d(${(cx * 18).toFixed(2)}px, ${(cy * 18).toFixed(2)}px, 0)`;
      }

      // Layer 3: Trajectory flight and arcs (distinct forward shift)
      if (midLayerRef.current) {
        midLayerRef.current.style.transform = `translate3d(${(cx * 34).toFixed(2)}px, ${(cy * 34).toFixed(2)}px, 0)`;
      }

      // Layer 4: Foreground typography & CTA (gentle foreground shift)
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
      className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#0B0F14] pt-24 pb-16 selection:bg-[#C8FF3D] selection:text-[#0B0F14]"
    >
      <style>{`
        @keyframes heroFadeUp {
          0% {
            opacity: 0;
            transform: translateY(22px);
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
        @keyframes smashSwingLoop {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(-4deg) translateY(-2px); }
        }
        @keyframes lungeFlexLoop {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(4px) scaleY(0.98); }
        }
        .smash-arm-motion {
          animation: smashSwingLoop 4.5s ease-in-out infinite;
          transform-origin: 165px 145px;
        }
        .lunge-reach-motion {
          animation: lungeFlexLoop 5s ease-in-out infinite;
          transform-origin: 200px 245px;
        }
      `}</style>

      {/* ── Background Kinetic Glow & Ambient Lighting ── */}
      <div
        className="absolute inset-0 pointer-events-none select-none"
        style={{
          background: `
            radial-gradient(ellipse 70% 55% at 50% 48%, rgba(200, 255, 61, 0.06) 0%, rgba(30, 136, 229, 0.03) 50%, transparent 80%),
            linear-gradient(135deg, rgba(30, 136, 229, 0.06) 0%, transparent 40%),
            linear-gradient(315deg, rgba(200, 255, 61, 0.04) 0%, transparent 40%)
          `,
        }}
        aria-hidden="true"
      />

      {/* ── Background Layer 1: Badminton Court Blueprint (Inverse Parallax) ── */}
      <div
        ref={courtLayerRef}
        className="absolute inset-0 pointer-events-none will-change-transform"
      >
        <CourtLines />
      </div>

      {/* ── Background Layer 2: Biomechanical Line-Art Player Silhouettes ── */}
      <div
        ref={playerLayerRef}
        className="absolute inset-0 pointer-events-none overflow-hidden will-change-transform"
      >
        {/* Player 1: Backcourt Jump Smash (Left, linked to trajectory origin) */}
        <SmashPlayerSilhouette className="-left-6 md:left-[3%] top-[14%] md:top-[16%]" />

        {/* Player 2: Forecourt Deep Defensive Lunge (Right, under net line) */}
        <LungePlayerSilhouette className="-right-8 md:right-[2%] bottom-[6%] md:bottom-[10%]" />
      </div>

      {/* ── Mid Layer: Hero Shuttle Flight & Trajectory Arcs (Positive Parallax) ── */}
      <div
        ref={midLayerRef}
        className="absolute inset-0 overflow-hidden pointer-events-none will-change-transform"
      >
        <HeroShuttleFlight />

        {/* Decorative Trajectory Arcs */}
        <AtmosphericArc
          d="M 10 200 Q 220 -30 440 170"
          delay={0.6}
          opacity={0.35}
          color={STEEL}
          className="left-[-4%] top-[10%] md:top-[14%]"
        />
        <AtmosphericArc
          d="M 440 20 Q 240 140 10 180"
          delay={0.8}
          opacity={0.3}
          color={VOLT}
          className="right-[-2%] bottom-[10%] md:bottom-[14%]"
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
            className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full"
            style={{
              background: "rgba(200, 255, 61, 0.08)",
              border: "1px solid rgba(200, 255, 61, 0.3)",
              boxShadow: "0 0 16px rgba(200, 255, 61, 0.15)",
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full inline-block bg-[#C8FF3D] shadow-[0_0_8px_#C8FF3D]"
            />
            <span
              className="text-xs uppercase tracking-[0.25em] font-semibold text-[#C8FF3D]"
              style={{
                fontFamily: FONT_BODY,
              }}
            >
              Mastery, by invitation.
            </span>
          </div>
        </div>

        {/* Step 2 & 3: Headline Staggered Reveal in High-Energy White & Volt */}
        <h1
          className="text-5xl sm:text-7xl md:text-8xl leading-[1.04] mb-3 tracking-tight"
          style={{
            fontFamily: FONT_HEADING,
            fontWeight: 900,
            letterSpacing: "-0.03em",
          }}
        >
          <span
            className="block text-white"
            style={{
              animation: "heroFadeUp 1s cubic-bezier(0.16, 1, 0.3, 1) 0.35s backwards",
            }}
          >
            Racquets Cult
          </span>
          <span
            className="block text-transparent bg-clip-text pb-1"
            style={{
              backgroundImage: `linear-gradient(90deg, #FFFFFF 0%, ${VOLT} 50%, #FFFFFF 100%)`,
              animation: "heroFadeUp 1s cubic-bezier(0.16, 1, 0.3, 1) 0.55s backwards",
            }}
          >
            Private Coaching
          </span>
        </h1>

        {/* Step 4: Animated Volt Accent Line Reveal */}
        <VoltAccentReveal />

        {/* Step 5: Subtext Reveal in Crisp Light Gray */}
        <p
          className="text-base sm:text-lg mb-10 max-w-xl mx-auto font-normal"
          style={{
            fontFamily: FONT_BODY,
            lineHeight: 1.8,
            color: MUTED_DARK,
            animation: "heroFadeUp 1s cubic-bezier(0.16, 1, 0.3, 1) 0.95s backwards",
          }}
        >
          Rc's is a private badminton coaching practice for players who
          train in silence and win in public.
        </p>

        {/* Step 6: Magnetic Volt CTA Button Reveal */}
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

      {/* Bottom Subtle Gradient Transition to Next Section */}
      <div
        className="absolute inset-x-0 bottom-0 h-28 pointer-events-none select-none"
        style={{
          background: "linear-gradient(to top, #0B0F14, rgba(11, 15, 20, 0))",
        }}
        aria-hidden="true"
      />
    </section>
  );
}
