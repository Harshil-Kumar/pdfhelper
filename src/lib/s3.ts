// src/lib/s3.ts
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: "ap-southeast-1",
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_S3_ACCESS_KEY_ID!,
    secretAccessKey: process.env.NEXT_PUBLIC_S3_SECRET_ACCESS_KEY!,
  },
});

export async function uploadToS3(file: File) {
  const buffer = Buffer.from(await file.arrayBuffer());

  const file_key = `uploads/${Date.now()}-${file.name.replace(/\s+/g, "-")}`;

  const command = new PutObjectCommand({
    Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME!,
    Key: file_key,
    Body: buffer,
    ContentType: file.type,
  });

  try {
    await s3Client.send(command);
    return { file_key, file_name: file.name };
  } catch (error) {
    console.error("AWS Upload Error:", error);
    throw new Error("Failed to upload file to S3");
  }
}