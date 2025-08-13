// src/pages/Admin.jsx
import React, { useEffect, useState } from "react";
import { trackEvent } from "../lib/tracker";
import { db } from "../lib/firebase";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";

/**
 * Admin screen lists recent events. (In rules we’ll restrict reads as needed.)
 */
export default function Admin() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    trackEvent("page_view", { page: "admin" });
    (async () => {
      try {
        const q = query(collection(db, "events"), orderBy("timestamp", "desc"), limit(50));
        const snap = await getDocs(q);
        setEvents(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (e) {
        console.warn("Admin cannot read events due to rules (that’s okay in prod).");
      }
    })();
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <h2 className="text-xl font-semibold mb-4">Recent Events</h2>
      <div className="card p-4 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-left text-[var(--muted)]">
            <tr><th>Type</th><th>Session</th><th>Page</th><th>Meta</th></tr>
          </thead>
          <tbody>
            {events.map(e => (
              <tr key={e.id} className="border-t border-white/10">
                <td className="py-2">{e.eventType}</td>
                <td>{e.sessionId}</td>
                <td>{e.pageUrl}</td>
                <td><pre className="max-w-[360px] whitespace-pre-wrap">{JSON.stringify(e.metadata)}</pre></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
