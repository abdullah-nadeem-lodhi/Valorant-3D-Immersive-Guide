import { useEffect, useRef, useState } from "react";
import useAgentStore from "../stores/useAgentStore";
import { AGENTS, ROLE_COLORS } from "../data/agents";
import SceneRoot     from "../components/three/SceneRoot";
import StatBar       from "../components/ui/StatBar";
import AbilityCard   from "../components/ui/AbilityCard";
import GameModeTable from "../components/ui/GameModeTable";

function DifficultyRow({ level }) {
  const labels = { 1: "Beginner", 2: "Intermediate", 3: "Expert" };
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      {[1, 2, 3].map((d) => (
        <div
          key={d}
          style={{
            width: 8, height: 8, borderRadius: 2,
            background: d <= level ? "#FC4E5B" : "rgba(255,255,255,0.12)",
            boxShadow: d <= level ? "0 0 8px rgba(252,78,91,0.6)" : "none",
          }}
        />
      ))}
      <span
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "0.65rem",
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "var(--color-text-muted)",
          fontWeight: 600,
          marginLeft: 4,
        }}
      >
        {labels[level]}
      </span>
    </div>
  );
}

const SECTIONS = [
  { id: "overview",   label: "Overview" },
  { id: "abilities",  label: "Abilities" },
  { id: "modes",      label: "Game Modes" },
  { id: "tips",       label: "Pro Tips" },
];

export default function ProfilePage({ isMobile }) {
  const activeAgentIndex = useAgentStore((s) => s.activeAgentIndex);
  const navigateBack     = useAgentStore((s) => s.navigateToSelection);
  const isTransitioning  = useAgentStore((s) => s.isTransitioning);
  const [mounted, setMounted]           = useState(false);
  const [activeSection, setActiveSection] = useState("overview");

  const agent     = AGENTS[activeAgentIndex];
  const roleColor = ROLE_COLORS[agent.role] ?? "#FC4E5B";

  useEffect(() => {
    setActiveSection("overview");
    const t = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(t);
  }, [activeAgentIndex]);

  const panelDelay = (i) => `${0.35 + i * 0.1}s`;

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        minHeight: "100svh",
        overflow: "hidden",
        background: "var(--color-void)",
        opacity: isTransitioning ? 0 : 1,
        transform: isTransitioning ? "scale(0.97) translateY(10px)" : "scale(1) translateY(0)",
        transition: "opacity 0.55s var(--ease-in-expo), transform 0.55s var(--ease-in-expo)",
      }}
    >
      {/* Background hero-bg at low opacity */}
      <div
        style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          backgroundImage: "url(/assets/hero-bg.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.2,
        }}
      />

      {/* Tactical grid */}
      <div className="tactical-grid" />

      {/* Agent accent gradient */}
      <div
        style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          background: agent.palette.bgGradient,
          opacity: 0.9,
          transition: "all 0.7s ease",
        }}
      />

      {/* Deep center glow */}
      <div
        style={{
          position: "absolute",
          top: "30%", left: "50%",
          transform: "translate(-50%, -50%)",
          width: 800, height: 800,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${agent.accentColor}10 0%, transparent 70%)`,
          pointerEvents: "none",
          transition: "background 0.7s ease",
        }}
      />

      {/* ── 3D CANVAS ─────────────────────────────────── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          height: isMobile ? "50svh" : "100%",
          opacity: mounted ? 1 : 0,
          transition: "opacity 1.2s ease 0.1s",
        }}
      >
        <SceneRoot view="profile" isMobile={isMobile} />
      </div>

      {/* Bottom dark fade */}
      <div
        style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          bottom: 0, top: "auto",
          height: isMobile ? "55%" : "65%",
          background: "linear-gradient(to top, var(--color-void) 50%, transparent 100%)",
        }}
      />

      {/* Right dark fade — desktop only */}
      {!isMobile && (
        <div
          style={{
            position: "absolute", inset: 0, pointerEvents: "none",
            left: "auto",
            width: "55%",
            background: "linear-gradient(to left, var(--color-void) 35%, transparent 100%)",
          }}
        />
      )}

      {/* ── BACK BUTTON ───────────────────────────────── */}
      <button
        onClick={navigateBack}
        style={{
          position: "absolute",
          top: isMobile ? "1rem" : "1.75rem",
          left: isMobile ? "1rem" : "2.5rem",
          zIndex: 30,
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          fontFamily: "var(--font-display)",
          fontSize: "0.78rem",
          fontWeight: 700,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: "var(--color-cream)",
          background: "transparent",
          border: "1px solid rgba(255,255,255,0.12)",
          padding: "8px 16px",
          borderRadius: 4,
          cursor: "pointer",
          opacity: mounted ? 1 : 0,
          transform: mounted ? "translateX(0)" : "translateX(-20px)",
          transition: "opacity 0.7s var(--ease-out-expo) 0.05s, transform 0.7s var(--ease-out-expo) 0.05s, border-color 0.2s, background 0.2s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = "rgba(255,255,255,0.3)";
          e.currentTarget.style.background  = "rgba(255,255,255,0.05)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)";
          e.currentTarget.style.background  = "transparent";
        }}
      >
        ← All Agents
      </button>

      {/* ── AGENT IDENTITY (top-left) ─────────────────── */}
      <div
        style={{
          position: "absolute",
          zIndex: 20,
          top: isMobile ? "auto" : "5rem",
          bottom: isMobile ? "52svh" : "auto",
          left: isMobile ? "1.25rem" : "2.5rem",
          pointerEvents: "none",
          opacity: mounted ? 1 : 0,
          transform: mounted ? "translateY(0)" : "translateY(24px)",
          transition: "opacity 0.9s var(--ease-out-expo) 0.2s, transform 0.9s var(--ease-out-expo) 0.2s",
        }}
      >
        {/* Role */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
          <div style={{ width: 16, height: 1.5, background: roleColor }} />
          <span
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.65rem",
              fontWeight: 600,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: roleColor,
            }}
          >
            {agent.roleIcon} {agent.role}
          </span>
        </div>

        {/* Name */}
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(3.5rem, 9vw, 7rem)",
            fontWeight: 700,
            letterSpacing: "0.03em",
            textTransform: "uppercase",
            color: "#FFFFFF",
            lineHeight: 0.88,
            textShadow: `0 0 80px ${agent.accentColor}33`,
          }}
        >
          {agent.name}
        </h1>

        {/* Tagline */}
        <p
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(0.75rem, 1.5vw, 1rem)",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: agent.accentColor,
            marginTop: 8,
            textShadow: `0 0 20px ${agent.accentColor}66`,
          }}
        >
          {agent.tagline}
        </p>

        {/* Difficulty */}
        <div style={{ marginTop: 12 }}>
          <DifficultyRow level={agent.difficulty} />
        </div>
      </div>

      {/* ── DESKTOP PANEL SYSTEM ─────────────────────── */}
      {!isMobile && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 20,
            pointerEvents: "none",
          }}
        >
          {/* Section tab bar */}
          <div
            style={{
              position: "absolute",
              top: "1.75rem",
              right: "2.5rem",
              display: "flex",
              gap: 8,
              pointerEvents: "auto",
              opacity: mounted ? 1 : 0,
              transform: mounted ? "translateY(0)" : "translateY(-16px)",
              transition: `opacity 0.8s var(--ease-out-expo) 0.3s, transform 0.8s var(--ease-out-expo) 0.3s`,
            }}
          >
            {SECTIONS.map((s) => (
              <button
                key={s.id}
                onClick={() => setActiveSection(s.id)}
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "0.64rem",
                  fontWeight: 600,
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  padding: "7px 14px",
                  borderRadius: 4,
                  border: `1px solid ${activeSection === s.id ? agent.accentColor + "66" : "rgba(255,255,255,0.08)"}`,
                  background: activeSection === s.id
                    ? agent.accentColor + "18"
                    : "rgba(10,20,29,0.6)",
                  color: activeSection === s.id ? agent.accentColor : "rgba(239,238,233,0.45)",
                  cursor: "pointer",
                  backdropFilter: "blur(12px)",
                  transition: "all 0.3s var(--ease-out-expo)",
                }}
              >
                {s.label}
              </button>
            ))}
          </div>

          {/* Content panels */}
          <div
            style={{
              position: "absolute",
              top: "6rem",
              right: "2.5rem",
              width: "clamp(280px, 26vw, 400px)",
              display: "flex",
              flexDirection: "column",
              gap: 12,
              pointerEvents: "auto",
              maxHeight: "calc(100svh - 10rem)",
              overflowY: "auto",
            }}
            className="scrollbar-hide"
          >
            {/* Overview */}
            {activeSection === "overview" && (
              <>
                {/* Description card */}
                <div
                  className="glass-card"
                  style={{
                    padding: "18px 20px",
                    opacity: mounted ? 1 : 0,
                    transform: mounted ? "translateX(0)" : "translateX(20px)",
                    transition: `opacity 0.8s var(--ease-out-expo) ${panelDelay(0)}, transform 0.8s var(--ease-out-expo) ${panelDelay(0)}`,
                  }}
                >
                  <div style={{ width: 28, height: 2, background: agent.accentColor, marginBottom: 10 }} />
                  <p
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "0.65rem",
                      fontWeight: 600,
                      letterSpacing: "0.16em",
                      textTransform: "uppercase",
                      color: agent.accentColor,
                      marginBottom: 8,
                    }}
                  >
                    Agent Bio
                  </p>
                  <p
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "0.875rem",
                      lineHeight: 1.65,
                      color: "rgba(239,238,233,0.6)",
                    }}
                  >
                    {agent.description}
                  </p>
                </div>

                {/* Stats card */}
                <div
                  className="glass-card"
                  style={{
                    padding: "18px 20px",
                    opacity: mounted ? 1 : 0,
                    transform: mounted ? "translateX(0)" : "translateX(20px)",
                    transition: `opacity 0.8s var(--ease-out-expo) ${panelDelay(1)}, transform 0.8s var(--ease-out-expo) ${panelDelay(1)}`,
                  }}
                >
                  <p
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "0.65rem",
                      fontWeight: 600,
                      letterSpacing: "0.16em",
                      textTransform: "uppercase",
                      color: agent.accentColor,
                      marginBottom: 16,
                    }}
                  >
                    Performance Metrics
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                    {Object.entries(agent.stats).map(([key, val], i) => (
                      <StatBar
                        key={key}
                        label={key.charAt(0).toUpperCase() + key.slice(1)}
                        value={val}
                        color={agent.accentColor}
                        delay={i * 130}
                      />
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Abilities */}
            {activeSection === "abilities" && (
              <div
                className="glass-card"
                style={{
                  padding: "18px 20px",
                  opacity: mounted ? 1 : 0,
                  transform: mounted ? "translateX(0)" : "translateX(20px)",
                  transition: `opacity 0.8s var(--ease-out-expo) ${panelDelay(0)}, transform 0.8s var(--ease-out-expo) ${panelDelay(0)}`,
                }}
              >
                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "0.65rem",
                    fontWeight: 600,
                    letterSpacing: "0.16em",
                    textTransform: "uppercase",
                    color: agent.accentColor,
                    marginBottom: 14,
                  }}
                >
                  Abilities
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {agent.abilities.map((ab) => (
                    <AbilityCard key={ab.name} ability={ab} accentColor={agent.accentColor} />
                  ))}
                </div>
              </div>
            )}

            {/* Game Modes */}
            {activeSection === "modes" && (
              <div
                className="glass-card"
                style={{
                  padding: "18px 20px",
                  opacity: mounted ? 1 : 0,
                  transform: mounted ? "translateX(0)" : "translateX(20px)",
                  transition: `opacity 0.8s var(--ease-out-expo) ${panelDelay(0)}, transform 0.8s var(--ease-out-expo) ${panelDelay(0)}`,
                }}
              >
                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "0.65rem",
                    fontWeight: 600,
                    letterSpacing: "0.16em",
                    textTransform: "uppercase",
                    color: agent.accentColor,
                    marginBottom: 14,
                  }}
                >
                  Game Mode Performance
                </p>
                <GameModeTable gameModes={agent.gameModes} accentColor={agent.accentColor} />
              </div>
            )}

            {/* Pro Tips */}
            {activeSection === "tips" && (
              <div
                className="glass-card"
                style={{
                  padding: "18px 20px",
                  opacity: mounted ? 1 : 0,
                  transform: mounted ? "translateX(0)" : "translateX(20px)",
                  transition: `opacity 0.8s var(--ease-out-expo) ${panelDelay(0)}, transform 0.8s var(--ease-out-expo) ${panelDelay(0)}`,
                }}
              >
                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "0.65rem",
                    fontWeight: 600,
                    letterSpacing: "0.16em",
                    textTransform: "uppercase",
                    color: agent.accentColor,
                    marginBottom: 14,
                  }}
                >
                  Tactical Tips
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {agent.tips.map((tip, i) => (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        gap: 10,
                        padding: "12px 14px",
                        borderRadius: 8,
                        background: "rgba(255,255,255,0.03)",
                        border: "1px solid rgba(255,255,255,0.07)",
                      }}
                    >
                      <span
                        style={{
                          fontFamily: "var(--font-display)",
                          fontSize: "0.75rem",
                          color: agent.accentColor,
                          letterSpacing: "0.1em",
                          flexShrink: 0,
                          marginTop: 1,
                        }}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <p
                        style={{
                          fontFamily: "var(--font-body)",
                          fontSize: "0.84rem",
                          lineHeight: 1.6,
                          color: "rgba(239,238,233,0.6)",
                        }}
                      >
                        {tip}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Bottom left: quick stats pill */}
          <div
            style={{
              position: "absolute",
              bottom: "3.5rem",
              left: "2.5rem",
              pointerEvents: "auto",
              opacity: mounted ? 1 : 0,
              transform: mounted ? "translateY(0)" : "translateY(20px)",
              transition: `opacity 0.9s var(--ease-out-expo) 0.55s, transform 0.9s var(--ease-out-expo) 0.55s`,
            }}
          >
            <div
              style={{
                display: "flex",
                gap: 10,
                background: "rgba(10,20,29,0.8)",
                backdropFilter: "blur(16px)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 8,
                padding: "12px 16px",
              }}
            >
              {Object.entries(agent.stats).slice(0, 4).map(([key, val]) => (
                <div
                  key={key}
                  style={{ display: "flex", flexDirection: "column", gap: 2, minWidth: 48, alignItems: "center" }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "1.3rem",
                      color: agent.accentColor,
                      lineHeight: 1,
                    }}
                  >
                    {val}
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "0.55rem",
                      letterSpacing: "0.14em",
                      textTransform: "uppercase",
                      color: "rgba(239,238,233,0.35)",
                      fontWeight: 600,
                    }}
                  >
                    {key.slice(0, 4)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom right: agent switcher */}
          <div
            style={{
              position: "absolute",
              bottom: "2rem",
              right: "2.5rem",
              display: "flex",
              gap: 6,
              pointerEvents: "auto",
              opacity: mounted ? 1 : 0,
              transition: `opacity 0.9s var(--ease-out-expo) 0.6s`,
            }}
          >
            {AGENTS.map((a, i) => (
              <button
                key={a.id}
                onClick={() => {
                  useAgentStore.getState().setActiveAgentIndex(i);
                  setMounted(false);
                  setTimeout(() => setMounted(true), 200);
                }}
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "0.65rem",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  padding: "6px 12px",
                  borderRadius: 4,
                  border: `1px solid ${i === activeAgentIndex ? a.accentColor + "66" : "rgba(255,255,255,0.07)"}`,
                  background: i === activeAgentIndex ? a.accentColor + "18" : "rgba(10,20,29,0.5)",
                  color: i === activeAgentIndex ? a.accentColor : "rgba(239,238,233,0.3)",
                  cursor: "pointer",
                  backdropFilter: "blur(12px)",
                  transition: "all 0.3s var(--ease-out-expo)",
                }}
              >
                {a.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── MOBILE LAYOUT ─────────────────────────────── */}
      {isMobile && (
        <>
          {/* Spacer for 3D canvas */}
          <div style={{ height: "48svh" }} />

          {/* Sheet */}
          <div
            style={{
              position: "relative",
              zIndex: 30,
              background: "linear-gradient(180deg, rgba(14,22,32,0.97) 0%, var(--color-void) 100%)",
              borderTop: `1px solid ${agent.accentColor}33`,
              borderRadius: "20px 20px 0 0",
              minHeight: "52svh",
              opacity: mounted ? 1 : 0,
              transform: mounted ? "translateY(0)" : "translateY(40px)",
              transition: "opacity 0.8s var(--ease-out-expo) 0.2s, transform 0.8s var(--ease-out-expo) 0.2s",
            }}
          >
            {/* Handle */}
            <div style={{ display: "flex", justifyContent: "center", paddingTop: 12, paddingBottom: 12 }}>
              <div style={{ width: 36, height: 4, background: "rgba(255,255,255,0.18)", borderRadius: 2 }} />
            </div>

            {/* Agent name */}
            <div style={{ padding: "0 18px 14px" }}>
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "0.6rem",
                  fontWeight: 600,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: roleColor,
                  marginBottom: 4,
                }}
              >
                {agent.role}
              </p>
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "2.5rem",
                  fontWeight: 700,
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                  color: "#FFFFFF",
                  lineHeight: 0.9,
                  marginBottom: 6,
                }}
              >
                {agent.name}
              </h2>
              <p
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "0.68rem",
                  letterSpacing: "0.09em",
                  textTransform: "uppercase",
                  color: agent.accentColor,
                }}
              >
                {agent.tagline}
              </p>
            </div>

            {/* Section tabs */}
            <div
              style={{ display: "flex", gap: 6, padding: "0 18px 14px", overflowX: "auto" }}
              className="scrollbar-hide"
            >
              {SECTIONS.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setActiveSection(s.id)}
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "0.6rem",
                    fontWeight: 600,
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    padding: "6px 12px",
                    borderRadius: 4,
                    border: `1px solid ${activeSection === s.id ? agent.accentColor + "66" : "rgba(255,255,255,0.08)"}`,
                    background: activeSection === s.id ? agent.accentColor + "18" : "transparent",
                    color: activeSection === s.id ? agent.accentColor : "rgba(239,238,233,0.4)",
                    cursor: "pointer",
                    flexShrink: 0,
                    whiteSpace: "nowrap",
                  }}
                >
                  {s.label}
                </button>
              ))}
            </div>

            {/* Content */}
            <div style={{ padding: "0 18px 24px", display: "flex", flexDirection: "column", gap: 12 }}>
              {activeSection === "overview" && (
                <>
                  <p style={{ fontFamily: "var(--font-body)", fontSize: "0.85rem", lineHeight: 1.6, color: "rgba(239,238,233,0.6)" }}>
                    {agent.description}
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {Object.entries(agent.stats).map(([key, val], i) => (
                      <StatBar key={key}
                        label={key.charAt(0).toUpperCase() + key.slice(1)}
                        value={val} color={agent.accentColor} delay={i * 100} />
                    ))}
                  </div>
                </>
              )}

              {activeSection === "abilities" && agent.abilities.map((ab) => (
                <AbilityCard key={ab.name} ability={ab} accentColor={agent.accentColor} />
              ))}

              {activeSection === "modes" && (
                <GameModeTable gameModes={agent.gameModes} accentColor={agent.accentColor} />
              )}

              {activeSection === "tips" && agent.tips.map((tip, i) => (
                <div key={i} style={{
                  display: "flex", gap: 10, padding: "12px 14px",
                  borderRadius: 8, background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.07)",
                }}>
                  <span style={{ fontFamily: "var(--font-display)", fontSize: "0.7rem", color: agent.accentColor, flexShrink: 0 }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p style={{ fontFamily: "var(--font-body)", fontSize: "0.82rem", lineHeight: 1.6, color: "rgba(239,238,233,0.6)" }}>
                    {tip}
                  </p>
                </div>
              ))}

              {/* Agent switcher */}
              <div style={{ display: "flex", gap: 6, marginTop: 8, overflowX: "auto" }} className="scrollbar-hide">
                {AGENTS.map((a, i) => (
                  <button key={a.id}
                    onClick={() => {
                      useAgentStore.getState().setActiveAgentIndex(i);
                      setMounted(false);
                      setTimeout(() => setMounted(true), 200);
                    }}
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "0.62rem",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      padding: "5px 10px",
                      borderRadius: 4,
                      border: `1px solid ${i === activeAgentIndex ? a.accentColor + "55" : "rgba(255,255,255,0.07)"}`,
                      background: i === activeAgentIndex ? a.accentColor + "18" : "transparent",
                      color: i === activeAgentIndex ? a.accentColor : "rgba(239,238,233,0.3)",
                      cursor: "pointer",
                      flexShrink: 0,
                    }}
                  >
                    {a.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
