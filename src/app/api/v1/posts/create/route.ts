import { NextResponse } from "next/server";

import { createPost } from "@/lib/db/posts";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const post = await createPost({
      slug: body.slug,
      title: body.title,
      description: body.description,
      category: body.category,
      tags: body.tags,
      keywords: body.keywords,
      author: body.author,
      image: body.image,
      alt_text: body.alt_text,
      content: body.content,
    });

    return NextResponse.json({
      post: post,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
