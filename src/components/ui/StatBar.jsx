import { useEffect, useRef, useState } from "react";

export default function StatBar({ label, value, color, delay = 0 }) {
  const [animated, setAnimated] = useState(false);
  const barRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <span className="text-label">{label}</span>
        <span
          className="font-display"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "0.8rem",
            color,
            letterSpacing: "0.08em",
          }}
        >
          {value}
        </span>
      </div>
      <div className="stat-bar-track">
        <div
          ref={barRef}
          className="stat-bar-fill"
          style={{
            width: animated ? `${value}%` : "0%",
            background: `linear-gradient(90deg, ${color}88, ${color})`,
            boxShadow: animated ? `0 0 8px ${color}66` : "none",
            transition: `width 1.2s var(--ease-out-expo) ${delay}ms`,
          }}
        />
      </div>
    </div>
  );
}
