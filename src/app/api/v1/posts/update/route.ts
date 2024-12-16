import { getSession, withApiAuthRequired } from "@auth0/nextjs-auth0";
import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";

const sql = neon(process.env.DATABASE_URL!);

export const POST = withApiAuthRequired(async function POST(request: Request) {
  try {
    const session = await getSession();
    const namespace = process.env.AUTH0_AUDIENCE;

    const isAdmin = session?.user[`${namespace}/roles`]?.includes("admin");

    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await request.json();

    const {
      id,
      title,
      slug,
      description,
      category,
      tags,
      keywords,
      author,
      image,
      alt_text,
      content,
    } = body;

    // Validate required fields
    if (!id || !title) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Insert or update post by ID
    const result = await sql`
        INSERT INTO posts (
          id,
          slug,
          title,
          description,
          category,
          tags,
          keywords,
          author,
          image,
          alt_text,
          views,
          created_at,
          updated_at,
          content
        ) VALUES (
          ${id},
          ${slug},
          ${title},
          ${description},
          ${category},
          ${tags},
          ${keywords},
          ${author},
          ${image},
          ${alt_text},
          0,
          NOW(),
          NOW(),
          ${content}
        )
        ON CONFLICT (id) DO UPDATE SET
          slug = EXCLUDED.slug,
          title = EXCLUDED.title,
          description = EXCLUDED.description,
          category = EXCLUDED.category,
          tags = EXCLUDED.tags,
          keywords = EXCLUDED.keywords,
          author = EXCLUDED.author,
          image = EXCLUDED.image,
          alt_text = EXCLUDED.alt_text,
          updated_at = NOW(),
          content = EXCLUDED.content
        RETURNING *;
      `;

    return NextResponse.json(result[0]);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
});
