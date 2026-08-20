/* ────────────────────────────────────────────────────────────────────── */
/* Shared UI primitives — FadeIn, GhostButton, Mark, Field               */
/* Kinetic Athletic Redesign — Charcoal, Volt Green, Steel Blue          */
/* ────────────────────────────────────────────────────────────────────── */

import React, { useEffect, useRef, useState } from "react";
import { FONT_HEADING, FONT_BODY, CHARCOAL, PAPER, MUTED_DARK, VOLT, STEEL } from "../lib/tokens.js";

/* ── useInView ───────────────────────────────────────────────────────── */
export function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(el);
        }
      },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return [ref, inView];
}

/* ── FadeIn — energetic entrance with subtle slide/scale support ────── */
export function FadeIn({ children, delay = 0, className = "", direction = "up" }) {
  const [ref, inView] = useInView();
  
  const getTransform = () => {
    if (inView) return "translate3d(0, 0, 0) scale(1)";
    if (direction === "up") return "translate3d(0, 24px, 0) scale(0.98)";
    if (direction === "left") return "translate3d(-24px, 0, 0) scale(0.98)";
    if (direction === "right") return "translate3d(24px, 0, 0) scale(0.98)";
    return "translate3d(0, 0, 0) scale(0.96)";
  };

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: inView ? 1 : 0,
        transform: getTransform(),
        transition: `opacity 800ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform 800ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
        willChange: "opacity, transform",
      }}
    >
      {children}
    </div>
  );
}

/* ── Ghost button — transparent background, 1px border, wide tracking ─ */
/* Kinetic Athletic Volt hover effect with crisp neon highlight */
export function GhostButton({ children, onClick, className = "", dark = false, disabled = false, variant = "volt" }) {
  const baseClass = variant === "steel"
    ? "border-[#1E88E5]/50 text-[#FFFFFF] hover:border-[#1E88E5] hover:text-[#1E88E5] hover:shadow-[0_0_20px_rgba(30,136,229,0.3)] hover:bg-[#1E88E5]/10"
    : "border-[#C8FF3D] text-[#C8FF3D] hover:border-[#C8FF3D] hover:bg-[#C8FF3D] hover:text-[#0B0F14] hover:shadow-[0_0_25px_rgba(200,255,61,0.4)]";

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center gap-3 px-8 py-4 text-xs uppercase tracking-[0.25em] font-semibold transition-all duration-300 border bg-transparent ${baseClass} ${disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer active:scale-95"} ${className}`}
      style={{
        fontFamily: FONT_BODY,
      }}
    >
      {children}
    </button>
  );
}

/* ── Monogram — bold athletic brand mark ────────────────────────────── */
export function Mark({ dark = true }) {
  return (
    <div className="flex items-center gap-1.5 group cursor-pointer">
      <span
        style={{
          fontFamily: FONT_HEADING,
          fontWeight: 900,
          letterSpacing: "-0.04em",
          color: PAPER,
        }}
        className="text-xl uppercase tracking-tighter"
      >
        Rc's
      </span>
      <span className="w-1.5 h-1.5 bg-[#C8FF3D] rounded-full shadow-[0_0_8px_#C8FF3D]" />
    </div>
  );
}

/* ── Field — labelled input with athletic focus states ──────────────── */
export function Field({ id, label, type, placeholder, required, value, onChange, error }) {
  const errorId = id ? `${id}-error` : undefined;
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-[11px] uppercase tracking-[0.2em] mb-2 font-medium"
        style={{ fontFamily: FONT_BODY, color: MUTED_DARK }}
      >
        {label}
      </label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={!!error}
        aria-describedby={error && errorId ? errorId : undefined}
        className="w-full bg-[#131922] text-sm text-white px-4 py-3 rounded-none focus:outline-none transition-all duration-200 placeholder:text-gray-600"
        style={{
          fontFamily: FONT_BODY,
          border: `1px solid ${error ? "#FF4B4B" : "rgba(255, 255, 255, 0.12)"}`,
        }}
        onFocus={(e) => {
          if (!error) e.target.style.borderColor = VOLT;
          e.target.style.boxShadow = `0 0 12px ${VOLT}33`;
        }}
        onBlur={(e) => {
          if (!error) e.target.style.borderColor = "rgba(255, 255, 255, 0.12)";
          e.target.style.boxShadow = "none";
        }}
      />
      {error && (
        <p id={errorId} className="text-[11px] mt-1.5 font-medium" style={{ fontFamily: FONT_BODY, color: "#FF4B4B" }}>
          {error}
        </p>
      )}
    </div>
  );
}
