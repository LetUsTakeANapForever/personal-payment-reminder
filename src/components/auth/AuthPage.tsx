"use client";

import { Theme } from "@/types/authTypes";
import { useState, useEffect, useRef, CSSProperties } from "react";
import GoogleButton from "./GoogleButton";

interface StarData {
  x: number;
  y: number;
  s: number;
  d: number;
}

const THEMES: Record<"dark" | "light", Theme> = {
  dark: {
    bg: "#0b0e1a",
    surface: "rgba(255,255,255,0.04)",
    surfaceBorder: "rgba(255,255,255,0.08)",
    text: "#e8e6e1",
    textMuted: "#7a7872",
    accent: "#c9a227",
    accentGlow: "rgba(201,162,39,0.25)",
    inputBg: "rgba(255,255,255,0.05)",
    inputBorder: "rgba(255,255,255,0.1)",
    inputFocus: "rgba(201,162,39,0.4)",
    buttonBg: "#c9a227",
    buttonText: "#0b0e1a",
    toggleBg: "#1a1e30",
    shadow: "0 24px 80px rgba(0,0,0,0.6)",
    starOpacity: 1,
  },
  light: {
    bg: "#f5efe6",
    surface: "rgba(255,255,255,0.7)",
    surfaceBorder: "rgba(0,0,0,0.06)",
    text: "#2a2520",
    textMuted: "#8a8278",
    accent: "#d4740e",
    accentGlow: "rgba(212,116,14,0.2)",
    inputBg: "rgba(255,255,255,0.8)",
    inputBorder: "rgba(0,0,0,0.1)",
    inputFocus: "rgba(212,116,14,0.35)",
    buttonBg: "#d4740e",
    buttonText: "#fff",
    toggleBg: "#e8dfd2",
    shadow: "0 24px 80px rgba(0,0,0,0.08)",
    starOpacity: 0,
  },
};

function Stars({ opacity }: { opacity: number }) {
  const stars = useRef<StarData[]>(
    Array.from({ length: 60 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      s: Math.random() * 2 + 0.5,
      d: Math.random() * 4 + 2,
    })),
  ).current;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        opacity,
        transition: "opacity 0.8s ease",
      }}
    >
      {stars.map((st, i) => (
        <span
          key={i}
          style={{
            position: "absolute",
            left: `${st.x}%`,
            top: `${st.y}%`,
            width: st.s,
            height: st.s,
            borderRadius: "50%",
            background: "#fff",
            animation: `twinkle ${st.d}s ease-in-out infinite alternate`,
          }}
        />
      ))}
    </div>
  );
}

export default function SignInPage() {
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    const id = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(id);
  }, []);

  const t: Theme = THEMES.dark;

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: t.bg,
        transition: "background 0.6s ease",
        fontFamily: "'DM Sans', sans-serif",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <link
        href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;700&family=DM+Sans:wght@400;500;600&display=swap"
        rel="stylesheet"
      />
      <style>{`
        @keyframes twinkle {
          0% { opacity: 0.2; }
          100% { opacity: 1; }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes floatUp {
          from { opacity: 0; transform: translateY(32px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        ::placeholder { color: ${t.textMuted}; opacity: 0.6; }
        input:-webkit-autofill {
          -webkit-box-shadow: 0 0 0 40px ${t.inputBg} inset !important;
          -webkit-text-fill-color: ${t.text} !important;
        }
      `}</style>

      <Stars opacity={t.starOpacity} />

      <div
        style={{
          position: "fixed",
          width: 500,
          height: 500,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(201,162,39,0.08) 0%, transparent 70%)",
          top: "10%",
          right: "-8%",
          pointerEvents: "none",
          transition: "background 0.6s",
        }}
      />

      <div
        style={{
          width: 420,
          maxWidth: "90vw",
          background: t.surface,
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          border: `1px solid ${t.surfaceBorder}`,
          borderRadius: 20,
          padding: "44px 36px 36px",
          boxShadow: t.shadow,
          position: "relative",
          zIndex: 2,
          transition: "background 0.5s, border 0.5s, box-shadow 0.5s",
          animation: mounted ? "floatUp 0.7s ease-out both" : "none",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 32,
          }}
        >
          <div>
            <h1
              style={{
                margin: 0,
                fontFamily: "'Playfair Display', serif",
                fontWeight: 700,
                fontSize: 28,
                color: t.text,
                transition: "color 0.4s",
                lineHeight: 1.2,
              }}
            >
              Welcome
            </h1>
            <p
              style={{
                margin: "6px 0 0",
                fontSize: 14,
                color: t.textMuted,
                transition: "color 0.4s",
              }}
            >
              Sign in with Google
            </p>
          </div>
        </div>

        <GoogleButton t={t} />
      </div>
    </div>
  );
}
