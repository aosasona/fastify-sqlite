import path from "path";
import sqlite3 from "sqlite3";
const sqlite = sqlite3.verbose();

// Database configuration
export const database = new sqlite.Database(
  path.join(__dirname, "..", "..", "data.db"),
  sqlite3.OPEN_READWRITE,
  (err: any) => {
    if (err) {
      console.log(err);
    }
  }
);
