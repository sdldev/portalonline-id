import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import type { Loader } from 'astro/loaders';

function safeGlob(options: Parameters<typeof glob>[0]): Loader {
    const originalLoader = glob(options);
    return {
        ...originalLoader,
        load: async (context: any) => {
            const originalWarn = context.logger.warn;
            context.logger.warn = (msg: any, ...args: any[]) => {
                if (typeof msg === 'string' && (msg.includes('does not exist or is empty') || msg.includes('No files found matching'))) return;
                originalWarn.call(context.logger, msg, ...args);
            };
            try {
                return await originalLoader.load(context);
            } finally {
                context.logger.warn = originalWarn;
            }
        }
    };
}

const baseSchema = z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    author: z.string().default('Portal Online'),
    tags: z.array(z.string()).default([]),
    image: z.string().optional(),
    imageCaption: z.string().optional(),
});

const tutorial = defineCollection({
    loader: safeGlob({ pattern: '**/*.{md,mdx}', base: './src/content/tutorial' }),
    schema: baseSchema.extend({
        category: z.enum(['Tutorial', 'Dokumentasi']).default('Tutorial'),
    }),
});

const article = defineCollection({
    loader: safeGlob({ pattern: '**/*.{md,mdx}', base: './src/content/article' }),
    schema: baseSchema.extend({
        category: z.enum(['Artikel', 'Opini', 'Ulasan']).default('Artikel'),
    }),
});

const tips = defineCollection({
    loader: safeGlob({ pattern: '**/*.{md,mdx}', base: './src/content/tips' }),
    schema: baseSchema.extend({
        category: z.enum(['Tips', 'Trik']).default('Tips'),
    }),
});

const update = defineCollection({
    loader: safeGlob({ pattern: '**/*.{md,mdx}', base: './src/content/update' }),
    schema: baseSchema.extend({
        category: z.enum(['Berita', 'Pengumuman', 'Update']).default('Update'),
    }),
});

const author = defineCollection({
    loader: safeGlob({ pattern: '**/*.{md,mdx}', base: './src/content/author' }),
    schema: z.object({
        name: z.string(),
        avatar: z.string().optional(),
    }),
});

export const collections = { tutorial, article, tips, update, author };
