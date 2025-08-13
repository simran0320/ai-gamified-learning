// src/pages/Lesson.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import VideoPlayer from "../components/VideoPlayer";
import Quiz from "../components/Quiz";
import XPBar from "../components/XPBar";
import { trackEvent } from "../lib/tracker";
import axios from "axios";
import { XP_PER_MINUTE_WATCHED, badgesFor, levelFromXP } from "../lib/points";

/**
 * Lesson page for the Public Health playlist.
 * For Lesson 1, we start with the first video from the provided playlist.
 * You can expand to a full playlist browser later.
 */
export default function Lesson() {
  const { id } = useParams(); // e.g., "lesson1"
  // Provided by you: Crash Course Public Health playlist, first video ID:
  const playlistId = "PL8dPuuaLjXtPjQj_LcJ0Zvj-VI3sslJyF";
  const firstVideoId = "PjdJ19ugXzQ";

  const [videoId, setVideoId] = useState(firstVideoId);
  const [summary, setSummary] = useState("");
  const [quiz, setQuiz] = useState([]);
  const [xp, setXP] = useState(0);
  const [badges, setBadges] = useState([]);

  // Award XP helper and update badges on the fly
  const awardXP = (delta) => {
    setXP((x) => {
      const nx = Math.max(0, Math.floor(x + delta));
      setBadges(badgesFor({ totalMinutes: nx / XP_PER_MINUTE_WATCHED, totalCorrect: 0 }));
      return nx;
    });
  };

  // Every second watched → XP (5 XP/minute = ~0.083 XP/sec)
  const handleSecondsWatched = (secs) => {
    const xpPerSec = XP_PER_MINUTE_WATCHED / 60;
    const gained = secs * xpPerSec;
    if (gained > 0) awardXP(gained);
  };

  // On mount: track page view
  useEffect(() => {
    trackEvent("page_view", { page: "lesson", lessonId: id, playlistId, videoId });
  }, [id, playlistId, videoId]);

  // Call Cloud Function to summarize current video transcript
  const summarizeVideo = async () => {
    setSummary("Summarizing…");
    try {
      const res = await axios.post("/api/summarize-video", { videoId });
      setSummary(res.data.summary || "(No summary)");
      trackEvent("ai_summary_request", { videoId });
    } catch (e) {
      setSummary("Failed to summarize (maybe no transcript).");
    }
  };

  // Generate a quiz from transcript and render it
  const generateQuiz = async () => {
    try {
      const res = await axios.post("/api/generate-quiz", { videoId });
      setQuiz(res.data.questions || []);
      trackEvent("ai_quiz_generated", { videoId, count: res.data.questions?.length || 0 });
    } catch (e) {
      setQuiz([]);
      alert("Failed to generate quiz (try again or pick another video).");
    }
  };

  // XP for quiz correctness is awarded by <Quiz />
  const handleQuizXP = (xp) => awardXP(xp);

  const lvl = levelFromXP(xp);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      {/* Header row: title + controls */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold">Lesson 1 · Public Health</h2>
          <div className="text-[var(--muted)] text-sm">Crash Course playlist • Video {videoId}</div>
        </div>
        <div className="flex gap-2">
          <button className="btn" onClick={summarizeVideo}>AI Summarize</button>
          <button className="btn" style={{ background:"#22c55e" }} onClick={generateQuiz}>Generate Quiz</button>
        </div>
      </div>

      {/* Main grid: player + right rail */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <VideoPlayer videoId={videoId} onSecondsWatched={handleSecondsWatched} />

          {summary && (
            <div className="card p-4">
              <h3 className="font-semibold">AI Summary</h3>
              <pre className="mt-2 whitespace-pre-wrap">{summary}</pre>
            </div>
          )}

          {/* Quiz renders if available */}
          <Quiz questions={quiz} videoId={videoId} onAwardXP={handleQuizXP} />
        </div>

        {/* Right rail: XP + quick plan (placeholder) */}
        <div className="space-y-6">
          <div className="card p-4">
            <h3 className="font-semibold">Your Progress</h3>
            <div className="text-sm text-[var(--muted)]">Level {lvl} • {Math.round(xp)} XP</div>
          </div>

          <div className="card p-4">
            <h3 className="font-semibold">Suggested Plan</h3>
            <p className="text-sm text-[var(--muted)]">
              Watch the current video, read the summary, take the quiz.
              Get {XP_PER_MINUTE_WATCHED} XP/min for watching; bonus XP for correct answers.
            </p>
            <p className="text-sm text-[var(--muted)] mt-2">
              After you finish, we’ll recommend the next video based on your performance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
