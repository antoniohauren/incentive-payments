import { AuthHandler } from "@/handlers/auth-handler";
import { signInSchema, signUpSchema } from "@/models/auth-model";
import { UserRepository } from "@/repositories/user-repository";
import { AuthService } from "@/services/auth-service";
import { UserService } from "@/services/user-service";
import { validator } from "@/utils/schema-validator";
import { Hono } from "hono";

// BUILDING
const authRouter = new Hono();
const userRepo = new UserRepository();
const userService = new UserService(userRepo);
const authService = new AuthService(userRepo, userService);
const handler = new AuthHandler(authService);

// VALIDATORS
const signInValidator = validator(signInSchema);
const signUpValidator = validator(signUpSchema);

// ROUTES
authRouter.post("sign-in", signInValidator, handler.signIn());
authRouter.post("sign-up", signUpValidator, handler.signUp());

export { authRouter };
