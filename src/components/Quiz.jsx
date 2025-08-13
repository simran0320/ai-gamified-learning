// src/components/Quiz.jsx
import React, { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db, ts } from "../lib/firebase";
import { trackEvent } from "../lib/tracker";

/**
 * Quiz renders MCQs and records attempts.
 * Props:
 *  - questions: [{ id, q, choices:[], answerIndex }]
 *  - videoId: string
 *  - onAwardXP: (xp) => void
 */
export default function Quiz({ questions = [], videoId, onAwardXP }) {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(null);

  // Toggle one answer; track every answer click
  const choose = (qId, idx) => {
    setAnswers((s) => ({ ...s, [qId]: idx }));
    trackEvent("quiz_question_answer", { videoId, questionId: qId, selected: idx });
  };

  // Submit: score, persist attempt, award XP, and emit event
  const handleSubmit = async () => {
    if (!questions.length) return;

    let correct = 0;
    const details = [];

    for (const q of questions) {
      const sel = answers[q.id];
      const isCorrect = sel === q.answerIndex;
      if (isCorrect) correct++;
      details.push({ qId: q.id, selected: sel ?? null, correct: !!isCorrect });
    }

    const pct = Math.round((correct / questions.length) * 100);
    setScore(pct);
    setSubmitted(true);

    // Save attempt to Firestore
    await addDoc(collection(db, "quizAttempts"), {
      videoId,
      answers: details,
      score: pct,
      createdAt: ts()
    });

    // Track submit
    trackEvent("quiz_submit", { videoId, score: pct });

    // Award XP for correct answers (20 per correct by default)
    onAwardXP?.(correct * 20);
  };

  if (!questions.length) {
    return <div className="text-sm text-[var(--muted)]">No quiz available yet.</div>;
  }

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Quiz</h3>
        {!submitted && (
          <button className="btn" onClick={handleSubmit}>Submit</button>
        )}
      </div>

      <div className="mt-4 space-y-5">
        {questions.map((q, i) => (
          <div key={q.id} className="p-4 rounded-xl bg-white/5">
            <p className="font-medium mb-2">{i + 1}. {q.q}</p>
            <div className="space-y-2">
              {q.choices.map((c, idx) => {
                const active = answers[q.id] === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => choose(q.id, idx)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition ${
                      active ? "bg-[var(--brand)]/20 border border-[var(--brand)]" : "bg-white/5 hover:bg-white/10"
                    }`}
                  >
                    {String.fromCharCode(65 + idx)}. {c}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {submitted && (
        <div className="mt-4 text-center">
          <div className="text-lg font-semibold">Your Score: {score}%</div>
          <div className="text-sm text-[var(--muted)]">Great work! Keep going.</div>
        </div>
      )}
    </div>
  );
}
