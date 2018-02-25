import { initialViewports, resetViewport, configuredStyles } from '../viewportInfo';

describe('Viewport/constants', () => {
  describe('initialViewports', () => {
    it('includes the default styles on every custom viewport', () => {
      const keys = Object.keys(initialViewports);

      keys.forEach(key => {
        expect(initialViewports[key].styles).toEqual(expect.objectContaining(configuredStyles));
      });
    });
  });

  describe('resetViewport', () => {
    it('does not include the styles for a responsive iframe', () => {
      expect(resetViewport).not.toEqual(expect.objectContaining(configuredStyles));
    });
  });
});
