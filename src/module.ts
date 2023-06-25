import { defineNuxtModule, createResolver, addTemplate } from "@nuxt/kit";
import { defu } from "defu";

// Module options TypeScript interface definition
export interface ModuleOptions {
  enabled: boolean;
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: "nuxt-server-utils",
    configKey: "nuxtServerUtils",
  },
  // Default configuration options of the Nuxt module
  defaults: {
    enabled: true,
  },
  setup(options, nuxt) {
    if (!options.enabled) {
      return;
    }

    const resolver = createResolver(import.meta.url);

    // Add utils to nitro config
    nuxt.hook("nitro:config", (nitroConfig) => {
      nitroConfig.alias = nitroConfig.alias || {};

      // Inline module runtime in Nitro bundle
      nitroConfig.externals = defu(
        typeof nitroConfig.externals === "object" ? nitroConfig.externals : {},
        {
          inline: [resolver.resolve("./runtime")],
        }
      );

      nitroConfig.alias["#nuxt-server-utils"] = resolver.resolve(
        "./runtime/server/utils"
      );
    });

    // Create vierual types
    addTemplate({
      filename: "./types/nuxt-server-utils.d.ts",
      getContents: () =>
        `declare module "#nuxt-server-utils" {
        const APIFeatures: typeof import("${resolver.resolve(
          "./runtime/server/utils"
        )}").APIFeatures;
        const allows: typeof import("${resolver.resolve(
          "./runtime/server/utils"
        )}").allows;
      }`,
    });

    nuxt.hook("prepare:types", (options) => {
      options.references.push({
        path: resolver.resolve(
          nuxt.options.buildDir,
          "types/nuxt-server-utils.d.ts"
        ),
      });
    });
  },
});
