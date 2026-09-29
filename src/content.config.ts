import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const work = defineCollection({
  loader: glob({ base: './src/content/work', pattern: '*.md' }),
  schema: z.object({
    title: z.string(),
    tagline: z.string(),
    kind: z.string(),
    year: z.number(),
    order: z.number(),
    draft: z.boolean().default(false),
    figure: z.enum(['cheat-rate', 'msa-sources', 'afr-commands']).optional(),
    result: z.object({ value: z.string(), caption: z.string() }),
    facts: z.array(z.object({ k: z.string(), v: z.string() })),
    links: z.array(z.object({ label: z.string(), url: z.string() })),
  }),
});

const writing = defineCollection({
  loader: glob({ base: './src/content/writing', pattern: '*.md' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    medium: z.string().url(),
    description: z.string(),
  }),
});

export const collections = { work, writing };
