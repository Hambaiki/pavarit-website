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

    const { id } = body;

    await sql`DELETE FROM posts WHERE id = ${id}`;

    return NextResponse.json({ message: "Post deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
});
