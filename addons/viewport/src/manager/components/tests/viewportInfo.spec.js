import {
  resetViewport,
  configuredStyles,
  applyStyles,
  viewportsTransformer,
} from '../viewportInfo';

describe('Viewport/constants', () => {
  describe('resetViewport', () => {
    it('does not include the styles for a responsive iframe', () => {
      expect(resetViewport).not.toEqual(expect.objectContaining(configuredStyles));
    });
  });

  describe('applyStyles', () => {
    it('creates a new viewport with all given styles applied', () => {
      const viewport = {
        styles: {
          width: '50px',
        },
      };
      const styles = {
        foo: 'bar',
        john: 'doe',
      };
      const newViewport = applyStyles(viewport, styles);

      expect(newViewport.styles).toEqual(
        expect.objectContaining({
          width: '50px',
          foo: 'bar',
          john: 'doe',
        })
      );
    });
  });

  describe('viewportsTransformer', () => {
    it('includes the default styles on every viewport', () => {
      const viewports = {
        foo: {
          styles: {
            width: '50px',
          },
        },
        bar: {
          styles: {
            width: '100px',
          },
        },
      };

      const transformedViewports = viewportsTransformer(viewports);
      const keys = Object.keys(transformedViewports);

      keys.forEach(key => {
        expect(transformedViewports[key].styles).toEqual(expect.objectContaining(configuredStyles));
      });
    });
  });
});
