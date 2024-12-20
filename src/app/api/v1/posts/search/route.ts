import { NextResponse } from "next/server";

import { getPostById, getPosts, getPostTotal } from "@/lib/db/posts";
import { GetPostResponse, SearchPostResponse } from "@/types/api/post";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const post = await getPostById(id);

    return NextResponse.json({ post } as GetPostResponse);
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
    const { search = "", page = 1, limit = 10, tags = [] } = body;

    const posts = await getPosts({ search, page, tags, limit });
    const total = await getPostTotal({ search, tags });

    return NextResponse.json({
      page,
      limit,
      total,
      posts,
    } as SearchPostResponse);
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
