import { useState } from 'react';

export const API_BASE_URL = 'http://localhost:3000/api';
export const MAX_POLL_ATTEMPTS = 20;
export const POLL_INTERVAL = 1000;

export default function useMediaAnalysis() {
  const [mediaId, setMediaId] = useState(null);
  const [mediaType, setMediaType] = useState(null);
  const [status, setStatus] = useState('idle');
  const [analysisResult, setAnalysisResult] = useState(null);
  const [error, setError] = useState(null);

  const uploadFile = async (file) => {
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
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Upload failed');
      }

      const data = await response.json();
      setMediaId(data.media_id);
      setMediaType(data.type);
      setStatus('uploaded');
      return data;
    } catch (err) {
      console.error('Upload error:', err);
      setError(err.message || 'Failed to upload file. Please try again.');
      setStatus('idle');
      throw err;
    }
  };

  const analyzeMedia = async (id) => {
    const targetId = id || mediaId;
    if (!targetId) return;

    setStatus('analyzing');
    setError(null);

    try {
      const analyzeResponse = await fetch(`${API_BASE_URL}/media/analyze/${targetId}`, {
        method: 'POST',
      });

      if (!analyzeResponse.ok) {
        const errorData = await analyzeResponse.json().catch(() => ({}));
        throw new Error(errorData.message || 'Analysis failed to start');
      }

      let attempts = 0;

      const pollResults = setInterval(async () => {
        attempts++;

        try {
          const resultResponse = await fetch(`${API_BASE_URL}/media/result/${targetId}`);
          
          if (!resultResponse.ok) {
            throw new Error('Failed to fetch analysis results');
          }
          
          const resultData = await resultResponse.json();

          if (resultData.status === 'completed') {
            clearInterval(pollResults);
            setAnalysisResult(resultData);
            setStatus('completed');
          } else if (attempts >= MAX_POLL_ATTEMPTS) {
            clearInterval(pollResults);
            setError('Analysis is taking longer than expected. Please try again.');
            setStatus('uploaded');
          }
        } catch (err) {
          console.error('Polling error:', err);
          clearInterval(pollResults);
          setError(err.message || 'Failed to fetch results');
          setStatus('uploaded');
        }
      }, POLL_INTERVAL);
    } catch (err) {
      console.error('Analysis error:', err);
      setError(err.message || 'Failed to start analysis. Please try again.');
      setStatus('uploaded');
    }
  };

  const reset = () => {
    setMediaId(null);
    setMediaType(null);
    setStatus('idle');
    setAnalysisResult(null);
    setError(null);
  };

  return {
    mediaId,
    mediaType,
    status,
    analysisResult,
    error,
    uploadFile,
    analyzeMedia,
    reset,
  };
}
