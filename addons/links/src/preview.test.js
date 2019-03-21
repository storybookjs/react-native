import addons from '@storybook/addons';
import { SELECT_STORY } from '@storybook/core-events';
import { linkTo, hrefTo } from './preview';

jest.mock('@storybook/addons');

export const mockChannel = () => {
  return {
    emit: jest.fn(),
    on: jest.fn(),
    once: jest.fn(),
  };
};

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

    it('should handle functions returning strings', () => {
      const channel = { emit: jest.fn() };
      addons.getChannel.mockReturnValue(channel);

      const handler = linkTo((a, b) => a + b, (a, b) => b + a);
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
