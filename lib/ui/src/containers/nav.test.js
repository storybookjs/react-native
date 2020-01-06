import { collapseDocsOnlyStories, collapseAllStories } from './nav';

const docsOnly = { parameters: { docsOnly: true } };
const root = { id: 'root', parent: false, children: ['a', 'b'] };
const a = { id: 'a', isComponent: true, parent: 'root', children: ['a1'] };
const a1 = { id: 'a1', isLeaf: true, parent: 'a' };
const b = { id: 'b', isComponent: true, parent: 'root', children: ['b1', 'b2'] };
const b1 = { id: 'b1', isLeaf: true, parent: 'b' };
const b2 = { id: 'b2', isLeaf: true, parent: 'b' };
const stories = { root, a, a1, b, b1, b2 };

describe('collapse docs-only stories', () => {
  it('ignores normal stories', () => {
    const filtered = collapseDocsOnlyStories(stories);
    expect(filtered).toEqual(stories);
  });

  it('filters out docs-only stories', () => {
    const hasDocsOnly = {
      ...stories,
      a1: { ...a1, ...docsOnly },
    };
    const filtered = collapseDocsOnlyStories(hasDocsOnly);
    expect(filtered.a1).toEqual({
      id: 'a1',
      isComponent: true,
      isLeaf: true,
      parent: 'root',
    });
  });
});

describe('collapse all stories', () => {
  it('collapses normal stories', () => {
    const collapsed = collapseAllStories(stories);
    expect(collapsed).toEqual({
      a1: {
        id: 'a1',
        isComponent: true,
        isLeaf: true,
        parent: 'root',
      },
      b1: {
        id: 'b1',
        isComponent: true,
        isLeaf: true,
        parent: 'root',
      },
      root: {
        children: ['a1', 'b1'],
        id: 'root',
        parent: false,
      },
    });
  });
  it('collapses docs-only stories', () => {
    const hasDocsOnly = {
      ...stories,
      a1: { ...a1, ...docsOnly },
    };
    const collapsed = collapseAllStories(hasDocsOnly);
    expect(collapsed.a1).toEqual({
      id: 'a1',
      isComponent: true,
      isLeaf: true,
      parent: 'root',
    });
  });
  it('collapses mixtures of leaf and non-leaf children', () => {
    const mixedRoot = { id: 'root', parent: false, children: ['a', 'b1'] };
    const mixed = { root: mixedRoot, a, a1, b1: { ...b1, parent: 'root' } };
    const collapsed = collapseAllStories(mixed);
    expect(collapsed).toEqual({
      a1: {
        id: 'a1',
        isComponent: true,
        isLeaf: true,
        parent: 'root',
      },
      b1: {
        id: 'b1',
        isLeaf: true,
        parent: 'root',
      },
      root: {
        children: ['a1', 'b1'],
        id: 'root',
        parent: false,
      },
    });
  });
});
