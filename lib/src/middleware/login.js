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
const zod_1 = require("zod");
const bcrypt_1 = __importDefault(require("bcrypt"));
const console_1 = require("console");
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("/Users/macbook/Desktop/week-6-pod-d-abdrasaq14/lib/src/usersAndNote.db", sqlite3.OPEN_READWRITE, (err) => {
    if (err)
        return console.log(err);
});
// Zod to validate
const userSchema = zod_1.z.object({
    email: zod_1.z.string({
        required_error: "email needs to be provided",
        invalid_type_error: "email needs to be a string",
    })
        .email(),
    password: zod_1.z.string({
        required_error: "password needs to be provided",
        invalid_type_error: "password needs to be a string",
    }).min(6, "password must be at least 6 characters")
});
const strictNewUserSchema = userSchema.strict();
function handleUserLogin(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const validation = strictNewUserSchema.parse(req.body);
            const { email, password } = validation;
            // checking the database for the record of that user
            const sql = `SELECT * FROM Users WHERE Email = ?;`;
            //   this is now an array of object for each record
            const selectEmailFromDatabase = yield new Promise((resolve, reject) => {
                db.all(sql, [email], (err, users) => {
                    if (err) {
                        console.error("Error in database operation:", err);
                        reject(res.status(500).json({
                            message: `my error ${console_1.error}`
                        }));
                    }
                    else {
                        return resolve(users);
                    }
                });
            });
            const checkDatabaseForUserRecord = selectEmailFromDatabase.find((element) => element.Email === email);
            //unauthorized, kindly sign up or request access from admin;
            if (!checkDatabaseForUserRecord) {
                return res.status(401).json({
                    message: `User with email ${email} does not exist, Kindly signup`
                });
            }
            //   if that user exist, check for password
            const matchPassword = yield bcrypt_1.default.compare(password, checkDatabaseForUserRecord.Password);
            if (matchPassword) {
                res.json({
                    'success': `User with Email: ${email} is logged in!`
                });
            }
            else {
                res.json({
                    message: `Incorrect password`,
                    "statusCode": 401
                });
            }
        }
        catch (error) {
            res.status(400).json({ 'message': error });
        }
    });
}
exports.default = handleUserLogin;
;
