import "dotenv/config";

import type { JwtPayload } from "@/utils/types";
import { sign } from "hono/jwt";

export class JwtService {
  secret: string;

  constructor() {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error("Invalid jwt secret");
    }

    this.secret = secret;
  }

  async generateToken(payload: JwtPayload) {
    const token = await sign(payload, this.secret);

    return token;
  }
}
