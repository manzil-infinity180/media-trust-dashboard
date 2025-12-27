import React from 'react';

export default function DashboardHeader() {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <h1 className="text-3xl font-bold text-slate-800 mb-2">Media Trust Analysis Dashboard</h1>
      <p className="text-slate-600">Upload audio or video files to detect potential deepfakes and manipulations</p>
    </div>
  );
}