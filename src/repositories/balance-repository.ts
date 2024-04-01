import { db } from "@/drizzle";
import {
  balance,
  type InsertBalance,
  type SelectBalance,
  type SelectBalanceWithPayments,
  type UpdateBalance,
} from "@/schemas";
import type { RepositoryRetrun } from "@/utils/types";
import { eq } from "drizzle-orm";

type Return<T = SelectBalance> = Promise<RepositoryRetrun<T>>;

export class BalanceRepository {
  async createBalance(dto: InsertBalance): Return {
    try {
      const data = await db.insert(balance).values(dto).returning();

      if (data.length === 0) {
        return { success: false };
      }

      return {
        success: true,
        data,
      };
    } catch (err) {
      console.log(err);

      return { success: false };
    }
  }

  async fetchBalanceById(id: string): Return<SelectBalanceWithPayments> {
    try {
      const data = await db.query.balance.findMany({
        where: eq(balance.id, id),
        with: {
          payments: true,
        },
      });

      if (data.length === 0) {
        return { success: false };
      }

      return {
        success: true,
        data,
      };
    } catch (err) {
      console.log(err);

      return { success: false };
    }
  }

  async fetchBalanceList(): Return {
    try {
      const data = await db.select().from(balance);

      return {
        success: true,
        data,
      };
    } catch (err) {
      console.log(err);

      return { success: false };
    }
  }

  async deleteBalance(id: string): Return {
    try {
      await db.delete(balance).where(eq(balance.id, id));

      return { success: true };
    } catch (err) {
      console.log(err);

      return { success: false };
    }
  }

  async updateBalance(id: string, dto: UpdateBalance): Return {
    try {
      const data = await db
        .update(balance)
        .set(Object.assign(dto, { updatedAt: new Date() }))
        .where(eq(balance.id, id))
        .returning();

      if (data.length === 0) {
        return { success: false };
      }

      return {
        success: true,
        data,
      };
    } catch (err) {
      console.log(err);
      return { success: false };
    }
  }

  async updateBalanceValue(id: string, newValue: number): Return {
    try {
      const data = await db
        .update(balance)
        .set({
          currentMoney: newValue,
          updatedAt: new Date(),
        })
        .where(eq(balance.id, id))
        .returning();

      if (data.length === 0) {
        return { success: false };
      }

      return {
        success: true,
        data,
      };
    } catch (err) {
      console.log(err);
      return { success: false };
    }
  }
}
