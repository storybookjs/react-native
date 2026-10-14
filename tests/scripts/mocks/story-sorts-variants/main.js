export default {
  stories: ['./FakeStory.stories.tsx'],
  storySorts: [
    {
      method: 'alphabetical',
      includeNames: true,
      locales: 'en-US',
      order: ['Intro', ['Getting "Started"', "It's here"], '*', 'Deprecated'],
    },
    ['Components', 'Hooks'],
    (a, b) => a.title.length - b.title.length,
    function byName(a, b) {
      return a.name.localeCompare(b.name);
    },
    function (a, b) {
      // multi-line body
      const left = a.id;
      const right = b.id;
      return left < right ? -1 : left > right ? 1 : 0;
    },
  ],
};
