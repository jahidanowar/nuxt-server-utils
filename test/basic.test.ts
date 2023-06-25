import { describe, it, expect } from "vitest";
import { fileURLToPath } from "node:url";
import { setup, $fetch } from "@nuxt/test-utils";

describe("ssr", async () => {
  await setup({
    rootDir: fileURLToPath(new URL("./fixtures/basic", import.meta.url)),
  });

  it("renders the index page", async () => {
    // Get response to a server-rendered page with `$fetch`.
    const html = await $fetch("/");
    expect(html).toContain("<div>basic</div>");
  });

  it("check the authorizer", async () => {
    // Get response to a server-rendered page with `$fetch`.
    const html = await $fetch("/api/authorizer-passed");
    expect(html).toContain("Gate passed");
  });

  it("check the authorizer", async () => {
    // Get response to a server-rendered page with `$fetch`.
    const html = await $fetch("/api/authorizer-failed");
    expect(html).toContain("You are not allowed");
  });
});
