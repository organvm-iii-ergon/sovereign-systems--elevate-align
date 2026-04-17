import { config, fields, collection } from '@keystatic/core';

export default config({
  storage: {
    kind: 'local',
  },
  collections: {
    pillars: collection({
      label: 'Pillars',
      slugField: 'title',
      path: 'src/content/pillars/*',
      format: { contentField: 'content' },
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        emoji: fields.text({ label: 'Emoji', description: 'Single emoji for this pillar' }),
        tagline: fields.text({ label: 'Tagline', description: 'Short description shown on cards' }),
        status: fields.select({
          label: 'Status',
          options: [
            { label: 'Live', value: 'live' },
            { label: 'Placeholder', value: 'placeholder' },
          ],
          defaultValue: 'placeholder',
        }),
        order: fields.integer({ label: 'Order', description: 'Display position (1-4)' }),
        content: fields.markdoc({
          label: 'Content',
          description: 'Full pillar page content',
        }),
      },
    }),
    branches: collection({
      label: 'Branches',
      slugField: 'title',
      path: 'src/content/branches/*',
      format: { contentField: 'content' },
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        emoji: fields.text({ label: 'Emoji', description: 'Single emoji for this branch' }),
        hook: fields.text({ label: 'Hook', description: 'Opening question or statement' }),
        status: fields.select({
          label: 'Status',
          options: [
            { label: 'Live', value: 'live' },
            { label: 'Placeholder', value: 'placeholder' },
          ],
          defaultValue: 'placeholder',
        }),
        tone: fields.select({
          label: 'Tone',
          options: [
            { label: 'Standard', value: 'standard' },
            { label: 'Soft', value: 'soft' },
          ],
          defaultValue: 'standard',
        }),
        order: fields.integer({ label: 'Order', description: 'Display position (1-6)' }),
        content: fields.markdoc({
          label: 'Content',
          description: 'Full branch page content',
        }),
      },
    }),
  },
});
