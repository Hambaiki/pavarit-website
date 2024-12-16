import { jwtDecode } from "jwt-decode";
import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";
import { getSession } from "@auth0/nextjs-auth0";

const sql = neon(process.env.DATABASE_URL!);

export async function POST(request: Request) {
  try {
    // Disable auth for now
    // const token = request.headers.get("Authorization");

    // if (!token) {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // }

    // const decodedToken: { permissions: string[] } = jwtDecode(token || "");
    // const isAuthorized = decodedToken.permissions.includes("write:system");

    // if (!isAuthorized) {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // }

    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    const {
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
    if (!title) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Ensure the slug is lowercase and contains only alphanumeric characters, hyphens, and underscores, spaced by hyphens
    const processedSlug = slug
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "-")
      .replace(/--+/g, "-");

    const slugCount =
      await sql`SELECT COUNT(*) FROM posts WHERE slug = ${processedSlug}`;

    if (parseInt(slugCount[0].count) > 0) {
      return NextResponse.json(
        { error: "Slug already exists" },
        { status: 400 }
      );
    }

    // // Generate the R2 key
    // const r2_key = `posts/${slug}.md`;

    // // Upload content to R2
    // await uploadPostToR2(r2_key, content);

    // Insert into database
    const result = await sql`
      INSERT INTO posts (
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
        ${processedSlug},
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
      ON CONFLICT (slug) DO UPDATE SET
        title = EXCLUDED.title,
        description = EXCLUDED.description,
        category = EXCLUDED.category,
        tags = EXCLUDED.tags,
        keywords = EXCLUDED.keywords,
        author = EXCLUDED.author,
        image = EXCLUDED.image,
        alt_text = EXCLUDED.alt_text,
        views = EXCLUDED.views,
        created_at = EXCLUDED.created_at,
        updated_at = NOW(),
        content = EXCLUDED.content
      RETURNING *;
    `;

    return NextResponse.json({
      post: result[0],
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
