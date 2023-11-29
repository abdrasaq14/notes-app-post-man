"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const zod_1 = require("zod");
const bcrypt_1 = __importDefault(require("bcrypt"));
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("/Users/macbook/Desktop/week-6-pod-d-abdrasaq14/lib/src/usersAndNote.db", sqlite3.OPEN_READWRITE, (err) => {
    if (err)
        return console.log(err);
});
// implementation start here
const router = express_1.default.Router();
router.use(body_parser_1.default.json());
router.use(express_1.default.json());
router.use(express_1.default.urlencoded({ extended: false }));
// Zod to validate
const userSchema = zod_1.z.object({
    fullname: zod_1.z
        .string({
        required_error: "fullname needs to be provided",
        invalid_type_error: "fullname needs to be a string",
    })
        .trim()
        .min(2, "fullname need to have a min length of 2")
        .max(50, "fullname need to have a max length of 50"),
    email: zod_1.z.string({
        required_error: "email needs to be provided",
        invalid_type_error: "email needs to be a string",
    }).email(),
    gender: zod_1.z.string().max(1),
    phone: zod_1.z.string().max(14),
    address: zod_1.z.string().min(10).max(100),
    password: zod_1.z.string({
        required_error: "password needs to be provided",
        invalid_type_error: "pass needs to be a string",
    }).min(6, "password must be at least 6 characters")
});
// GET all users route
router.get("/", function (req, res, next) {
    const sql = `SELECT * FROM Users`;
    db.all(sql, function (err, users) {
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
const handleNewUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validation = userSchema.parse(req.body);
        const { fullname, gender, email, phone, address, password } = validation;
        // Check for duplicate email
        const sql = `SELECT Email FROM Users`;
        const selectEmailFromDatabase = yield new Promise((resolve, reject) => {
            db.all(sql, (err, users) => {
                if (err) {
                    console.error("Error in database operation:", err);
                    reject(err);
                }
                else {
                    resolve(users);
                }
            });
        });
        const checkDuplicateemail = selectEmailFromDatabase.find((element) => element.Email === email);
        // checking if the email already exists
        if (checkDuplicateemail) {
            return res.json({
                message: `User with ${email} already exist kindly login`,
                "statusCode": 409
            });
        }
        // Encrypt password
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
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
        db.run(insertSql, [fullname, gender, email, phone, address, hashedPassword], function (err) {
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
    }
    catch (error) {
        res.status(400).json({ 'message': error });
    }
});
// Creating user route
router.post("/", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    yield handleNewUser(req, res, next);
}));
exports.default = router;
