// src/App.jsx
import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Lesson from "./pages/Lesson";
import Profile from "./pages/Profile";
import Admin from "./pages/Admin";
import { auth } from "./lib/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut
} from "firebase/auth";

/**
 * Root app: handles auth + routes + navbar.
 * We keep auth super simple (email/password) and show status in nav.
 */
export default function App() {
  const [user, setUser] = useState(null);     // current user object (or null)
  const [email, setEmail] = useState("");     // email input state
  const [password, setPassword] = useState("");// password input state
  const [mode, setMode] = useState("login");  // "login" or "register"

  // Subscribe to auth state changes (login/logout)
  useEffect(() => {
    return auth.onAuthStateChanged(setUser);
  }, []);

  // Register a new user with email+password
  const register = async (e) => {
    e.preventDefault();
    await createUserWithEmailAndPassword(auth, email, password);
  };

  // Login an existing user
  const login = async (e) => {
    e.preventDefault();
    await signInWithEmailAndPassword(auth, email, password);
  };

  // Logout
  const logout = async () => {
    await signOut(auth);
  };

  // Right side of navbar: auth status + actions
  const right = user ? (
    <div className="flex items-center gap-3">
      <span className="text-sm text-[var(--muted)] hidden md:inline">{user.email}</span>
      <button className="btn" onClick={logout}>Logout</button>
    </div>
  ) : (
    <form onSubmit={mode === "login" ? login : register} className="flex items-center gap-2">
      <input
        className="px-3 py-2 rounded-xl bg-white/10 placeholder:text-white/50"
        placeholder="Email"
        type="email" value={email} onChange={e=>setEmail(e.target.value)} required
      />
      <input
        className="px-3 py-2 rounded-xl bg-white/10 placeholder:text-white/50"
        placeholder="Password"
        type="password" value={password} onChange={e=>setPassword(e.target.value)} required
      />
      <button className="btn" type="submit">{mode === "login" ? "Sign In" : "Register"}</button>
      <button type="button" className="badge" onClick={()=>setMode(mode==="login"?"register":"login")}>
        {mode === "login" ? "Need an account?" : "Have an account?"}
      </button>
    </form>
  );

  return (
    <BrowserRouter>
      <Navbar right={right} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/lesson/:id" element={user ? <Lesson /> : <PleaseLogin />} />
        <Route path="/profile" element={user ? <Profile /> : <PleaseLogin />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
      <footer className="max-w-6xl mx-auto px-4 py-10 text-xs text-[var(--muted)]">
        Built with Firebase + OpenAI • © You
      </footer>
    </BrowserRouter>
  );
}

// Small component shown when unauthenticated user tries to access protected routes
function PleaseLogin() {
  return (
    <div className="max-w-xl mx-auto px-4 py-10 text-center card">
      <h3 className="font-semibold">Please sign in</h3>
      <p className="text-sm text-[var(--muted)] mt-1">Create an account or sign in from the top bar.</p>
    </div>
  );
}
