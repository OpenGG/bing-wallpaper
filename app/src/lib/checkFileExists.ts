import { access, constants } from "node:fs/promises";

export async function checkFileExists(filePath: string) {
  try {
    await access(filePath, constants.F_OK);
    return true; // File exists and is accessible
  } catch (error: unknown) {
    const code = (error as { code?: string })?.code;
    if (code === "ENOENT") {
      return false; // File does not exist
    }
    throw error; // Other errors (e.g., permissions issues)
  }
}
