"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const fastify = (0, fastify_1.default)();
// Import handlers
const users_handler_1 = require("../handlers/users.handler");
function default_1(fastify, options, done) {
    /**
     * @description - Create a new user
     * @access - Public
     */
    fastify.post("/users/create", users_handler_1.createUser);
    done();
}
exports.default = default_1;
