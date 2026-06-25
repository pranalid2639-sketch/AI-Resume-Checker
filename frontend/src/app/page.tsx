"use client";

import { useState } from "react";

export default function Home() {
  const [resume, setResume] = useState<File | null>(null);
  const [jd, setJd] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!resume) {
      alert("Please upload a resume");
      return;
    }

    if (!jd.trim()) {
      alert("Please enter a Job Description");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();

      formData.append("resume", resume);
      formData.append("jd", jd);

      const response = await fetch(
        "http://127.0.0.1:8000/analyze",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      console.log("API Response:", data);

      setResult(data);
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    }

    setLoading(false);
  };

  const handleDownloadReport = async () => {
    if (!result) {
      alert("Please analyze a resume first");
      return;
    }

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/download-report",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(result),
        }
      );

      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "ATS_Report.pdf";

      document.body.appendChild(a);
      a.click();
      a.remove();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
      alert("Failed to download report");
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 p-8 text-white">
      <div className="max-w-5xl mx-auto">

        {/* Upload Card */}
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl p-10">
          <h1 className="text-6xl font-extrabold text-center mb-3 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
  AI Resume Checker
</h1>

<p className="text-center text-gray-300 mb-10">
  Analyze Resume • Improve ATS Score • Get Gemini AI Insights
</p>

          <div className="mb-6">
            <label className="font-semibold block mb-2">
              Upload Resume
            </label>

            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(e) =>
                setResume(e.target.files?.[0] || null)
              }
              className="w-full border p-3 rounded-lg"
            />

            {resume && (
              <p className="mt-2 text-sm font-semibold text-cyan-500">
  Selected: {resume.name}
</p>
            )}
          </div>

          <div className="mb-6">
            <label className="font-semibold block mb-2">
              Job Description
            </label>

            <textarea
              value={jd}
              onChange={(e) => setJd(e.target.value)}
              placeholder="Paste Job Description here..."
              className="w-full border p-3 rounded-lg h-52"
            />
          </div>

          <button
            onClick={handleAnalyze}
            disabled={loading}
           className="w-full py-4 rounded-xl font-bold text-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:scale-105 transition-all duration-300 shadow-lg"
          >
            {loading ? "Analyzing..." : "Analyze Resume"}
          </button>
        </div>

        {result && (
          <div className="mt-8">

            {/* Download Button */}
            <div className="mb-6">
              <button
                onClick={handleDownloadReport}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold"
              >
                📄 Download ATS Report
              </button>
            </div>

            {/* ATS Score */}
            <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl p-8 mb-6">
              <h2 className="text-3xl font-bold mb-6">
                ATS Score
              </h2>

              <div className="flex items-center justify-between mb-4">
                <div className="text-7xl font-extrabold bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">
                  {result.score}%
                </div>

                <div>
                  {result.score >= 86 ? (
                    <span className="bg-green-500 text-white px-4 py-2 rounded-full">
                      Excellent Resume
                    </span>
                  ) : result.score >= 71 ? (
                    <span className="bg-blue-500 text-white px-4 py-2 rounded-full">
                      Good Resume
                    </span>
                  ) : result.score >= 41 ? (
                    <span className="bg-yellow-500 text-white px-4 py-2 rounded-full">
                      Average Resume
                    </span>
                  ) : (
                    <span className="bg-red-500 text-white px-4 py-2 rounded-full">
                      Poor Resume
                    </span>
                  )}
                </div>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-8 overflow-hidden">
                <div
                  className="h-8 flex items-center justify-center text-white font-semibold transition-all duration-700"
                  style={{
                    width: `${result.score}%`,
                    background:
                      result.score >= 80
                        ? "#22c55e"
                        : result.score >= 60
                        ? "#3b82f6"
                        : "#ef4444",
                  }}
                >
                  {result.score}%
                </div>
              </div>
            </div>

            {/* Matched Keywords */}
            <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl p-6 mb-6">
              <h2 className="text-2xl font-bold mb-4 text-green-700">
                ✅ Matched Keywords
              </h2>

              <div className="flex flex-wrap gap-2">
                {result.matched_keywords?.map(
                  (keyword: string, index: number) => (
                    <span
                      key={index}
                      className="bg-green-500/20 border border-green-400 text-green-300 px-4 py-2 rounded-full hover:scale-105 transition"
                    >
                      {keyword}
                    </span>
                  )
                )}
              </div>
            </div>

            {/* Missing Keywords */}
            <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl p-6 mb-6">
              <h2 className="text-2xl font-bold mb-4 text-red-700">
                ❌ Missing Keywords
              </h2>

              <div className="flex flex-wrap gap-2">
                {result.missing_keywords?.map(
                  (keyword: string, index: number) => (
                    <span
                      key={index}
                      className="bg-red-500/20 border border-red-400 text-red-300 px-4 py-2 rounded-full hover:scale-105 transition"
                    >
                      {keyword}
                    </span>
                  )
                )}
              </div>
            </div>

            {/* Suggestions */}
            <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl p-6 mb-6">
              <h2 className="text-2xl font-bold mb-4">
                💡 Suggestions
              </h2>

              <ul className="space-y-3">
                {result.suggestions?.map(
                  (suggestion: string, index: number) => (
                    <li
                      key={index}
                      className="border-b pb-3"
                    >
                      • {suggestion}
                    </li>
                  )
                )}
              </ul>
            </div>

            {/* AI Analysis */}
            {result.ai_feedback && (
  <div className="backdrop-blur-xl bg-white/10 border border-cyan-400/30 rounded-3xl shadow-2xl p-8">
    <div className="flex items-center gap-3 mb-6">
      <span className="text-4xl">🤖</span>

      <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
        Gemini AI Resume Analysis
      </h2>
    </div>

    <div className="bg-black/20 rounded-2xl p-6 border border-white/10">
      <pre className="whitespace-pre-wrap text-gray-200 leading-8 font-medium">
        {result.ai_feedback}
      </pre>
    </div>
  </div>
)}

          </div>
        )}
      </div>
    </main>
  );
}