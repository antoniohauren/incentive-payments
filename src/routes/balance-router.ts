import {
  createBalanceHandler,
  getBalanceHandler,
  getBalanceListHandler,
  updateBalanceHandler,
} from "@/handlers/balance";
import {
  balanceRequestSchema,
  balanceUpdateSchema,
} from "@/models/balance-model";
import { validator } from "@/utils/schema-validator";
import { Hono } from "hono";

const balanceRouter = new Hono();

balanceRouter.post(
  "/create",
  validator(balanceRequestSchema),
  createBalanceHandler,
);

balanceRouter.get("/:id", getBalanceHandler);
balanceRouter.get("/", getBalanceListHandler);
balanceRouter.patch(
  "/:id",
  validator(balanceUpdateSchema),
  updateBalanceHandler,
);

export { balanceRouter };
