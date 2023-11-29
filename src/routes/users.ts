import createError from "http-errors";
import express, { Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";
import { z } from "zod";
import bcrypt from 'bcrypt';
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
  fullname: z
    .string({
      required_error: "fullname needs to be provided",
      invalid_type_error: "fullname needs to be a string",
    })
    .trim()
    .min(2, "fullname need to have a min length of 2")
    .max(50, "fullname need to have a max length of 50"),
  email: z.string({
    required_error: "email needs to be provided",
    invalid_type_error: "email needs to be a string",
  }).email(),
  gender: z.string().max(1),
  phone: z.string().max(14),
  address: z.string().min(10).max(100),
  password: z.string({
    required_error: "password needs to be provided",
    invalid_type_error: "pass needs to be a string",
  }).min(6, "password must be at least 6 characters")
});

// GET all users route
router.get("/", function (req: Request, res: Response, next: NextFunction) {
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
    console.log("All users detail gotten");
    return res.send(users);
  });
});

// Authentication middleware
const handleNewUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validation = userSchema.parse(req.body);
    const { fullname, gender, email, phone, address, password } = validation;
    // Check for duplicate email
    const sql = `SELECT Email FROM Users`;
    const selectEmailFromDatabase:Record<string, string>[] = await new Promise((resolve, reject) => {
      db.all(sql, (err: Error, users: any[]) => {
        if (err) {
          console.error("Error in database operation:", err);
          reject(err);
        } else {
          resolve(users);
        }
      });
    });

    const checkDuplicateemail = selectEmailFromDatabase.find((element: Record<string, string>) => element.Email === email);
    // checking if the email already exists
    if (checkDuplicateemail) {
      return res.json({
          message: `User with ${email} already exist kindly login`,
          "statusCode": 409
    });
  }

    // Encrypt password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Store the new user
    const insertSql = `INSERT INTO Users (
      Full_name, 
      Gender, 
      Email, 
      Phone_no, 
      Address,
      Password
      ) 
      VALUES (?,?,?,?,?,?)`;

    db.run(insertSql, [fullname, gender, email, phone, address, hashedPassword], function (err: Error) {
      if (err) {
        console.error("Error in database operation:", err);
        return res.status(500).json({
          status: 500,
          success: false,
          error: err.message, // Provide the error message for better debugging
        });
      }

      console.log("Successful input:", req.body);
      return res.status(201).json({
        success: `New User with ${email} and password: ${hashedPassword} created`
      });
    });
  } catch (error) {
    res.status(400).json({'message': error});
  }
};

// Creating user route
router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  await handleNewUser(req, res, next)
});

export default router;
