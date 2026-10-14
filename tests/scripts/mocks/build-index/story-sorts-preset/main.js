export default {
  stories: ['./*.stories.tsx'],
  storySorts: (existing = []) => [...existing, { order: ['Hooks'] }, { method: 'alphabetical' }],
};
