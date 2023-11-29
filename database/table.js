var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('./usersAndNote.db', sqlite3.OPEN_READWRITE, function (err) {
    if (err)
        return console.log(err);
});
var user_table = "CREATE TABLE Users (\n    UserId INTEGER PRIMARY KEY AUTOINCREMENT,\n    Full_name VARCHAR(50) NOT NULL,\n    Gender CHAR(1),\n    Email VARCHAR(100) NOT NULL UNIQUE,\n    Phone_no CHAR(14) NOT NULL UNIQUE,\n    Address VARCHAR(150),\n    Password VARCHAR(255) NOT NULL\n\n)";
var note_table = "CREATE TABLE Notes (\n    NoteId INTEGER PRIMARY KEY AUTOINCREMENT,\n    NoteCode VARCHAR(20) GENERATED ALWAYS AS ('database' || NoteId) STORED,\n    UserId INTEGER,\n    Title VARCHAR(255) NOT NULL,\n    Description TEXT,\n    DueDate VARCHAR(25),\n    Status VARCHAR(50),\n    FOREIGN KEY (UserId) REFERENCES Users(UserId)\n)";
db.run(user_table, function () {
    console.log('user_table created successfully');
});
db.run(note_table, function () {
    console.log('note_table created successfully');
});
