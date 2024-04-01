import type { SignInRequest, SignUpRequest } from "@/models/auth-model";
import type { AuthService } from "@/services/auth-service";
import type { Handler } from "hono";

export class AuthHandler {
  constructor(private readonly service: AuthService) {}

  signIn(): Handler {
    return async (ctx) => {
      const body = await ctx.req.json<SignInRequest>();

      const { success, message, data } = await this.service.signIn(body);

      if (success) {
        return ctx.json({ success, data });
      }

      return ctx.json({ success, message }, 400);
    };
  }

  signUp(): Handler {
    return async (ctx) => {
      const body = await ctx.req.json<SignUpRequest>();

      const { success, data, message } = await this.service.signUp(body);

      if (success) {
        return ctx.json({ success, data });
      }

      return ctx.json({ success, message }, 400);
    };
  }
}
