import { AuthHandler } from "@/handlers/auth-handler";
import { ConfigService } from "@/lib/config-service";
import { HashService } from "@/lib/hash-service";
import { JwtService } from "@/lib/jwt-service";
import { signInSchema, signUpSchema } from "@/models/auth-model";
import { UserRepository } from "@/repositories/user-repository";
import { AuthService } from "@/services/auth-service";
import { UserService } from "@/services/user-service";
import { validator } from "@/utils/schema-validator";
import { Hono } from "hono";

// BUILDING
const authRouter = new Hono();
const hashService = new HashService();
const userRepository = new UserRepository();
const userService = new UserService(userRepository, hashService);
const configService = new ConfigService();
const jwtService = new JwtService(configService);
const authService = new AuthService(
  userRepository,
  userService,
  hashService,
  jwtService,
);
const handler = new AuthHandler(authService);

// VALIDATORS
const signInValidator = validator(signInSchema);
const signUpValidator = validator(signUpSchema);

// ROUTES
authRouter.post("sign-in", signInValidator, handler.signIn());
authRouter.post("sign-up", signUpValidator, handler.signUp());

export { authRouter };
