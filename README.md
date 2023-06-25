# Nuxt Server Utils

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![License][license-src]][license-href]
[![Nuxt][nuxt-src]][nuxt-href]

A collection of utilities for Nuxt server.

- [✨ &nbsp;Release Notes](/CHANGELOG.md)
  <!-- - [🏀 Online playground](https://stackblitz.com/github/jahidanowar/nuxt-server-utils?file=playground%2Fapp.vue) -->
  <!-- - [📖 &nbsp;Documentation](https://example.com) -->

## Features

<details>
<summary>Filtering Collections (Mongoose)</summary>  
- [x] Filtering
- [x] Sorting
- [x] Pagination
- [x] Selecting
- [x] Populating
- [x] Counting
- [x] Searching
</details>

<details>
<summary>Authorization</summary>
- [x] Authority checker utility
- [ ] Permission checker utility
- [ ] Policy utility
</details>

<details>
<summary>Resource Utilities</summary>
- [x] Resource index utility
- [x] Resource show utility
- [x] Resource delete utility
- [ ] Resource update utility
</details>

## Quick Setup

1. Add `nuxt-server-utils` dependency to your project

```bash
# Using pnpm
pnpm add -D nuxt-server-utils

# Using yarn
yarn add --dev nuxt-server-utils

# Using npm
npm install --save-dev nuxt-server-utils
```

2. Add `nuxt-server-utils` to the `modules` section of `nuxt.config.ts`

```js
export default defineNuxtConfig({
  modules: ["nuxt-server-utils"],
});
```

That's it! You can now use My Module in your Nuxt app ✨

## Development

```bash
# Install dependencies
npm install

# Generate type stubs
npm run dev:prepare

# Develop with the playground
npm run dev

# Build the playground
npm run dev:build

# Run ESLint
npm run lint

# Run Vitest
npm run test
npm run test:watch

# Release new version
npm run release
```

<!-- Badges -->

[npm-version-src]: https://img.shields.io/npm/v/nuxt-server-utils/latest.svg?style=flat&colorA=18181B&colorB=28CF8D
[npm-version-href]: https://npmjs.com/package/nuxt-server-utils
[npm-downloads-src]: https://img.shields.io/npm/dm/nuxt-server-utils.svg?style=flat&colorA=18181B&colorB=28CF8D
[npm-downloads-href]: https://npmjs.com/package/nuxt-server-utils
[license-src]: https://img.shields.io/npm/l/nuxt-server-utils.svg?style=flat&colorA=18181B&colorB=28CF8D
[license-href]: https://npmjs.com/package/nuxt-server-utils
[nuxt-src]: https://img.shields.io/badge/Nuxt-18181B?logo=nuxt.js
[nuxt-href]: https://nuxt.com
