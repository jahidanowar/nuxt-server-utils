export default defineAppConfig({
  docus: {
    title: "Nuxt Server Utils",
    description: "A collection of utility functions for Nuxt API development.",
    image:
      "https://raw.githubusercontent.com/jahidanowar/nuxt-server-utils/main/.github/nuxt-server-utils.png",
    socials: {
      twitter: "jahiddev",
      github: "jahidanowar/nuxt-server-utils",
    },
    github: {
      dir: "docs/content",
      branch: "main",
      repo: "nuxt-server-utils",
      owner: "jahidanowar",
      edit: true,
    },
    aside: {
      level: 0,
      collapsed: false,
      exclude: [],
    },
    main: {
      padded: true,
      fluid: true,
    },
    header: {
      logo: true,
      showLinkIcon: true,
      exclude: [],
      fluid: true,
    },
    footer: {
      iconLinks: [
        {
          href: "https://jahid.dev",
          icon: "solar:user-bold-duotone",
        },
      ],
    },
  },
});
