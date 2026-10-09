import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://rezonanca.art',
  i18n: {
    defaultLocale: 'sr',
    locales: ['sr', 'en'],
    routing: { prefixDefaultLocale: false },
  },
});
