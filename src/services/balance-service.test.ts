import type {
  BalanceRequest,
  BalanceUpdateRequest,
} from "@/models/balance-model";
import type { BalanceRepository } from "@/repositories/balance-repository";
import type { SelectBalance, SelectBalanceWithPayments } from "@/schemas";
import A from "node:assert";
import T from "node:test";
import { BalanceService } from "./balance-service";

T.describe("balance-service", () => {
  const now = new Date();
  const mockBalance: SelectBalance = {
    id: "id",
    userId: "user_id",
    name: "name",
    description: "desc",
    currentMoney: 200,
    startMoney: 200,
    createdAt: now,
    updatedAt: now,
  };

  const mockBalanceWithPayments: SelectBalanceWithPayments = {
    ...mockBalance,
    payments: [],
  };

  let balanceRepository: BalanceRepository;
  let sut: BalanceService;

  T.before(() => {
    balanceRepository = {
      createBalance: async () => ({ success: true, data: [mockBalance] }),
      deleteBalance: async () => ({ success: true }),
      fetchBalanceById: async () => ({
        success: true,
        data: [mockBalanceWithPayments],
      }),
      fetchBalanceList: async () => ({ success: true, data: [mockBalance] }),
      updateBalance: async () => ({ success: true }),
      updateBalanceValue: async () => ({ success: true }),
    };

    sut = new BalanceService(balanceRepository);
  });

  T.beforeEach(() => {
    T.mock.restoreAll();
  });

  T.describe("create-balance", () => {
    const dto: BalanceRequest = {
      name: "qwe",
      description: "qwe",
      startMoney: 2,
    };

    T.it("should throw if cant create balance", async () => {
      T.mock.method(balanceRepository, "createBalance", () => ({
        success: false,
      }));

      const response = await sut.createBalance(dto, "user_id");
      const expected = {
        success: false,
        message: "FAILED_TO_CREATE_BALANCE",
      };

      A.deepEqual(response, expected);
    });

    T.it("should create balance", async () => {
      const response = await sut.createBalance(dto, "user_id");

      const expected = {
        success: true,
        message: "BALANCE_CREATED",
        data: mockBalance,
      };

      A.deepEqual(response, expected);
    });
  });

  T.describe("get-balance", () => {
    T.it("should throw if balance not found", async () => {
      T.mock.method(balanceRepository, "fetchBalanceById", () => ({
        success: false,
      }));
      const response = await sut.getBalance("fake_id");
      const expected = {
        success: false,
        message: "BALANCE_NOT_FOUND",
      };

      A.deepEqual(response, expected);
    });

    T.it("should get balance", async () => {
      const response = await sut.getBalance("valid_id");
      const expected = {
        success: true,
        data: mockBalanceWithPayments,
      };

      A.deepEqual(response, expected);
    });
  });

  T.describe("get-balance-list", () => {
    T.it("should throw if unknown error", async () => {
      T.mock.method(balanceRepository, "fetchBalanceList", () => ({
        success: false,
      }));

      const response = await sut.getBalanceList();
      const expected = {
        success: false,
        message: "SOMETHING_GONE_WRONG",
      };

      A.deepEqual(response, expected);
    });

    T.it("should get empty balance list", async () => {
      T.mock.method(balanceRepository, "fetchBalanceList", () => ({
        success: true,
        data: [],
      }));

      const response = await sut.getBalanceList();

      const expected = {
        success: true,
        data: [],
      };

      A.deepEqual(response, expected);
    });

    T.it("should get balance list", async () => {
      const response = await sut.getBalanceList();

      const expected = {
        success: true,
        data: [mockBalance],
      };

      A.deepEqual(response, expected);
    });
  });

  T.describe("update-balance", () => {
    const updateDto: BalanceUpdateRequest = {
      description: "updated_description",
      name: "updated_name",
    };

    T.it("should throw if failed to update balance", async () => {
      const response = await sut.updateBalance("id", updateDto);

      const expected = {
        success: false,
        message: "FAILED_TO_UPDATE_BALANCE",
      };

      A.deepEqual(response, expected);
    });

    T.it("should update balance", async () => {
      const updatedBalance = {
        ...mockBalance,
        ...updateDto,
      };

      T.mock.method(balanceRepository, "updateBalance", () => ({
        success: true,
        data: [updatedBalance],
      }));

      const response = await sut.updateBalance("id", updateDto);

      const expected = {
        success: true,
        message: "BALANCE_UPDATED",
        data: updatedBalance,
      };

      A.deepEqual(response, expected);
    });
  });

  T.describe("delete-balance", () => {
    T.it("should throw if cant delete balance", async () => {
      T.mock.method(balanceRepository, "deleteBalance", () => ({
        success: false,
      }));

      const response = await sut.deleteBalance("id");
      const expected = {
        success: false,
        message: "FAILED_TO_DELETE_BALANCE",
      };

      A.deepEqual(response, expected);
    });

    T.it("should delete balance", async () => {
      const response = await sut.deleteBalance("id");
      const expected = {
        success: true,
        message: "BALANCE_DELETED",
      };

      A.deepEqual(response, expected);
    });
  });
});
