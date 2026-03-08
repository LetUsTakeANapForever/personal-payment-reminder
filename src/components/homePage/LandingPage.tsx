"use client";

import { useState, useEffect, useRef } from "react";
import AnimatedNumber from "./AnimatedNumber";

const DiscordIcon = ({
  size = 24,
  color = "currentColor",
}: {
  size?: number;
  color?: string;
}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
  </svg>
);

const BellIcon = ({ size = 24 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);

const CheckIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#3cf08a"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const ArrowRight = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

const ZapIcon = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);

const CalendarIcon = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const ShieldIcon = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const RepeatIcon = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="17 1 21 5 17 9" />
    <path d="M3 11V9a4 4 0 0 1 4-4h14" />
    <polyline points="7 23 3 19 7 15" />
    <path d="M21 13v2a4 4 0 0 1-4 4H3" />
  </svg>
);

const C = {
  bg: "#0c0d10",
  bgCard: "#141519",
  bgCardHover: "#1a1b21",
  border: "rgba(255,255,255,0.06)",
  borderHover: "rgba(255,255,255,0.12)",
  text: "#eae8e3",
  muted: "#6b6a66",
  blurple: "#5865F2",
  blurpleGlow: "rgba(88,101,242,0.3)",
  blurpleSoft: "rgba(88,101,242,0.12)",
  green: "#3cf08a",
  greenGlow: "rgba(60,240,138,0.2)",
  greenSoft: "rgba(60,240,138,0.08)",
};

const chatMessages = [
  {
    who: "bot",
    text: "Hey! Your Netflix subscription ($15.99) is due tomorrow.",
  },
  { who: "user", text: "/remind me 3 hours before" },
  { who: "bot", text: "Done! I'll ping you at 9:00 PM tonight." },
  {
    who: "bot",
    text: "Heads up — you have 3 more bills coming this week. Type /list to see them all.",
  },
];

export default function LandingPage() {
  const [mounted, setMounted] = useState(false);
  const [visibleMsgs, setVisibleMsgs] = useState(0);

  useEffect(() => {
    setMounted(true);
    const timers: ReturnType<typeof setTimeout>[] = [];
    chatMessages.forEach((_, i) => {
      timers.push(setTimeout(() => setVisibleMsgs(i + 1), 600 + i * 900));
    });
    return () => timers.forEach(clearTimeout);
  }, []);

  const sectionStyle = (delay: number): React.CSSProperties => ({
    opacity: mounted ? 1 : 0,
    transform: mounted ? "translateY(0)" : "translateY(40px)",
    transition: `opacity 0.8s ease ${delay}s, transform 0.8s ease ${delay}s`,
  });

  return (
    <div
      style={{
        background: C.bg,
        color: C.text,
        minHeight: "100vh",
        overflowX: "hidden",
      }}
    >
      <link
        href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap"
        rel="stylesheet"
      />

      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { background: ${C.bg}; }
        ::selection { background: ${C.blurple}; color: white; }
        @keyframes pulse-ring {
          0% { transform: scale(1); opacity: 0.4; }
          100% { transform: scale(1.8); opacity: 0; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        @keyframes typing {
          0%, 80% { opacity: 0.3; }
          40% { opacity: 1; }
        }
        @keyframes grain {
          0%, 100% { transform: translate(0,0); }
          10% { transform: translate(-5%,-10%); }
          30% { transform: translate(3%,-15%); }
          50% { transform: translate(12%,9%); }
          70% { transform: translate(9%,4%); }
          90% { transform: translate(-1%,7%); }
        }
      `}</style>

      <div
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          zIndex: 0,
          opacity: 0.03,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          animation: "grain 8s steps(10) infinite",
        }}
      />

      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          padding: "16px 40px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "rgba(12,13,16,0.8)",
          backdropFilter: "blur(16px)",
          borderBottom: `1px solid ${C.border}`,
          fontFamily: "'Outfit', sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 10,
              background: `linear-gradient(135deg, ${C.blurple}, #7b6cf6)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <BellIcon size={18} />
          </div>
          <span
            style={{ fontSize: 20, fontWeight: 700, letterSpacing: "-0.02em" }}
          >
            PayPing
          </span>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 32,
            fontSize: 14,
            fontWeight: 500,
            color: C.muted,
          }}
        >
          {["Features", "How it works", "Pricing"].map(item => (
            <a
              key={item}
              href={`#${item.toLowerCase().replace(/ /g, "-")}`}
              style={{
                color: "inherit",
                textDecoration: "none",
                transition: "color 0.2s",
              }}
              onMouseEnter={e => (e.currentTarget.style.color = C.text)}
              onMouseLeave={e => (e.currentTarget.style.color = C.muted)}
            >
              {item}
            </a>
          ))}
          <a
            href="/discord-server-integration"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "9px 20px",
              borderRadius: 10,
              background: C.blurple,
              color: "#fff",
              fontSize: 14,
              fontWeight: 600,
              textDecoration: "none",
              transition: "transform 0.2s, box-shadow 0.2s",
              boxShadow: `0 4px 20px ${C.blurpleGlow}`,
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = "translateY(-1px)";
              e.currentTarget.style.boxShadow = `0 8px 30px ${C.blurpleGlow}`;
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = `0 4px 20px ${C.blurpleGlow}`;
            }}
          >
            <DiscordIcon size={16} color="#fff" /> Add to Discord
          </a>
        </div>
      </nav>

      <section
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "120px 40px 80px",
          position: "relative",
          fontFamily: "'Outfit', sans-serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            width: 600,
            height: 600,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${C.blurpleGlow} 0%, transparent 70%)`,
            top: "5%",
            left: "10%",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            width: 400,
            height: 400,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${C.greenGlow} 0%, transparent 70%)`,
            bottom: "10%",
            right: "5%",
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            maxWidth: 1200,
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: 80,
            position: "relative",
            zIndex: 2,
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <div
            style={{ flex: "1 1 480px", maxWidth: 560, ...sectionStyle(0.1) }}
          >
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "6px 14px",
                borderRadius: 999,
                background: C.blurpleSoft,
                color: C.blurple,
                fontSize: 13,
                fontWeight: 600,
                marginBottom: 24,
                border: `1px solid rgba(88,101,242,0.2)`,
              }}
            >
              <DiscordIcon size={14} color={C.blurple} /> Discord-native bot
            </div>

            <h1
              style={{
                fontSize: "clamp(40px, 5vw, 64px)",
                fontWeight: 800,
                lineHeight: 1.08,
                letterSpacing: "-0.03em",
                marginBottom: 24,
              }}
            >
              Never miss a<br />
              <span style={{ color: C.blurple }}>payment</span> again
            </h1>

            <p
              style={{
                fontSize: 18,
                lineHeight: 1.7,
                color: C.muted,
                marginBottom: 36,
                maxWidth: 460,
              }}
            >
              PayPing lives in your Discord server and reminds you before every
              bill, subscription, and payment — so late fees become a thing of
              the past.
            </p>

            <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
              <a
                href="/discord-server-integration"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "14px 28px",
                  borderRadius: 12,
                  background: C.blurple,
                  color: "#fff",
                  fontSize: 16,
                  fontWeight: 600,
                  textDecoration: "none",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  boxShadow: `0 4px 24px ${C.blurpleGlow}`,
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <DiscordIcon size={20} color="#fff" /> Add to Discord — Free
              </a>
              <a
                href="#how-it-works"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "14px 24px",
                  borderRadius: 12,
                  background: "transparent",
                  color: C.text,
                  fontSize: 16,
                  fontWeight: 500,
                  textDecoration: "none",
                  border: `1.5px solid ${C.border}`,
                  transition: "border-color 0.3s",
                }}
                onMouseEnter={e =>
                  (e.currentTarget.style.borderColor = C.borderHover)
                }
                onMouseLeave={e =>
                  (e.currentTarget.style.borderColor = C.border)
                }
              >
                See how it works <ArrowRight />
              </a>
            </div>

            {/* social proof */}
            <div
              style={{
                display: "flex",
                gap: 32,
                marginTop: 48,
                flexWrap: "wrap",
              }}
            >
              {[{ val: 1, suffix: "+", label: "Active servers" }].map(s => (
                <div key={s.label}>
                  <div
                    style={{
                      fontSize: 28,
                      fontWeight: 700,
                      color: C.green,
                      fontFamily: "'JetBrains Mono', monospace",
                    }}
                  >
                    {s.label === "Avg. saved/year" && "$"}
                    <AnimatedNumber target={s.val} suffix={s.suffix} />
                  </div>
                  <div style={{ fontSize: 13, color: C.muted, marginTop: 4 }}>
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div
            style={{
              flex: "1 1 400px",
              maxWidth: 440,
              background: "#1e1f23",
              borderRadius: 16,
              border: "1px solid rgba(255,255,255,0.06)",
              overflow: "hidden",
              boxShadow: `0 40px 100px rgba(0,0,0,0.5), 0 0 60px ${C.blurpleGlow}`,
              animation: "float 6s ease-in-out infinite",
              ...sectionStyle(0.4),
            }}
          >
            {/* title bar */}
            <div
              style={{
                padding: "12px 16px",
                display: "flex",
                alignItems: "center",
                gap: 10,
                borderBottom: "1px solid rgba(255,255,255,0.06)",
                background: "#2b2d31",
              }}
            >
              <span style={{ color: C.muted, fontSize: 18 }}>#</span>
              <span style={{ fontSize: 14, fontWeight: 600, color: C.text }}>
                payment-reminders
              </span>
            </div>

            <div
              style={{
                padding: 16,
                display: "flex",
                flexDirection: "column",
                gap: 14,
                minHeight: 260,
              }}
            >
              {chatMessages.slice(0, visibleMsgs).map((msg, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    gap: 10,
                    alignItems: "flex-start",
                    opacity: 1,
                    animation: "cel-fade-in 0.4s ease both",
                  }}
                >
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      flexShrink: 0,
                      background:
                        msg.who === "bot"
                          ? `linear-gradient(135deg, ${C.blurple}, #7b6cf6)`
                          : "linear-gradient(135deg, #3a3c42, #4e5058)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 14,
                    }}
                  >
                    {msg.who === "bot" ? <BellIcon size={14} /> : "👤"}
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        color: msg.who === "bot" ? C.blurple : "#b5b3ae",
                        marginBottom: 3,
                      }}
                    >
                      {msg.who === "bot" ? "PayPing" : "you"}
                      <span
                        style={{
                          fontWeight: 400,
                          color: C.muted,
                          marginLeft: 8,
                          fontSize: 11,
                        }}
                      >
                        Today at 8:57 PM
                      </span>
                    </div>
                    <div
                      style={{
                        fontSize: 14,
                        lineHeight: 1.55,
                        color: "#dcddde",
                        fontFamily: "'Outfit', sans-serif",
                      }}
                    >
                      {msg.text}
                    </div>
                  </div>
                </div>
              ))}

              {/* typing indicator */}
              {visibleMsgs < chatMessages.length && (
                <div
                  style={{
                    display: "flex",
                    gap: 4,
                    paddingLeft: 42,
                    paddingTop: 4,
                  }}
                >
                  {[0, 1, 2].map(d => (
                    <span
                      key={d}
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        background: C.muted,
                        animation: `typing 1.2s ease-in-out ${d * 0.2}s infinite`,
                      }}
                    />
                  ))}
                </div>
              )}
            </div>

            <div
              style={{
                padding: "12px 16px",
                borderTop: "1px solid rgba(255,255,255,0.06)",
                background: "#383a40",
                borderRadius: "0 0 16px 16px",
              }}
            >
              <div
                style={{
                  padding: "10px 14px",
                  borderRadius: 8,
                  background: "#40444b",
                  color: C.muted,
                  fontSize: 14,
                  fontFamily: "'Outfit', sans-serif",
                }}
              >
                Message #payment-reminders
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="features"
        style={{
          padding: "100px 40px",
          fontFamily: "'Outfit', sans-serif",
          maxWidth: 1200,
          margin: "0 auto",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <p
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: C.blurple,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              marginBottom: 12,
            }}
          >
            Features
          </p>
          <h2
            style={{
              fontSize: "clamp(28px, 3.5vw, 42px)",
              fontWeight: 700,
              letterSpacing: "-0.02em",
            }}
          >
            Everything you need, right in Discord
          </h2>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 20,
          }}
        >
          {[
            {
              icon: <ZapIcon />,
              title: "Instant Alerts",
              desc: "Get DM or channel pings before any bill is due. Set custom lead times — 1 hour, 1 day, or 1 week.",
            },
            {
              icon: <CalendarIcon />,
              title: "Smart Scheduling",
              desc: "Recurring reminders auto-adjust for weekends and holidays. Supports monthly, yearly, and custom cycles.",
            },
            {
              icon: <RepeatIcon />,
              title: "Auto-detect Subscriptions",
              desc: "Connect your bank or paste a receipt — PayPing auto-creates reminders for recurring charges.",
            },
            {
              icon: <ShieldIcon />,
              title: "Privacy First",
              desc: "Your financial data is encrypted end-to-end. We never share or sell. You own your data, period.",
            },
            {
              icon: <DiscordIcon size={22} color={C.blurple} />,
              title: "Slash Commands",
              desc: "Use /remind, /list, /snooze, /history — manage everything without leaving Discord.",
            },
            {
              icon: <BellIcon size={22} />,
              title: "Team Billing",
              desc: "Shared server reminders for team subscriptions. Everyone stays in the loop, no more surprise charges.",
            },
          ].map((feat, i) => (
            <div
              key={feat.title}
              style={{
                background: C.bgCard,
                borderRadius: 16,
                border: `1px solid ${C.border}`,
                padding: 28,
                transition:
                  "border-color 0.3s, background 0.3s, transform 0.3s",
                cursor: "default",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = C.borderHover;
                e.currentTarget.style.background = C.bgCardHover;
                e.currentTarget.style.transform = "translateY(-4px)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = C.border;
                e.currentTarget.style.background = C.bgCard;
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  background: C.blurpleSoft,
                  color: C.blurple,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 18,
                }}
              >
                {feat.icon}
              </div>
              <h3
                style={{
                  fontSize: 17,
                  fontWeight: 600,
                  marginBottom: 8,
                  letterSpacing: "-0.01em",
                }}
              >
                {feat.title}
              </h3>
              <p style={{ fontSize: 14, lineHeight: 1.65, color: C.muted }}>
                {feat.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section
        id="how-it-works"
        style={{
          padding: "100px 40px",
          fontFamily: "'Outfit', sans-serif",
          maxWidth: 900,
          margin: "0 auto",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <p
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: C.green,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              marginBottom: 12,
            }}
          >
            How it works
          </p>
          <h2
            style={{
              fontSize: "clamp(28px, 3.5vw, 42px)",
              fontWeight: 700,
              letterSpacing: "-0.02em",
            }}
          >
            Three steps, zero late fees
          </h2>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 0,
            position: "relative",
          }}
        >
          {/* vertical line */}
          <div
            style={{
              position: "absolute",
              left: 27,
              top: 30,
              bottom: 30,
              width: 2,
              background: `linear-gradient(to bottom, ${C.blurple}, ${C.green})`,
              borderRadius: 2,
              opacity: 0.3,
            }}
          />

          {[
            {
              step: "01",
              title: "Add PayPing to your server",
              desc: "One click. No credit card. The bot joins and is ready in seconds.",
            },
            {
              step: "02",
              title: "Set up your reminders",
              desc: "Use /remind to add bills, or connect your bank to auto-detect subscriptions. Set when and where to get pinged.",
            },
            {
              step: "03",
              title: "Relax — we've got you",
              desc: "PayPing pings you before every due date. Snooze, mark paid, or adjust — all from Discord.",
            },
          ].map((s, i) => (
            <div
              key={s.step}
              style={{
                display: "flex",
                gap: 24,
                alignItems: "flex-start",
                padding: "28px 0",
              }}
            >
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 16,
                  flexShrink: 0,
                  background: i === 2 ? C.greenSoft : C.blurpleSoft,
                  color: i === 2 ? C.green : C.blurple,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 18,
                  fontWeight: 700,
                  fontFamily: "'JetBrains Mono', monospace",
                  position: "relative",
                  zIndex: 2,
                }}
              >
                {s.step}
              </div>
              <div>
                <h3 style={{ fontSize: 19, fontWeight: 600, marginBottom: 6 }}>
                  {s.title}
                </h3>
                <p style={{ fontSize: 15, lineHeight: 1.7, color: C.muted }}>
                  {s.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section
        id="pricing"
        style={{
          padding: "100px 40px",
          fontFamily: "'Outfit', sans-serif",
          maxWidth: 1000,
          margin: "0 auto",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <p
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: C.blurple,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              marginBottom: 12,
            }}
          >
            Pricing
          </p>
          <h2
            style={{
              fontSize: "clamp(28px, 3.5vw, 42px)",
              fontWeight: 700,
              letterSpacing: "-0.02em",
            }}
          >
            Start free, upgrade when you need
          </h2>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 20,
            alignItems: "start",
          }}
        >
          {/* Free */}
          <div
            style={{
              background: C.bgCard,
              borderRadius: 20,
              border: `1px solid ${C.border}`,
              padding: 32,
            }}
          >
            <p
              style={{
                fontSize: 14,
                fontWeight: 600,
                color: C.muted,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                marginBottom: 8,
              }}
            >
              Free
            </p>
            <div
              style={{
                fontSize: 42,
                fontWeight: 800,
                letterSpacing: "-0.03em",
                marginBottom: 4,
              }}
            >
              $0
            </div>
            <p style={{ fontSize: 14, color: C.muted, marginBottom: 28 }}>
              Forever. No credit card needed.
            </p>
            {[
              "Up to 10 reminders",
              "DM notifications",
              "Slash commands",
              "Community support",
            ].map(f => (
              <div
                key={f}
                style={{
                  display: "flex",
                  gap: 10,
                  alignItems: "center",
                  marginBottom: 14,
                }}
              >
                <CheckIcon />
                <span style={{ fontSize: 14, color: C.text }}>{f}</span>
              </div>
            ))}
            <a
              href="#"
              style={{
                display: "block",
                textAlign: "center",
                padding: "13px 0",
                borderRadius: 12,
                marginTop: 24,
                border: `1.5px solid ${C.border}`,
                color: C.text,
                fontSize: 15,
                fontWeight: 600,
                textDecoration: "none",
                transition: "border-color 0.3s, background 0.3s",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = C.borderHover;
                e.currentTarget.style.background = "rgba(255,255,255,0.03)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = C.border;
                e.currentTarget.style.background = "transparent";
              }}
            >
              Get started
            </a>
          </div>

          {/* Pro */}
          <div
            style={{
              background: C.bgCard,
              borderRadius: 20,
              border: `2px solid ${C.blurple}`,
              padding: 32,
              position: "relative",
              boxShadow: `0 0 60px ${C.blurpleGlow}`,
            }}
          >
            <div
              style={{
                position: "absolute",
                top: -13,
                left: "50%",
                transform: "translateX(-50%)",
                padding: "4px 16px",
                borderRadius: 999,
                background: C.blurple,
                color: "#fff",
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: "0.04em",
              }}
            >
              MOST POPULAR
            </div>
            <p
              style={{
                fontSize: 14,
                fontWeight: 600,
                color: C.blurple,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                marginBottom: 8,
              }}
            >
              Pro
            </p>
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: 4,
                marginBottom: 4,
              }}
            >
              <span
                style={{
                  fontSize: 42,
                  fontWeight: 800,
                  letterSpacing: "-0.03em",
                }}
              >
                $4
              </span>
              <span style={{ fontSize: 16, color: C.muted }}>/mo</span>
            </div>
            <p style={{ fontSize: 14, color: C.muted, marginBottom: 28 }}>
              For power users and small teams.
            </p>
            {[
              "Unlimited reminders",
              "Channel + DM notifications",
              "Bank auto-detect",
              "Snooze & reschedule",
              "Priority support",
              "Custom reminder templates",
            ].map(f => (
              <div
                key={f}
                style={{
                  display: "flex",
                  gap: 10,
                  alignItems: "center",
                  marginBottom: 14,
                }}
              >
                <CheckIcon />
                <span style={{ fontSize: 14, color: C.text }}>{f}</span>
              </div>
            ))}
            <a
              href="#"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                padding: "13px 0",
                borderRadius: 12,
                marginTop: 24,
                background: C.blurple,
                color: "#fff",
                fontSize: 15,
                fontWeight: 600,
                textDecoration: "none",
                transition: "transform 0.2s, box-shadow 0.2s",
                boxShadow: `0 4px 20px ${C.blurpleGlow}`,
              }}
              onMouseEnter={e =>
                (e.currentTarget.style.transform = "translateY(-1px)")
              }
              onMouseLeave={e =>
                (e.currentTarget.style.transform = "translateY(0)")
              }
            >
              <DiscordIcon size={16} color="#fff" /> Start free trial
            </a>
          </div>
        </div>
      </section>

      <section
        style={{
          padding: "100px 40px",
          fontFamily: "'Outfit', sans-serif",
          maxWidth: 800,
          margin: "0 auto",
          textAlign: "center",
        }}
      >
        <div
          style={{
            background: C.bgCard,
            borderRadius: 24,
            border: `1px solid ${C.border}`,
            padding: "56px 48px",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* glow */}
          <div
            style={{
              position: "absolute",
              width: 400,
              height: 400,
              borderRadius: "50%",
              background: `radial-gradient(circle, ${C.blurpleGlow} 0%, transparent 70%)`,
              top: "-40%",
              right: "-10%",
              pointerEvents: "none",
            }}
          />

          <div style={{ position: "relative", zIndex: 2 }}>
            <h2
              style={{
                fontSize: "clamp(26px, 3vw, 36px)",
                fontWeight: 700,
                letterSpacing: "-0.02em",
                marginBottom: 16,
              }}
            >
              Ready to stop worrying about bills?
            </h2>
            <p
              style={{
                fontSize: 16,
                color: C.muted,
                marginBottom: 32,
                maxWidth: 480,
                margin: "0 auto 32px",
              }}
            >
              Join 1+ Discord servers that never miss a payment. Set up takes 30
              seconds.
            </p>
            <a
              href="/discord-server-integration"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                padding: "15px 32px",
                borderRadius: 14,
                background: C.blurple,
                color: "#fff",
                fontSize: 17,
                fontWeight: 600,
                textDecoration: "none",
                transition: "transform 0.2s, box-shadow 0.2s",
                boxShadow: `0 4px 24px ${C.blurpleGlow}`,
              }}
              onMouseEnter={e =>
                (e.currentTarget.style.transform = "translateY(-2px)")
              }
              onMouseLeave={e =>
                (e.currentTarget.style.transform = "translateY(0)")
              }
            >
              <DiscordIcon size={20} color="#fff" /> Add PayPing to Discord
            </a>
          </div>
        </div>
      </section>

      <footer
        style={{
          padding: "40px 40px 32px",
          fontFamily: "'Outfit', sans-serif",
          borderTop: `1px solid ${C.border}`,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          maxWidth: 1200,
          margin: "0 auto",
          flexWrap: "wrap",
          gap: 16,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            color: C.muted,
            fontSize: 13,
          }}
        >
          <div
            style={{
              width: 24,
              height: 24,
              borderRadius: 6,
              background: `linear-gradient(135deg, ${C.blurple}, #7b6cf6)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <BellIcon size={12} />
          </div>
          PayPing &copy; {new Date().getFullYear()}
        </div>
        <div style={{ display: "flex", gap: 24, fontSize: 13, color: C.muted }}>
          {["Privacy", "Terms", "Support", "Status"].map(l => (
            <a
              key={l}
              href="#"
              style={{
                color: "inherit",
                textDecoration: "none",
                transition: "color 0.2s",
              }}
              onMouseEnter={e => (e.currentTarget.style.color = C.text)}
              onMouseLeave={e => (e.currentTarget.style.color = C.muted)}
            >
              {l}
            </a>
          ))}
        </div>
      </footer>
    </div>
  );
}
