import Fastify from "fastify";
const fastify = Fastify();

// Import types
import { RegRoute } from "types/user.types";

// Import handlers
import { viewUsers, createUser } from "../handlers/users.handler";

export default async function (fastify: any, options: any, done: any) {
  /**
   * @description - View all users
   * @access - Public
   */
  fastify.get("/users", viewUsers);

  /**
   * @description - Create a new user
   * @access - Public
   */
  fastify.post("/users/create", createUser);

  done();
}
