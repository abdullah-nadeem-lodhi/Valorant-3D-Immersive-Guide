import { MODE_RATING_COLOR } from "../../data/agents";

const MODE_LABELS = {
  unrated:     "Unrated",
  competitive: "Competitive",
  spikeRush:   "Spike Rush",
  deathmatch:  "Deathmatch",
};

function RatingBadge({ rating }) {
  const color = MODE_RATING_COLOR[rating] ?? "#EFEEE9";
  return (
    <span
      className="rating-badge"
      style={{
        background: color + "18",
        color,
        border: `1px solid ${color}33`,
      }}
    >
      {rating}
    </span>
  );
}

export default function GameModeTable({ gameModes, accentColor }) {
  return (
    <div className="flex flex-col gap-2">
      {Object.entries(gameModes).map(([mode, rating]) => (
        <div
          key={mode}
          className="flex items-center justify-between py-2.5 px-4 rounded-lg"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <span className="text-label" style={{ color: "var(--color-text-muted)" }}>
            {MODE_LABELS[mode]}
          </span>
          <RatingBadge rating={rating} />
        </div>
      ))}
    </div>
  );
}
