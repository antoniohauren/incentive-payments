import type { UserRequest } from "@/models";
import type { UserService } from "@/services/user-service";
import type { Handler } from "hono";

export class UserHandler {
  constructor(private readonly service: UserService) {}

  createUser(): Handler {
    return async (c) => {
      const body = await c.req.json<UserRequest>();

      const { success, message } = await this.service.createuser(body);

      if (success) {
        return c.json({ success, message }, 201);
      }

      return c.json({ success, message }, 400);
    };
  }

  getuser(): Handler {
    return async (c) => {
      const id = c.req.param("id");

      const { success, data, message } = await this.service.getUser(id);

      if (success) {
        return c.json({ success, data });
      }

      return c.json({ success, message }, 400);
    };
  }

  getuserList(): Handler {
    return async (c) => {
      const { success, data, message } = await this.service.getUserList();

      if (success) {
        return c.json({ success, data });
      }

      return c.json({ success, message }, 400);
    };
  }
}
