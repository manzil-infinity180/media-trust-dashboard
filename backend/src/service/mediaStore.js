import { db } from "../db/sqlite.js";
import { v4 as uuidv4 } from "uuid";

class MediaStore {
  async mediaStore(fileData) {
    return new Promise((resolve, reject) => {
      const mediaId = uuidv4();
      const { filename, originalName, mimetype, size, path, type } = fileData;

      const query = `
        INSERT INTO media_files (id, filename, original_name, type, file_path, file_size, mime_type, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, 'uploaded')
      `;
      db.run(
        query,
        [mediaId, filename, originalName, type, path, size, mimetype],
        function (err) {
          if (err) {
            reject(err);
          } else {
            resolve({
              media_id: mediaId,
              type: type,
              status: 'uploaded'
            });
          }
        }
      );
    });
  }

  async getMediaById(mediaId) {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM media_files WHERE id = ?';
      
      db.get(query, [mediaId], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  async updateMediaStatus(mediaId, status) {
    return new Promise((resolve, reject) => {
      const query = 'UPDATE media_files SET status = ? WHERE id = ?';
      
      db.run(query, [status, mediaId], function (err) {
        if (err) {
          reject(err);
        } else {
          resolve({ updated: this.changes });
        }
      });
    });
  }

  async getAllMedia() {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM media_files ORDER BY created_at DESC';
      
      db.all(query, [], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  getMediaType(mimetype) {
    if (mimetype.startsWith('audio/')) {
      return 'audio';
    } else if (mimetype.startsWith('video/')) {
      return 'video';
    }
    return 'unknown';
  }
}

const mediaStore = new MediaStore();
export default mediaStore;
