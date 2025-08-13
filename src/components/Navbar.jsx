// src/components/Navbar.jsx
import React from "react";
import { Link } from "react-router-dom";

/**
 * Top navigation with brand + quick links.
 * Tailwind utility classes keep it stylish and compact.
 */
export default function Navbar({ right }) {
  return (
    <header className="sticky top-0 z-40 backdrop-blur bg-black/30">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Brand */}
        <Link to="/" className="text-lg font-semibold tracking-wide">
          <span className="text-white">Health</span>
          <span className="text-[var(--brand)] ml-1">Coach AI</span>
        </Link>

        {/* Primary nav */}
        <nav className="hidden md:flex gap-6 text-sm text-[var(--muted)]">
          <Link to="/lesson/lesson1" className="hover:text-white">Lesson 1</Link>
          <Link to="/profile" className="hover:text-white">Profile</Link>
          <Link to="/admin" className="hover:text-white">Admin</Link>
        </nav>

        {/* Right side (Auth status or buttons) */}
        <div className="flex items-center gap-2">{right}</div>
      </div>
    </header>
  );
}
