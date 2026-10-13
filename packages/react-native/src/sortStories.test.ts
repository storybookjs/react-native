import type { IndexEntry, StoryIndex } from 'storybook/internal/types';
import { sortIndexEntries } from './sortStories';

const entry = (title: string, name: string, importPath: string): IndexEntry => ({
  type: 'story',
  subtype: 'story',
  id: `${title}--${name}`.toLowerCase(),
  title,
  name,
  importPath,
  tags: ['story'],
});

const toEntries = (list: IndexEntry[]): StoryIndex['entries'] =>
  Object.fromEntries(list.map((item) => [item.id, item]));

const titles = (entries: StoryIndex['entries']) =>
  Object.values(entries).map((item) => `${item.title}/${item.name}`);

const entries = toEntries([
  entry('Components/Button', 'Primary', './Button.stories.tsx'),
  entry('Introduction', 'Welcome', './Introduction.stories.tsx'),
  entry('Components/Avatar', 'Basic', './Avatar.stories.tsx'),
  entry('Hooks', 'Basic', './Hooks.stories.tsx'),
]);

describe('sortIndexEntries', () => {
  test('keeps file order without sorters', () => {
    expect(titles(sortIndexEntries(entries, []))).toEqual([
      'Components/Button/Primary',
      'Introduction/Welcome',
      'Components/Avatar/Basic',
      'Hooks/Basic',
    ]);
  });

  test('applies a single sorter', () => {
    expect(titles(sortIndexEntries(entries, [{ method: 'alphabetical' }]))).toEqual([
      'Components/Avatar/Basic',
      'Components/Button/Primary',
      'Hooks/Basic',
      'Introduction/Welcome',
    ]);
  });

  test('lets later sorters order only the stories earlier sorters consider equal', () => {
    const sorted = sortIndexEntries(entries, [
      { order: ['Introduction', 'Components'] },
      (a, b) => a.title.localeCompare(b.title),
    ]);

    expect(titles(sorted)).toEqual([
      'Introduction/Welcome',
      'Components/Avatar/Basic',
      'Components/Button/Primary',
      'Hooks/Basic',
    ]);
  });

  test('does not let later sorters reorder stories an earlier sorter ordered', () => {
    const sorted = sortIndexEntries(entries, [
      { order: ['Hooks', 'Introduction'] },
      { method: 'alphabetical' },
    ]);

    expect(titles(sorted)).toEqual([
      'Hooks/Basic',
      'Introduction/Welcome',
      'Components/Avatar/Basic',
      'Components/Button/Primary',
    ]);
  });
});
