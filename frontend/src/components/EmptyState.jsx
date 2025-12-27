import React from 'react';
import { Clock } from 'lucide-react';

export default function EmptyState() {
  return (
    <div className="bg-white rounded-lg shadow-sm p-12 text-center">
      <Clock className="w-16 h-16 mx-auto text-slate-300 mb-4" />
      <h3 className="text-lg font-medium text-slate-600 mb-2">No Analysis Yet</h3>
      <p className="text-slate-500">Upload a media file and click analyze to see results here</p>
    </div>
  );
}