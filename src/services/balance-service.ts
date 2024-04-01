import type {
  BalanceListResponse,
  BalanceRequest,
  BalanceUpdateRequest,
} from "@/models/balance-model";
import type { BalanceRepository } from "@/repositories/balance-repository";
import type {
  InsertBalance,
  SelectBalance,
  SelectBalanceWithPayments,
  UpdateBalance,
} from "@/schemas";
import { CONSTANTS as C } from "@/utils/constants";
import type { ServiceReturn } from "@/utils/types";

type Return<T = SelectBalance> = Promise<ServiceReturn<T>>;

export class BalanceService {
  constructor(private readonly repository: BalanceRepository) {}

  async createBalance(dto: BalanceRequest, userId: string): Return {
    const balanceDto: InsertBalance = {
      name: dto.name,
      description: dto.description,
      startMoney: dto.startMoney,
      currentMoney: dto.startMoney,
      userId: userId,
    };

    const res = await this.repository.createBalance(balanceDto);

    if (!res.success || !res.data) {
      return { success: false, message: C.BALANCE.FAILED.CREATE };
    }

    const [data] = res.data;

    return { success: true, message: C.BALANCE.SUCCESS.CREATE, data };
  }

  async getBalance(id: string): Return<SelectBalanceWithPayments> {
    const res = await this.repository.fetchBalanceById(id);

    if (!res.success || !res.data) {
      return { success: false, message: C.BALANCE.FAILED.FOUND };
    }

    const [data] = res.data;

    return { success: true, data };
  }

  async getBalanceList(): Return<BalanceListResponse> {
    const res = await this.repository.fetchBalanceList();

    if (!res.success || !res.data) {
      return { success: false, message: C.SHARED.UNKNOWN };
    }

    const { data } = res;

    return { success: true, data };
  }

  async updateBalance(id: string, dto: BalanceUpdateRequest): Return {
    const balanceDto: UpdateBalance = {
      description: dto.description,
      name: dto.name,
    };

    const res = await this.repository.updateBalance(id, balanceDto);

    if (!res.success || !res.data) {
      return { success: false, message: C.BALANCE.FAILED.UPDATE };
    }

    const [data] = res.data;

    return { success: true, message: C.BALANCE.SUCCESS.UPDATE, data };
  }

  async deleteBalance(id: string): Return {
    const res = await this.repository.fetchBalanceById(id);

    if (!res.success || !res.data) {
      return { success: false, message: C.BALANCE.FAILED.DELETE };
    }

    const [balance] = res.data;

    if (balance.payments.length !== 0) {
      return { success: false, message: C.BALANCE.FAILED.HAS_PAYMENTS };
    }

    const { success } = await this.repository.deleteBalance(id);

    if (!success) {
      return { success: false, message: C.BALANCE.FAILED.DELETE };
    }

    return { success: true, message: C.BALANCE.SUCCESS.DELETE };
  }
}
