"use client";

import React, { useState } from "react";

const questions = [
  {
    key: "protein",
    question: "Which type of protein would you prefer?",
    options: ["Chicken", "Beef", "Pork", "Fish", "Vegan"],
  },
  {
    key: "mainCarb",
    question: "Which staple would you prefer?",
    options: ["Rice", "Noodles", "Pasta", "Bread"],
  },
  {
    key: "taste",
    question: "What flavor profile do you prefer?",
    options: ["Sweet", "Savory", "Salty"],
  },
  {
    key: "budget",
    question: "What is your preferred budget range?",
    options: ["1-3", "3-5", "5-7", "7-10"],
  },
  {
    key: "dietaryType",
    question: "Which dietary consideration applies to you?",
    options: ["Halal", "Non-Halal", "Vegetarian"],
  },
];

export default function PreferencePage() {
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (key, value) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  };

  const allAnswered = questions.every((q) => answers[q.key]);

  const handleSubmit = async () => {
    if (!allAnswered) return;
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/preferences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(answers),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to save preferences");
      }

      setSubmitted(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-2xl text-black">
        <h1 className="text-3xl font-bold mb-6">Tell Us Your Preferences</h1>

        {questions.map((q) => (
          <div key={q.key} className="mb-4">
            <label className="block font-medium mb-1">{q.question}</label>
            <select
              className="w-full p-2 border rounded text-black"
              value={answers[q.key] || ""}
              onChange={(e) => handleChange(q.key, e.target.value)}
            >
              <option value="">Select an option</option>
              {q.options.map((opt) => (
                <option key={opt} value={opt.toLowerCase()}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        ))}

        {!allAnswered && (
          <div className="text-red-600 text-sm mb-2">
            Please answer all questions before submitting.
          </div>
        )}
        {error && <div className="text-red-600 mt-2">{error}</div>}
        {submitted && (
          <div className="text-green-600 mt-2">
            Preferences saved successfully!
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={!allAnswered || submitting}
          className={`w-full mt-4 px-4 py-2 rounded text-white transition ${
            allAnswered && !submitting
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          {submitting ? "Submitting..." : "Submit Preferences"}
        </button>
      </div>
    </div>
  );
}

// asyiq