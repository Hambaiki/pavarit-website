"use server";

import { cookies } from "next/headers";

import { computeSessionToken } from "@/lib/auth";

export async function serverLogin(password: string) {
  try {
    if (password !== process.env.ADMIN_PASSWORD) {
      return {
        success: false,
        error: "Invalid password",
      };
    }

    const token = await computeSessionToken();
    const cookieStore = await cookies();
    cookieStore.set("admin_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return {
      success: true,
    };
  } catch (error) {
    console.error("Error logging in:", error);
    return {
      success: false,
      error: "Failed to login",
    };
  }
}

export async function serverLogout() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete("admin_session");
    return {
      success: true,
    };
  } catch (error) {
    console.error("Error logging out:", error);
    return {
      success: false,
      error: "Failed to logout",
    };
  }
}
