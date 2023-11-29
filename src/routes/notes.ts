import createError from "http-errors";
import express, { Request as ExpressRequest, Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";
import { ZodError, z } from "zod";
import bcrypt from 'bcrypt';
import { error } from "console";

const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database(
  "/Users/macbook/Desktop/week-6-pod-d-abdrasaq14/lib/src/usersAndNote.db",
  sqlite3.OPEN_READWRITE,
  (err: any) => {
    if (err) return console.log("why", err);
  }
);

interface AuthenticatedRequest extends ExpressRequest {
  user?: { UserId: number; Password: string }; // Adjust the properties according to your user object
}


// implementation start here
const router = express.Router();

//router.use(bodyParser.json());
router.use(express.json());
router.use(express.urlencoded({ extended: false }));

/* GET NOTES listing. */

router.get("/", function (req: Request, res: Response, next: NextFunction) {
  const sql = `SELECT * FROM Notes`;

  db.all(sql, function (err: Error, notes:any[]) {
    if (err) {
      console.error("Error in database operation:", err);
      res.status(500).send('Internal Server Error');
    }
    console.log("All users detail gotten");
    res.render('notes', { notes });
  });
  
});

// CREATING NOTES LIST

// zod to validate input
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


// new note middle ware
const newNoteMiddleWare = async (req: AuthenticatedRequest, res: Response, next: NextFunction) =>{
  try{
  //const userId = req.user?.UserId;
  const validation = strictNoteObjectSchema.parse(req.body);
  const { Title, description, DueDate, status } = validation;
  
  const sql = `INSERT INTO Notes (
    Title, 
    description, 
    DueDate, 
    Status
    ) 
    VALUES (?,?,?,?,?)`;

  db.run(sql, [Title, description, DueDate, status], function (err: Error, createdNote:any) {
    if (err) {
      
      return error('Error in connecting to database')
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
router.post("/", async (req: Request, res: Response, next: NextFunction) => {
 
    await newNoteMiddleWare(req, res, next)
 
})


 

export default router;
