"use client";

import { Theme, ToggleProps } from "@/types/authTypes";
import { useState, useEffect, useRef, CSSProperties, MouseEvent } from "react";
import GoogleButton from "./GoogleButton";
import Divider from "./Devider";

type Page = "login" | "signup";
type FieldName = "email" | "pass" | "name" | "confirmPass";

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

function CelestialToggle({ isDark, onToggle, t }: ToggleProps) {
  return (
    <button
      onClick={onToggle}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      style={{
        position: "relative",
        width: 72,
        height: 36,
        borderRadius: 999,
        border: "none",
        cursor: "pointer",
        background: t.toggleBg,
        boxShadow: isDark
          ? "inset 0 2px 8px rgba(0,0,0,0.5)"
          : "inset 0 2px 8px rgba(0,0,0,0.08)",
        transition: "background 0.5s ease, box-shadow 0.5s ease",
        outline: "none",
        flexShrink: 0,
      }}
    >
      <span
        style={{
          position: "absolute",
          top: 3,
          left: isDark ? 3 : 36,
          width: 30,
          height: 30,
          borderRadius: "50%",
          background: isDark ? "#e0dcd0" : "#f9b233",
          boxShadow: isDark
            ? "inset -4px -2px 0 0 #b0aca0"
            : "0 0 14px 4px rgba(249,178,51,0.45)",
          transition:
            "left 0.45s cubic-bezier(.68,-0.3,.32,1.3), background 0.5s, box-shadow 0.5s",
        }}
      >
        {!isDark && (
          <span
            style={{
              position: "absolute",
              inset: -6,
              borderRadius: "50%",
              border: "2px dashed rgba(249,178,51,0.35)",
              animation: "spin 12s linear infinite",
            }}
          />
        )}
      </span>
    </button>
  );
}

export default function SignInSignUpPage() {
  const [isDark, setIsDark] = useState<boolean>(true);
  const [page, setPage] = useState<Page>("login");
  const [animating, setAnimating] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);

  const [loginEmail, setLoginEmail] = useState<string>("");
  const [loginPass, setLoginPass] = useState<string>("");
  const [showLoginPass, setShowLoginPass] = useState<boolean>(false);

  const [signupName, setSignupName] = useState<string>("");
  const [signupEmail, setSignupEmail] = useState<string>("");
  const [signupPass, setSignupPass] = useState<string>("");
  const [signupConfirm, setSignupConfirm] = useState<string>("");
  const [showSignupPass, setShowSignupPass] = useState<boolean>(false);

  const [focusField, setFocusField] = useState<FieldName | null>(null);

  useEffect(() => {
    const id = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(id);
  }, []);

  const t: Theme = isDark ? THEMES.dark : THEMES.light;

  const switchPage = (to: Page): void => {
    setAnimating(true);
    setTimeout(() => {
      setPage(to);
      setTimeout(() => setAnimating(false), 30);
    }, 280);
  };

  const inputStyle = (field: FieldName): CSSProperties => ({
    width: "100%",
    padding: "14px 16px",
    fontSize: 15,
    fontFamily: "'DM Sans', sans-serif",
    color: t.text,
    background: t.inputBg,
    border: `1.5px solid ${focusField === field ? t.inputFocus : t.inputBorder}`,
    borderRadius: 10,
    outline: "none",
    transition: "border 0.3s, background 0.3s, box-shadow 0.3s",
    boxShadow: focusField === field ? `0 0 0 3px ${t.accentGlow}` : "none",
    boxSizing: "border-box",
  });

  const labelStyle: CSSProperties = {
    fontSize: 12,
    fontWeight: 600,
    letterSpacing: "0.06em",
    textTransform: "uppercase",
    color: t.textMuted,
    marginBottom: 6,
    display: "block",
    fontFamily: "'DM Sans', sans-serif",
    transition: "color 0.4s",
  };

  const linkStyle: CSSProperties = {
    color: t.accent,
    fontWeight: 600,
    textDecoration: "none",
    cursor: "pointer",
    transition: "color 0.3s",
  };

  const submitBtnStyle: CSSProperties = {
    width: "100%",
    padding: "15px 0",
    borderRadius: 12,
    border: "none",
    background: t.buttonBg,
    color: t.buttonText,
    fontSize: 15,
    fontWeight: 600,
    fontFamily: "'DM Sans', sans-serif",
    cursor: "pointer",
    transition: "transform 0.2s, box-shadow 0.3s, background 0.4s",
    boxShadow: `0 4px 20px ${t.accentGlow}`,
  };

  const onBtnEnter = (e: MouseEvent<HTMLButtonElement>): void => {
    e.currentTarget.style.transform = "translateY(-1px)";
    e.currentTarget.style.boxShadow = `0 8px 30px ${t.accentGlow}`;
  };
  const onBtnLeave = (e: MouseEvent<HTMLButtonElement>): void => {
    e.currentTarget.style.transform = "translateY(0)";
    e.currentTarget.style.boxShadow = `0 4px 20px ${t.accentGlow}`;
  };

  const showToggleStyle: CSSProperties = {
    position: "absolute",
    right: 12,
    top: "50%",
    transform: "translateY(-50%)",
    background: "none",
    border: "none",
    cursor: "pointer",
    color: t.textMuted,
    fontSize: 13,
    fontFamily: "'DM Sans', sans-serif",
    fontWeight: 500,
    padding: "4px 6px",
    transition: "color 0.3s",
  };

  const cardContentStyle: CSSProperties = {
    opacity: animating ? 0 : 1,
    transform: animating ? "translateY(12px)" : "translateY(0)",
    transition: "opacity 0.28s ease, transform 0.28s ease",
  };

  const loginContent = (
    <div style={cardContentStyle}>
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
            Welcome back
          </h1>
          <p
            style={{
              margin: "6px 0 0",
              fontSize: 14,
              color: t.textMuted,
              transition: "color 0.4s",
            }}
          >
            Sign in to continue
          </p>
        </div>
        <CelestialToggle
          isDark={isDark}
          onToggle={() => setIsDark(!isDark)}
          t={t}
        />
      </div>

      <GoogleButton t={t} />
      <Divider t={t} />

      <div style={{ marginBottom: 18 }}>
        <label style={labelStyle}>Email</label>
        <input
          type="email"
          placeholder="you@example.com"
          value={loginEmail}
          onChange={e => setLoginEmail(e.target.value)}
          onFocus={() => setFocusField("email")}
          onBlur={() => setFocusField(null)}
          style={inputStyle("email")}
        />
      </div>

      <div style={{ marginBottom: 10 }}>
        <label style={labelStyle}>Password</label>
        <div style={{ position: "relative" }}>
          <input
            type={showLoginPass ? "text" : "password"}
            placeholder="••••••••"
            value={loginPass}
            onChange={e => setLoginPass(e.target.value)}
            onFocus={() => setFocusField("pass")}
            onBlur={() => setFocusField(null)}
            style={inputStyle("pass")}
          />
          <button
            type="button"
            onClick={() => setShowLoginPass(!showLoginPass)}
            style={showToggleStyle}
          >
            {showLoginPass ? "Hide" : "Show"}
          </button>
        </div>
      </div>

      <div style={{ textAlign: "right" as const, marginBottom: 24 }}>
        <a
          href="#"
          onClick={e => e.preventDefault()}
          style={{
            fontSize: 12,
            color: t.accent,
            textDecoration: "none",
            fontWeight: 500,
            transition: "color 0.3s",
          }}
        >
          Forgot password?
        </a>
      </div>

      <button
        style={submitBtnStyle}
        onMouseEnter={onBtnEnter}
        onMouseLeave={onBtnLeave}
      >
        Sign In
      </button>

      <p
        style={{
          textAlign: "center" as const,
          marginTop: 22,
          fontSize: 13,
          color: t.textMuted,
          transition: "color 0.4s",
        }}
      >
        Don't have an account?{" "}
        <a
          href="#"
          onClick={e => {
            e.preventDefault();
            switchPage("signup");
          }}
          style={linkStyle}
        >
          Sign up
        </a>
      </p>
    </div>
  );

  const signupContent = (
    <div style={cardContentStyle}>
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
            Create account
          </h1>
          <p
            style={{
              margin: "6px 0 0",
              fontSize: 14,
              color: t.textMuted,
              transition: "color 0.4s",
            }}
          >
            Join us today
          </p>
        </div>
        <CelestialToggle
          isDark={isDark}
          onToggle={() => setIsDark(!isDark)}
          t={t}
        />
      </div>

      <GoogleButton t={t} />
      <Divider t={t} />

      <div style={{ marginBottom: 18 }}>
        <label style={labelStyle}>Full Name</label>
        <input
          type="text"
          placeholder="Jane Doe"
          value={signupName}
          onChange={e => setSignupName(e.target.value)}
          onFocus={() => setFocusField("name")}
          onBlur={() => setFocusField(null)}
          style={inputStyle("name")}
        />
      </div>

      <div style={{ marginBottom: 18 }}>
        <label style={labelStyle}>Email</label>
        <input
          type="email"
          placeholder="you@example.com"
          value={signupEmail}
          onChange={e => setSignupEmail(e.target.value)}
          onFocus={() => setFocusField("email")}
          onBlur={() => setFocusField(null)}
          style={inputStyle("email")}
        />
      </div>

      <div style={{ marginBottom: 18 }}>
        <label style={labelStyle}>Password</label>
        <div style={{ position: "relative" }}>
          <input
            type={showSignupPass ? "text" : "password"}
            placeholder="••••••••"
            value={signupPass}
            onChange={e => setSignupPass(e.target.value)}
            onFocus={() => setFocusField("pass")}
            onBlur={() => setFocusField(null)}
            style={inputStyle("pass")}
          />
          <button
            type="button"
            onClick={() => setShowSignupPass(!showSignupPass)}
            style={showToggleStyle}
          >
            {showSignupPass ? "Hide" : "Show"}
          </button>
        </div>
      </div>

      <div style={{ marginBottom: 24 }}>
        <label style={labelStyle}>Confirm Password</label>
        <input
          type="password"
          placeholder="••••••••"
          value={signupConfirm}
          onChange={e => setSignupConfirm(e.target.value)}
          onFocus={() => setFocusField("confirmPass")}
          onBlur={() => setFocusField(null)}
          style={inputStyle("confirmPass")}
        />
      </div>

      <button
        style={submitBtnStyle}
        onMouseEnter={onBtnEnter}
        onMouseLeave={onBtnLeave}
      >
        Create Account
      </button>

      <p
        style={{
          textAlign: "center" as const,
          marginTop: 22,
          fontSize: 13,
          color: t.textMuted,
          transition: "color 0.4s",
        }}
      >
        Already have an account?{" "}
        <a
          href="#"
          onClick={e => {
            e.preventDefault();
            switchPage("login");
          }}
          style={linkStyle}
        >
          Sign in
        </a>
      </p>
    </div>
  );

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
          background: isDark
            ? "radial-gradient(circle, rgba(201,162,39,0.08) 0%, transparent 70%)"
            : "radial-gradient(circle, rgba(212,116,14,0.10) 0%, transparent 70%)",
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
        {page === "login" ? loginContent : signupContent}
      </div>
    </div>
  );
}
