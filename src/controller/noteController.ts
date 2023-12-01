import express, { Request, Response, NextFunction } from "express";
import { ZodError, z } from "zod";
import { AuthenticatedRequest } from "../../express";
import url from 'node:url'

// my database
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database(
  "/Users/macbook/Desktop/week-6-pod-d-abdrasaq14/lib/src/usersAndNote.db",
  sqlite3.OPEN_READWRITE,
  (err: any) => {
    if (err) return console.log("why", err);
  }
);


// implementation start here
const router = express.Router();

//router.use(bodyParser.json());
router.use(express.json());
router.use(express.urlencoded({ extended: false }));

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
  const userId = req.user?.UserId
  const sql = `INSERT INTO Notes (
    Title, 
    description, 
    DueDate, 
    Status,
    UserId
    ) 
    VALUES (?,?,?,?,?)`;

  db.run(sql, [Title, description, DueDate, status, userId], function (err: Error, createdNote:any) {
    if (err) {
      return err
    }
    else{
      return res.status(200).json({
      error: 'New note created successfully'
    })
    
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
  if (!query.id) {
    res.writeHead(400, {"content-type": "text/json"});
    res.end('Kindly supply id to delete');
  }
  else{
    const validation = strictPutNotesObjectSchema.parse(req.body);
    const { Title, description, DueDate, status } = validation;
    const userId = req.user?.UserId
    const sql = `UPDATE Notes SET Title, description, DueDate, Status (
      Title, 
      description, 
      DueDate, 
      Status,
      UserId
      ) 
      VALUES (?,?,?,?,?)`;

  db.run(sql, [Title, description, DueDate, status, userId], function (err: Error, createdNote:any) {
    if (err) {
      return err
    }
    else{
      return res.status(200).json({
      error: 'New note created successfully'
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