import Fastify from "fastify";
const fastify = Fastify({
  logger: {
    transport:
      process.env.NODE_ENV !== "production"
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
import dotenv from "dotenv";
dotenv.config();

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
const port: number | any = process.env.PORT || 9200;

fastify.listen({ port: port }, (err, address) => {
  if (err) return console.log(err);
  console.log(`🚀 Fastify server listening on ${address}`);
});
