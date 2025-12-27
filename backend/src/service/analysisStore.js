import { db } from "../db/sqlite.js";

class AnalysisStore {
  async storeAnalysis(analysisData) {
    return new Promise((resolve, reject) => {
      const { media_id,fake_score,confidence,verdict,signals,explanation, status = "completed"} = analysisData;

      // make up query 
      const query = `
        INSERT INTO analysis_results 
        (media_id, fake_score, confidence, verdict, signals, explanation, status, analyzed_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
      `;

      db.run(
        query,
        [
          media_id,
          fake_score,
          confidence,
          verdict,
          JSON.stringify(signals),
          explanation,
          status,
        ],
        function (err) {
          if (err) {
            reject(err);
          } else {
    
            resolve({
              id: this.lastID,
              media_id,
              ...analysisData,
            });
          }
        }
      );
    });
  }

  async getAnalysisByMediaId(mediaId) {
    return new Promise((resolve, reject) => {
        const query = `SELECT ar.*, mf.type, mf.original_name, mf.created_at as uploaded_at FROM 
        analysis_results ar JOIN media_files mf ON ar.media_id = mf.id
        WHERE ar.media_id = ?
        ORDER BY ar.analyzed_at DESC
        LIMIT 1
        `;
        db.get(query, [mediaId], (err, row) => {
            if(err) {
                reject(err)
            } else if(row) {
                row.signals = JSON.parse(row.signals)
                resolve(row);
            } else {
                resolve(row)
            }
        })
    })
  }

  async getAllAnalyses(){
    return new Promise((resolve, reject) => {
        const query = `SELECT ar.*, mf.type, mf.original_name FROM analysis_results ar
        JOIN media_files mf ON ar.media_id = mf.id ORDER BY ar.analyzed_at DESC`;
        db.all(query, [], (err, rows) => {
            if(err) {
                reject(err);
            } else {
                rows = rows.map(row => ({
                    ...row,
                    signals: JSON.parse(row.signals)
                }));

                resolve(rows)
            }
        })
    });
  }
  async hasAnalysis(mediaId) {
    return new Promise((resolve, reject) => {
      const query = 'SELECT COUNT(*) as count FROM analysis_results WHERE media_id = ?';

      db.get(query, [mediaId], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row.count > 0);
        }
      });
    });
  }

  async updateAnalysisStatus(mediaId, status) {
    return new Promise((resolve, reject) => {
      const query = 'UPDATE analysis_results SET status = ? WHERE media_id = ?';

      db.run(query, [status, mediaId], function (err) {
        if (err) {
          reject(err);
        } else {
          resolve({ updated: this.changes });
        }
      });
    });
  }

}

const analysisStore = new AnalysisStore()
export default analysisStore;