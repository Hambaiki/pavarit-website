import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";

const sql = neon(process.env.DATABASE_URL!);

export async function GET(
  _: Request,
  { params }: { params: { slug: string } }
) {
  const { slug } = params;

  if (!slug) {
    return NextResponse.json({ error: "Slug is required" }, { status: 400 });
  }

  try {
    // Increment the views count
    await sql`
      UPDATE posts
      SET views = views + 1
      WHERE slug = ${slug}
      RETURNING views;`; // Add RETURNING to see the updated value

    // Fetch the updated post data
    const post = await sql`SELECT * FROM posts WHERE slug = ${slug}`;

    if (post.length === 0) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json({ post: post.length > 0 ? post[0] : null });
  } catch (error) {
    console.error("Error fetching post:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
