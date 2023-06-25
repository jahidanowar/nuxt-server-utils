export default defineNuxtConfig({
  modules: ["../src/module"],
  nuxtServerUtils: {
    mongodbUri: process.env.MONGODB_URI,
  },
  devtools: { enabled: true },
});
