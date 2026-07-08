import { useRef, useEffect, useState } from "react";
import useAgentStore from "../../stores/useAgentStore";
import { ROLE_COLORS } from "../../data/agents";

function DifficultyDots({ level }) {
  return (
    <div className="flex gap-1 items-center">
      {[1, 2, 3].map((d) => (
        <div
          key={d}
          style={{
            width: 7,
            height: 7,
            borderRadius: 2,
            background: d <= level ? "#FC4E5B" : "rgba(255,255,255,0.12)",
            boxShadow: d <= level ? "0 0 8px rgba(252,78,91,0.5)" : "none",
            transition: "all 0.3s ease",
          }}
        />
      ))}
    </div>
  );
}

// Agent visual lettermark
function AgentMark({ agent, isActive, isHovered }) {
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      {/* Radial bg glow */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(circle at center, ${agent.accentColor}22 0%, transparent 70%)`,
          opacity: isActive || isHovered ? 1 : 0.3,
          transition: "opacity 0.4s ease",
        }}
      />

      {/* Hexagon rings */}
      {[80, 56, 32].map((size, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            width: size,
            height: size,
            borderRadius: "50%",
            border: `1px solid ${agent.accentColor}${isActive ? "44" : "22"}`,
            transition: "all 0.4s ease",
            animation: `spin-slow ${8 + i * 4}s linear infinite ${i % 2 ? "reverse" : ""}`,
          }}
        />
      ))}

      {/* Main letter */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          fontFamily: "var(--font-display)",
          fontSize: "3.8rem",
          fontWeight: 700,
          color: agent.accentColor,
          lineHeight: 1,
          letterSpacing: "0.02em",
          textShadow: `0 0 40px ${agent.accentColor}88, 0 0 80px ${agent.accentColor}44`,
          transition: "transform 0.4s var(--ease-out-expo), text-shadow 0.4s ease",
          transform: isActive || isHovered ? "scale(1.1)" : "scale(1)",
        }}
      >
        {agent.name[0]}
      </div>

      {/* Role icon bottom */}
      <div
        style={{
          position: "absolute",
          bottom: 10,
          right: 12,
          fontFamily: "var(--font-display)",
          fontSize: "0.6rem",
          letterSpacing: "0.15em",
          color: agent.accentColor,
          opacity: 0.6,
          textTransform: "uppercase",
        }}
      >
        {agent.role}
      </div>
    </div>
  );
}

export default function AgentCard({ agent, index, isActive }) {
  const cardRef       = useRef(null);
  const navigateTo    = useAgentStore((s) => s.navigateToProfile);
  const setHovered    = useAgentStore((s) => s.setHoveredAgentIndex);
  const setActive     = useAgentStore((s) => s.setActiveAgentIndex);
  const isTransition  = useAgentStore((s) => s.isTransitioning);
  const [isHovered, setIsHovered] = useState(false);

  const roleColor = ROLE_COLORS[agent.role] ?? "#FC4E5B";

  const handleClick = () => {
    if (isTransition) return;
    navigateTo(index);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    setHovered(index);
    setActive(index);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setHovered(null);
  };

  // 3D tilt effect
  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const handleMove = (e) => {
      const rect = card.getBoundingClientRect();
      const cx   = rect.left + rect.width  / 2;
      const cy   = rect.top  + rect.height / 2;
      const dx   = (e.clientX - cx) / (rect.width  / 2);
      const dy   = (e.clientY - cy) / (rect.height / 2);

      card.style.transform = `
        translateY(-10px)
        scale(1.025)
        perspective(900px)
        rotateX(${-dy * 7}deg)
        rotateY(${dx * 7}deg)
      `;
    };

    const handleLeave = () => {
      card.style.transform = "";
    };

    card.addEventListener("mousemove", handleMove);
    card.addEventListener("mouseleave", handleLeave);
    return () => {
      card.removeEventListener("mousemove", handleMove);
      card.removeEventListener("mouseleave", handleLeave);
    };
  }, []);

  return (
    <div
      ref={cardRef}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        position: "relative",
        cursor: "pointer",
        borderRadius: "var(--card-radius)",
        background: isActive
          ? `linear-gradient(145deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.02) 100%)`
          : `linear-gradient(145deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)`,
        backdropFilter: "blur(16px) saturate(1.4)",
        WebkitBackdropFilter: "blur(16px) saturate(1.4)",
        border: `1px solid ${isActive ? agent.accentColor + "55" : "rgba(255,255,255,0.09)"}`,
        boxShadow: isActive
          ? `0 0 0 1px ${agent.accentColor}22, 0 16px 48px rgba(0,0,0,0.6), 0 0 80px ${agent.accentGlow}`
          : "0 4px 24px rgba(0,0,0,0.4), 0 1px 0 rgba(255,255,255,0.05) inset",
        transition: "border-color 0.4s ease, box-shadow 0.4s ease, transform 0.4s var(--ease-out-expo), background 0.4s ease",
        willChange: "transform",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        userSelect: "none",
      }}
    >
      {/* Corner decoration */}
      <div style={{ position: "absolute", top: 0, left: 0, width: 16, height: 16, pointerEvents: "none" }}>
        <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: 1.5, background: agent.accentColor, opacity: isActive ? 0.8 : 0.3 }} />
        <div style={{ position: "absolute", top: 0, left: 0, width: 1.5, height: "100%", background: agent.accentColor, opacity: isActive ? 0.8 : 0.3 }} />
      </div>
      <div style={{ position: "absolute", top: 0, right: 0, width: 16, height: 16, pointerEvents: "none" }}>
        <div style={{ position: "absolute", top: 0, right: 0, width: "100%", height: 1.5, background: agent.accentColor, opacity: isActive ? 0.8 : 0.3 }} />
        <div style={{ position: "absolute", top: 0, right: 0, width: 1.5, height: "100%", background: agent.accentColor, opacity: isActive ? 0.8 : 0.3 }} />
      </div>

      {/* Index badge */}
      <div
        style={{
          position: "absolute",
          top: 10,
          right: 12,
          fontFamily: "var(--font-display)",
          fontSize: "0.65rem",
          color: "rgba(255,255,255,0.2)",
          letterSpacing: "0.1em",
          zIndex: 2,
        }}
      >
        {String(index + 1).padStart(2, "0")}
      </div>

      {/* Agent visual */}
      <div style={{ height: 160, position: "relative", overflow: "hidden" }}>
        <AgentMark agent={agent} isActive={isActive} isHovered={isHovered} />

        {/* Scan line on hover */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `linear-gradient(180deg, transparent 0%, ${agent.accentColor}08 50%, transparent 100%)`,
            opacity: isHovered ? 1 : 0,
            transition: "opacity 0.3s ease",
            pointerEvents: "none",
          }}
        />
      </div>

      {/* Divider */}
      <div
        style={{
          height: 1,
          background: `linear-gradient(90deg, transparent, ${agent.accentColor}33, transparent)`,
          marginBottom: 0,
        }}
      />

      {/* Card content */}
      <div style={{ padding: "14px 16px", flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
        {/* Role + difficulty */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.6rem",
              fontWeight: 600,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: roleColor,
            }}
          >
            {agent.roleIcon} {agent.role}
          </span>
          <DifficultyDots level={agent.difficulty} />
        </div>

        {/* Name */}
        <h3
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(1.3rem, 3vw, 1.8rem)",
            fontWeight: 700,
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            color: "#FFFFFF",
            lineHeight: 0.95,
          }}
        >
          {agent.name}
        </h3>

        {/* Tagline */}
        <p
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "0.65rem",
            letterSpacing: "0.07em",
            textTransform: "uppercase",
            color: agent.accentColor,
            opacity: 0.85,
          }}
        >
          {agent.tagline}
        </p>

        {/* Description — hide on small mobile */}
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "0.78rem",
            color: "var(--color-text-muted)",
            lineHeight: 1.5,
            flex: 1,
          }}
        >
          {agent.description}
        </p>

        {/* CTA row */}
        <div style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 4 }}>
          <button
            style={{
              flex: 1,
              fontFamily: "var(--font-display)",
              fontSize: "0.72rem",
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#0A141D",
              background: agent.accentColor,
              border: "none",
              padding: "9px 0",
              borderRadius: 4,
              cursor: "pointer",
              transition: "all 0.3s var(--ease-out-expo)",
              boxShadow: isActive ? `0 4px 20px ${agent.accentColor}55` : "none",
            }}
            onClick={(e) => { e.stopPropagation(); handleClick(); }}
            onMouseEnter={(e) => {
              e.currentTarget.style.filter = "brightness(1.15)";
              e.currentTarget.style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.filter = "";
              e.currentTarget.style.transform = "";
            }}
          >
            View Profile →
          </button>
        </div>
      </div>

      {/* Bottom glow line */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: "10%",
          right: "10%",
          height: 1,
          background: `linear-gradient(90deg, transparent, ${agent.accentColor}, transparent)`,
          opacity: isActive ? 1 : 0,
          transition: "opacity 0.4s ease",
        }}
      />
    </div>
  );
}
