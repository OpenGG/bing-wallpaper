import { readFile } from "node:fs/promises";
import axios from "axios";
import { S3Client, GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { ensureImageValid } from "./imageService.js";
import { WallpaperIndex } from "../models/wallpaperIndex";

export interface UploadOptions {
  bucket: string;
  client?: S3Client;
  cursorKey?: string;
  allPath?: string;
}

async function readCursor(client: S3Client, bucket: string, key: string) {
  try {
    const res = await client.send(new GetObjectCommand({ Bucket: bucket, Key: key }));
    const chunks: Uint8Array[] = [];
    const body = res.Body as AsyncIterable<Uint8Array> | undefined;
    if (!body) {
      return "";
    }
    for await (const chunk of body) {
      chunks.push(chunk);
    }
    return Buffer.concat(chunks).toString("utf8").trim();
  } catch {
    return "";
  }
}

async function writeCursor(client: S3Client, bucket: string, key: string, value: string) {
  await client.send(new PutObjectCommand({ Bucket: bucket, Key: key, Body: value }));
}

export async function uploadImages(options: UploadOptions) {
  const bucket = options.bucket;
  if (!bucket) throw new Error("bucket required");
  const client = options.client || new S3Client({});
  const cursorKey = options.cursorKey ?? "cursor.txt";
  const allPath = options.allPath ?? "wallpaper/all.txt";
  const cursor = await readCursor(client, bucket, cursorKey);
  const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: "base" });
  const lines = (await readFile(allPath, "utf8"))
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .sort((a, b) => collator.compare(a, b));

  let latest = cursor;
  for (const line of lines) {
    const { date, url, key } = WallpaperIndex.parseIndexLine(line);
    if (cursor && date <= cursor) continue;

    const res = await axios.get(url, { responseType: "arraybuffer" });
    if (res.status !== 200 || !res.headers["content-type"]?.startsWith("image/")) {
      throw new Error(`invalid image: ${url}`);
    }
    const buffer = Buffer.isBuffer(res.data) ? res.data : Buffer.from(res.data);
    ensureImageValid(buffer);

    await client.send(new PutObjectCommand({ Bucket: bucket, Key: key, Body: buffer }));
    latest = date;
    if (date.endsWith("1")) {
      await writeCursor(client, bucket, cursorKey, latest);
    }
  }

  if (latest && latest !== cursor) {
    await writeCursor(client, bucket, cursorKey, latest);
  }
}
