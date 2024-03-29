import { Request, Response, NextFunction } from "express";
import sqlite3 from 'sqlite3'
import path from "path";
sqlite3.verbose();
const dbPath = path.resolve(__dirname, "../../../", "database/notes.db")
const db = new sqlite3.Database(
  dbPath,
  sqlite3.OPEN_READWRITE,
  (err: any) => {
    if (err) return console.log(err);
  }
);

export default function (req: Request, res: Response, next: NextFunction) {
    const sql = `SELECT * FROM Users`;
  
    db.all(sql, function (err: Error, users: any[]) {
      if (err) {
        console.error("Error in database operation:", err);
        return res.status(500).json({
          status: 500,
          success: false,
          error: err.message, // Provide the error message for better debugging
        });
      }
      else{
        console.log("All users detail gotten");
        return res.send(JSON.stringify(users, null, 2));
    }
    });
  };