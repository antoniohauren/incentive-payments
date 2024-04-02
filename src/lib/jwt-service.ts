import type { JwtPayload } from "@/utils/types";
import { sign } from "hono/jwt";
import type { ConfigService } from "./config-service";

export class JwtService {
  constructor(private readonly config: ConfigService) {}

  async generateToken(payload: JwtPayload) {
    const token = await sign(payload, this.config.jwt_secret);

    return token;
  }
}
