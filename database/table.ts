const sqlite3 = require('sqlite3').verbose()
const db = new sqlite3.Database('./usersAndNote.db', sqlite3.OPEN_READWRITE, (err: any)=>{
    if(err) return console.log(err)
})

const user_table = `CREATE TABLE Users (
    UserId INTEGER PRIMARY KEY AUTOINCREMENT,
    Full_name VARCHAR(50) NOT NULL,
    Gender CHAR(1),
    Email VARCHAR(100) NOT NULL UNIQUE,
    Phone_no CHAR(14) NOT NULL UNIQUE,
    Address VARCHAR(150),
    Password VARCHAR(255) NOT NULL

)`

const note_table = `CREATE TABLE Notes (
    NoteId INTEGER PRIMARY KEY AUTOINCREMENT,
    NoteCode VARCHAR(20) GENERATED ALWAYS AS ('database' || NoteId) STORED,
    UserId INTEGER,
    Title VARCHAR(255) NOT NULL,
    Description TEXT,
    DueDate VARCHAR(25),
    Status VARCHAR(50),
    FOREIGN KEY (UserId) REFERENCES Users(UserId)
)`

db.run(user_table, ()=>{
    console.log('user_table created successfully')
})
db.run(note_table, ()=>{
    console.log('note_table created successfully')
})

