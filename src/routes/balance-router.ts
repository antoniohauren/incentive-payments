import { BalanceHandler } from "@/handlers/balance-handler";
import {
  balanceRequestSchema,
  balanceUpdateSchema,
} from "@/models/balance-model";
import { BalanceRepository } from "@/repositories/balance-repository";
import { BalanceService } from "@/services/balance-service";
import { validator } from "@/utils/schema-validator";
import { Hono } from "hono";

// BUILDING
const balanceRouter = new Hono();
const balanceRepository = new BalanceRepository();
const balanceService = new BalanceService(balanceRepository);
const handler = new BalanceHandler(balanceService);

// VALIDATORS
const createValidator = validator(balanceRequestSchema);
const updateValidator = validator(balanceUpdateSchema);

// ROUTES
balanceRouter.post("/create", createValidator, handler.createBalance());
balanceRouter.patch("/:id", updateValidator, handler.updateBalance());
balanceRouter.get("/:id", handler.getBalance());
balanceRouter.get("/", handler.getBalanceList());
balanceRouter.delete("/:id", handler.deleteBalance());

export { balanceRouter };
