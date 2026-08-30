import { expect, test } from "vitest";
import { cn } from "./utils";

test("cn merges classes correctly", () => {
  expect(cn("bg-red-500", "bg-blue-500")).toBe("bg-blue-500");
  expect(cn("px-2", "py-2", "p-4")).toBe("p-4");
  expect(cn("px-2", { "py-2": true, "hidden": false })).toBe("px-2 py-2");
});
