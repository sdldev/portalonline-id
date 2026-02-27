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
  integrations: [
    sitemap({
      /** @param {any} item */
      serialize(item) {
        if (item.url === 'https://portalonline.id/') {
          item.changefreq = 'daily';
          item.priority = 1.0;
        } else if (item.url.match(/https:\/\/portalonline\.id\/[^\/]+\/[^\/]+/)) {
          // Inner items (e.g. /article/something)
          item.changefreq = 'weekly';
          item.priority = 0.8;
        } else if (item.url.match(/about|contact|pricing|privacy|terms|seo|themes/)) {
          // Static support pages
          item.changefreq = 'monthly';
          item.priority = 0.5;
        } else {
          // Category index pages like /article/, /tips/, /author/
          item.changefreq = 'daily';
          item.priority = 0.9;
        }
        item.lastmod = new Date().toISOString();
        return item;
      }
    }),
    robotsTxt({
      sitemap: 'https://portalonline.id/sitemap-index.xml',
    }),
    mdx()
  ],
  adapter: cloudflare({
    platformProxy: {
      enabled: true,
    },
  }),
});