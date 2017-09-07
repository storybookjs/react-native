import addons from '@storybook/addons';
import { init, addChannel } from '../manager';

jest.mock('@storybook/addons');

describe('Viewport manager', () => {
  describe('init', () => {
    it('registers the addon', () => {
      init();

      expect(addons.register).toHaveBeenCalledWith('storybook-addon-viewport', addChannel);
    });
  });

  describe('addChannel', () => {
    it('adds the panel to storybook', () => {
      addChannel();

      expect(addons.addPanel).toHaveBeenCalledWith(
        'storybook-addon-viewport/addon-panel',
        expect.objectContaining({ title: 'Viewport' })
      );
    });
  });
});
