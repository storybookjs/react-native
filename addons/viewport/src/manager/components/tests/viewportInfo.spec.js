import { viewports, resetViewport, configuredStyles } from '../viewportInfo';

describe('Viewport/constants', () => {
  describe('viewports', () => {
    it('includes the default styles on every custom viewport', () => {
      const keys = Object.keys(viewports);

      keys.forEach(key => {
        expect(viewports[key].styles).toEqual(expect.objectContaining(configuredStyles));
      });
    });
  });

  describe('resetViewport', () => {
    it('does not include the styles for a responsive iframe', () => {
      expect(resetViewport).not.toEqual(expect.objectContaining(configuredStyles));
    });
  });
});
