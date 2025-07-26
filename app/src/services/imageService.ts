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
