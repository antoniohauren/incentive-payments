import type { UserListResponse, UserRequest, UserResponse } from "@/models";
import type { userRepository } from "@/repositories/user-repository";
import type { InsertUser, SelectUser } from "@/schemas";
import { CONSTANTS as C } from "@/utils/constants";
import { generateHash, generateSalt } from "@/utils/hash";
import type { RepositoryRetrun, ServiceReturn } from "@/utils/types";

type Return<T = SelectUser> = Promise<ServiceReturn<T>>;

export class UserService {
  constructor(private readonly repository: userRepository) {}

  async createuser(dto: UserRequest): Return {
    let found: RepositoryRetrun<SelectUser>;

    found = await this.repository.fetchUserByEmail(dto.email);

    if (found.success) {
      return { success: false, message: C.USER.IN_USE.EMAIL };
    }

    found = await this.repository.fetchUserByUsername(dto.username);

    if (found.success) {
      return { success: false, message: C.USER.IN_USE.USERNAME };
    }

    const passwordSalt = generateSalt();
    const passwordHash = generateHash(dto.password, passwordSalt);

    const userDto: InsertUser = {
      username: dto.username,
      email: dto.email,
      name: dto.name,
      passwordHash: passwordHash,
      salt: passwordSalt,
    };

    const user = await this.repository.createUser(userDto);

    if (!user.success || !user.data) {
      return { success: false, message: C.USER.FAILED.CREATE };
    }

    const [data] = user.data;

    return { success: true, message: C.USER.SUCCESS.CREATE, data }
  }

  async getUser(id: string): Return<UserResponse> {
    const found = await this.repository.fetchUserById(id);

    if (!found.success || !found.data) {
        return { success: false, message: C.USER.FAILED.FOUND }
    }

    const [user] = found.data;

    const data: UserResponse = {
        id: user.id,
        email: user.email,
        name: user.name,
        username: user.username,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
    };

    return { success: true, data }
  }

  async getUserList(): Return<UserListResponse> {
    const res = await this.repository.fetchUserList();

    if (!res.success || !res.data) {
        return { success: false, message: C.SHARED.UNKNOWN}
    }

    const data = res.data.map(user => {
        return {
            id: user.id,
            name: user.name,
            username: user.username,
            email: user.email,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        }
    })

    return { success: true, data }
  }
}
