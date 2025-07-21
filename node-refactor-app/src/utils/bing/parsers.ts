import { IMAGE_FILENAME_REGEX } from "@/constants.js";

export const parseBingWalpaperUrl = (
  url: string,
): { previewUrl: string; downloadUrl: string; filename: string | null } => {
  if (url.startsWith("/th?")) url = `https://bing.com${url}`;
  const urlObj = new URL(url);

  urlObj.searchParams.set("w", "3840");
  urlObj.searchParams.set("h", "2160");
  const downloadUrl = urlObj.toString();

  urlObj.searchParams.set("w", "1024");
  urlObj.searchParams.set("h", "576");
  const previewUrl = urlObj.toString();

  const id = urlObj.searchParams.get("id");
  let filename: string | null = null;
  if (id && IMAGE_FILENAME_REGEX.test(id)) {
    filename = id;
  }

  return { previewUrl, downloadUrl, filename };
};

