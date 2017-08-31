import { urlsFromAssets, isPreviewAsset } from './iframe.html';

describe('server.urlsFromAssets', () => {
  it('should return the default when there are no assets', () => {
    expect(urlsFromAssets()).toEqual({
      js: ['static/preview.bundle.js'],
      css: [],
    });
  });

  it('should return multiple assets', () => {
    const fixture = {
      manager: 'static/manager.a.bundle.js',
      preview: ['static/preview.x.bundle.js', 'static/preview.y.css', 'static/preview.y.css.map'],
    };
    expect(urlsFromAssets(fixture)).toEqual({
      js: ['static/preview.x.bundle.js'],
      css: ['static/preview.y.css'],
    });
  });

  it('should not return non-js or non-css assets', () => {
    const fixture = {
      'some-thing.svg': 'some-thing.svg',
    };
    expect(urlsFromAssets(fixture)).toEqual({
      js: [],
      css: [],
    });
  });

  it('should put the JS preview bundle first, before other chunks', () => {
    const fixture = {
      manager: 'static/manager.a.bundle.js',
      preview: [
        'static/0.bundle.js',
        'static/2.bundle.js',
        'static/3.bundle.js',
        'static/4.bundle.js',
        'static/preview.bundle.js',
        'static/5.bundle.js',
        'static/6.bundle.js',
      ],
    };
    expect(urlsFromAssets(fixture)).toEqual({
      js: [
        'static/preview.bundle.js',
        'static/0.bundle.js',
        'static/2.bundle.js',
        'static/3.bundle.js',
        'static/4.bundle.js',
        'static/5.bundle.js',
        'static/6.bundle.js',
      ],
      css: [],
    });
  });
});

describe('server.isPreviewAsset', () => {
  it('should return true when this is the preview bundle', () => {
    expect(isPreviewAsset('static/preview.bundle.js')).toBe(true);
  });

  it('should return false when this is NOT the preview bundle', () => {
    expect(isPreviewAsset('static/some.other.bundle.js')).toBe(false);
  });
});
