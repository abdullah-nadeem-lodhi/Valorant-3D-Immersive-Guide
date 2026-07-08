export const AGENTS = [
  {
    id: "sova",
    name: "SOVA",
    role: "Initiator",
    tagline: "Track. Reveal. Eliminate.",
    difficulty: 2,
    accentColor: "#1EB3FF",
    accentGlow: "rgba(30, 179, 255, 0.20)",
    description: "A master tracker who gathers enemy intel before the fight.",
    abilities: [
      { name: "Owl Drone", type: "Basic", tip: "Scout corners before walking in." },
      { name: "Recon Bolt", type: "Signature", tip: "Cover common hiding spots." },
    ],
    gameModes: { unrated: "Excellent", competitive: "Excellent", spikeRush: "Good", deathmatch: "Fair" },
    tips: [
      "Always fire Recon Bolt toward site at round start.",
      "Combine Shock Bolt with team push.",
    ],
    palette: {
      bgGradient: "radial-gradient(ellipse at 60% 50%, rgba(30,179,255,0.12) 0%, transparent 70%)",
      particleColor: "#1EB3FF",
    },
    roleIcon: "◎",
    stats: { mobility: 40, firepower: 70, utility: 90, survivability: 60 },
  },
  {
    id: "sage",
    name: "SAGE",
    role: "Sentinel",
    tagline: "Protect. Heal. Resurrect.",
    difficulty: 1,
    accentColor: "#00D4A8",
    accentGlow: "rgba(0,212,168,0.20)",
    description: "The team's lifeline. She can wall off entrances and revive allies.",
    abilities: [
      { name: "Barrier Orb", type: "Basic", tip: "Block the main choke point." },
      { name: "Resurrection", type: "Ultimate", tip: "Save it for the spike carrier." },
    ],
    gameModes: { unrated: "Excellent", competitive: "Excellent", spikeRush: "Excellent", deathmatch: "Poor" },
    tips: [
      "Always have Healing Orb ready for your carry.",
      "Barrier Orb on door gaps forces detours.",
    ],
    palette: {
      bgGradient: "radial-gradient(ellipse at 40% 50%, rgba(0,212,168,0.12) 0%, transparent 70%)",
      particleColor: "#00D4A8",
    },
    roleIcon: "⬡",
    stats: { mobility: 30, firepower: 45, utility: 85, survivability: 95 },
  },
  {
    id: "jett",
    name: "JETT",
    role: "Duelist",
    tagline: "Strike fast. Dash faster.",
    difficulty: 3,
    accentColor: "#A8D8FF",
    accentGlow: "rgba(168, 216, 255, 0.18)",
    description: "Agile and lethal. Built for confident aimers who love making highlight plays.",
    abilities: [
      { name: "Cloudburst", type: "Basic", tip: "Pop smokes on contact." },
      { name: "Tailwind", type: "Signature", tip: "Dash out of a losing fight instantly." },
    ],
    gameModes: { unrated: "Good", competitive: "Excellent", spikeRush: "Excellent", deathmatch: "Excellent" },
    tips: [
      "Use Updraft + Tailwind together for unique sightlines.",
      "Blade Storm knives reset on kill.",
    ],
    palette: {
      bgGradient: "radial-gradient(ellipse at 50% 40%, rgba(168,216,255,0.10) 0%, transparent 70%)",
      particleColor: "#A8D8FF",
    },
    roleIcon: "◈",
    stats: { mobility: 98, firepower: 80, utility: 60, survivability: 55 },
  },
  {
    id: "phoenix",
    name: "PHOENIX",
    role: "Duelist",
    tagline: "Flash. Fight. Reborn.",
    difficulty: 2,
    accentColor: "#FF7A1A",
    accentGlow: "rgba(255, 122, 26, 0.20)",
    description: "A self-sufficient fighter who heals from his own fire.",
    abilities: [
      { name: "Curveball", type: "Basic", tip: "Curve the flash around corners." },
      { name: "Run It Back", type: "Ultimate", tip: "Entry aggressively without risk." },
    ],
    gameModes: { unrated: "Good", competitive: "Good", spikeRush: "Excellent", deathmatch: "Good" },
    tips: [
      "Always curve Curveball from the edge of cover.",
      "Hot Hands heals you if you stand inside it.",
    ],
    palette: {
      bgGradient: "radial-gradient(ellipse at 55% 55%, rgba(255, 122, 26, 0.14) 0%, transparent 70%)",
      particleColor: "#FF7A1A",
    },
    roleIcon: "⬡",
    stats: { mobility: 65, firepower: 85, utility: 70, survivability: 75 },
  },
];

export const ROLE_COLORS = {
  Initiator: "#1EB3FF",
  Sentinel: "#00D4A8",
  Duelist: "#FC4E5B",
  Controller: "#A855F7",
};

export const MODE_RATING_COLOR = {
  Excellent: "#00D4A8",
  Good: "#1EB3FF",
  Fair: "#FF7A1A",
  Poor: "#FC4E5B",
};
