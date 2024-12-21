import { NextResponse } from "next/server";

import { deletePost } from "@/lib/db/posts";
import { CommonResponse } from "@/types/api/post";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { id } = body;

    await deletePost(id);

    return NextResponse.json({
      success: true,
      message: "Post deleted successfully",
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
