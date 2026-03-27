import { config, fields, collection } from '@keystatic/core';

export default config({
  storage: import.meta.env.PROD
    ? {
        kind: 'github',
        repo: {
          owner: 'organvm-iii-ergon',
          name: 'sovereign-systems--elevate-align',
        },
      }
    : {
        kind: 'local',
      },
  collections: {
    branches: collection({
      label: 'Branches',
      slugField: 'title',
      path: 'src/content/branches/*',
      format: { contentField: 'content' },
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        emoji: fields.text({ label: 'Emoji' }),
        hook: fields.text({ label: 'Hook', multiline: true }),
        status: fields.select({
          label: 'Status',
          options: [
            { label: 'Live', value: 'live' },
            { label: 'Placeholder', value: 'placeholder' },
          ],
          defaultValue: 'live',
        }),
        tone: fields.select({
          label: 'Tone',
          options: [
            { label: 'Standard', value: 'standard' },
            { label: 'Soft', value: 'soft' },
          ],
          defaultValue: 'standard',
        }),
        order: fields.integer({ label: 'Order', defaultValue: 1 }),
        content: fields.markdoc({
          label: 'Content',
        }),
      },
    }),
    pillars: collection({
      label: 'Pillars',
      slugField: 'title',
      path: 'src/content/pillars/*',
      format: { contentField: 'content' },
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        emoji: fields.text({ label: 'Emoji' }),
        tagline: fields.text({ label: 'Tagline', multiline: true }),
        status: fields.select({
          label: 'Status',
          options: [
            { label: 'Live', value: 'live' },
            { label: 'Placeholder', value: 'placeholder' },
          ],
          defaultValue: 'placeholder',
        }),
        order: fields.integer({ label: 'Order', defaultValue: 1 }),
        content: fields.markdoc({
          label: 'Content',
        }),
      },
    }),
  },
});
