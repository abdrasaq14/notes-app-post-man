"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sqlite3_1 = __importDefault(require("sqlite3"));
const path_1 = __importDefault(require("path"));
sqlite3_1.default.verbose();
const dbPath = path_1.default.resolve(__dirname, "../../../", "database/notes.db");
const db = new sqlite3_1.default.Database(dbPath, sqlite3_1.default.OPEN_READWRITE, (err) => {
    if (err)
        return console.log(err);
});
function default_1(req, res, next) {
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
        else {
            console.log("All users detail gotten");
            return res.send(JSON.stringify(users, null, 2));
        }
    });
}
exports.default = default_1;
;
