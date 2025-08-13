// src/pages/Home.jsx
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import XPBar from "../components/XPBar";
import { trackEvent } from "../lib/tracker";

/**
 * Landing dashboard with quick start and XP overview.
 */
export default function Home({ xp = 0, badges = [] }) {
  useEffect(() => {
    trackEvent("page_view", { page: "home" });
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      {/* Hero */}
      <div className="card p-6 md:p-8">
        <h1 className="text-2xl md:text-3xl font-semibold">Welcome to <span className="text-[var(--brand)]">HealthCoach AI</span></h1>
        <p className="mt-2 text-[var(--muted)]">Watch lessons, get AI summaries, take quizzes, earn XP, unlock badges, and get a personalized plan.</p>
        <div className="mt-4 flex gap-3">
          <Link to="/lesson/lesson1" className="btn">Start Lesson 1</Link>
          <Link to="/profile" className="btn" style={{ background:"#2dd4bf" }}>View Profile</Link>
        </div>
      </div>

      {/* XP & Badges */}
      <div className="grid md:grid-cols-2 gap-6">
        <XPBar xp={xp} />
        <div className="card p-4">
          <h3 className="font-semibold">Badges</h3>
          <div className="mt-2 flex gap-2 flex-wrap">
            {badges.length ? badges.map((b, i) => (
              <span key={i} className="badge">{b}</span>
            )) : <span className="text-sm text-[var(--muted)]">No badges yet. Earn XP to unlock!</span>}
          </div>
        </div>
      </div>

      {/* Recommendations shell (we’ll fill from a Function call later) */}
      <div className="card p-4">
        <h3 className="font-semibold">Recommended Next</h3>
        <p className="text-[var(--muted)] text-sm">Take Lesson 1 to unlock personalized suggestions.</p>
      </div>
    </div>
  );
}
