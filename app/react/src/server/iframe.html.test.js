import { urlsFromAssets } from './iframe.html';

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
});
