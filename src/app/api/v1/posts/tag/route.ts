import { NextResponse } from "next/server";

import { getPostTags } from "@/lib/db/posts";
import { TagResponse } from "@/types/api/post";

export async function GET(_: Request) {
  try {
    const tags = await getPostTags();

    return NextResponse.json({ tags } as TagResponse);
  } catch (error) {
    console.error("Error fetching post:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
