import axios from "axios";
import { promises as fs } from "node:fs";
import type { BingImage } from "../lib/bing.js";

export default async function legacyNiumoo(source: string): Promise<BingImage[]> {
  let text: string;
  if (source.startsWith("http://") || source.startsWith("https://")) {
    const res = await axios.get(source);
    text = res.data;
  } else {
    text = await fs.readFile(source, "utf8");
  }
  const regex = /(?<year>\d{4})-(?<month>\d{2})-(?<date>\d{2})[^[]+\[(?<desc>[^\]]+)\]\((?<img>[^)]+)\)/g;
  const images: BingImage[] = [];
  for (const match of text.matchAll(regex)) {
    if (!match.groups) {
      continue;
    }
    const { year, month, date, desc, img } = match.groups as {
      year: string;
      month: string;
      date: string;
      desc: string;
      img: string;
    };
    images.push({
      startdate: `${year}${month}${date}`,
      url: img,
      title: desc,
      copyright: desc,
    });
  }
  return images;
}
