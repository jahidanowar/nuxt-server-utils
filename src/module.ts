import {
  defineNuxtModule,
  createResolver,
  addTemplate,
  addServerPlugin,
} from "@nuxt/kit";
import { defu } from "defu";

const DOCUMENTATION_URL = "https://nuxt-server-utils.jahid.dev/";

// Module options TypeScript interface definition
export interface ModuleOptions {
  enabled: boolean;
  mongodbUri?: string;
  enableDevTools?: boolean;
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: "nuxt-server-utils",
    configKey: "nuxtServerUtils",
  },
  // Default configuration options of the Nuxt module
  defaults: {
    enabled: true,
    mongodbUri: process.env.MONGODB_URI || undefined,
    enableDevTools: true,
  },
  setup(options, nuxt) {
    if (!options.enabled) {
      return;
    }

    const resolver = createResolver(import.meta.url);
    const runtimeConfig = nuxt.options.runtimeConfig;

    // Expose MongoDB URI to runtimeConfig
    runtimeConfig.nuxtServerUtils = defu(runtimeConfig.nuxtServerUtils || {}, {
      mongodbUri: options.mongodbUri,
    });

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
        const validateSchema: typeof import("${resolver.resolve(
          "./runtime/server/utils"
        )}").validateSchema;
        const indexRecourceHelper: typeof import("${resolver.resolve(
          "./runtime/server/utils"
        )}").indexRecourceHelper;
        const showResourceHelper: typeof import("${resolver.resolve(
          "./runtime/server/utils"
        )}").showResourceHelper;
        const deleteResourceHelper: typeof import("${resolver.resolve(
          "./runtime/server/utils"
        )}").deleteResourceHelper;

        const Validator: typeof import("${resolver.resolve(
          "./runtime/server/utils"
        )}").Validator;

        const Authorizer: typeof import("${resolver.resolve(
          "./runtime/server/utils"
        )}").Authorizer;

        const ResourceHelper: typeof import("${resolver.resolve(
          "./runtime/server/utils"
        )}").ResourceHelper;

      }`,
    });

    // Add virtual types to Nuxt types
    nuxt.hook("prepare:types", (options) => {
      options.references.push({
        path: resolver.resolve(
          nuxt.options.buildDir,
          "types/nuxt-server-utils.d.ts"
        ),
      });
    });

    // Add server plugin
    if (options.mongodbUri) {
      addServerPlugin(resolver.resolve("./runtime/server/plugins/mongoose"));
    }

    // Add devtools
    if (options.enableDevTools) {
      nuxt.hook("devtools:customTabs", (iframeTabs) => {
        iframeTabs.push({
          name: "nuxr-server-utils",
          title: "Nuxt Server Utils",
          icon: "solar:settings-minimalistic-bold-duotone",
          view: {
            type: "iframe",
            src: DOCUMENTATION_URL,
          },
        });
      });
    }
  },
});
