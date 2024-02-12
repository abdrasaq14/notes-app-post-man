import express, { Request, Response, NextFunction } from "express";
import { ZodError, z } from "zod";
import { AuthenticatedRequest } from "../../express";
import url from 'node:url'
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
/* GET NOTES listing. */

export function getNoteFunction(req: Request, res: Response, next: NextFunction) {
    const sql = `SELECT * FROM Notes`;
  
    db.all(sql, function (err: Error, notes:any[]) {
      if (err) {
        console.error("Error in database operation:", err);
        res.status(500).send('Internal Server Error');
      }
      console.log("All users detail gotten");
      res.render('notes', { notes });
    });
    
  }

// zod to validate new input
const notesObjectSchema = z.object({
  Title: z
    .string({
      required_error: "fullname needs to be provided",
      invalid_type_error: "fullname needs to be a string",
    })
    .trim()
    .min(2, "Title need to have a min length of 2")
    .max(200, "title need to have a max length of 200"),
  description: z.string(),
  DueDate: z.string().trim(),
  status: z.string({
    required_error: "kindly indicate the status",
  }).max(14) 
});
const strictNoteObjectSchema = notesObjectSchema.strict()

// new note middle control
export const createNewNoteFunction = async (req: AuthenticatedRequest, res: Response, next: NextFunction) =>{
  try{
  //const userId = req.user?.UserId;
  const validation = strictNoteObjectSchema.parse(req.body);
  const { Title, description, DueDate, status } = validation;
  const userId = req.user?.UserId;
  console.log(userId)
  const sql = `INSERT INTO Notes (
    Title, 
    description, 
    DueDate, 
    Status,
    UserId
    ) 
    VALUES (?,?,?,?,?)`;
  

  const notesToRender = db.run(sql, [Title, description, DueDate, status, userId], function (err: Error) {
    if (err) {
      return err
    }
    else{
      // get the detail of the user that creates note
      const queryUserDetail = `SELECT * FROM Users WHERE UserId = ?`;
      const returnedUserDetailFromDatabase:any[] = []
      db.all(queryUserDetail, [userId], function(error:Error, userDetailFromDatabase:Record<string, any>[]){
        if(error) return error
        else{
          console.log(userDetailFromDatabase) 
          returnedUserDetailFromDatabase.push(userDetailFromDatabase)
          console.log(returnedUserDetailFromDatabase) 
        }
      })
      
    // get all notes created by the user
      const queryNotesDetail = `SELECT * FROM Notes WHERE UserId = ?`;
      const returnedNotesDetailFromDatabase:Record<string,any>[] = []
        db.all(queryNotesDetail, [userId], function(error:Error, noteDetailFromDatabase:Record<string, any>[]){
        if(error) return error
        else{
          returnedNotesDetailFromDatabase.push(...noteDetailFromDatabase)
        }
      });
      // rendering the notes after creation
      res.render('Dashboard', {notesToRender, returnedUserDetailFromDatabase, returnedNotesDetailFromDatabase})
        // return res.status(200).json({
        // message: 'New note created successfully'
        // })
    } 
    });


 
  
  }
  catch(error){
    if(error instanceof ZodError){
      res.status(401).json({
          message: ZodError
      })
  }
  else{
    return res.status(403).json({
      error: 'Kindly sign up or request access from admin'
    })
  }
  }
}

// zod to validate new input
const putNotesObjectSchema = z.object({
  Title: z
    .string({
      required_error: "fullname needs to be provided",
      invalid_type_error: "fullname needs to be a string",
    })
    .trim()
    .min(2, "Title need to have a min length of 2")
    .max(200, "title need to have a max length of 200"),
  description: z.string(),
  DueDate: z.string().trim(),
  status: z.string({
    required_error: "kindly indicate the status",
  }).max(14) 
});
const strictPutNotesObjectSchema = putNotesObjectSchema.strict()

// new note middle control
export const putNewNoteFunction = async (req: AuthenticatedRequest, res: Response, next: NextFunction) =>{
  try{
  //const userId = req.user?.UserId;
  const { query } = url.parse(req.url as string, true);
  if (!query.noteId) {
    res.status(400).json({
      message: 'Kindly supply noteid to update'
    })
  }
  else{
    const validation = strictPutNotesObjectSchema.parse(req.body);
    const { Title, description, DueDate, status } = validation;
    //const userId = req.user?.UserId
    const sql = `UPDATE Notes SET Title = ?, description = ?, DueDate = ?, Status =? WHERE NoteId = ${query.noteId}`;

  db.run(sql, [Title, description, DueDate, status], function (err: Error, createdNote:any) {
    if (err) {
      return err
    }
    else{
      return res.status(200).json({
      error: 'notes updated successfully'
    })
    
  }
  });
  }
  
  }
  catch(error){
    if(error instanceof ZodError){
      res.status(401).json({
          message: ZodError
      })
  }
  else{
    return res.status(403).json({
      error: 'Kindly sign up or request access from admin'
    })
  }
  }
}