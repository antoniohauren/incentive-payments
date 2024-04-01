import { db } from "@/drizzle";
import {
  balance,
  payment,
  type InsertPayment,
  type SelectPayment,
  type UpdatePayment,
} from "@/schemas";
import type { RepositoryRetrun } from "@/utils/types";
import { eq } from "drizzle-orm";

type Return = Promise<RepositoryRetrun<SelectPayment>>;

export class PaymentRepository {
  async createPayment(dto: InsertPayment, newBalance: number): Return {
    try {
      await db.transaction(async (tx) => {
        await tx
          .update(balance)
          .set({
            currentMoney: newBalance,
            updatedAt: new Date(),
          })
          .where(eq(balance.id, dto.balanceId));
      });

      await db.insert(payment).values(dto);

      return { success: true };
    } catch (err) {
      console.log(err);

      return { success: false };
    }
  }

  async fetchPaymentById(id: string): Return {
    try {
      const data = await db.select().from(payment).where(eq(payment.id, id));

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

  async fetchPaymentList(): Return {
    try {
      const data = await db.select().from(payment);

      return {
        success: true,
        data,
      };
    } catch (err) {
      console.log(err);

      return { success: false };
    }
  }

  async updatePayment(id: string, dto: UpdatePayment): Return {
    try {
      const data = await db
        .update(payment)
        .set(
          Object.assign(dto, {
            updatedAt: new Date(),
          }),
        )
        .where(eq(payment.id, id))
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

  async deletePayment(id: string): Return {
    try {
      await db.transaction(async (tx) => {
        const [p] = await tx.select().from(payment).where(eq(payment.id, id));
        const [b] = await tx
          .select()
          .from(balance)
          .where(eq(balance.id, p.balanceId));

        await tx.delete(payment).where(eq(payment.id, id));

        await tx.update(balance).set({
          currentMoney: b.currentMoney + p.value,
          updatedAt: new Date(),
        });
      });

      return { success: true };
    } catch (err) {
      console.log(err);

      return { success: false };
    }
  }
}
