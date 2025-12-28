export default function MetadataCard({ result }) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold text-slate-800 mb-4">Metadata</h2>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-slate-600">Media ID:</span>
          <span className="text-slate-800 font-mono text-xs">{result.media_id}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-600">Type:</span>
          <span className="text-slate-800 capitalize">{result.type}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-600">Analyzed:</span>
          <span className="text-slate-800">
            {new Date(result.analyzed_at).toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}