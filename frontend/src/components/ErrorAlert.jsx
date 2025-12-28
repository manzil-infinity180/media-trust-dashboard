import { AlertCircle } from 'lucide-react';

export default function ErrorAlert({ message }) {
  return (
    <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
      <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
      <p className="text-red-800 text-sm">{message}</p>
    </div>
  );
}