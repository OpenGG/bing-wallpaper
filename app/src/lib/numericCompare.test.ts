import { describe, it, expect } from "vitest";
import { numericCompare } from "./numericCompare.js";

describe("numericCompare", () => {
  it("sorts strings", () => {
    expect(["3", "2", "1", "4", "5"].sort(numericCompare)).toEqual(["1", "2", "3", "4", "5"]);
  });

  it("sorts date strings", () => {
    expect(["2021-01-02", "2021-01-01", "2021-01-03"].sort(numericCompare)).toEqual([
      "2021-01-01",
      "2021-01-02",
      "2021-01-03",
    ]);
  });

  it("sorts mixed", () => {
    expect(["2021-01-02", "2021-01-01", "3", "2", "1", "4", "5"].sort(numericCompare)).toEqual([
      "1",
      "2",
      "3",
      "4",
      "5",
      "2021-01-01",
      "2021-01-02",
    ]);
  });
});
