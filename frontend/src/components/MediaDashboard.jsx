import React, { useState } from 'react';
import { Upload, AlertCircle, CheckCircle, Clock, PlayCircle, Music } from 'lucide-react';
const API_BASE_URL = 'http://localhost:3000/api';

export default function MediaDashboard() {
  const [file, setFile] = useState(null);
  const [mediaId, setMediaId] = useState(null);
  const [mediaType, setMediaType] = useState(null);
  const [status, setStatus] = useState('idle'); // idle, uploading, uploaded, analyzing, completed
  const [analysisResult, setAnalysisResult] = useState(null);
  const [error, setError] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    // Validate file type
    const validTypes = ['audio/wav', 'audio/mpeg', 'audio/mp3', 'video/mp4'];
    if (!validTypes.includes(selectedFile.type)) {
      setError('Invalid file type. Please upload .wav, .mp3, or .mp4 files.');
      return;
    }

    setFile(selectedFile);
    setPreviewUrl(URL.createObjectURL(selectedFile));
    setError(null);
    setStatus('idle');
    setAnalysisResult(null);
    setMediaId(null);
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file first');
      return;
    }

    setStatus('uploading');
    setError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${API_BASE_URL}/media/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      setMediaId(data.media_id);
      setMediaType(data.type);
      setStatus('uploaded');
    } catch (err) {
      setError('Failed to upload file. Please try again.');
      setStatus('idle');
    }
  };

  const handleAnalyze = async () => {
    if (!mediaId) return;

    setStatus('analyzing');
    setError(null);

    try {
      const analyzeResponse = await fetch(`${API_BASE_URL}/media/analyze/${mediaId}`, {
        method: 'POST',
      });

      if (!analyzeResponse.ok) {
        throw new Error('Analysis failed to start');
      }

      let attempts = 0;
      const maxAttempts = 20;
      const pollInterval = 1000;

      const pollResults = setInterval(async () => {
        attempts++;

        try {
          const resultResponse = await fetch(`${API_BASE_URL}/media/result/${mediaId}`);
          const resultData = await resultResponse.json();

          if (resultData.status === 'completed') {
            clearInterval(pollResults);
            setAnalysisResult(resultData);
            setStatus('completed');
          } else if (attempts >= maxAttempts) {
            clearInterval(pollResults);
            setError('Analysis is taking longer than expected. Please try again.');
            setStatus('uploaded');
          }
        } catch (err) {
          clearInterval(pollResults);
          setError('Failed to fetch results');
          setStatus('uploaded');
        }
      }, pollInterval);
    } catch (err) {
      setError('Failed to start analysis. Please try again.');
      setStatus('uploaded');
    }
  };

  const getVerdictColor = (verdict) => {
    switch (verdict) {
      case 'likely_real':
        return 'text-green-600 bg-green-50';
      case 'uncertain':
        return 'text-yellow-600 bg-yellow-50';
      case 'suspicious':
        return 'text-orange-600 bg-orange-50';
      case 'likely_fake':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getVerdictLabel = (verdict) => {
    return verdict.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const getSignalColor = (value) => {
    switch (value) {
      case 'natural':
      case 'acceptable':
        return 'text-green-600 bg-green-100';
      case 'inconsistent':
        return 'text-orange-600 bg-orange-100';
      case 'highly_suspicious':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const resetAll = () => {
    setFile(null);
    setMediaId(null);
    setMediaType(null);
    setStatus('idle');
    setAnalysisResult(null);
    setError(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Media Trust Analysis Dashboard</h1>
          <p className="text-slate-600">Upload audio or video files to detect potential deepfakes and manipulations</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Upload and Preview */}
          <div className="space-y-6">
            {/* Upload Section */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-slate-800 mb-4">Upload Media</h2>
              
              <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-slate-400 transition-colors">
                <input
                  type="file"
                  id="file-upload"
                  accept=".mp3,.wav,.mp4"
                  onChange={handleFileSelect}
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
                  onClick={handleUpload}
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
                  onClick={handleAnalyze}
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
                  onClick={resetAll}
                  className="w-full mt-4 bg-slate-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-slate-700 transition-colors"
                >
                  Analyze Another File
                </button>
              )}

              {error && (
                <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-red-800 text-sm">{error}</p>
                </div>
              )}
            </div>

            {/* Preview Section */}
            {previewUrl && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-slate-800 mb-4">Media Preview</h2>
                
                {file && file.type.startsWith('audio') ? (
                  <div className="space-y-4">
                    <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg p-8 flex items-center justify-center">
                      <Music className="w-16 h-16 text-white" />
                    </div>
                    <audio controls className="w-full">
                      <source src={previewUrl} type={file.type} />
                      Your browser does not support the audio element.
                    </audio>
                    <div className="text-sm text-slate-600">
                      <p><strong>Filename:</strong> {file.name}</p>
                      <p><strong>Size:</strong> {(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <video controls className="w-full rounded-lg">
                      <source src={previewUrl} type={file.type} />
                      Your browser does not support the video element.
                    </video>
                    <div className="text-sm text-slate-600">
                      <p><strong>Filename:</strong> {file.name}</p>
                      <p><strong>Size:</strong> {(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Column - Results */}
          <div>
            {analysisResult ? (
              <div className="space-y-6">
                {/* Verdict Card */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-semibold text-slate-800 mb-4">Analysis Results</h2>
                  
                  <div className={`rounded-lg p-4 mb-4 ${getVerdictColor(analysisResult.verdict)}`}>
                    <div className="flex items-center gap-2 mb-2">
                      {analysisResult.verdict === 'likely_real' ? (
                        <CheckCircle className="w-6 h-6" />
                      ) : (
                        <AlertCircle className="w-6 h-6" />
                      )}
                      <span className="text-xl font-bold">
                        {getVerdictLabel(analysisResult.verdict)}
                      </span>
                    </div>
                    <p className="text-sm opacity-90">
                      Confidence: {analysisResult.confidence.toUpperCase()}
                    </p>
                  </div>

                  {/* Fake Score */}
                  <div className="mb-4">
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium text-slate-700">Manipulation Score</span>
                      <span className="text-sm font-bold text-slate-800">
                        {(analysisResult.fake_score * 100).toFixed(0)}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 transition-all duration-500"
                        style={{ width: `${analysisResult.fake_score * 100}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      0% = Likely Real | 100% = Likely Fake
                    </p>
                  </div>

                  {/* Explanation */}
                  <div className="bg-slate-50 rounded-lg p-4">
                    <h3 className="text-sm font-semibold text-slate-700 mb-2">Explanation</h3>
                    <p className="text-sm text-slate-600">{analysisResult.explanation}</p>
                  </div>
                </div>

                {/* Detection Signals */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-semibold text-slate-800 mb-4">Detection Signals</h2>
                  
                  <div className="space-y-3">
                    {Object.entries(analysisResult.signals).map(([key, value]) => (
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

                {/* Metadata */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-semibold text-slate-800 mb-4">Metadata</h2>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Media ID:</span>
                      <span className="text-slate-800 font-mono text-xs">{analysisResult.media_id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Type:</span>
                      <span className="text-slate-800 capitalize">{analysisResult.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Analyzed:</span>
                      <span className="text-slate-800">
                        {new Date(analysisResult.analyzed_at).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <Clock className="w-16 h-16 mx-auto text-slate-300 mb-4" />
                <h3 className="text-lg font-medium text-slate-600 mb-2">No Analysis Yet</h3>
                <p className="text-slate-500">Upload a media file and click analyze to see results here</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}