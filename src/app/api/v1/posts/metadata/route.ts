import { NextResponse } from "next/server";

import { getPostMetadata } from "@/lib/db/posts";
import { CommonResponse, GetPostMetadataResponse } from "@/types/api/post";

export async function POST(request: Request) {
  const { slug } = await request.json();

  if (!slug) {
    return NextResponse.json(
      {
        success: false,
        message: "Slug is required",
      } as CommonResponse,
      { status: 400 }
    );
  }

  try {
    // Fetch the post metadata
    const post = await getPostMetadata(slug);

    if (!post) {
      return NextResponse.json(
        {
          success: false,
          message: "Post not found",
        } as CommonResponse,
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Post metadata fetched",
      metadata: post,
    } as GetPostMetadataResponse);
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
