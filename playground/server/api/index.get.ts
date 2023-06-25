import { Authorizer } from "#nuxt-server-utils";
import { defineEventHandler } from "#imports";

export default defineEventHandler((event) => {
  Authorizer.allows(event, () => true, "You are not allowed");
  return `Gate passed`;
});
