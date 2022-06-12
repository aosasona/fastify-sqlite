import Fastify from "fastify";
const fastify = Fastify();
import { database } from "../config/database";
import {
  SingleUserInterface,
  TokenInterface,
  UserInterface,
} from "types/user.types";
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
const get: any = promisify(database.get).bind(database);

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
const loginUser = async (request: any, reply: any) => {
  try {
    const {
      body: { identifier, password },
    }: Body = request;

    // Check if all fields are filled
    if (!(identifier && password)) {
      return reply.code(400).send({
        message: "Please fill in all fields",
      });
    }

    // Cast data
    const Identifier: string = identifier?.toLowerCase();

    // Check if user exists
    const checkSql =
      "SELECT email, password FROM users WHERE username = ? OR email = ? LIMIT 1";
    const user: SingleUserInterface | undefined | any = await get(checkSql, [
      Identifier,
      Identifier,
    ]);

    // If user does not exist
    if (!user || !Boolean(user)) {
      return reply.code(404).send({
        message: "User does not exist",
      });
    }

    // Compare password with password hash
    const comparePassword: boolean = await bcrypt.compare(
      password,
      user?.password
    );

    // If password is incorrect
    if (!comparePassword) {
      return reply.code(400).send({
        message: "Password is incorrect!",
      });
    }

    // Create JWT token
    const token: string = await reply.jwtSign(
      {
        email: user?.email,
        role: ["user"],
      },
      { expiresIn: "1d" }
    );

    // Send response message
    return reply.send({
      message: "Welcome back chief!",
      token: token,
    });
  } catch (error: any) {
    return reply.code(500).send({
      message: error?.message || "Something went wrong",
    });
  }
};

/**
 * @description - Login a user
 */
const verifyUser = async (request: any, reply: any) => {
  try {
    const { authorization } = request.headers;

    if (!authorization || !authorization.startsWith("Bearer ")) {
      return reply.code(401).send({
        message: "Please provide a valid token!",
      });
    }

    // Verify token
    const verified: TokenInterface = await request.jwtVerify();

    const { email } = verified;

    // Get the user's name
    const sql: string = "SELECT username, email FROM users WHERE email = ?";

    const user: UserInterface | undefined | any = await get(sql, [email]);

    // If user does not exist
    if (!user || !Boolean(user)) {
      return reply.code(404).send({
        message: "User does not exist",
      });
    }

    // Send response message
    return reply.send({
      message: "Yup, you are logged in!",
      user,
    });
  } catch (error: any) {
    return reply.code(500).send({
      message: error?.message || "Something went wrong",
    });
  }
};

export { viewUsers, createUser, loginUser, verifyUser };
