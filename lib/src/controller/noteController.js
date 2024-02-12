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
exports.putNewNoteFunction = exports.createNewNoteFunction = exports.getNoteFunction = void 0;
const zod_1 = require("zod");
const node_url_1 = __importDefault(require("node:url"));
const sqlite3_1 = __importDefault(require("sqlite3"));
const path_1 = __importDefault(require("path"));
sqlite3_1.default.verbose();
const dbPath = path_1.default.resolve(__dirname, "../../../", "database/notes.db");
const db = new sqlite3_1.default.Database(dbPath, sqlite3_1.default.OPEN_READWRITE, (err) => {
    if (err)
        return console.log(err);
});
/* GET NOTES listing. */
function getNoteFunction(req, res, next) {
    const sql = `SELECT * FROM Notes`;
    db.all(sql, function (err, notes) {
        if (err) {
            console.error("Error in database operation:", err);
            res.status(500).send('Internal Server Error');
        }
        console.log("All users detail gotten");
        res.render('notes', { notes });
    });
}
exports.getNoteFunction = getNoteFunction;
// zod to validate new input
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
// new note middle control
const createNewNoteFunction = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        //const userId = req.user?.UserId;
        const validation = strictNoteObjectSchema.parse(req.body);
        const { Title, description, DueDate, status } = validation;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.UserId;
        console.log(userId);
        const sql = `INSERT INTO Notes (
    Title, 
    description, 
    DueDate, 
    Status,
    UserId
    ) 
    VALUES (?,?,?,?,?)`;
        const notesToRender = db.run(sql, [Title, description, DueDate, status, userId], function (err) {
            if (err) {
                return err;
            }
            else {
                // get the detail of the user that creates note
                const queryUserDetail = `SELECT * FROM Users WHERE UserId = ?`;
                const returnedUserDetailFromDatabase = [];
                db.all(queryUserDetail, [userId], function (error, userDetailFromDatabase) {
                    if (error)
                        return error;
                    else {
                        console.log(userDetailFromDatabase);
                        returnedUserDetailFromDatabase.push(userDetailFromDatabase);
                        console.log(returnedUserDetailFromDatabase);
                    }
                });
                // get all notes created by the user
                const queryNotesDetail = `SELECT * FROM Notes WHERE UserId = ?`;
                const returnedNotesDetailFromDatabase = [];
                db.all(queryNotesDetail, [userId], function (error, noteDetailFromDatabase) {
                    if (error)
                        return error;
                    else {
                        returnedNotesDetailFromDatabase.push(...noteDetailFromDatabase);
                    }
                });
                // rendering the notes after creation
                res.render('Dashboard', { notesToRender, returnedUserDetailFromDatabase, returnedNotesDetailFromDatabase });
                // return res.status(200).json({
                // message: 'New note created successfully'
                // })
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
exports.createNewNoteFunction = createNewNoteFunction;
// zod to validate new input
const putNotesObjectSchema = zod_1.z.object({
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
const strictPutNotesObjectSchema = putNotesObjectSchema.strict();
// new note middle control
const putNewNoteFunction = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //const userId = req.user?.UserId;
        const { query } = node_url_1.default.parse(req.url, true);
        if (!query.noteId) {
            res.status(400).json({
                message: 'Kindly supply noteid to update'
            });
        }
        else {
            const validation = strictPutNotesObjectSchema.parse(req.body);
            const { Title, description, DueDate, status } = validation;
            //const userId = req.user?.UserId
            const sql = `UPDATE Notes SET Title = ?, description = ?, DueDate = ?, Status =? WHERE NoteId = ${query.noteId}`;
            db.run(sql, [Title, description, DueDate, status], function (err, createdNote) {
                if (err) {
                    return err;
                }
                else {
                    return res.status(200).json({
                        error: 'notes updated successfully'
                    });
                }
            });
        }
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
exports.putNewNoteFunction = putNewNoteFunction;
