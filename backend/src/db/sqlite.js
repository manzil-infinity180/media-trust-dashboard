import sqlite3 from "sqlite3";
import path from "path"
import fs from "fs"
const DB_PATH = process.env.DB_PATH || "./database/media.db";

const dbDir = path.dirname(DB_PATH);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

export const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error("Error connecting to database:", err.message);
  } else {
    console.log("Connected to SQLite database");
  }
});

export const initializeDatabase = () => {
  db.serialize(() => {
    db.run(`
      CREATE TABLE IF NOT EXISTS media_files (
        id TEXT PRIMARY KEY,
        filename TEXT NOT NULL,
        original_name TEXT NOT NULL,
        type TEXT NOT NULL,
        file_path TEXT NOT NULL,
        file_size INTEGER,
        mime_type TEXT,
        status TEXT DEFAULT 'uploaded',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS analysis_results (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        media_id TEXT NOT NULL,
        fake_score REAL NOT NULL,
        confidence TEXT NOT NULL,
        verdict TEXT NOT NULL,
        signals TEXT NOT NULL,
        explanation TEXT,
        status TEXT DEFAULT 'pending',
        analyzed_at DATETIME,
        FOREIGN KEY (media_id) REFERENCES media_files(id)
      )
    `);

    console.log('Database schema initialized');
  });
};

initializeDatabase()