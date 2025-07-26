import { readFile } from "node:fs/promises";
import { S3Client, GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { fetchBingImage } from "./imageService.js";
import { WallpaperIndex } from "../models/wallpaperIndex.js";
import { retry } from "../lib/retry.js";
import { measureTime } from "../lib/measureTime.js";
import { logger } from "../lib/logger.js";
import { numericCompare } from "../lib/numericCompare.js";

export interface UploadOptions {
  bucket: string;
  client?: S3Client;
  cursorKey?: string;
  allPath?: string;
}

async function readCursor(client: S3Client, bucket: string, key: string) {
  try {
    const res = await client.send(new GetObjectCommand({ Bucket: bucket, Key: key }));
    const body = res.Body;

    if (!body) {
      return "";
    }

    return (await body.transformToString("utf8")).trim();
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
  if (!bucket) {
    throw new Error("bucket required");
  }
  logger.info("0. Start uploading. bucket=%s", bucket);

  const client = options.client || new S3Client({});
  const cursorKey = options.cursorKey ?? "cursor.txt";
  const allPath = options.allPath ?? "wallpaper/all.txt";
  let cursor = await measureTime("readCursor", () => readCursor(client, bucket, cursorKey));

  const lines = (await readFile(allPath, "utf8"))
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .sort(numericCompare);

  logger.info("1. Initial cursor=%s, lines=%d", cursor, lines.length);

  let uploaded = 0;
  let latest = cursor;
  for (const line of lines) {
    const { date, url, key } = WallpaperIndex.parseIndexLine(line);
    logger.info("processing date=%s key=%s url=%s", date, key, url);

    if (cursor && date <= cursor) {
      logger.info("skipping %s", date);
      continue;
    }

    logger.info("fetching date=%s key=%s", date, key);
    const buffer = await measureTime("fetch bing image", () => retry(() => fetchBingImage(url)));

    logger.info("upload date=%s key=%s", date, key);
    await measureTime("upload bing image", () =>
      client.send(new PutObjectCommand({ Bucket: bucket, Key: key, Body: buffer })),
    );

    uploaded += 1;
    latest = date;

    // Update cursor every 10 days (1st, 11th, 21st, 31st of month)
    if (date.endsWith("1")) {
      logger.info("write cursor=%s", latest);
      await measureTime("write cursor", () => writeCursor(client, bucket, cursorKey, latest));
      cursor = latest;
    }
  }

  logger.info("2. Final cursor=%s, uploaded=%d", cursor, uploaded);
  if (latest && latest !== cursor) {
    logger.info("write cursor=%s", latest);
    await measureTime("write cursor", () => writeCursor(client, bucket, cursorKey, latest));
  }
  logger.info("finish", latest);
}
