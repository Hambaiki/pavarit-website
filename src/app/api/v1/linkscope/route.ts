import { NextResponse } from "next/server";
import { loadJoblibModel, predictWithModel } from "@/lib/joblib/joblibParser";
import path from "path";

// Load model once when the API route is initialized
const MODEL_PATH = path.join(process.cwd(), "public", "models", "model.joblib");
let model: any = null;

// Initialize model
model = loadJoblibModel(MODEL_PATH);

export async function POST(request: Request) {
  console.log("Model:", model);
  try {
    if (!model) {
      return NextResponse.json(
        { error: "Model not initialized" },
        { status: 500 }
      );
    }
    const data = await request.json();
    const { input } = data;
    if (!input) {
      return NextResponse.json(
        { error: "Input data is required" },
        { status: 400 }
      );
    }
    const prediction = await predictWithModel(model, input);

    return NextResponse.json({ prediction });
  } catch (error) {
    console.error("Error making prediction:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
