import { NextResponse } from "next/server";

import { updatePost } from "@/lib/db/posts";
import { CommonResponse } from "@/types/api/post";

export async function POST(request: Request) {
  try {
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
        {
          success: false,
          message: "Missing required fields",
        } as CommonResponse,
        { status: 400 }
      );
    }

    // Insert or update post by ID
    await updatePost(id, {
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
    });

    return NextResponse.json({
      success: true,
      message: "Post updated successfully",
    } as CommonResponse);
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
      } as CommonResponse,
      { status: 500 }
    );
  }
}
