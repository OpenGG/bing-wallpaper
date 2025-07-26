import { readFile } from "node:fs/promises";
import { S3Client, GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { fetchBingImage } from "./imageService.js";
import { WallpaperIndex } from "../models/wallpaperIndex.js";
import { retry } from "../lib/retry.js";

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
  } catch (err: unknown) {
    const code = (err as { Code?: string })?.Code;
    if (code === "NoSuchKey") {
      return "";
    }
    throw err;
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
  let cursor = await readCursor(client, bucket, cursorKey);
  const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: "base" });

  console.log("cursor=%s", cursor);

  const lines = (await readFile(allPath, "utf8"))
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .sort((a, b) => collator.compare(a, b));

  let latest = cursor;
  for (const line of lines) {
    const { date, url, key } = WallpaperIndex.parseIndexLine(line);
    console.log("current=%s url=%s key=%s", date, url, key);

    if (cursor && date <= cursor) {
      console.log("skipping %s", date);
      continue;
    }

    console.time("fetch bing image");

    console.log("fetching date=%s", date);
    const buffer = await retry(() => fetchBingImage(url));
    console.log("fetch finish date=%s", date);

    console.timeEnd("fetch bing image");

    console.time("upload bing image");

    await client.send(new PutObjectCommand({ Bucket: bucket, Key: key, Body: buffer }));
    console.log("upload finish date=%s", date);

    console.timeEnd("upload bing image");

    latest = date;
    if (date.endsWith("1")) {
      console.time("write cursor");

      console.log("update cursor=%s", latest);
      await writeCursor(client, bucket, cursorKey, latest);
      cursor = latest;

      console.timeEnd("write cursor");
    }
  }

  if (latest && latest !== cursor) {
    console.time("write cursor");

    console.log("update cursor=%s", latest);
    await writeCursor(client, bucket, cursorKey, latest);

    console.timeEnd("write cursor");
  }
  console.log("finish", latest);
}
