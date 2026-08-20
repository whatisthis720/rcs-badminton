/* ────────────────────────────────────────────────────────────────────── */
/* Shared UI primitives — FadeIn, GhostButton, Mark, Field               */
/* ────────────────────────────────────────────────────────────────────── */

import React, { useEffect, useRef, useState } from "react";
import { FONT_HEADING, FONT_BODY, INK, PAPER, MUTED, ACCENT } from "../lib/tokens.js";

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

/* ── FadeIn — pure opacity, 1.2s, no translate/slide/bounce ──────── */
export function FadeIn({ children, delay = 0, className = "" }) {
  const [ref, inView] = useInView();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: inView ? 1 : 0,
        transition: `opacity 1200ms ease-out ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

/* ── Ghost button — transparent, 1px border, uppercase, wide tracking */
/* Gold appears only on hover, as an outline/text shift — never a fill */
export function GhostButton({ children, onClick, className = "", dark = false, disabled = false }) {
  const baseClass = dark ? "border-white text-white" : "border-[#0A0A0A] text-[#0A0A0A]";
  const hoverClass = disabled ? "" : "hover:border-[#C5A059] hover:text-[#C5A059]";
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center gap-3 px-9 py-4 text-xs uppercase tracking-[0.25em] transition-colors duration-300 border bg-transparent ${baseClass} ${hoverClass} ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${className}`}
      style={{
        fontFamily: FONT_BODY,
        fontWeight: 500,
      }}
    >
      {children}
    </button>
  );
}

/* ── Monogram — serif only, per the two-font constraint ────────────── */
export function Mark({ dark = false }) {
  const color = dark ? PAPER : INK;
  return (
    <span
      style={{
        fontFamily: FONT_HEADING,
        fontWeight: 700,
        letterSpacing: "-0.02em",
        color,
      }}
      className="text-lg"
    >
      Rc's
    </span>
  );
}

/* ── Field — labelled input with error state ─────────────────────── */
export function Field({ id, label, type, placeholder, required, value, onChange, error }) {
  const errorId = id ? `${id}-error` : undefined;
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-[11px] uppercase tracking-[0.2em] mb-2"
        style={{ fontFamily: FONT_BODY, color: MUTED }}
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
        className="w-full bg-transparent text-base py-2 focus:outline-none"
        style={{ fontFamily: FONT_BODY, color: INK, borderBottom: `1px solid ${error ? "#B3413E" : INK}` }}
      />
      {error && (
        <p id={errorId} className="text-[11px] mt-1.5" style={{ fontFamily: FONT_BODY, color: "#B3413E" }}>
          {error}
        </p>
      )}
    </div>
  );
}
