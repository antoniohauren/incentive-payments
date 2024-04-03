import A from "node:assert";
import T from "node:test";
import type { PaymentRequest, PaymentUpdateRequest } from "@/models/payment-model";
import type { PaymentRepository } from "@/repositories/payment-repository";
import type { SelectPayment } from "@/schemas";
import type { BalanceService } from "./balance-service";
import { PaymentService } from "./payment-service";

T.describe("payment-service", () => {
  const now = new Date();
  const mockPayment: SelectPayment = {
    balanceId: "balance_id",
    createdAt: now,
    description: "description",
    id: "id",
    name: "name",
    updatedAt: now,
    value: 111,
  };

  let balanceService: BalanceService;
  let paymentRepository: PaymentRepository;
  let sut: PaymentService;

  T.before(() => {
    paymentRepository = {
      createPayment: async () => ({ success: true, data: [] }),
      deletePayment: async () => ({ success: true }),
      fetchPaymentById: async () => ({ success: true, data: [mockPayment] }),
      fetchPaymentList: async () => ({ success: true, data: [mockPayment] }),
      updatePayment: async () => ({ success: true }),
    };

    balanceService = {
      createBalance: async () => ({ success: true }),
      getBalance: async () => ({ success: true, data: [] }),
      getBalanceList: async () => ({ success: true }),
      updateBalance: async () => ({ success: true }),
      deleteBalance: async () => ({ success: true }),
    } as unknown as BalanceService;

    sut = new PaymentService(paymentRepository, balanceService);
  });

  T.beforeEach(() => {
    T.mock.restoreAll();
  });

  T.describe("create-payment", () => {
    const dto: PaymentRequest = {
      balanceId: "id",
      description: "desc",
      name: "name",
      value: 200,
    };

    T.it("should throw if balance cant be found", async () => {
      T.mock.method(balanceService, "getBalance", () => ({
        success: false,
      }));

      const response = await sut.createPayment(dto);

      const expected = {
        success: false,
        message: "BALANCE_NOT_FOUND",
      };

      A.deepEqual(response, expected);
    });

    T.it("should throw if cant create payment", async () => {
      T.mock.method(paymentRepository, "createPayment", () => ({
        success: false,
      }));

      const response = await sut.createPayment(dto);

      const expected = {
        success: false,
        message: "FAILED_TO_CREATE_PAYMENT",
      };

      A.deepEqual(response, expected);
    });

    T.it("should throw if insuficient balance", async () => {
      T.mock.method(balanceService, "getBalance", () => ({
        success: true,
        data: { currentMoney: 0 },
      }));

      const response = await sut.createPayment(dto);

      const expected = {
        success: false,
        message: "INSUFICIENT_BALANCE",
      };

      A.deepEqual(response, expected);
    });

    T.it("should create payment", async () => {
      const response = await sut.createPayment(dto);

      const expected = {
        success: true,
        message: "PAYMENT_CREATED",
      };

      A.deepEqual(response, expected);
    });
  });

  T.describe("get-payment", () => {
    T.it("should throw if payment not found", async () => {
      T.mock.method(paymentRepository, "fetchPaymentById", () => ({
        success: false,
      }));
      const response = await sut.getPayment("fake_id");
      const expected = {
        success: false,
        message: "PAYMENT_NOT_FOUND",
      };

      A.deepEqual(response, expected);
    });

    T.it("should get payment", async () => {
      const response = await sut.getPayment("valid_id");
      const expected = {
        success: true,
        data: mockPayment,
      };

      A.deepEqual(response, expected);
    });
  });

  T.describe("get-payment-list", () => {
    T.it("should throw if unknown error", async () => {
      T.mock.method(paymentRepository, "fetchPaymentList", () => ({
        success: false,
      }));

      const response = await sut.getPaymentList();
      const expected = {
        success: false,
        message: "SOMETHING_GONE_WRONG",
      };

      A.deepEqual(response, expected);
    });

    T.it("should get empty payment list", async () => {
      T.mock.method(paymentRepository, "fetchPaymentList", () => ({
        success: true,
        data: [],
      }));

      const response = await sut.getPaymentList();

      const expected = {
        success: true,
        data: [],
      };

      A.deepEqual(response, expected);
    });

    T.it("should get payment list", async () => {
      const response = await sut.getPaymentList();

      const expected = {
        success: true,
        data: [mockPayment],
      };

      A.deepEqual(response, expected);
    });
  });


  T.describe("update-payment", () => {
    const updateDto: PaymentUpdateRequest = {
      description: "updated_description",
      name: "updated_name",
    };

    T.it("should throw if failed to update payment", async () => {
      const response = await sut.updatePayment("id", updateDto);

      const expected = {
        success: false,
        message: "FAILED_TO_UPDATE_PAYMENT",
      };

      A.deepEqual(response, expected);
    });

    T.it("should update payment", async () => {
      const updatedPayment = {
        ...mockPayment,
        ...updateDto,
      };

      T.mock.method(paymentRepository, "updatePayment", () => ({
        success: true,
        data: [updatedPayment],
      }));

      const response = await sut.updatePayment("id", updateDto);

      const expected = {
        success: true,
        message: "PAYMENT_UPDATED",
        data: updatedPayment,
      };

      A.deepEqual(response, expected);
    });
  });



  T.describe("delete-payment", () => {
    T.it("should throw if cant delete payment", async () => {
      T.mock.method(paymentRepository, "deletePayment", () => ({
        success: false,
      }));

      const response = await sut.deletePayment("id");
      const expected = {
        success: false,
        message: "FAILED_TO_DELETE_PAYMENT",
      };

      A.deepEqual(response, expected);
    });

    T.it("should delete payment", async () => {
      const response = await sut.deletePayment("id");
      const expected = {
        success: true,
        message: "PAYMENT_DELETED",
      };

      A.deepEqual(response, expected);
    });
  });
});
