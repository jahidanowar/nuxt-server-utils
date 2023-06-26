import { defineEventHandler } from "h3";

import { Authorizer } from "#nuxt-server-utils";

export default defineEventHandler((event) => {
  Authorizer.allows(event, () => 1 === 1);

  return `Gate passed`;
});
