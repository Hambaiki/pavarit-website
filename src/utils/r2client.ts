import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";

import { Readable } from "stream";

const r2Client = new S3Client({
  region: "auto",
  endpoint: process.env.S3_ENDPOINT,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY!,
    secretAccessKey: process.env.S3_SECRET_KEY!,
  },
});

export async function uploadPostToR2(key: string, content: string) {
  if (!process.env.S3_BUCKET_NAME) {
    throw new Error("S3_BUCKET_NAME environment variable is not set");
  }

  try {
    const command = new PutObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: key,
      Body: content,
      ContentType: "text/markdown",
    });

    const response = await r2Client.send(command);
    return response;
  } catch (error) {
    console.error("Error uploading to R2:", error);
    throw error;
  }
}

export async function fetchPostFromR2(key: string): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: process.env.S3_BUCKET_NAME,
    Key: key,
  });

  const response = await r2Client.send(command);

  const stream = response.Body as Readable;
  const chunks: Buffer[] = [];

  for await (const chunk of stream) {
    chunks.push(chunk);
  }

  return Buffer.concat(chunks).toString("utf-8");
}

export const uploadFileToR2 = async (key: string, file: File) => {
  // Convert File to ArrayBuffer
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const command = new PutObjectCommand({
    Bucket: process.env.S3_BUCKET_NAME,
    Key: key,
    Body: buffer,
  });

  const response = await r2Client.send(command);
  return response;
};

export default r2Client;
