"use server";

import { getSession } from "@auth0/nextjs-auth0";
import { neon } from "@neondatabase/serverless";
import { jwtDecode } from "jwt-decode";

export async function getData() {
  const dbUrl = process.env.DATABASE_URL;

  if (dbUrl) {
    const sql = neon(dbUrl);
    const data = await sql`...`;
    return data;
  } else {
    return undefined;
  }
}

export async function checkCMSAuthorized() {
  const session = await getSession();

  const accessToken = session?.accessToken;
  if (!accessToken) {
    return false;
  } else {
    const decodedToken: { permissions: string[] } = jwtDecode(accessToken);
    const isCMSAuthorized = decodedToken.permissions.includes("write:system");

    return isCMSAuthorized;
  }
}
