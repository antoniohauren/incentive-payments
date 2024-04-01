import { UserHandler } from "@/handlers/user-handler";
import { userRequestSchema } from "@/models";
import { UserRepository } from "@/repositories/user-repository";
import { UserService } from "@/services/user-service";
import { validator } from "@/utils/schema-validator";
import { Hono } from "hono";

// BUILDING
const userRouter = new Hono();
const userRepository = new UserRepository();
const userService = new UserService(userRepository);
const handler = new UserHandler(userService);

// VALIDATORS
const createValidator = validator(userRequestSchema);

// ROUTES
userRouter.post("/create", createValidator, handler.createUser());
userRouter.get("/:id", handler.getuser());
userRouter.get("/", handler.getuserList());

export { userRouter };
