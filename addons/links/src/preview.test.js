import addons from '@storybook/addons';
import { linkTo, hrefTo } from './preview';
import { EVENT_ID, REQUEST_HREF_EVENT_ID, RECEIVE_HREF_EVENT_ID } from '.';

jest.mock('@storybook/addons');

export const mockChannel = () => {
  let cb;
  return {
    emit(id, payload) {
      if (id === REQUEST_HREF_EVENT_ID) {
        cb(`?selectedKind=${payload.kind}&selectedStory=${payload.story}`);
      }
    },
    on(id, callback) {
      if (id === RECEIVE_HREF_EVENT_ID) {
        cb = callback;
      }
    },
  };
};

describe('preview', () => {
  describe('linkTo()', () => {
    it('should select the kind and story provided', () => {
      const channel = { emit: jest.fn() };
      addons.getChannel.mockReturnValue(channel);

      const handler = linkTo('kind', 'story');
      handler();

      expect(channel.emit).toHaveBeenCalledWith(EVENT_ID, {
        kind: 'kind',
        story: 'story',
      });
    });

    it('should handle functions returning strings', () => {
      const channel = { emit: jest.fn() };
      addons.getChannel.mockReturnValue(channel);

      const handler = linkTo((a, b) => a + b, (a, b) => b + a);
      handler('foo', 'bar');

      expect(channel.emit).toHaveBeenCalledWith(EVENT_ID, {
        kind: 'foobar',
        story: 'barfoo',
      });
    });
  });

  describe('hrefTo()', () => {
    it('should return promise resolved with story href', async () => {
      const channel = mockChannel();
      addons.getChannel.mockReturnValue(channel);

      const href = await hrefTo('kind', 'story');
      expect(href).toBe('?selectedKind=kind&selectedStory=story');
    });
  });
});
