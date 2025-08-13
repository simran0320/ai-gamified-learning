// src/pages/Profile.jsx
import React, { useEffect } from "react";
import XPBar from "../components/XPBar";
import { trackEvent } from "../lib/tracker";

/**
 * Simple profile page. You can expand to show history/progress saved in Firestore.
 */
export default function Profile({ xp = 0, badges = [] }) {
  useEffect(() => { trackEvent("page_view", { page: "profile" }); }, []);

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
      <XPBar xp={xp} />
      <div className="card p-4">
        <h3 className="font-semibold">Your Badges</h3>
        <div className="mt-2 flex gap-2 flex-wrap">
          {badges.length ? badges.map((b, i) => (
            <span key={i} className="badge">{b}</span>
          )) : <span className="text-sm text-[var(--muted)]">None yet — complete a quiz and watch more minutes!</span>}
        </div>
      </div>
    </div>
  );
}
