import * as sqlite3 from "sqlite3"
import * as path from "path"

const dbPath = path.resolve(__dirname, './notes.db')
sqlite3.verbose()
const db = new sqlite3.Database(dbPath)

db.serialize(() => {
    db.run(`CREATE TABLE Users (
    UserId TEXT PRIMARY KEY,
    Full_name VARCHAR(50) NOT NULL,
    Gender CHAR(1),
    Email VARCHAR(100) NOT NULL UNIQUE,
    Phone_no CHAR(14) NOT NULL UNIQUE,
    Address VARCHAR(150),
    Password VARCHAR(255) NOT NULL
)`, (err) => {
        if(err) console.log('unable to table user')
        else console.log('table user created successfully')
    })
    db.run(`CREATE TABLE Notes (
    NoteId TEXT PRIMARY KEY,
    NoteCode VARCHAR(20) GENERATED ALWAYS AS ('database' || NoteId) STORED,
    UserId INTEGER,
    Title VARCHAR(255) NOT NULL,
    Description TEXT,
    DueDate VARCHAR(25),
    Status VARCHAR(50),
    FOREIGN KEY (UserId) REFERENCES Users(UserId)
)`, (err) => {
        if(err) console.log('unable to table user')
        else console.log('table user created successfully')
    })
})

db.close()