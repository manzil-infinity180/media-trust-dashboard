import React from 'react';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { getVerdictColor, getVerdictLabel } from '../utils/helpers';

export default function VerdictCard({ result }) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold text-slate-800 mb-4">Analysis Results</h2>
      
      <div className={`rounded-lg p-4 mb-4 ${getVerdictColor(result.verdict)}`}>
        <div className="flex items-center gap-2 mb-2">
          {result.verdict === 'likely_real' ? (
            <CheckCircle className="w-6 h-6" />
          ) : (
            <AlertCircle className="w-6 h-6" />
          )}
          <span className="text-xl font-bold">
            {getVerdictLabel(result.verdict)}
          </span>
        </div>
        <p className="text-sm opacity-90">
          Confidence: {result.confidence.toUpperCase()}
        </p>
      </div>

      <div className="mb-4">
        <div className="flex justify-between mb-2">
          <span className="text-sm font-medium text-slate-700">Manipulation Score</span>
          <span className="text-sm font-bold text-slate-800">
            {(result.fake_score * 100).toFixed(0)}%
          </span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 transition-all duration-500"
            style={{ width: `${result.fake_score * 100}%` }}
          ></div>
        </div>
        <p className="text-xs text-slate-500 mt-1">
          0% = Likely Real | 100% = Likely Fake
        </p>
      </div>

      <div className="bg-slate-50 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-slate-700 mb-2">Explanation</h3>
        <p className="text-sm text-slate-600">{result.explanation}</p>
      </div>
    </div>
  );
}
