import { NextResponse } from "next/server";
import { uploadFileToR2 } from "@/utils/r2client";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const filename = `${file.name}`;
    const r2_key = `images/${filename}`;

    // Upload to R2
    await uploadFileToR2(r2_key, file);

    const url = `${process.env.NEXT_PUBLIC_BUCKET_URL}/${r2_key}`;
    return NextResponse.json({ url });
  } catch (error) {
    console.error("Error uploading image:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
