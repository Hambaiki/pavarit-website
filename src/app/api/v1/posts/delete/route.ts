import { NextResponse } from "next/server";

import { deletePost } from "@/lib/db/posts";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { id } = body;

    await deletePost(id);

    return NextResponse.json({ message: "Post deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
