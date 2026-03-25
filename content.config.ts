import { defineCollection, z } from 'astro:content';

const branches = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    emoji: z.string(),
    hook: z.string(),
    status: z.enum(['live', 'placeholder']),
    tone: z.enum(['standard', 'soft']).default('standard'),
    order: z.number(),
  }),
});

const pillars = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    emoji: z.string(),
    tagline: z.string(),
    status: z.enum(['live', 'placeholder']),
    order: z.number(),
  }),
});

export const collections = { branches, pillars };
