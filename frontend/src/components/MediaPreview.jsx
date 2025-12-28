import { Music } from 'lucide-react';

export default function MediaPreview({ file, previewUrl }) {
  if (!previewUrl) return null;

  const isAudio = file && file.type.startsWith('audio');

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold text-slate-800 mb-4">Media Preview</h2>
      
      {isAudio ? (
        <div className="space-y-4">
          <div className="bg-linear-to-br from-blue-500 to-purple-600 rounded-lg p-8 flex items-center justify-center">
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
  );
}