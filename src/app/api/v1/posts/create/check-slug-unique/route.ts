import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";

const sql = neon(process.env.DATABASE_URL!);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const slug = body.slug;

    const isSlugUnique =
      await sql`SELECT COUNT(*) FROM posts WHERE slug = ${slug}`;

    return NextResponse.json({
      unique: parseInt(isSlugUnique[0].count) === 0,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
