import createError from "http-errors";
import express, { Request, Response, NextFunction } from "express";
import { z } from "zod";
import bcrypt from 'bcrypt';
import { error } from "console";
import { Session, SessionData } from 'express-session';
import jwt from 'jsonwebtoken'

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
export default async function handleUserLogin(req: AuthenticatedRequest, res: Response, next: NextFunction){
  try{  
      const validation = strictNewUserSchema.parse(req.body);
      const { email, password } = validation;
  
      // checking the database for the record of that user
      const sql = `SELECT * FROM Users WHERE Email = ?;`;
    //   this is now an array of object for each record
    const userDetailFromDatabase:Record<string, any> = { }
      const selectEmailFromDatabase:Record<string, any>[] = await new Promise((resolve, reject) => {
        db.all(sql, [email], (err: Error, users: any[]) => {
          if (err) {
            console.error("Error in database operation:", err);
            reject(res.status(500).json({
                message: `my error ${error}`
            }));
          } else {
            
            return resolve(Object.assign(userDetailFromDatabase, ...users))
          }
        });
      });
  
      
      //unauthorized, kindly sign up or request access from admin;
      if (userDetailFromDatabase.Email !== email) {
        return res.status(401).json({
            message: `User with email ${email} does not exist, Kindly signup`
        })
        } 
    //   if that user exist, check for password
        const matchPassword = await bcrypt.compare(password, userDetailFromDatabase.Password)
        const token = jwt.sign({userId: userDetailFromDatabase.UserId}, 'your-secret-key', { expiresIn: '1h'})
        if(matchPassword){
        // res.json({
        //     message: `User with Email: ${email} is logged in!`,
        //     token: token
        // })
        res.header('Authorization', `Bearer ${token}`);
           res.json({
            message: `User with Email: ${email} is logged in!`,
            token: token
        })
      }
      else{
        res.status(401).json({
            message: `Incorrect password`,
            "statusCode": 401
        })
      }
      
    }
    catch(error){
        res.status(400).json({'message': error});
    }
 
  };