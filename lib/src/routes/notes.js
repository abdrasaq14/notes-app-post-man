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
const zod_1 = require("zod");
const console_1 = require("console");
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("/Users/macbook/Desktop/week-6-pod-d-abdrasaq14/lib/src/usersAndNote.db", sqlite3.OPEN_READWRITE, (err) => {
    if (err)
        return console.log("why", err);
});
// implementation start here
const router = express_1.default.Router();
//router.use(bodyParser.json());
router.use(express_1.default.json());
router.use(express_1.default.urlencoded({ extended: false }));
/* GET NOTES listing. */
router.get("/", function (req, res, next) {
    const sql = `SELECT * FROM Notes`;
    db.all(sql, function (err, notes) {
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
const notesObjectSchema = zod_1.z.object({
    Title: zod_1.z
        .string({
        required_error: "fullname needs to be provided",
        invalid_type_error: "fullname needs to be a string",
    })
        .trim()
        .min(2, "Title need to have a min length of 2")
        .max(200, "title need to have a max length of 200"),
    description: zod_1.z.string(),
    DueDate: zod_1.z.string().trim(),
    status: zod_1.z.string({
        required_error: "kindly indicate the status",
    }).max(14)
});
const strictNoteObjectSchema = notesObjectSchema.strict();
// new note middle ware
const newNoteMiddleWare = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
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
        db.run(sql, [Title, description, DueDate, status], function (err, createdNote) {
            if (err) {
                return (0, console_1.error)('Error in connecting to database');
            }
            else {
                return res.status(200).json({
                    error: 'New note created successfully'
                });
            }
        });
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            res.status(401).json({
                message: zod_1.ZodError
            });
        }
        else {
            return res.status(403).json({
                error: 'Kindly sign up or request access from admin'
            });
        }
    }
});
router.post("/", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    yield newNoteMiddleWare(req, res, next);
}));
exports.default = router;
