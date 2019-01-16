import { constructUrl } from '../url';

describe('Construct URL for Storyshots', () => {
  it('can use a url without path and without query params', () => {
    expect(constructUrl('http://localhost:9001', 'someKind', 'someStory')).toEqual(
      'http://localhost:9001/iframe.html?id=somekind--somestory'
    );
  });

  it('can use a url without path (but slash) and without query params', () => {
    expect(constructUrl('http://localhost:9001/', 'someKind', 'someStory')).toEqual(
      'http://localhost:9001/iframe.html?id=somekind--somestory'
    );
  });

  it('can use a url without path and with query params', () => {
    expect(constructUrl('http://localhost:9001?hello=world', 'someKind', 'someStory')).toEqual(
      'http://localhost:9001/iframe.html?id=somekind--somestory&hello=world'
    );
  });

  it('can use a url without path (buth slash) and with query params', () => {
    expect(constructUrl('http://localhost:9001/?hello=world', 'someKind', 'someStory')).toEqual(
      'http://localhost:9001/iframe.html?id=somekind--somestory&hello=world'
    );
  });

  it('can use a url with some path and query params', () => {
    expect(
      constructUrl('http://localhost:9001/nice-path?hello=world', 'someKind', 'someStory')
    ).toEqual('http://localhost:9001/nice-path/iframe.html?id=somekind--somestory&hello=world');
  });

  it('can use a url with some path (slash) and query params', () => {
    expect(
      constructUrl('http://localhost:9001/nice-path/?hello=world', 'someKind', 'someStory')
    ).toEqual('http://localhost:9001/nice-path/iframe.html?id=somekind--somestory&hello=world');
  });

  it('can use a url with file protocol', () => {
    expect(constructUrl('file://users/storybook', 'someKind', 'someStory')).toEqual(
      'file://users/storybook/iframe.html?id=somekind--somestory'
    );
  });
});
