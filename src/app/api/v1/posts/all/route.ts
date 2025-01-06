import { NextResponse } from "next/server";

import { getAllPosts } from "@/lib/db/posts";
import { CommonResponse, SearchPostResponse } from "@/types/api/post";

export async function GET() {
  try {
    const posts = await getAllPosts();

    return NextResponse.json({
      success: true,
      message: "Post fetched",
      posts,
    } as SearchPostResponse);
  } catch (error) {
    console.error("Get all posts error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
      } as CommonResponse,
      { status: 500 }
    );
  }
}
