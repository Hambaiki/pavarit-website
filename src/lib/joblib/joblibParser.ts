import { readFileSync } from "fs";
import { Parser } from "pickleparser";

export async function loadJoblibModel(filepath: string) {
  try {
    // Read the joblib file
    const buffer = readFileSync(filepath);

    // Create pickle parser instance
    const parser = new Parser();

    // Parse the joblib file (which uses pickle format internally)
    const model = parser.parse(buffer);

    return model;
  } catch (error) {
    console.error("Error loading joblib model:", error);
    throw error;
  }
}

export async function predictWithModel(model: any, input: any) {
  try {
  } catch (error) {
    console.error("Error making prediction:", error);
    throw error;
  }
}
