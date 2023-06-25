import { allows } from "#nuxt-server-utils";
import { defineEventHandler } from "#imports";

export default defineEventHandler((event) => {
  allows(event, () => false);

  return `Gate passed`;
});
