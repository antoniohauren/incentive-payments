import type {
  BalanceRequest,
  BalanceUpdateRequest,
} from "@/models/balance-model";
import type { BalanceService } from "@/services/balance-service";
import type { JwtPayload } from "@/utils/types";
import type { Handler } from "hono";

export class BalanceHandler {
  constructor(private readonly service: BalanceService) {}

  createBalance(): Handler {
    return async (c) => {
      const body = await c.req.json<BalanceRequest>();
      const user: JwtPayload = c.get("jwtPayload");

      const { success, message } = await this.service.createBalance(
        body,
        user.id,
      );

      if (success) {
        return c.json({ success, message }, 201);
      }

      return c.json({ success, message }, 400);
    };
  }

  getBalance(): Handler {
    return async (c) => {
      const id = c.req.param("id");

      const { success, data, message } = await this.service.getBalance(id);

      if (success) {
        return c.json({ success, data });
      }

      return c.json({ success, message }, 400);
    };
  }

  getBalanceList(): Handler {
    return async (c) => {
      const { success, data, message } = await this.service.getBalanceList();

      if (success) {
        return c.json({ success, data });
      }

      return c.json({ success, message }, 400);
    };
  }

  updateBalance(): Handler {
    return async (c) => {
      const body = await c.req.json<BalanceUpdateRequest>();
      const id = c.req.param("id");

      const { success, message } = await this.service.updateBalance(id, body);

      if (success) {
        return c.json({ success, message });
      }

      return c.json({ success, message }, 400);
    };
  }

  deleteBalance(): Handler {
    return async (c) => {
      const id = c.req.param("id");

      const { success, message } = await this.service.deleteBalance(id);

      if (success) {
        return c.json({ success, message });
      }

      return c.json({ success, message }, 400);
    };
  }
}
