export interface ProcessedUrl {
  previewUrl: string;
  downloadUrl: string;
}

export function processImageUrl(input: string): ProcessedUrl {
  let url = input;
  if (url.startsWith("/th?")) {
    url = `https://bing.com${url}`;
  }
  const u = new URL(url);
  if (u.host === "cn.bing.com") {
    u.host = "bing.com";
  }
  let downloadUrl = u.toString();
  if (u.pathname === "/th") {
    const id = u.searchParams.get("id");
    if (id?.includes("1920x1080")) {
      u.searchParams.set("id", id.replace("1920x1080", "UHD"));
    }
    const rf = u.searchParams.get("rf");
    if (rf?.includes("1920x1080")) {
      u.searchParams.set("rf", rf.replace("1920x1080", "UHD"));
    }
    u.searchParams.set("w", "3840");
    u.searchParams.set("h", "2160");
    downloadUrl = u.toString();
  }
  if (u.pathname === "/th") {
    u.searchParams.set("w", "1024");
    u.searchParams.set("h", "576");
  }
  const previewUrl = u.toString();
  return { downloadUrl, previewUrl };
}
