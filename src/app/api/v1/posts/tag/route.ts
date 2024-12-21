import { NextResponse } from "next/server";

import { getPostTags } from "@/lib/db/posts";
import { CommonResponse, TagResponse } from "@/types/api/post";

export async function GET(_: Request) {
  try {
    const tags = await getPostTags();

    return NextResponse.json({
      success: true,
      message: "Tags fetched",
      tags,
    } as TagResponse);
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
