// Initializes table in database
const sqlite3 = require('sqlite3').verbose();

// Initializing database
let db = new sqlite3.Database('./nodejs-sqlite/test.db');

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS userinfo (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        firstname text NOT NULL,
        lastname text NOT NULL,
        email text NOT NULL UNIQUE,
        password text NOT NULL
    )`);
});

module.exports = db;