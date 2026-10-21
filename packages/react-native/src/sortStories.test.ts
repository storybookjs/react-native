import { sortStoriesV7 } from 'storybook/internal/preview-api';
import type { Addon_StorySortParameterV7, IndexEntry, StoryIndex } from 'storybook/internal/types';
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

describe('sortIndexEntries matches Storybook core', () => {
  // Storybook doesn't export its comparators, but sortStoriesV7 hands the comparator for a sorter
  // to `stories.sort()`, so a fake array can capture it.
  const coreComparator = (storySort: Addon_StorySortParameterV7) => {
    let comparator: ((a: IndexEntry, b: IndexEntry) => number) | undefined;
    const capture = Object.assign([] as IndexEntry[], {
      sort(fn: (a: IndexEntry, b: IndexEntry) => number) {
        comparator = fn;
        return capture;
      },
    });
    sortStoriesV7(capture, storySort, []);
    return comparator!;
  };

  // `combineStorySorts` from Storybook 11's `code/core/src/shared/story-index/sortStories.ts`.
  const combineStorySorts = (storySorts: Addon_StorySortParameterV7[]) => {
    const comparators = storySorts.map(coreComparator);
    return (a: IndexEntry, b: IndexEntry) => {
      for (const comparator of comparators) {
        const result = Number(comparator(a, b)) || 0;
        if (result !== 0) {
          return result;
        }
      }
      return 0;
    };
  };

  const sorterSets: Addon_StorySortParameterV7[][] = [
    [{ method: 'alphabetical' }],
    [{ order: ['Intro', 'Components'] }],
    [{ order: ['Intro', '*', 'Docs'] }, { method: 'alphabetical', includeNames: true }],
    [['Hooks'], { order: ['Components', ['Button', 'Avatar']] }, { method: 'alphabetical' }],
    [(a, b) => a.name.localeCompare(b.name), { method: 'alphabetical' }],
    [
      (a, b) => b.title.split('/').length - a.title.split('/').length,
      (a, b) => a.id.localeCompare(b.id),
    ],
    [() => 0, { order: ['Docs'] }],
  ];

  const titlePool = [
    'Intro',
    'Docs',
    'Hooks',
    'Components/Button',
    'Components/Avatar',
    'Components/Card/Header',
    'Utils/Format',
  ];
  const namePool = ['Basic', 'Primary', 'Disabled', 'Advanced'];

  // Small deterministic PRNG so failures are reproducible.
  const random = (seed: number) => () => {
    seed = (seed * 1103515245 + 12345) % 2 ** 31;
    return seed / 2 ** 31;
  };

  test.each(sorterSets.map((storySorts, index) => [index, storySorts] as const))(
    'sorter set %i',
    (setIndex, storySorts) => {
      const next = random(setIndex + 1);
      for (let run = 0; run < 25; run += 1) {
        const list = Array.from({ length: 2 + Math.floor(next() * 10) }, (_, i) => {
          const title = titlePool[Math.floor(next() * titlePool.length)];
          const name = namePool[Math.floor(next() * namePool.length)];
          return { ...entry(title, name, `./${title}.stories.tsx`), id: `${title}--${name}--${i}` };
        });

        const expected = [...list].sort(combineStorySorts(storySorts)).map((item) => item.id);

        expect(Object.keys(sortIndexEntries(toEntries(list), storySorts))).toEqual(expected);
      }
    }
  );
});
