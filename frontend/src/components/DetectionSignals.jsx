import React from 'react';
import { getSignalColor } from '../utils/helpers';

export default function DetectionSignals({ signals }) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold text-slate-800 mb-4">Detection Signals</h2>
      
      <div className="space-y-3">
        {Object.entries(signals).map(([key, value]) => (
          <div key={key} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
            <span className="text-sm font-medium text-slate-700 capitalize">
              {key.replace(/_/g, ' ')}
            </span>
            <span className={`text-xs font-semibold px-3 py-1 rounded-full ${getSignalColor(value)}`}>
              {value.replace(/_/g, ' ').toUpperCase()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}