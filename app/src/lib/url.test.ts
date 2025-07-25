import { describe, it, expect } from "vitest";
import { processImageUrl } from "./url.js";

describe("processImageUrl", () => {
  it("converts preview and download urls", () => {
    const result = processImageUrl(
      "/th?id=OHR.AcroporaReef_EN-US5567789372_UHD.jpg&rf=LaDigue_UHD.jpg&pid=hp&w=3840&h=2160&rs=1&c=4",
    );
    expect(result.downloadUrl).toContain("3840");
    expect(result.previewUrl).toContain("1024");
  });
});
