import "dotenv/config";

export class ConfigService {
  public jwt_secret = "";

  constructor() {
    this.load();
  }

  load() {
    const jwt_secret = process.env.JWT_SECRET;

    if (!jwt_secret) {
      throw new Error("invalid JWT_SECRET");
    }

    this.jwt_secret = jwt_secret;
  }
}
