import type { NitroApp } from "nitropack";
import mongoose from "mongoose";
import { logger } from "@nuxt/kit";
//@ts-ignore
import { useRuntimeConfig } from "#imports";

type NitroAppPlugin = (nitro: NitroApp) => void;

function defineNitroPlugin(def: NitroAppPlugin): NitroAppPlugin {
  return def;
}

export default defineNitroPlugin(async () => {
  const config = useRuntimeConfig();

  if (!config.nuxtServerUtils?.mongodbUri) {
    logger.warn(
      "Mongodb URI not found in runtime config, skipping mongodb connection"
    );
    return;
  }
  try {
    await mongoose.connect(config.nuxtServerUtils.mongodbUri);
    logger.info("Mongodb connected");
  } catch (e) {
    logger.error("Mongodb connection error: ", e);
  }
});
