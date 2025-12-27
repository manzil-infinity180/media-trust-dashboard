import { Router } from "express";
import multer, { diskStorage } from "multer";
import fs from "fs";
import { param, validationResult } from "express-validator";
import mediaStore from "../service/mediaStore.js";
import detectionClient from "../service/detectionClient.js";
import analysisStore from "../service/analysisStore.js";
import path from "path"
import { error } from "console";

export const router = Router();
const UPLOAD_DIR = process.env.UPLOAD_DIR || "./uploads";
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const storage = diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

// allowed file types
const fileFilter = (req, file, cb) => {
  const allowedMimes = ["audio/wav", "audio/mpeg", "audio/mp3", "video/mp4"];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Invalid file type. Only .wav, .mp3, and .mp4 files are allowed."
      ),
      false
    );
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100 mb
  },
});

// POST /media/upload
router.post("/upload", upload.single("file"), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: "No file uploaded",
        message: "Please provide a file in the request",
      });
    }

    const mediaType = mediaStore.getMediaType(req.file.mimetype);

    const fileData = {
      filename: req.file.filename,
      originalName: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      path: req.file.path,
      type: mediaType,
    };

    const result = await mediaStore.mediaStore(fileData);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
});

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: "Validation Error",
      details: errors.array(),
    });
  }

  next();
};

router.post(
  "/analyze/:media_id",
  [param("media_id").isUUID().withMessage("Invalid media ID format")],
  validateRequest,
  async (req, res, next) => {
    try {
      const { media_id } = req.params;
      const media = await mediaStore.getMediaById(media_id);
      if (!media) {
        return res.status(404).json({
          error: "Media not found",
          message: `No media found with ID: ${media_id}`,
        });
      }
      const exitingAnalysis = await analysisStore.hasAnalysis(media_id);

      if (exitingAnalysis) {
        const analysis = await analysisStore.getAnalysisByMediaId(media_id);
        return res.status(200).json({
          message: "Media already analyzed",
          ...analysis,
        });
      }
      // potential improvement here to add server sent event or websocket to get the details at real time
      await mediaStore.updateMediaStatus(media_id, "analyzing");

      setImmediate(async () => {
        try {
          const results = await detectionClient.analyzeMedia(
            media_id,
            media.type
          );
          await analysisStore.storeAnalysis(results);
          await mediaStore.updateMediaStatus(media_id, "completed");
        } catch (error) {
          console.error("Analysis error:", error);
          await mediaStore.updateMediaStatus(media_id, "failed");
        }
      });
      res.status(202).json({
        media_id,
        status: "analyzing",
        message: "Analysis started. Check /media/result/:media_id for results.",
      });
    } catch (err) {
      next(error);
    }
  }
);

router.get(
  "/result/:media_id",
  [param("media_id").isUUID().withMessage("Invalid media ID format")],
  validateRequest,
  async (req, res, next) => {
    try {
      const { media_id } = req.params;
      const media = await mediaStore.getMediaById(media_id);
      if (!media) {
        return res.status(404).json({
          error: "Media not found",
          message: `No media found with ID: ${media_id}`,
        });
      }

      const analysis = await analysisStore.getAnalysisByMediaId(media_id);
      if (!analysis) {
        return res.status(200).json({
          media_id,
          type: media.type,
          status: media.status,
          message: media.status === 'uploaded' 
            ? 'Media not analyzed yet.'
            : 'Analysis in progress'
        });
      }
      res.status(200).json(analysis);
    } catch (err) {
        next(err)
    }
  }
);
