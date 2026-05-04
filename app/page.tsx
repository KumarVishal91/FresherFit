"use client";
import { useState } from "react";
import ResumeUploader from "@/components/ResumeUploader";
import ScoreCard from "@/components/ScoreCard";
import BulletRewriter from "@/components/BulletRewriter";
import JDMatcher from "@/components/JDMatcher";
import { AnalysisResult } from "@/lib/claude";

export default function Home() {
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!resumeText) return;
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText, jobDescription }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      setResult(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-violet-50 to-indigo-50">
      <div className="max-w-3xl mx-auto px-4 py-12 space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-extrabold text-gray-900">
            🎓 FresherFit
          </h1>
          <p className="text-gray-500 text-lg">
            AI-powered resume analyzer for students — beat ATS, land interviews
          </p>
        </div>

        {/* Upload */}
        <ResumeUploader onTextExtracted={setResumeText} isLoading={isLoading} />

        {/* Job Description */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-2">
          <label className="font-semibold text-gray-700">
            📋 Job Description{" "}
            <span className="text-gray-400 font-normal text-sm">(optional)</span>
          </label>
          <textarea
            rows={5}
            placeholder="Paste the job description here to get a match score and gap analysis..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            className="w-full border border-gray-200 rounded-xl p-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-violet-400 resize-none"
          />
        </div>

        {/* Analyze Button */}
        <button
          onClick={handleAnalyze}
          disabled={!resumeText || isLoading}
          className="w-full bg-violet-600 hover:bg-violet-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-4 rounded-2xl transition-all text-lg shadow-md"
        >
          {isLoading ? "⏳ Analyzing your resume..." : "🚀 Analyze My Resume"}
        </button>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-4 text-sm">
            {error}
          </div>
        )}

        {/* Results */}
        {result && (
          <div className="space-y-6 animate-fadeIn">
            <ScoreCard
              atsScore={result.atsScore}
              jdMatchScore={result.jdMatchScore}
              strengths={result.strengths}
              weaknesses={result.weaknesses}
            />
            <BulletRewriter bullets={result.rewrittenBullets} />
            <JDMatcher
              missingKeywords={result.missingKeywords}
              actionableFeedback={result.actionableFeedback}
            />
          </div>
        )}
      </div>
    </main>
  );
}
