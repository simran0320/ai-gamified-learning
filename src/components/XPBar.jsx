// src/components/XPBar.jsx
import React from "react";
import { levelFromXP, LEVEL_XP } from "../lib/points";

/**
 * Visualize current XP and level.
 * Props: xp (number)
 */
export default function XPBar({ xp = 0 }) {
  const level = levelFromXP(xp);              // compute level from XP
  const progress = (xp % LEVEL_XP) / LEVEL_XP;// progress within current level
  const pct = Math.round(progress * 100);     // 0-100%

  return (
    <div className="card p-4">
      <div className="flex items-baseline justify-between">
        <h3 className="font-semibold">Level {level}</h3>
        <span className="badge">{xp} XP</span>
      </div>
      <div className="mt-3 h-3 w-full rounded-full bg-white/10 overflow-hidden">
        <div className="h-full" style={{ width: `${pct}%`, background: "var(--brand)" }} />
      </div>
      <div className="mt-2 text-xs text-[var(--muted)]">{pct}% to next level</div>
    </div>
  );
}
