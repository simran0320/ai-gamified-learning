// src/lib/points.js

// Configurable constants for XP economy
export const XP_PER_MINUTE_WATCHED = 5;  // each minute watched yields XP
export const XP_PER_CORRECT_ANSWER = 20; // each correct quiz answer yields XP
export const LEVEL_XP = 200;             // XP threshold per level (simple linear)

// Compute level from total XP (simple linear model)
export function levelFromXP(xp) {
  return Math.floor(xp / LEVEL_XP) + 1;
}

// Award a badge when a rule matches (simple demo rules)
export function badgesFor({ totalMinutes, totalCorrect }) {
  const badges = [];
  if (totalMinutes >= 30) badges.push("Half-Hour Hero");
  if (totalMinutes >= 60) badges.push("One-Hour Scholar");
  if (totalCorrect >= 10) badges.push("Quiz Apprentice");
  if (totalCorrect >= 25) badges.push("Quiz Ninja");
  return badges;
}
