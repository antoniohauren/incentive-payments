import type {
  PaymentRequest,
  PaymentUpdateRequest,
} from "@/models/payment-model";
import type { PaymentService } from "@/services/payment-service";
import type { Handler } from "hono";

export class PaymentHandler {
  constructor(private readonly service: PaymentService) {}

  createPayment(): Handler {
    return async (c) => {
      const body = await c.req.json<PaymentRequest>();

      const { success, message } = await this.service.createPayment(body);

      if (success) {
        return c.json({ success, message }, 201);
      }

      return c.json({ success, message }, 400);
    };
  }

  getPayment(): Handler {
    return async (c) => {
      const id = c.req.param("id");

      const { success, data, message } = await this.service.getPayment(id);

      if (success) {
        return c.json({ success, data });
      }

      return c.json({ success, message }, 400);
    };
  }

  getPaymentlist(): Handler {
    return async (c) => {
      const { success, data, message } = await this.service.getPaymentList();

      if (success) {
        return c.json({ success, data });
      }

      return c.json({ success, message }, 400);
    };
  }

  updatePayment(): Handler {
    return async (c) => {
      const body = await c.req.json<PaymentUpdateRequest>();
      const id = c.req.param("id");

      const { success, message } = await this.service.updatePayment(id, body);

      if (success) {
        return c.json({ success, message });
      }

      return c.json({ success, message }, 400);
    };
  }

  deletePayment(): Handler {
    return async (c) => {
      const id = c.req.param("id");

      const { success, message } = await this.service.deletePayment(id);

      if (success) {
        return c.json({ success, message });
      }

      return c.json({ success, message }, 400);
    };
  }
}
