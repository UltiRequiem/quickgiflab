import { join } from "node:path";
import Database from "better-sqlite3";

const db = new Database(join(process.cwd(), "gifs.db"));

export interface GifRecord {
	id: number;
	filename: string;
	tixte_url: string;
	created_at: string;
	size: number;
	duration?: number;
	is_public: boolean;
}

db.exec(`
  CREATE TABLE IF NOT EXISTS gifs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    filename TEXT NOT NULL,
    tixte_url TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    size INTEGER NOT NULL,
    duration INTEGER
  )
`);

export const insertGif = db.prepare(`
  INSERT INTO gifs (filename, tixte_url, size, duration, is_public)
  VALUES (?, ?, ?, ?, ?)
`);

export const getAllGifs = db.prepare(`
  SELECT * FROM gifs ORDER BY created_at DESC
`);

export const getPublicGifs = db.prepare(`
  SELECT * FROM gifs WHERE is_public = 1 ORDER BY created_at DESC
`);

export const getGifById = db.prepare(`
  SELECT * FROM gifs WHERE id = ?
`);

export default db;
