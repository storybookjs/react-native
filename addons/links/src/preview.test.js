import addons from '@storybook/addons';
import { SELECT_STORY } from '@storybook/core-events';

import { __STORYBOOK_STORY_STORE__ } from 'global';
import { linkTo, hrefTo } from './preview';

jest.mock('@storybook/addons');
jest.mock('global', () => ({
  document: global.document,
  __STORYBOOK_STORY_STORE__: {
    getSelection: jest.fn(() => ({
      storyId: 'name',
      kind: 'kind',
    })),
    fromId: jest.fn(() => ({
      story: 'name',
      kind: 'kind',
    })),
  },
  __STORYBOOK_CLIENT_API__: {
    raw: jest.fn(() => [
      {
        story: 'name',
        kind: 'kind',
      },
      {
        story: 'namekind',
        kind: 'kindname',
      },
    ]),
  },
}));

describe('preview', () => {
  describe('linkTo()', () => {
    it('should select the kind and story provided', () => {
      const channel = { emit: jest.fn() };
      addons.getChannel.mockReturnValue(channel);

      const handler = linkTo('kind', 'name');
      handler();

      expect(channel.emit).toHaveBeenCalledWith(SELECT_STORY, {
        kind: 'kind',
        story: 'name',
      });
    });

    it('should select the kind (only) provided', () => {
      const channel = { emit: jest.fn() };
      addons.getChannel.mockReturnValue(channel);
      __STORYBOOK_STORY_STORE__.fromId.mockImplementation(input => null);

      const handler = linkTo('kind');
      handler();

      expect(channel.emit).toHaveBeenCalledWith(SELECT_STORY, {
        kind: 'kind',
        story: 'name',
      });
    });

    it('should select the story (only) provided', () => {
      const channel = { emit: jest.fn() };
      addons.getChannel.mockReturnValue(channel);
      // simulate a currently selected, but not found as ID
      __STORYBOOK_STORY_STORE__.fromId.mockImplementation(input =>
        !input
          ? {
              kind: 'kind',
              story: 'name',
            }
          : null
      );

      const handler = linkTo(undefined, 'kind');
      handler();

      expect(channel.emit).toHaveBeenCalledWith(SELECT_STORY, {
        kind: 'kind',
        story: 'name',
      });
    });

    it('should select the id provided', () => {
      const channel = { emit: jest.fn() };
      addons.getChannel.mockReturnValue(channel);
      __STORYBOOK_STORY_STORE__.fromId.mockImplementation(input =>
        input === 'kind--story'
          ? {
              story: 'name',
              kind: 'kind',
            }
          : null
      );

      const handler = linkTo('kind--story');
      handler();

      expect(channel.emit).toHaveBeenCalledWith(SELECT_STORY, {
        kind: 'kind',
        story: 'name',
      });
    });

    it('should handle functions returning strings', () => {
      const channel = { emit: jest.fn() };
      addons.getChannel.mockReturnValue(channel);
      __STORYBOOK_STORY_STORE__.fromId.mockImplementation(input => null);

      const handler = linkTo(
        (a, b) => a + b,
        (a, b) => b + a
      );
      handler('kind', 'name');

      expect(channel.emit.mock.calls).toContainEqual([
        SELECT_STORY,
        {
          kind: 'kindname',
          story: 'namekind',
        },
      ]);
    });
  });

  describe('hrefTo()', () => {
    it('should return promise resolved with story href', async () => {
      const href = await hrefTo('kind', 'name');
      expect(href).toContain('?id=kind--name');
    });
  });
});
