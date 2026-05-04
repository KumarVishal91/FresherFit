interface Props {
  bullets: { original: string; rewritten: string }[];
}

export default function BulletRewriter({ bullets }: Props) {
  if (!bullets.length) return null;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
      <h2 className="text-xl font-bold text-gray-800">✏️ Bullet Point Rewrites</h2>
      <p className="text-sm text-gray-500">Weak bullets rewritten with strong action verbs & metrics</p>
      <div className="space-y-4">
        {bullets.map((b, i) => (
          <div key={i} className="rounded-xl overflow-hidden border border-gray-100">
            <div className="bg-red-50 p-3">
              <p className="text-xs text-red-500 font-semibold mb-1">BEFORE</p>
              <p className="text-sm text-gray-700">{b.original}</p>
            </div>
            <div className="bg-green-50 p-3">
              <p className="text-xs text-green-600 font-semibold mb-1">AFTER</p>
              <p className="text-sm text-gray-700 font-medium">{b.rewritten}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
