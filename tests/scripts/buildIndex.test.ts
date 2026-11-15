import { describe, it } from 'node:test';
import assert from 'node:assert';
import path from 'node:path';
import { sync as globSync } from 'glob';
import { buildIndex } from '@storybook/react-native/node';

(globalThis as any).window = { navigator: {} };

const fixture = (name: string) => `scripts/mocks/build-index/${name}`;

const titles = (index: Awaited<ReturnType<typeof buildIndex>>) =>
  Object.values(index.entries).map((entry) => entry.title);

describe('buildIndex storySorts', () => {
  it('sorts with storySorts from main', async () => {
    const index = await buildIndex({ configPath: fixture('story-sorts-array') });

    assert.deepStrictEqual(titles(index), [
      'Introduction',
      'Components/Avatar',
      'Components/Button',
      'Hooks',
    ]);
  });

  it('resolves storySorts given as a preset function', async () => {
    const index = await buildIndex({ configPath: fixture('story-sorts-preset') });

    assert.deepStrictEqual(titles(index), [
      'Hooks',
      'Components/Avatar',
      'Components/Button',
      'Introduction',
    ]);
  });

  it('keeps file order without storySorts and ignores storySort in preview', async () => {
    const index = await buildIndex({ configPath: fixture('story-sorts-none') });

    // File order is the order the stories glob returns. The preview storySort would put the stories
    // in an order no file listing produces.
    const fileOrder = globSync('*.stories.tsx', { cwd: fixture('story-sorts-none') }).map((file) =>
      path.basename(file, '.stories.tsx').replace('-', '/')
    );
    assert.deepStrictEqual(titles(index), fileOrder);
    assert.notDeepStrictEqual(titles(index), [
      'Hooks',
      'Components/Button',
      'Components/Avatar',
      'Introduction',
    ]);
  });
});
