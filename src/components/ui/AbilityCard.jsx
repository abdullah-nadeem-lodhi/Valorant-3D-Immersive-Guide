const TYPE_STYLES = {
  Basic:     { bg: "rgba(255,255,255,0.06)", border: "rgba(255,255,255,0.1)",  label: "#EFEEE9" },
  Signature: { bg: "rgba(30,179,255,0.08)",  border: "rgba(30,179,255,0.25)", label: "#1EB3FF" },
  Ultimate:  { bg: "rgba(252,78,91,0.08)",   border: "rgba(252,78,91,0.25)",  label: "#FC4E5B" },
};

export default function AbilityCard({ ability, accentColor }) {
  const style = TYPE_STYLES[ability.type] ?? TYPE_STYLES.Basic;

  return (
    <div
      className="p-4 rounded-lg relative overflow-hidden"
      style={{
        background: style.bg,
        border: `1px solid ${style.border}`,
      }}
    >
      {/* Type badge */}
      <div className="flex items-center justify-between mb-2">
        <span
          className="rating-badge"
          style={{ background: style.border, color: style.label }}
        >
          {ability.type}
        </span>
      </div>

      {/* Name */}
      <p
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "1rem",
          color: "#FFFFFF",
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          marginBottom: "0.5rem",
        }}
      >
        {ability.name}
      </p>

      {/* Tip */}
      <p className="text-body" style={{ fontSize: "0.78rem", color: "var(--color-text-muted)" }}>
        💡 {ability.tip}
      </p>
    </div>
  );
}
