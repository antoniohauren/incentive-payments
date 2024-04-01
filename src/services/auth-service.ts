import type { SignInRequest, SignUpRequest } from "@/models/auth-model";
import type { userRepository } from "@/repositories/user-repository";
import { CONSTANTS as C } from "@/utils/constants";
import { generateHash } from "@/utils/hash";
import { generateJwtToken } from "@/utils/jwt";
import type { JwtPayload, ServiceReturn } from "@/utils/types";
import type { UserService } from "./user-service";

type Return = Promise<ServiceReturn>;

export class AuthService {
  constructor(private readonly repository: userRepository, private readonly service: UserService) {}

  async signIn(dto: SignInRequest): Return {
    const found = await this.repository.fetchUserByUsername(dto.username);

    if (!found.success || !found.data) {
      return {
        success: false,
        message: C.AUTH.FAILED.CREDENTIALS,
      };
    }

    const [user] = found.data;

    const userPasswordHash = user.passwordHash;
    const userSalt = user.salt;

    const passwordHash = generateHash(dto.password, userSalt);

    if (userPasswordHash !== passwordHash) {
      return {
        success: false,
        message: C.AUTH.FAILED.CREDENTIALS,
      };
    }

    const payload: JwtPayload = {
      email: user.email,
      id: user.id,
      name: user.name,
      username: user.username,
    };

    const token = await generateJwtToken(payload);

    return {
      success: true,
      data: { token },
    };
  }

  async signUp(dto: SignUpRequest): Return {
    const res = await this.service.createuser(dto);

    if (!res.success || !res.data) {
      return { success: false, message: C.USER.FAILED.CREATE }
    }

    const user = res.data;

    const payload: JwtPayload = {
      email: user.email,
      id: user.id,
      name: user.name,
      username: user.username
    }

    const token = await generateJwtToken(payload);

    return { success: true, data: { token }}
  }
}
