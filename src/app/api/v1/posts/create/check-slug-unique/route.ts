import { NextResponse } from "next/server";

import { checkSlugUnique } from "@/lib/db/posts";
import { CheckSlugUniqueResponse } from "@/types/api/post";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const slug = body.slug;

    if (!slug) {
      return NextResponse.json({ error: "Slug is required" }, { status: 400 });
    }

    const unique = await checkSlugUnique(slug);

    return NextResponse.json({ unique } as CheckSlugUniqueResponse);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
