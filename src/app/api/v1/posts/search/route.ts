// import { withApiAuthRequired } from "@auth0/nextjs-auth0";
import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";

const sql = neon(process.env.DATABASE_URL!);

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const post = await sql`SELECT * FROM posts WHERE id = ${id}`;

    return NextResponse.json({ post: post.length > 0 ? post[0] : null });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { search = "", page = 1, per_page = 10, tags = [] } = body;

    const offset = (page - 1) * per_page;

    const result = await sql`
      SELECT *
      FROM posts
      WHERE 
        (title ILIKE ${"%" + search + "%"} OR
        description ILIKE ${"%" + search + "%"} OR
        category ILIKE ${"%" + search + "%"} OR
        author ILIKE ${"%" + search + "%"} OR
        ARRAY_TO_STRING(tags, ',') ILIKE ${"%" + search + "%"} OR
        ARRAY_TO_STRING(keywords, ',') ILIKE ${"%" + search + "%"})
        AND (${tags.length === 0} OR tags && ${tags})
        ORDER BY created_at DESC
      LIMIT ${per_page} OFFSET ${offset};
    `;

    const total = await sql`
      SELECT COUNT(*)::int AS count
      FROM posts
      WHERE
        (title ILIKE ${"%" + search + "%"} OR
        description ILIKE ${"%" + search + "%"} OR
        category ILIKE ${"%" + search + "%"} OR
        author ILIKE ${"%" + search + "%"} OR
        ARRAY_TO_STRING(tags, ',') ILIKE ${"%" + search + "%"} OR
        ARRAY_TO_STRING(keywords, ',') ILIKE ${"%" + search + "%"})
        AND (${tags.length === 0} OR tags && ${tags})
    `;

    return NextResponse.json({
      page,
      total: total[0].count,
      posts: result,
    });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// export const POST = withApiAuthRequired(POST);
