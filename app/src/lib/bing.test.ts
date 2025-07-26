import { describe, it, expect, vi, beforeEach } from "vitest";
import { fetchBingImages } from "./bing.js";
import axios from "axios";

vi.mock("axios");

const sample = {
  startdate: "20250721",
  url: "https://img.jpg",
  copyright: "c",
  title: "t",
};

describe("fetchBingImages", () => {
  beforeEach(() => {
    vi.mocked(axios.get).mockReset();
  });

  it("returns images when request succeeds", async () => {
    vi.mocked(axios.get).mockResolvedValue({
      status: 200,
      data: { images: [sample] },
    });
    const res = await fetchBingImages();
    expect(res[0].startdate).toBe("20250721");
  });

  it("throws on invalid response", async () => {
    vi.mocked(axios.get).mockResolvedValue({ status: 200, data: {} });
    await expect(fetchBingImages()).rejects.toThrow("invalid response");
  });
});
