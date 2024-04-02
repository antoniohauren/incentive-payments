import type { HashService } from "@/lib/hash-service";
import type { UserRequest } from "@/models";
import type { UserRepository } from "@/repositories/user-repository";
import A from "node:assert";
import T from "node:test";
import { UserService } from "./user-service";

const now = new Date();

const mockUser = {
  email: "test@test.com",
  id: "id",
  name: "test",
  username: "username",
  createdAt: now,
  updatedAt: now,
  passwordHash: "hashed",
  salt: "salt",
};

T.describe("user-service", () => {
  let userRepository: UserRepository;
  let hashService: HashService;
  let sut: UserService;

  T.before(() => {
    userRepository = {
      createUser: async () => ({ success: true, data: [mockUser] }),
      fetchUserByEmail: async () => ({ success: true, data: [] }),
      fetchUserById: async () => ({ success: true, data: [mockUser] }),
      fetchUserByUsername: async () => ({ success: true, data: [mockUser] }),
      fetchUserList: async () => ({ success: true, data: [] }),
    };

    hashService = {
      generateHash: () => "hashed",
      generateSalt: () => "salt",
      isValidHash: () => true,
    };

    sut = new UserService(userRepository, hashService);
  });

  T.beforeEach(() => {
    T.mock.restoreAll();
  });

  T.describe("create-user", () => {
    const dto: UserRequest = {
      id: "valid_id",
      email: "valid@user.com",
      name: "valid",
      username: " valid_username",
      createdAt: new Date(),
      updatedAt: new Date(),
      password: "valid_password",
    };

    T.it("should throw if email is in use", async () => {
      const response = await sut.createuser(dto);

      const expected = {
        success: false,
        message: "EMAIL_IN_USE",
      };

      A.deepEqual(response, expected);
    });

    T.it("should throw if username is in use", async () => {
      T.mock.method(userRepository, "fetchUserByEmail", () => ({
        success: false,
      }));

      const response = await sut.createuser(dto);

      const expected = {
        success: false,
        message: "USERNAME_IN_USE",
      };

      A.deepEqual(response, expected);
    });

    T.it("should throw if repository cant create user", async () => {
      T.mock.method(userRepository, "createUser", () => ({ success: false }));

      T.mock.method(userRepository, "fetchUserByEmail", () => ({
        success: false,
      }));

      T.mock.method(userRepository, "fetchUserByUsername", () => ({
        success: false,
      }));

      const response = await sut.createuser(dto);

      const expected = {
        success: false,
        message: "FAILED_TO_CREATE_USER",
      };

      A.deepEqual(response, expected);
    });

    T.it("should create user", async () => {
      T.mock.method(userRepository, "fetchUserByEmail", () => ({
        success: false,
      }));

      T.mock.method(userRepository, "fetchUserByUsername", () => ({
        success: false,
      }));

      const response = await sut.createuser(dto);
      const expected = {
        success: true,
        message: "USER_CREATED",
        data: mockUser,
      };

      A.deepEqual(response, expected);
    });
  });

  T.describe("get-user", () => {
    T.it("should throw if user not found", async () => {
      T.mock.method(userRepository, "fetchUserById", () => ({
        success: false,
      }));

      const response = await sut.getUser("fake_id");

      const expected = {
        success: false,
        message: "USER_NOT_FOUND",
      };

      A.deepEqual(response, expected);
    });

    T.it("should get user", async () => {
      const response = await sut.getUser("id");
      const { passwordHash, salt, ...data } = mockUser;

      const expected = {
        success: true,
        data,
      };

      A.deepEqual(response, expected);
    });
  });

  T.describe("get-user-list", () => {
    T.it("should load empty user list", async () => {
      const response = await sut.getUserList();

      const expected = {
        success: true,
        data: [],
      };

      A.deepEqual(response, expected);
    });

    T.it("should load user list", async () => {
      T.mock.method(userRepository, "fetchUserList", () => ({
        success: true,
        data: [mockUser],
      }));

      const { passwordHash, salt, ...data } = mockUser;

      const response = await sut.getUserList();

      const expected = {
        success: true,
        data: [data],
      };

      A.deepEqual(response, expected);
    });
  });
});
