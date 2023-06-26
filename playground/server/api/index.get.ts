import { Authorizer } from "#nuxt-server-utils";
import { defineEventHandler } from "#imports";

export default defineEventHandler((event) => {
  Authorizer.allows(event, () => false);
  return `Gate passed`;
});
