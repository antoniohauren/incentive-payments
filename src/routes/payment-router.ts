import { PaymentHandler } from "@/handlers/payment-handler";
import {
  paymentRequestSchema,
  paymentUpdateSchema,
} from "@/models/payment-model";
import { BalanceRepository } from "@/repositories/balance-repository";
import { PaymentRepository } from "@/repositories/payment-repository";
import { BalanceService } from "@/services/balance-service";
import { PaymentService } from "@/services/payment-service";
import { validator } from "@/utils/schema-validator";
import { Hono } from "hono";

// BUILDING
const paymentRouter = new Hono();
const balanceRepository = new BalanceRepository();
const paymentRepository = new PaymentRepository();
const balanceService = new BalanceService(balanceRepository);
const paymentService = new PaymentService(paymentRepository, balanceService);
const handler = new PaymentHandler(paymentService);

// VALIDATORS
const createValidator = validator(paymentRequestSchema);
const updateValidator = validator(paymentUpdateSchema);

// ROUTES
paymentRouter.post("create", createValidator, handler.createPayment());
paymentRouter.patch("/:id", updateValidator, handler.updatePayment());
paymentRouter.get("/:id", handler.getPayment());
paymentRouter.get("/", handler.getPaymentlist());
paymentRouter.delete("/:id", handler.deletePayment());

export { paymentRouter };
