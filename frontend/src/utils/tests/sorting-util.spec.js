import { describe, it, expect } from "vitest";
import { sortByPropertyWithKeywordFirst } from "../sorting-util";

describe("sortByPropertyWithKeywordFirst", () => {
  it("should keep the keyword at the top and sort the rest alphabetically by given property", () => {
    const input = [
      { title: "Beta" },
      { title: "alpha" },
      { title: "LATEST" },
      { title: "Gamma" },
    ];
    const result = sortByPropertyWithKeywordFirst(input, "title", "latest");
    expect(result.map((item) => item.title)).toEqual([
      "LATEST",
      "alpha",
      "Beta",
      "Gamma",
    ]);
  });

  it("should work when the keyword does not exist in the list", () => {
    const input = [{ title: "Beta" }, { title: "alpha" }, { title: "Gamma" }];
    const result = sortByPropertyWithKeywordFirst(input, "title", "latest");
    expect(result.map((item) => item.title)).toEqual([
      "alpha",
      "Beta",
      "Gamma",
    ]);
  });

  it("should treat keyword case-insensitively", () => {
    const input = [
      { title: "Keyword" },
      { title: "alpha" },
      { title: "Gamma" },
    ];
    const result = sortByPropertyWithKeywordFirst(input, "title", "keyword");
    expect(result[0].title).toBe("Keyword");
  });

  it("should handle missing property gracefully", () => {
    const input = [{ title: "alpha" }, { noTitle: "Gamma" }, { title: "Beta" }];
    const result = sortByPropertyWithKeywordFirst(input, "title", "latest");
    expect(result.map((item) => item.title ?? "")).toEqual([
      "alpha",
      "Beta",
      "",
    ]);
  });
});
