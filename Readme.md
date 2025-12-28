# Media Trust Analysis Dashboard


https://github.com/user-attachments/assets/fa679699-5619-42b1-aacd-d6861c016727

<div align="center">
<img width="2248" height="1586" alt="Screenshot 2025-12-28 at 11 38 40 AM" src="https://github.com/user-attachments/assets/b5efc7b9-cb2f-4767-b3c8-7a0074d5adf4" />
</div>

## Backend Setup
```
# Clone the repository
git clone <repository-url>
cd media-trust-dashboard

# Navigate to backend
cd backend

# Install dependencies
npm install

# Create .env file
cat > .env << EOF
PORT=3000
NODE_ENV=development
UPLOAD_DIR=./uploads
DB_PATH=./database/media.db
EOF

# Start the backend server
npm run dev

```
* Backend will run on `http://localhost:3000`

## Frontend Setup
```
# Open new terminal, navigate to frontend
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```
* Frontend will run on `http://localhost:5173`

## API Documentation

* Base URL `http://localhost:3000/api`
## Endpoints

### 1. Upload Media

```
POST /media/upload
Content-Type: multipart/form-data
```
* Request Body:
    - file: Media file (.mp3, .wav, .mp4)
```
// http://localhost:3000/api/media/upload
{
    "media_id": "9477b061-a1c7-48b6-bc7a-51f6cd224d14",
    "type": "video",
    "status": "uploaded"
}
```

### 2. Analyze Media
```
POST /media/analyze/:media_id
```
```
{
    "media_id": "9477b061-a1c7-48b6-bc7a-51f6cd224d14",
    "status": "analyzing",
    "message": "Analysis started. Check /media/result/:media_id for results."
}
```
> Wait 2–3 seconds. If you request the same ID again, the system will return the `mock detection results`.
> Potential statuses include `processing`, `analyzing`, and `completed`. Real-time event updates may be added in future versions.

```
{
    "message": "Media already analyzed",
    "id": 34,
    "media_id": "9477b061-a1c7-48b6-bc7a-51f6cd224d14",
    "fake_score": 0.83,
    "confidence": "high",
    "verdict": "likely_fake",
    "signals": {
        "lip_sync": "highly_suspicious",
        "facial_consistency": "highly_suspicious",
        "temporal_artifacts": "inconsistent",
        "background_consistency": "highly_suspicious",
        "audio_consistency": "highly_suspicious",
        "background_noise": "highly_suspicious",
        "spectral_analysis": "highly_suspicious"
    },
    "explanation": "This video is highly likely to be manipulated or synthetic. Significant anomalies detected in: lip sync, facial consistency, temporal artifacts, background consistency, audio consistency, background noise, spectral analysis.",
    "status": "completed",
    "analyzed_at": "2025-12-28 06:46:20",
    "type": "video",
    "original_name": "Speed_has_equalised_India_vs_USA_Part_7_48KBPS.mp4",
    "uploaded_at": "2025-12-28 06:46:03"
}
```
### 3. Get Analysis Results

```
GET /media/result/:media_id
```

```
{
    "id": 34,
    "media_id": "9477b061-a1c7-48b6-bc7a-51f6cd224d14",
    "fake_score": 0.83,
    "confidence": "high",
    "verdict": "likely_fake",
    "signals": {
        "lip_sync": "highly_suspicious",
        "facial_consistency": "highly_suspicious",
        "temporal_artifacts": "inconsistent",
        "background_consistency": "highly_suspicious",
        "audio_consistency": "highly_suspicious",
        "background_noise": "highly_suspicious",
        "spectral_analysis": "highly_suspicious"
    },
    "explanation": "This video is highly likely to be manipulated or synthetic. Significant anomalies detected in: lip sync, facial consistency, temporal artifacts, background consistency, audio consistency, background noise, spectral analysis.",
    "status": "completed",
    "analyzed_at": "2025-12-28 06:46:20",
    "type": "video",
    "original_name": "Speed_has_equalised_India_vs_USA_Part_7_48KBPS.mp4",
    "uploaded_at": "2025-12-28 06:46:03"
}
```

### 4. Health Check
```
GET /health
```

```
{
    "status": "healthy",
    "timestamp": "2025-12-28T06:51:57.146Z",
    "uptime": 2654.789405458
}
```
<div align="center">
<img width="1323" height="760" alt="Screenshot 2025-12-28 at 12 56 07 PM" src="https://github.com/user-attachments/assets/47ebe3cf-5ed0-42a2-910c-7e9cf6126ee8" />
</div>
