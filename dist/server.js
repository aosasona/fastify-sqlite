"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const fastify = (0, fastify_1.default)({
    logger: {
        transport: process.env.NODE_ENV !== "production"
            ? {
                target: "pino-pretty",
                options: {
                    translateTime: "HH:MM:ss Z",
                    ignore: "hostname",
                },
            }
            : undefined,
    },
});
// Load environment variables from .env file
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Register plugins
fastify.register(require("@fastify/formbody"));
fastify.register(require("@fastify/cors"));
fastify.register(require("@fastify/multipart"));
fastify.register(require("@fastify/jwt"), {
    secret: process.env.JWT_SECRET,
});
// Import routes
fastify.register(require("./routes/users.route"));
// Run the server
const port = process.env.PORT || 9200;
fastify.listen({ port: port }, (err, address) => {
    if (err)
        return console.log(err);
    console.log(`🚀 Fastify server listening on ${address}`);
});
