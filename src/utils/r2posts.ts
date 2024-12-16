import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";

import r2Client from "@/utils/r2client";

export const fetchMarkdownFile = async (
  bucketName: string,
  fileName: string
): Promise<string> => {
  try {
    const command = new GetObjectCommand({ Bucket: bucketName, Key: fileName });
    const response = await r2Client.send(command);

    if (response.Body) {
      const body = await response.Body.transformToString();
      return body;
    }

    throw new Error("File not found or empty response.");
  } catch (error) {
    console.error("Error fetching markdown file:", error);
    throw error;
  }
};

export const updatePostToBucket = async (
  bucketName: string,
  fileName: string,
  post: string
) => {
  try {
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: fileName,
      Body: post,
    });

    const response = await r2Client.send(command);

    return response;
  } catch (error) {
    console.error("Error updating post to bucket:", error);
    throw error;
  }
};
