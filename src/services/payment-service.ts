import type {
  PaymentListResponse,
  PaymentRequest,
  PaymentUpdateRequest,
} from "@/models/payment-model";
import type { PaymentRepository } from "@/repositories/payment-repository";
import type { InsertPayment, SelectPayment, UpdatePayment } from "@/schemas";
import { CONSTANTS as C } from "@/utils/constants";
import type { ServiceReturn } from "@/utils/types";
import type { BalanceService } from "./balance-service";

type Return<T = SelectPayment> = Promise<ServiceReturn<T>>;

export class PaymentService {
  constructor(
    private readonly repository: PaymentRepository,
    private readonly balanceService: BalanceService,
  ) {}

  async createPayment(dto: PaymentRequest): Return {
    const paymentDto: InsertPayment = {
      name: dto.name,
      balanceId: dto.balanceId,
      description: dto.description,
      value: dto.value,
    };

    const res = await this.balanceService.getBalance(dto.balanceId);

    if (!res.success || !res.data) {
      return { success: false, message: C.BALANCE.FAILED.FOUND };
    }

    const currentMoney = res.data.currentMoney;
    const newBalance = currentMoney - dto.value;

    if (newBalance < 0) {
      return { success: false, message: C.BALANCE.FAILED.INSUFICIENT };
    }

    const { success } = await this.repository.createPayment(
      paymentDto,
      newBalance,
    );

    if (!success) {
      return { success: false, message: C.PAYMENT.FAILED.CREATE };
    }

    return { success: true, message: C.PAYMENT.SUCCESS.CREATE };
  }

  async getPayment(id: string): Return {
    const res = await this.repository.fetchPaymentById(id);

    if (!res.success || !res.data) {
      return { success: false, message: C.PAYMENT.FAILED.FOUND };
    }

    const [data] = res.data;

    return { success: true, data };
  }

  async getPaymentList(): Return<PaymentListResponse> {
    const res = await this.repository.fetchPaymentList();

    if (!res.success || !res.data) {
      return { success: false, message: C.SHARED.UNKNOWN };
    }

    const data = res.data;

    return { success: true, data };
  }

  async updatePayment(id: string, dto: PaymentUpdateRequest): Return {
    const paymentDto: UpdatePayment = {
      description: dto.description,
      name: dto.name,
    };

    const res = await this.repository.updatePayment(id, paymentDto);

    if (!res.success || !res.data) {
      return { success: false, message: C.PAYMENT.FAILED.UPDATE };
    }

    const [data] = res.data;

    return { success: true, message: C.PAYMENT.SUCCESS.UPDATE, data };
  }

  async deletePayment(id: string): Return {
    const res = await this.repository.deletePayment(id);

    if (!res.success) {
      return { success: false, message: C.PAYMENT.FAILED.DELETE };
    }

    return { success: true, message: C.PAYMENT.SUCCESS.DELETE };
  }
}
