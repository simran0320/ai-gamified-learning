// src/lib/tracker.js

// Firestore helpers for writing documents
import { collection, addDoc } from "firebase/firestore";
// Our db instance + server timestamp helper
import { db, ts } from "./firebase";

/**
 * Get or create a lightweight session ID stored in localStorage.
 * This lets us stitch events together within a browser session.
 */
function getSessionId() {
  let s = localStorage.getItem("sessionId");
  if (!s) {
    s = "sess_" + Math.random().toString(36).slice(2);
    localStorage.setItem("sessionId", s);
  }
  return s;
}

/**
 * Track an event into Firestore /events collection.
 * @param {string} eventType - e.g., 'page_view', 'video_play', 'quiz_submit'
 * @param {object} data - free-form metadata to attach
 */
export async function trackEvent(eventType, data = {}) {
  // Build the payload with consistent fields
  const payload = {
    sessionId: getSessionId(),         // link events within a session
    eventType,                         // what happened
    pageUrl: window.location.pathname, // where it happened
    metadata: data,                    // any additional details
    timestamp: ts()                    // server-side event time
  };
  try {
    // Write to Firestore "events" as a new doc
    await addDoc(collection(db, "events"), payload);
  } catch (err) {
    // For demo, log if something fails
    console.error("trackEvent failed:", err);
  }
}
