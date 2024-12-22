import { sql } from "@/lib/db/neon";

import { UserData } from "@/types/api/users";

export async function createUser(user: Partial<UserData>) {
  try {
    const newUser = await sql(
      "INSERT INTO users (auth0_sub, email, name) VALUES ($1, $2, $3)",
      [user.auth0_sub, user.email, user.name]
    );
    return newUser[0];
  } catch (error) {
    console.error("Error creating user:", error);
  }
}

export async function getUser(id: string) {
  try {
    const user = await sql("SELECT * FROM users WHERE id = $1", [id]);
    return user;
  } catch (error) {
    console.error("Error getting user:", error);
  }
}

export async function getUserByAuth0Sub(auth0Sub: string) {
  try {
    const user = await sql("SELECT * FROM users WHERE auth0_sub = $1", [
      auth0Sub,
    ]);
    return user;
  } catch (error) {
    console.error("Error getting user:", error);
  }
}

export async function getUsers() {
  try {
    const users = await sql("SELECT * FROM users");
    return users;
  } catch (error) {
    console.error("Error getting users:", error);
  }
}
