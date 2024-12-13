"use server";

import { neon } from "@neondatabase/serverless";

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
