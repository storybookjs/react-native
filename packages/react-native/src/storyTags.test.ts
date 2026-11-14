import { transformStoryIndexToStoriesHash } from '@storybook/react-native-ui-common';
import type { StoryIndex } from 'storybook/internal/types';
import { definePreview } from './definePreview';
import { SIDEBAR_FILTERS, combineStoryTags, getProjectTags, isShownInSidebar } from './storyTags';

describe('storyTags', () => {
  test('combineStoryTags starts from the default tags and applies negated tags in order', () => {
    expect(combineStoryTags({})).toEqual(['dev', 'test', 'manifest']);

    expect(
      combineStoryTags({
        projectTags: ['project', '!manifest'],
        metaTags: ['beta', '!dev'],
        storyTags: ['dev', '!beta', 'new'],
      })
    ).toEqual(['test', 'project', 'dev', 'new']);
  });

  test('combineStoryTags ignores tags that are not arrays of strings', () => {
    expect(
      combineStoryTags({ projectTags: 'beta', metaTags: [1, 'meta'], storyTags: null })
    ).toEqual(['dev', 'test', 'manifest', 'meta']);
  });

  test('getProjectTags reads the tags of every preview annotation', () => {
    const preview = definePreview({ addons: [], tags: ['factory'] });

    expect(
      getProjectTags([
        { default: { tags: ['default-export'] } },
        { tags: ['named-export'] },
        { default: { parameters: {} } },
        { default: preview },
      ])
    ).toEqual(['default-export', 'named-export', 'factory']);
  });

  test('isShownInSidebar only shows entries tagged dev', () => {
    expect(isShownInSidebar({ tags: ['dev', 'test'] })).toBe(true);
    expect(isShownInSidebar({ tags: ['test'] })).toBe(false);
    expect(isShownInSidebar({})).toBe(false);
  });

  test('SIDEBAR_FILTERS leaves stories without the dev tag out of the sidebar', () => {
    const story = (id: string, title: string, tags: string[]) => ({
      type: 'story' as const,
      subtype: 'story' as const,
      id,
      title,
      name: id,
      importPath: './Button.stories.tsx',
      tags,
    });
    const index: StoryIndex = {
      v: 5,
      entries: {
        'group-button--shown': story('group-button--shown', 'Group/Button', ['dev', 'test']),
        'group-button--hidden': story('group-button--hidden', 'Group/Button', ['test']),
        'group-icon--hidden': story('group-icon--hidden', 'Group/Icon', ['test']),
      },
    };

    const storyHash = transformStoryIndexToStoriesHash(index, {
      docsOptions: { docsMode: false, defaultName: '' },
      filters: SIDEBAR_FILTERS,
      allStatuses: {},
      provider: { handleAPI: () => ({}), getConfig: () => ({}) } as any,
    });

    expect(Object.keys(storyHash).sort()).toEqual(['group', 'group-button', 'group-button--shown']);
  });
});
