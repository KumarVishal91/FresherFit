interface Props {
  missingKeywords: string[];
  actionableFeedback: string[];
}

export default function JDMatcher({ missingKeywords, actionableFeedback }: Props) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">
      <h2 className="text-xl font-bold text-gray-800">🔍 Gap Analysis & Tips</h2>
      {missingKeywords.length > 0 && (
        <div>
          <h3 className="font-semibold text-gray-700 mb-2">Missing Keywords</h3>
          <div className="flex flex-wrap gap-2">
            {missingKeywords.map((kw, i) => (
              <span key={i} className="bg-orange-100 text-orange-700 text-xs font-medium px-3 py-1 rounded-full">
                {kw}
              </span>
            ))}
          </div>
        </div>
      )}
      <div>
        <h3 className="font-semibold text-gray-700 mb-2">💡 Actionable Feedback</h3>
        <ul className="space-y-2">
          {actionableFeedback.map((tip, i) => (
            <li key={i} className="flex gap-2 text-sm text-gray-600">
              <span className="text-violet-500 font-bold">{i + 1}.</span>
              {tip}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
