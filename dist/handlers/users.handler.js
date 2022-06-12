"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUser = void 0;
const database_1 = require("../config/database");
const validator_1 = __importDefault(require("validator"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
/**
 * @description - Create a new user
 */
const createUser = async (request, reply) => {
    try {
        const { body: { email, username, password, password2 }, } = request;
        // Check if all fields are filled
        if (!(email && username && password && password2)) {
            return reply.code(400).send({
                message: "Please fill in all fields",
            });
        }
        // Check if email is valid
        if (!validator_1.default.isEmail(email)) {
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
        const Email = email === null || email === void 0 ? void 0 : email.toLowerCase();
        const Username = username === null || username === void 0 ? void 0 : username.toLowerCase();
        // Check if username is already taken
        const checkSql = "SELECT * FROM users WHERE username = ?";
        const usernameStmt = database_1.database
            .prepare(checkSql)
            .run([Username])
            .finalize();
        // if (usernameStmt) {
        //   return reply.code(400).send({
        //     message: "Username already taken",
        //   });
        // }
        console.log(usernameStmt);
        const HashedPassword = await bcryptjs_1.default.hash(password, 10);
        const sql = `INSERT INTO users (email, username, password) VALUES (?, ?, ?)`;
        const execute = database_1.database
            .prepare(sql)
            .run([Email, username, HashedPassword])
            .finalize();
        if (!execute) {
            return reply.code(400).send({
                message: "Something went wrong",
            });
        }
        database_1.database.close();
        return reply.code(201).send({
            message: "User created successfully",
        });
    }
    catch (error) {
        console.log(error);
        return reply.code(500).send({
            message: "Something went wrong",
        });
    }
};
exports.createUser = createUser;
