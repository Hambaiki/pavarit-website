import { eq } from "drizzle-orm";

import { db } from "./index";
import { type NewUser, type User, users } from "./schema";

export type { User };

export async function createUser(
  user: Pick<NewUser, "auth0_sub" | "email" | "name">
) {
  try {
    const result = await db.insert(users).values(user).returning();
    return result[0];
  } catch (error) {
    console.error("Error creating user:", error);
  }
}

export async function getUser(id: string) {
  try {
    return await db
      .select()
      .from(users)
      .where(eq(users.id, Number(id)));
  } catch (error) {
    console.error("Error getting user:", error);
  }
}

export async function getUserByAuth0Sub(auth0Sub: string) {
  try {
    return await db.select().from(users).where(eq(users.auth0_sub, auth0Sub));
  } catch (error) {
    console.error("Error getting user:", error);
  }
}

export async function getUsers() {
  try {
    return await db.select().from(users);
  } catch (error) {
    console.error("Error getting users:", error);
  }
}
