export default {
  stories: ['./FakeStory.stories.tsx'],
  storySorts: [
    { order: ['Introduction', 'Components'] },
    (a, b) => a.title.localeCompare(b.title, undefined, { numeric: true }),
  ],
};
