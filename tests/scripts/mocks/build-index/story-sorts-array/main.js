export default {
  stories: ['./*.stories.tsx'],
  storySorts: [{ order: ['Introduction', 'Components'] }, (a, b) => a.title.localeCompare(b.title)],
};
