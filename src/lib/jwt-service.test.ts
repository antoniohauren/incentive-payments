import A from "node:assert";
import T from "node:test";
import type { ConfigService } from "./config-service";
import { JwtService } from "./jwt-service";

T.describe("jwt-service", () => {
  let configService: ConfigService;
  let sut: JwtService;

  T.before(() => {
    configService = {
      jwt_secret: "secret",
      load() {},
    };

    sut = new JwtService(configService);
  });

  T.test("should generate token", async () => {
    const response = await sut.generateToken({
      email: "test@mail.com",
      id: "id",
      name: "name",
      username: "username",
    });

    A.equal(response.length > 0, true);
    A.equal(typeof response, "string");
  });
});
