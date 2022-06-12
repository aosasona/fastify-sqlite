import { database } from "../config/database";
import { UserInterface } from "types/user.types";
import validator from "validator";
import bcrypt from "bcryptjs";
import { Database, Statement } from "sqlite3";
import { promisify } from "util";

interface Body {
  body: UserInterface;
}

interface User {
  id?: number;
  username: string;
  email?: string;
  password?: string;
  createdAt?: string;
}

// Promisify database methods
const query: any = promisify(database.all).bind(database);
const run: any = promisify(database.run).bind(database);

/**
 * @description - View all users
 */
const viewUsers = async (request: any, reply: any) => {
  try {
    // SQL query
    const sql: string = "SELECT id, username, email FROM users";

    // Promisify and execute query
    const rows: any = await query(sql);

    // Check if no users is found
    if (typeof rows !== "object" || rows?.length === 0 || !rows) {
      return reply.code(404).send({
        message: "No users found",
      });
    }

    // Return users if its not null
    return reply.code(200).send({ message: "Users retrieved", data: rows });
  } catch (error: any) {
    return reply.code(500).send({
      message: error?.message || "Something went wrong",
    });
  }
};

/**
 * @description - Create a new user
 */
const createUser = async (request: any, reply: any) => {
  try {
    const {
      body: { email, username, password, password2 },
    }: Body = request;

    // Check if all fields are filled
    if (!(email && username && password && password2)) {
      return reply.code(400).send({
        message: "Please fill in all fields",
      });
    }

    // Check if email is valid
    if (!validator.isEmail(email)) {
      return reply.code(400).send({
        message: "Please enter a valid email",
      });
    }

    // If passwords do not match
    if (password !== password2) {
      return reply.code(400).send({
        message: "Passwords do not match",
      });
    }

    // Cast data
    const Email: string = email?.toLowerCase();
    const Username: string = username?.toLowerCase();

    //  Check if user already exists
    const checkSql: string =
      "SELECT * FROM users WHERE username = ? OR email = ?";

    // database.prepare(checkSql);

    const user: any = await query(checkSql, [Username, Email]);

    // If user exists
    if (user?.length > 0) {
      return reply.code(400).send({
        message: "User already exists",
      });
    }

    // Hash password
    const HashedPassword: string = await bcrypt.hash(password, 10);

    // SQL query
    const sql: string = `INSERT INTO users (email, username, password) VALUES (?, ?, ?)`;

    // database.prepare(sql);

    // Execute query
    await run(sql, [Email, Username, HashedPassword]);

    // Send success message
    return reply.code(201).send({
      message: "User created!",
    });
  } catch (error: any) {
    // console.log(error);
    return reply.code(500).send({
      message: error?.message || "Something went wrong",
    });
  }
};

/**
 * @description - Login a user
 */

export { viewUsers, createUser };
