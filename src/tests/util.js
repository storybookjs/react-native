import { describe, it } from 'mocha';
import { expect } from 'chai';
import { filterStorybook } from '../util';

describe('filterStorybook', () => {
  it('should filter by grep regexp', () => {
    const storybook = [
      {
        kind: 'foo kind',
        stories: [
          { name: 'aaa aaa' },
          { name: 'aaa aaa' },
        ],
      },
      {
        kind: 'aaaaa aaaaa',
        stories: [
          { name: 'aaaa aaaa' },
          { name: 'aaa aaaa' },
          { name: 'foo story' },
          { name: 'aaaa' },
        ],
      },
    ];

    const expectedStorybook = [
      {
        kind: 'foo kind',
        stories: [
          { name: 'aaa aaa' },
          { name: 'aaa aaa' },
        ],
      },
      {
        kind: 'aaaaa aaaaa',
        stories: [
          { name: 'foo story' },
        ],
      },
    ];

    const filteredStorybook = filterStorybook(storybook, 'foo');
    expect(filteredStorybook).to.deep.equal(expectedStorybook);
  });

  it('should filter by ignore regexp', () => {
    const storybook = [
      {
        kind: 'aaa aaaa',
        stories: [
          { name: 'foo bar' },
          { name: 'foo bar' },
        ],
      },
      {
        kind: 'foo bar',
        stories: [
          { name: 'aaaa aaaa' },
          { name: 'aaa aaaa' },
          { name: 'foo story' },
          { name: 'bar story' },
        ],
      },
    ];

    const expectedStorybook = [
      {
        kind: 'foo bar',
        stories: [
          { name: 'foo story' },
          { name: 'bar story' },
        ],
      },
    ];

    const filteredStorybook = filterStorybook(storybook, undefined, 'aa');
    expect(filteredStorybook).to.deep.equal(expectedStorybook);
  });
});
