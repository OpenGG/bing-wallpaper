import axios from "axios";
import { BING_WALLPAPER_API } from "./config.js";

export interface BingImage {
  startdate: string;
  url: string;
  copyright: string;
  title: string;
}

interface BingApiResponse {
  images: BingImage[];
}

export async function fetchBingImages(): Promise<BingImage[]> {
  const res = await axios.get(BING_WALLPAPER_API, { responseType: "json" });
  if (res.status !== 200) {
    throw new Error(`request failed: ${res.status}`);
  }
  const images = (res.data as BingApiResponse).images;
  if (!Array.isArray(images)) {
    throw new Error("invalid response");
  }
  return images;
}
