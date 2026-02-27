// @ts-check
import { defineConfig } from 'astro/config';

import sitemap from '@astrojs/sitemap';

import robotsTxt from 'astro-robots-txt';

import mdx from '@astrojs/mdx';

import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
export default defineConfig({
  site: 'https://portalonline.id',
  output: 'server',
  integrations: [sitemap(), robotsTxt(), mdx()],
  adapter: cloudflare({
    platformProxy: {
      enabled: true,
    },
  }),
});