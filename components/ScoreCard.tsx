interface Props {
  atsScore: number;
  jdMatchScore: number | null;
  strengths: string[];
  weaknesses: string[];
}

function ScoreRing({ score, label, color }: { score: number; label: string; color: string }) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-2">
      <svg width="130" height="130" viewBox="0 0 130 130">
        <circle cx="65" cy="65" r={radius} fill="none" stroke="#e5e7eb" strokeWidth="10" />
        <circle
          cx="65" cy="65" r={radius} fill="none"
          stroke={color} strokeWidth="10"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 65 65)"
          style={{ transition: "stroke-dashoffset 1s ease" }}
        />
        <text x="65" y="65" textAnchor="middle" dy="0.35em" fontSize="22" fontWeight="bold" fill="#1f2937">
          {score}
        </text>
      </svg>
      <span className="text-sm font-medium text-gray-600">{label}</span>
    </div>
  );
}

export default function ScoreCard({ atsScore, jdMatchScore, strengths, weaknesses }: Props) {
  const atsColor = atsScore >= 75 ? "#10b981" : atsScore >= 50 ? "#f59e0b" : "#ef4444";
  const jdColor = jdMatchScore
    ? jdMatchScore >= 75 ? "#10b981" : jdMatchScore >= 50 ? "#f59e0b" : "#ef4444"
    : "#6b7280";

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-6">
      <h2 className="text-xl font-bold text-gray-800">📊 Your Scores</h2>
      <div className="flex justify-around">
        <ScoreRing score={atsScore} label="ATS Score" color={atsColor} />
        {jdMatchScore !== null && (
          <ScoreRing score={jdMatchScore} label="JD Match" color={jdColor} />
        )}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h3 className="text-green-700 font-semibold mb-2">✅ Strengths</h3>
          <ul className="space-y-1">
            {strengths.map((s, i) => (
              <li key={i} className="text-sm text-gray-600">• {s}</li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-red-600 font-semibold mb-2">⚠️ Weaknesses</h3>
          <ul className="space-y-1">
            {weaknesses.map((w, i) => (
              <li key={i} className="text-sm text-gray-600">• {w}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
