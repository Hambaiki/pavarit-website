import { NextResponse } from "next/server";

import { updatePost } from "@/lib/db/posts";

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
        { error: "Missing required fields" },
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

    return NextResponse.json({ message: "Post updated successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
