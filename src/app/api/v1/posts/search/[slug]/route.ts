import { NextResponse } from "next/server";

import { getPostBySlug } from "@/lib/db/posts";
import { CommonResponse, GetPostResponse } from "@/types/api/post";

export const revalidate = 0;

export async function GET(
  _: Request,
  { params }: { params: { slug: string } }
) {
  const headers = {
    "Cache-Control": "no-store, max-age=0",
  };

  const { slug } = params;

  try {
    // Fetch the updated post data
    const post = await getPostBySlug(slug);

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json(
      {
        success: true,
        message: "Post fetched",
        post,
      } as GetPostResponse,
      { headers }
    );
  } catch (error) {
    console.error("Error fetching post:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
      } as CommonResponse,
      { status: 500 }
    );
  }
}
