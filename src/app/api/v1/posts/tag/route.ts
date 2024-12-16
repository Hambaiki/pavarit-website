import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";

const sql = neon(process.env.DATABASE_URL!);

export async function GET(_: Request) {
  try {
    const result = await sql`
      SELECT DISTINCT UNNEST(tags) as tag
      FROM posts
      ORDER BY tag;
    `;

    return NextResponse.json({ tags: result.map((r) => r.tag) });
  } catch (error) {
    console.error("Error fetching post:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
