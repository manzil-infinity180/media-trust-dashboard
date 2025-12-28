import { useState } from "react";
import useMediaAnalysis from "../hooks/useMediaAnalysis";
import DashboardHeader from "./DashboardHeader";
import FileUploadSection from "./FileUploadSection";
import MediaPreview from "./MediaPreview";
import VerdictCard from "./VerdictCard";
import DetectionSignals from "./DetectionSignals";
import MetadataCard from "./Metadata";
import EmptyState from "./EmptyState";

const VALID_FILE_TYPES = ["audio/wav", "audio/mpeg", "audio/mp3", "video/mp4"];

export default function MediaDashboard() {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const {
    status,
    analysisResult,
    error,
    uploadFile,
    analyzeMedia,
    reset: resetAnalysis,
  } = useMediaAnalysis();

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    if (!VALID_FILE_TYPES.includes(selectedFile.type)) {
      alert("Invalid file type. Please upload .wav, .mp3, or .mp4 files.");
      return;
    }

    setFile(selectedFile);
    setPreviewUrl(URL.createObjectURL(selectedFile));
    resetAnalysis();
  };

  const handleUpload = async () => {
    if (!file) return;
    await uploadFile(file);
  };

  const handleAnalyze = async () => {
    await analyzeMedia();
  };

  const resetAll = () => {
    setFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    resetAnalysis();
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100">
      <div className="max-w-6xl mx-auto p-6">
        <DashboardHeader />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <FileUploadSection
              file={file}
              status={status}
              onFileSelect={handleFileSelect}
              onUpload={handleUpload}
              onAnalyze={handleAnalyze}
              onReset={resetAll}
              error={error}
            />
            <MediaPreview file={file} previewUrl={previewUrl} />
          </div>

          <div>
            {analysisResult ? (
              <div className="space-y-6">
                <VerdictCard result={analysisResult} file={file} />
                <DetectionSignals signals={analysisResult.signals} />
                <MetadataCard result={analysisResult} />
              </div>
            ) : (
              <EmptyState />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
