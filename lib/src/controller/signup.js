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
const sqlite3_1 = __importDefault(require("sqlite3"));
const path_1 = __importDefault(require("path"));
sqlite3_1.default.verbose();
const dbPath = path_1.default.resolve(__dirname, "../../../", "database/notes.db");
const db = new sqlite3_1.default.Database(dbPath, sqlite3_1.default.OPEN_READWRITE, (err) => {
    if (err)
        return console.log(err);
});
// new user schema
const newUserSchema = zod_1.z.object({
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
const strictNewUserSchema = newUserSchema.strict();
function checkIfUserHasAccount(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const validation = strictNewUserSchema.parse(req.body);
            const { fullname, gender, email, phone, address, password } = validation;
            // Check for duplicate email
            const sql = `SELECT Email FROM Users`;
            const selectEmailFromDatabase = yield new Promise((resolve, reject) => {
                db.all(sql, (err, users) => {
                    resolve(users);
                });
            });
            const checkDuplicateemail = selectEmailFromDatabase.find((element) => element.Email === email);
            // checking if the email already exists
            if (checkDuplicateemail) {
                return res.status(401).json({
                    message: `User with ${email} already exist kindly login`,
                });
            }
            else {
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
                        return `Error in database operation: ${err}`;
                    }
                    else {
                        return res.status(201).json({
                            success: `New User with ${email} created, proceed to login`
                        });
                    }
                });
            }
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                res.status(401).json({
                    message: error
                });
            }
            else {
                return res.status(403).json({
                    error: 'Kindly sign up or request access from admin'
                });
            }
        }
    });
}
exports.default = checkIfUserHasAccount;
;
