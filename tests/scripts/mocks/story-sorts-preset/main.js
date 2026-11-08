export default {
  stories: ['./FakeStory.stories.tsx'],
  storySorts: (existing = []) => [...existing, { order: ['Intro'] }, { method: 'alphabetical' }],
};
