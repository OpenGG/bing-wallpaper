import axios from "axios";

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
  const api = "https://bing.com/HPImageArchive.aspx?format=js&idx=0&n=10&uhd=1&uhdwidth=3840&uhdheight=2160&mkt=en-US";
  const res = await axios.get(api, { responseType: "json" });
  if (res.status !== 200) {
    throw new Error(`request failed: ${res.status}`);
  }
  const images = (res.data as BingApiResponse).images;
  if (!Array.isArray(images)) {
    throw new Error("invalid response");
  }
  return images;
}
