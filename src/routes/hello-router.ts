import { hello } from "@/handlers/hello-handler";
import { Hono } from "hono";

const helloRouter = new Hono();

helloRouter.get("/", hello);

export { helloRouter };
