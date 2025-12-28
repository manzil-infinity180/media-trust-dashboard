import { Upload, PlayCircle } from 'lucide-react';
import ErrorAlert from './ErrorAlert';

export default function FileUploadSection({ file, status, onFileSelect, onUpload, onAnalyze, onReset, error }) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold text-slate-800 mb-4">Upload Media</h2>
      
      <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-slate-400 transition-colors">
        <input
          type="file"
          id="file-upload"
          accept=".mp3,.wav,.mp4"
          onChange={onFileSelect}
          className="hidden"
        />
        <label htmlFor="file-upload" className="cursor-pointer">
          <Upload className="w-12 h-12 mx-auto text-slate-400 mb-3" />
          <p className="text-slate-600 mb-1">
            {file ? file.name : 'Click to upload or drag and drop'}
          </p>
          <p className="text-sm text-slate-400">MP3, WAV, or MP4 (max 100MB)</p>
        </label>
      </div>

      {file && status === 'idle' && (
        <button
          onClick={onUpload}
          className="w-full mt-4 bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          Upload File
        </button>
      )}

      {status === 'uploading' && (
        <div className="mt-4 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent"></div>
          <p className="text-slate-600 mt-2">Uploading...</p>
        </div>
      )}

      {status === 'uploaded' && (
        <button
          onClick={onAnalyze}
          className="w-full mt-4 bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
        >
          <PlayCircle className="w-5 h-5" />
          Analyze Media
        </button>
      )}

      {status === 'analyzing' && (
        <div className="mt-4 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-green-600 border-t-transparent"></div>
          <p className="text-slate-600 mt-2">Analyzing media... This may take a few seconds</p>
        </div>
      )}

      {status === 'completed' && (
        <button
          onClick={onReset}
          className="w-full mt-4 bg-slate-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-slate-700 transition-colors"
        >
          Analyze Another File
        </button>
      )}

      {error && <ErrorAlert message={error} />}
    </div>
  );
}