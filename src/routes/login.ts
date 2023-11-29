import createError from "http-errors";
import express, { Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";
import { z } from "zod";
import bcrypt from 'bcrypt';
import { match } from "assert";
import { error } from "console";
import { Session, SessionData } from 'express-session';

interface AuthenticatedRequest extends Request {
    session: Session & Partial<SessionData> & { userId?: number };
  }

interface AuthenticatedRequest extends Request {
  session: Session & Partial<SessionData> & { userId?: number };
}
const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database(
  "/Users/macbook/Desktop/week-6-pod-d-abdrasaq14/lib/src/usersAndNote.db",
  sqlite3.OPEN_READWRITE,
  (err: any) => {
    if (err) return console.log(err);
  }
);

// implementation start here
const router = express.Router();

router.use(bodyParser.json());
router.use(express.json());
router.use(express.urlencoded({ extended: false }));

// Zod to validate
const userSchema = z.object({
    email: z.string({
        required_error: "email needs to be provided",
        invalid_type_error: "email needs to be a string",
      })
      .email(),
    password: z.string({
        required_error: "password needs to be provided",
        invalid_type_error: "password needs to be a string",
      }).min(6, "password must be at least 6 characters")
  });
  const strictNewUserSchema = userSchema.strict()
const handleUserLogin = async (req: Request, res: Response, next: NextFunction) => {
    try{
      const validation = strictNewUserSchema.parse(req.body);
      const { email, password } = validation;
  
      // checking the database for the record of that user
      const sql = `SELECT * FROM Users WHERE Email = ?;`;
    //   this is now an array of object for each record
      const selectEmailFromDatabase:Record<string, any>[] = await new Promise((resolve, reject) => {
        db.all(sql, [email], (err: Error, users: any[]) => {
          if (err) {
            console.error("Error in database operation:", err);
            reject(res.status(500).json({
                message: `my error ${error}`
            }));
          } else {
            
            return resolve(users);
          }
        });
      });
  
      const checkDatabaseForUserRecord = selectEmailFromDatabase.find((element: Record<string, string>) => element.Email === email);
      
      //unauthorized, kindly sign up or request access from admin;
      if (!checkDatabaseForUserRecord) {
        return res.status(401).json({
            message: `User with email ${email} does not exist, Kindly signup`
        })
        } 
    //   if that user exist, check for password
        const matchPassword = await bcrypt.compare(password, checkDatabaseForUserRecord.Password)
      if(matchPassword){
        res.json({
            'success': `User with Email: ${email} is logged in!`
        })
      }
      else{
        res.json({
            message: `Incorrect password`,
            "statusCode": 401
        })
      }
     
    }
    catch(error){
        res.status(400).json({'message': error});
    }
  };
  router.post("/", async (req: Request, res: Response, next: NextFunction) => {
    const session = req.session as Session & Partial<SessionData> & { userId?: number };

    await handleUserLogin(req, res, next);
    session.userId = 123;
  
})


export default router