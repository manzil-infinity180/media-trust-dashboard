# Media Trust Analysis Dashboard


https://github.com/user-attachments/assets/fa679699-5619-42b1-aacd-d6861c016727

<div align="center">
<img width="2248" height="1586" alt="Screenshot 2025-12-28 at 11 38 40 AM" src="https://github.com/user-attachments/assets/b5efc7b9-cb2f-4767-b3c8-7a0074d5adf4" />
</div>

# Local Setup 
Prerequisites - Node.js v18 or higher, npm, git

## Backend Setup
```
# Clone the repository
git clone https://github.com/manzil-infinity180/media-trust-dashboard
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

## System architecture

<div align="center">
<img width="1323" height="760" alt="Screenshot 2025-12-28 at 12 56 07 PM" src="https://github.com/user-attachments/assets/47ebe3cf-5ed0-42a2-910c-7e9cf6126ee8" />
</div>

## Tech Stack
### Backend
NodeJS(Express.js), SQlite, Multer(file upload), express-validator

### Frontend
React(Vite), Tailwind CSS, Fetch API, Lucide React(for Icons)

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
## API Flow Diagram 

<div align="center">
<img width="520" height="772" alt="Screenshot 2025-12-28 at 4 50 27 PM" src="https://github.com/user-attachments/assets/0d397448-c2c2-46e7-b231-7a0604c53228" />
</div>

## Key design decisions

1. Separated business logic into dedicated service modules instead of putting everything in route handlers. It's easier to add the unit test in the future
2. Treated the deepfake detection engine as an external black box with a well-defined interface. Easier to integrate with the real deepfake detection engine
3. Used SQLite instead of in-memory storage, JSON files. Reasons are zero setup, ACID compliance, and support for SQL queries
4. For the endpoint `media/analyze/:media_id`, started analysis in the background (non-blocking), have the client poll for results. This provides a better User Experience
5. Used `express-validator` for input validation and centralized error handling middleware

## How this system would integrate with a real detection engine in production

1. Replace the mock implementation in `detectionClient.js` with calls to a real detection API, we need our authentication and authorization, or if it need api_key to call the api
2. Adding Job Queue for Background Processing, especially for handling the `/media/analyze/:media_id` at scale
3. Add timeouts, retries, and proper failure handling would be added around the detection call

## What you would improve given more time

1. Add `file hash` handling so the system can detect whether the same file is being analyzed again. Currently, the same file gets a different `media_id` each time. Using file hashes would help avoid duplicate processing or allow a re-analysis option
2. Add `metadata (EXIF)` extraction for audio and video files to enhance `deepfake detection using metadata` signals. Even though metadata can be edited, it can still act as an additional signal
3. Add a history or listing view of previous analyses so users can see past uploads and results, instead of only viewing a single analysis at a time.
4. Improve the report export feature. Currently, the analysis report is exported as HTML. With more time, this could be changed to support PDF export
5. Add support for uploading multiple files at the same time, so users can analyze several audio or video files in one go.
6. Replace the simulated background processing with a proper job queue
7. Adding Unit tests for all services (Jest)
8. Add real-time status updates using `WebSockets` or `Server-Sent Events` for the `/media/analyze/:media_id` endpoint instead of polling
9. Support cloud object storage (e.g., S3) instead of local filesystem storage for better scalability and durability
10. Add logging, metrics, and tracing to improve observability and debugging
11. API versioning (/api/v1, /api/v2) for backward compatibility
