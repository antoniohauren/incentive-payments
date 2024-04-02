import A from "node:assert";
import T from "node:test";
import type { ConfigService } from "@/lib/config-service";
import type { HashService } from "@/lib/hash-service";
import { JwtService } from "@/lib/jwt-service";
import type { UserRepository } from "@/repositories/user-repository";
import { AuthService } from "./auth-service";
import { UserService } from "./user-service";

T.describe("auth-service", () => {
  let userRepository: UserRepository;
  let userService: UserService;
  let hashService: HashService;
  let configService: ConfigService;
  let jwtService: JwtService;
  let sut: AuthService;

  T.before(() => {
    const now = new Date();
    const mockUser = {
      email: "test@test.com",
      id: "id",
      name: "test",
      username: "q",
      passwordHash: "hashed",
      salt: "salt",
      createdAt: now,
      updatedAt: now,
    };

    userRepository = {
      createUser: async () => ({ success: true, data: [] }),
      fetchUserByEmail: async () => ({ success: true, data: [] }),
      fetchUserById: async () => ({ success: true, data: [] }),
      fetchUserByUsername: async () => ({ success: true, data: [mockUser] }),
      fetchUserList: async () => ({ success: true, data: [] }),
    };

    hashService = {
      generateHash: () => "hashed",
      generateSalt: () => "salt",
      isValidHash: () => true,
    };

    configService = {
      jwt_secret: "secret",
      load() {},
    };

    jwtService = new JwtService(configService);

    T.mock.method(jwtService, "generateToken", () => "valid_token");

    userService = new UserService(userRepository, hashService);
    sut = new AuthService(userRepository, userService, hashService, jwtService);
  });

  T.describe("sign-in", () => {
    T.it("should success", async () => {
      const response = await sut.signIn({
        password: "123",
        username: "teste",
      });

      const expected = {
        success: true,
        data: { token: "valid_token" },
      };

      A.deepStrictEqual(response, expected);
    });

    T.it("should invalid credentials", async () => {
      const spy = T.mock.method(userRepository, "fetchUserByUsername");
      spy.mock.mockImplementationOnce(async () => ({
        success: false,
      }));

      const response = await sut.signIn({
        password: "invalid",
        username: "invalid",
      });

      const expected = {
        success: false,
        message: "INVALID_CREDENTIALS",
      };

      A.equal(spy.mock.callCount(), 1);
      A.deepStrictEqual(response, expected);
    });

    T.it("should throw invalid with wrong password", async () => {
      const spy = T.mock.method(
        hashService,
        "generateHash",
        async () => "fake_hash",
      );

      const response = await sut.signIn({
        password: "invalid",
        username: "valid",
      });

      const expected = {
        success: false,
        message: "INVALID_CREDENTIALS",
      };

      A.equal(spy.mock.callCount(), 1);
      A.deepStrictEqual(response, expected);
    });
  });

  T.describe("sign-up", () => {
    const dto = {
      email: "valid@mail.com",
      name: "valid",
      password: "valid",
      username: "valid",
    };

    T.it("should thow error from user service", async () => {
      const response = await sut.signUp(dto);

      const expected = {
        success: false,
        message: "EMAIL_IN_USE",
      };

      A.deepEqual(response, expected);
    });

    T.it("should thow failed to create user", async () => {
      T.mock.method(userService, "createuser", () => ({
        success: false,
      }));

      const response = await sut.signUp(dto);

      const expected = {
        success: false,
        message: "FAILED_TO_CREATE_USER",
      };

      A.deepEqual(response, expected);
    });

    T.it("should success", async () => {
      T.mock.method(userService, "createuser", () => ({
        success: true,
        data: [],
      }));

      const response = await sut.signUp(dto);

      const expected = {
        success: true,
        data: { token: "valid_token" },
      };

      A.deepEqual(response, expected);
    });
  });
});
