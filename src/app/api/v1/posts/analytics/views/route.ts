import { NextResponse } from "next/server";

import { updatePostViews } from "@/lib/db/posts";

export async function POST(request: Request) {
  try {
    const { id } = await request.json();

    const views = await updatePostViews(id);

    return NextResponse.json({
      success: true,
      message: "Post views updated",
      views,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: "Error updating post views",
    });
  }
}
