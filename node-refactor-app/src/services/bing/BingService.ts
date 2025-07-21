import { Injectable } from "../../utils/di.js";
import { LATEST_WALLPAPERS_COUNT } from "../../constants.js";
import { IBingImageDTO } from "../../types/IBingImageDTO.ts";

@Injectable()
export class BingService {
  private readonly API_URL =
    `https://bing.com/HPImageArchive.aspx?format=js&idx=0&n=${LATEST_WALLPAPERS_COUNT}&uhd=1&uhdwidth=3840&uhdheight=2160&mkt=en-US`;

  public async fetchLatestImages(): Promise<IBingImageDTO[]> {
    const res = await fetch(this.API_URL);
    if (!res.ok) throw new Error(`API request failed: ${res.statusText}`);
    const json = await res.json();
    if (!Array.isArray(json?.images)) {
      throw new Error("Invalid API response format");
    }
    return json.images;
  }
}
