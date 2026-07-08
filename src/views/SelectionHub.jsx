import { useEffect, useRef, useState } from "react";
import AgentCard     from "../components/ui/AgentCard";
import SceneRoot     from "../components/three/SceneRoot";
import useAgentStore from "../stores/useAgentStore";
import { AGENTS }   from "../data/agents";

export default function SelectionHub({ isMobile }) {
  const activeAgentIndex = useAgentStore((s) => s.activeAgentIndex);
  const isTransitioning  = useAgentStore((s) => s.isTransitioning);
  const [mounted, setMounted] = useState(false);
  const headerRef = useRef(null);
  const heroRef   = useRef(null);
  const cardsRef  = useRef(null);

  const activeAgent = AGENTS[activeAgentIndex];

  useEffect(() => {
    // Staggered mount animation
    const t = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      className="relative w-full min-h-screen overflow-hidden noise-overlay"
      style={{
        background: "var(--color-void)",
        opacity: isTransitioning ? 0 : 1,
        transform: isTransitioning ? "scale(1.04) translateY(-10px)" : "scale(1) translateY(0)",
        transition: "opacity 0.55s var(--ease-in-expo), transform 0.55s var(--ease-in-expo)",
        willChange: "opacity, transform",
      }}
    >
      {/* Background image */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "url(/assets/hero-bg.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.35,
        }}
      />

      {/* Tactical grid */}
      <div className="tactical-grid" />

      {/* 3D Canvas Layer */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          opacity: mounted ? 1 : 0,
          transition: "opacity 1.5s ease 0.3s",
        }}
      >
        <SceneRoot view="selection" isMobile={isMobile} />
      </div>

      {/* Bottom gradient overlay */}
      <div
        className="absolute inset-x-0 bottom-0 pointer-events-none"
        style={{
          height: "60%",
          background: "linear-gradient(to top, var(--color-void) 45%, transparent 100%)",
        }}
      />

      {/* Top gradient overlay */}
      <div
        className="absolute inset-x-0 top-0 pointer-events-none"
        style={{
          height: "25%",
          background: "linear-gradient(to bottom, var(--color-void) 0%, transparent 100%)",
        }}
      />

      {/* Left side gradient */}
      <div
        className="absolute inset-y-0 left-0 pointer-events-none hidden md:block"
        style={{
          width: "20%",
          background: "linear-gradient(to right, var(--color-void) 0%, transparent 100%)",
        }}
      />

      {/* Right side gradient */}
      <div
        className="absolute inset-y-0 right-0 pointer-events-none hidden md:block"
        style={{
          width: "20%",
          background: "linear-gradient(to left, var(--color-void) 0%, transparent 100%)",
        }}
      />

      {/* Active agent accent gradient — transitions with agent */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: activeAgent.palette.bgGradient,
          opacity: 0.7,
          transition: "opacity 0.5s ease",
        }}
      />

      {/* ── HEADER ──────────────────────────────────────────── */}
      <header
        ref={headerRef}
        className="relative z-20 flex items-center justify-between px-5 md:px-12 pt-6 md:pt-8"
        style={{
          opacity: mounted ? 1 : 0,
          transform: mounted ? "translateY(0)" : "translateY(-20px)",
          transition: "opacity 0.9s var(--ease-out-expo) 0.1s, transform 0.9s var(--ease-out-expo) 0.1s",
        }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div
            className="flex items-center justify-center flex-shrink-0"
            style={{
              width: 34,
              height: 34,
              background: "#FC4E5B",
              borderRadius: "3px",
              transform: "rotate(45deg)",
              boxShadow: "0 0 20px rgba(252,78,91,0.4)",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "0.85rem",
                color: "#fff",
                transform: "rotate(-45deg)",
                display: "block",
                fontWeight: 700,
              }}
            >
              V
            </span>
          </div>
          <div>
            <p className="text-label" style={{ color: "#FC4E5B", marginBottom: 0 }}>
              VALORANT
            </p>
            <p
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "0.85rem",
                letterSpacing: "0.14em",
                color: "var(--color-cream)",
                marginTop: -2,
              }}
            >
              AGENT GUIDE
            </p>
          </div>
        </div>

        {/* Nav — desktop */}
        <nav className="hidden md:flex items-center gap-8">
          {["Agents", "Abilities", "Maps", "Strategies"].map((item) => (
            <a
              key={item}
              href="#"
              className="text-label"
              style={{
                color: "var(--color-text-muted)",
                letterSpacing: "0.15em",
                transition: "color 0.2s",
                textDecoration: "none",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#FFFFFF")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-text-muted)")}
            >
              {item}
            </a>
          ))}
        </nav>

        {/* Counter */}
        <div className="flex items-center gap-2">
          <div
            className="hidden md:block text-label"
            style={{ color: "var(--color-text-dim)", letterSpacing: "0.18em" }}
          >
            {String(activeAgentIndex + 1).padStart(2, "0")}
            <span style={{ color: "var(--color-text-dim)", opacity: 0.4 }}> / </span>
            {String(AGENTS.length).padStart(2, "0")}
          </div>
          {/* Mobile hamburger placeholder */}
          <div className="md:hidden flex flex-col gap-1 cursor-pointer p-2">
            <div style={{ width: 20, height: 2, background: "white" }} />
            <div style={{ width: 14, height: 2, background: "#FC4E5B" }} />
          </div>
        </div>
      </header>

      {/* ── HERO TEXT ───────────────────────────────────────── */}
      <div
        ref={heroRef}
        className="relative z-20 px-5 md:px-12 pt-6 md:pt-8 pb-4 md:pb-6"
        style={{
          opacity: mounted ? 1 : 0,
          transform: mounted ? "translateY(0)" : "translateY(28px)",
          transition: "opacity 1s var(--ease-out-expo) 0.2s, transform 1s var(--ease-out-expo) 0.2s",
        }}
      >
        {/* Label */}
        <div className="flex items-center gap-3 mb-3">
          <div style={{ width: 24, height: 2, background: "#FC4E5B" }} />
          <p className="text-label" style={{ color: "#FC4E5B" }}>
            Select Your Operative
          </p>
        </div>

        {/* Main headline */}
        <h1
          className="text-display-xl"
          style={{
            color: "#FFFFFF",
            maxWidth: "18ch",
            lineHeight: 0.88,
          }}
        >
          Choose Your
          <br />
          <span
            style={{
              color: activeAgent.accentColor,
              transition: "color 0.6s var(--ease-out-expo)",
              textShadow: `0 0 60px ${activeAgent.accentColor}66`,
            }}
          >
            Operative
          </span>
        </h1>

        {/* Sub */}
        <p
          className="text-body mt-3"
          style={{
            color: "var(--color-text-muted)",
            maxWidth: "40ch",
            fontSize: "0.9rem",
          }}
        >
          Master unique abilities. Dominate the battlefield. Every agent
          brings a distinct tactical identity to your squad.
        </p>

        {/* Currently active agent name strip */}
        <div
          className="flex items-center gap-3 mt-4 md:mt-5"
          style={{ opacity: 0.85 }}
        >
          <span
            className="text-label"
            style={{ color: "var(--color-text-dim)" }}
          >
            Featured:
          </span>
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "1.1rem",
              color: activeAgent.accentColor,
              letterSpacing: "0.12em",
              transition: "color 0.5s ease",
            }}
          >
            {activeAgent.name}
          </span>
          <span className="text-label" style={{ color: "var(--color-text-dim)" }}>
            · {activeAgent.role}
          </span>
        </div>
      </div>

      {/* ── AGENT CARDS ─────────────────────────────────────── */}
      <div
        ref={cardsRef}
        className="relative z-20 px-4 md:px-12 pb-4"
        style={{
          opacity: mounted ? 1 : 0,
          transform: mounted ? "translateY(0)" : "translateY(48px)",
          transition: "opacity 1.1s var(--ease-out-expo) 0.3s, transform 1.1s var(--ease-out-expo) 0.3s",
        }}
      >
        <div
          className="grid gap-3 md:gap-4"
          style={{
            gridTemplateColumns: isMobile
              ? "repeat(2, 1fr)"
              : "repeat(4, 1fr)",
          }}
        >
          {AGENTS.map((agent, i) => (
            <AgentCard
              key={agent.id}
              agent={agent}
              index={i}
              isActive={i === activeAgentIndex}
            />
          ))}
        </div>
      </div>

      {/* ── BOTTOM STATUS BAR ───────────────────────────────── */}
      <div
        className="relative z-20 flex items-center justify-between px-5 md:px-12 py-4"
        style={{
          borderTop: "1px solid var(--color-border)",
          opacity: mounted ? 1 : 0,
          transition: "opacity 1.2s var(--ease-out-expo) 0.5s",
        }}
      >
        <span className="text-label" style={{ color: "var(--color-text-dim)", display: isMobile ? "none" : "block" }}>
          Season Episode 9 · Patch 9.04
        </span>

        {/* Dot progress */}
        <div className="flex items-center gap-2 mx-auto md:mx-0">
          {AGENTS.map((a, i) => (
            <button
              key={i}
              onClick={() => useAgentStore.getState().setActiveAgentIndex(i)}
              style={{
                width: i === activeAgentIndex ? 24 : 8,
                height: 3,
                borderRadius: 2,
                background: i === activeAgentIndex
                  ? activeAgent.accentColor
                  : "rgba(255,255,255,0.18)",
                border: "none",
                cursor: "pointer",
                transition: "all 0.4s var(--ease-out-expo)",
                padding: 0,
              }}
              aria-label={`Select agent ${i + 1}`}
            />
          ))}
        </div>

        <span className="text-label" style={{ color: "var(--color-text-dim)", display: isMobile ? "none" : "block" }}>
          PC · Console · Mobile
        </span>
      </div>

      {/* ── DECORATIVE ELEMENTS ─────────────────────────────── */}
      {/* Top-right corner bracket */}
      <div
        className="absolute top-0 right-0 pointer-events-none hidden md:block"
        style={{ padding: "16px" }}
      >
        <div style={{ position: "relative", width: 60, height: 60 }}>
          <div style={{ position: "absolute", top: 0, right: 0, width: "100%", height: 1.5, background: "rgba(252,78,91,0.4)" }} />
          <div style={{ position: "absolute", top: 0, right: 0, width: 1.5, height: "100%", background: "rgba(252,78,91,0.4)" }} />
        </div>
      </div>

      {/* Bottom-left counter */}
      <div
        className="absolute bottom-14 left-5 md:left-12 hidden md:flex flex-col gap-1 pointer-events-none"
        style={{
          opacity: mounted ? 0.4 : 0,
          transition: "opacity 1.5s ease 0.8s",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "4rem",
            color: "#FFFFFF",
            letterSpacing: "0.05em",
            lineHeight: 1,
            opacity: 0.06,
          }}
        >
          {activeAgent.name}
        </span>
      </div>
    </div>
  );
}
