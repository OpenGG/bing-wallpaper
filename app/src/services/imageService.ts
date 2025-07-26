import { spawn } from "node:child_process";

export async function ensureImageValid(buf: Buffer): Promise<void> {
  return new Promise((resolve, reject) => {
    const proc = spawn("identify", ["-verbose", "-"]);
    let output = "";

    proc.stdout.on("data", (d) => {
      output += d.toString();
    });
    proc.stderr.on("data", (d) => {
      output += d.toString();
    });

    proc.on("error", (err) => {
      reject(err);
    });

    proc.on("close", (code) => {
      if (code !== 0 || /corrupt/i.test(output)) {
        reject(new Error("image corrupt"));
      } else {
        resolve();
      }
    });

    proc.stdin.write(buf);
    proc.stdin.end();
  });
}

export async function fetchBingImage(url: string) {
  const res = await fetch(url, {
    headers: {
      accept: "image/avif,image/webp,image/apng,image/svg+xml,image/*",
      "accept-language": "en",
      "cache-control": "no-cache",
      pragma: "no-cache",
      Referer: "https://bing.com/",
    },
    body: null,
    method: "GET",
  });
  if (!res.ok) {
    throw new Error(`response status not ok: status=${res.status} url=${url}`);
  }

  const contentType = res.headers.get("content-type") || "";
  if (!contentType.startsWith("image/")) {
    throw new Error(`response content type not valid: content-type=${contentType} url=${url}`);
  }

  const data = await res.arrayBuffer();

  const buffer = Buffer.from(data);
  await ensureImageValid(buffer);

  return buffer;
}
