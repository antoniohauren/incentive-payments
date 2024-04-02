import { db } from "@/drizzle";
import { type InsertUser, type SelectUser, user } from "@/schemas";
import type { RepositoryRetrun } from "@/utils/types";
import { eq } from "drizzle-orm";

type Return = Promise<RepositoryRetrun<SelectUser>>;

export class UserRepository {
  async createUser(dto: InsertUser): Return {
    try {
      const data = await db.insert(user).values(dto).returning();

      if (data.length === 0) {
        return { success: false };
      }

      return {
        success: true,
        data,
      };
    } catch (err) {
      console.log(err);

      return {
        success: false,
      };
    }
  }

  async fetchUserByEmail(email: string): Return {
    try {
      const data = await db.select().from(user).where(eq(user.email, email));

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

  async fetchUserById(id: string): Return {
    try {
      const data = await db.select().from(user).where(eq(user.id, id));

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

  async fetchUserByUsername(username: string): Return {
    try {
      const data = await db
        .select()
        .from(user)
        .where(eq(user.username, username));

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

  async fetchUserList(): Return {
    try {
      const data = await db.select().from(user);

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
