import { NextResponse } from "next/server";

import { getPostMetadata } from "@/lib/db/posts";
import { GetPostMetadataResponse } from "@/types/api/post";

export async function POST(request: Request) {
  const { slug } = await request.json();

  if (!slug) {
    return NextResponse.json({ error: "Slug is required" }, { status: 400 });
  }

  try {
    // Fetch the post metadata
    const post = await getPostMetadata(slug);

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json({ metadata: post } as GetPostMetadataResponse);
  } catch (error) {
    console.error("Error fetching post:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
