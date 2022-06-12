import { database } from "./config/database";

/**
 * @description Create Tables
 */

database.serialize(() => {
  const sql: string = `CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email VARCHAR(255) NOT NULL UNIQUE,
        username VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`;
  database.run(sql);
});

//  Close database connection
database.close();
