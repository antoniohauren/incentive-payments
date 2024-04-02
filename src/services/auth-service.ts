import type { HashService } from "@/lib/hash-service";
import type { JwtService } from "@/lib/jwt-service";
import type { SignInRequest, SignUpRequest } from "@/models/auth-model";
import type { UserRepository } from "@/repositories/user-repository";
import { CONSTANTS as C } from "@/utils/constants";
import type { JwtPayload, ServiceReturn } from "@/utils/types";
import type { UserService } from "./user-service";

type Return = Promise<ServiceReturn>;

export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly userService: UserService,
    private readonly hashService: HashService,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(dto: SignInRequest): Return {
    const found = await this.userRepository.fetchUserByUsername(dto.username);

    if (!found.success || !found.data) {
      return {
        success: false,
        message: C.AUTH.FAILED.CREDENTIALS,
      };
    }

    const [user] = found.data;

    const userPasswordHash = user.passwordHash;
    const userSalt = user.salt;

    const passwordHash = this.hashService.generateHash(dto.password, userSalt);

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

    const token = await this.jwtService.generateToken(payload);

    return {
      success: true,
      data: { token },
    };
  }

  async signUp(dto: SignUpRequest): Return {
    const res = await this.userService.createuser(dto);

    if (!res.success || !res.data) {
      return { success: false, message: res.message || C.USER.FAILED.CREATE };
    }

    const user = res.data;

    const payload: JwtPayload = {
      email: user.email,
      id: user.id,
      name: user.name,
      username: user.username,
    };

    const token = await this.jwtService.generateToken(payload);

    return { success: true, data: { token } };
  }
}
