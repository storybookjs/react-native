import { toId } from '@storybook/csf';

import { constructUrl } from '../url';

jest.mock('@storybook/node-logger');

const id = toId('someKind', 'someStory');

describe('Construct URL for Storyshots', () => {
  it('can use a url without path and without query params', () => {
    expect(constructUrl('http://localhost:9001', id)).toEqual(
      'http://localhost:9001/iframe.html?id=somekind--somestory'
    );
  });

  it('can use a url without path (but slash) and without query params', () => {
    expect(constructUrl('http://localhost:9001/', id)).toEqual(
      'http://localhost:9001/iframe.html?id=somekind--somestory'
    );
  });

  it('can use a url without path and with query params', () => {
    expect(constructUrl('http://localhost:9001?hello=world', id)).toEqual(
      'http://localhost:9001/iframe.html?id=somekind--somestory&hello=world'
    );
  });

  it('can use a url without path (buth slash) and with query params', () => {
    expect(constructUrl('http://localhost:9001/?hello=world', id)).toEqual(
      'http://localhost:9001/iframe.html?id=somekind--somestory&hello=world'
    );
  });

  it('can use a url with some path and query params', () => {
    expect(constructUrl('http://localhost:9001/nice-path?hello=world', id)).toEqual(
      'http://localhost:9001/nice-path/iframe.html?id=somekind--somestory&hello=world'
    );
  });

  it('can use a url with some path (slash) and query params', () => {
    expect(constructUrl('http://localhost:9001/nice-path/?hello=world', id)).toEqual(
      'http://localhost:9001/nice-path/iframe.html?id=somekind--somestory&hello=world'
    );
  });

  it('can use a url with file protocol', () => {
    expect(constructUrl('file://users/storybook', id)).toEqual(
      'file://users/storybook/iframe.html?id=somekind--somestory'
    );
  });
});
