import {
  createHierarchyRoot,
  createHierarchies,
  resolveStoryHierarchy,
  resolveStoryHierarchyRoots,
  prepareStoriesForHierarchy,
} from './hierarchy';

describe('manager.ui.libs.hierarchy', () => {
  describe('createHierarchyRoot', () => {
    test('should return root hierarchy node', () => {
      const result = createHierarchyRoot();

      expect(result).toEqual({
        namespaces: [],
        name: '',
        isNamespace: true,
        map: new Map(),
      });
    });

    test('should return root hierarchy node with root name', () => {
      const result = createHierarchyRoot('root name');

      expect(result).toEqual({
        namespaces: [],
        name: 'root name',
        isNamespace: true,
        map: new Map(),
      });
    });
  });

  describe('createHierarchies', () => {
    test('should return empty root hierarchy if stories are undefined', () => {
      const result = createHierarchies();

      expect(result[0]).toEqual({
        namespaces: [],
        name: '',
        isNamespace: true,
        map: new Map(),
      });
    });

    test('should return empty root hierarchy if stories are empty', () => {
      const result = createHierarchies([]);

      expect(result[0]).toEqual({
        namespaces: [],
        name: '',
        isNamespace: true,
        map: new Map(),
      });
    });

    test('should return flat hierarchy if kind is not separated', () => {
      const stories = [
        {
          kind: 'some.name.item1',
          namespaces: ['some.name.item1'],
          stories: ['a1', 'a2'],
        },
        {
          kind: 'another.space.20',
          namespaces: ['another.space.20'],
          stories: ['b1', 'b2'],
        },
      ];

      const result = createHierarchies(stories);

      const expected = [
        [
          'some.name.item1',
          {
            kind: 'some.name.item1',
            name: 'some.name.item1',
            namespaces: ['some.name.item1'],
            highlight: null,
            isNamespace: true,
            map: new Map(),
            stories: [{ name: 'a1', highlight: null }, { name: 'a2', highlight: null }],
          },
        ],
        [
          'another.space.20',
          {
            kind: 'another.space.20',
            name: 'another.space.20',
            namespaces: ['another.space.20'],
            highlight: null,
            isNamespace: true,
            map: new Map(),
            stories: [{ name: 'b1', highlight: null }, { name: 'b2', highlight: null }],
          },
        ],
      ];

      expect(result).toHaveLength(1);
      expect(result[0].map).toEqual(new Map(expected));
    });

    test('should return hierarchy if kind is separated', () => {
      const stories = [
        {
          kind: 'some.name.item1',
          namespaces: ['some', 'name', 'item1'],
          stories: ['a1', 'a2'],
        },
        {
          kind: 'another.space.20',
          namespaces: ['another', 'space', '20'],
          stories: ['b1', 'b2'],
        },
      ];

      const result = createHierarchies(stories, '\\.');

      const expected = new Map([
        [
          'some',
          {
            name: 'some',
            isNamespace: true,
            highlight: null,
            namespaces: ['some'],
            map: new Map([
              [
                'name',
                {
                  name: 'name',
                  isNamespace: true,
                  highlight: null,
                  namespaces: ['some', 'name'],
                  map: new Map([
                    [
                      'item1',
                      {
                        kind: 'some.name.item1',
                        name: 'item1',
                        namespaces: ['some', 'name', 'item1'],
                        isNamespace: true,
                        highlight: null,
                        map: new Map(),
                        stories: [{ name: 'a1', highlight: null }, { name: 'a2', highlight: null }],
                      },
                    ],
                  ]),
                },
              ],
            ]),
          },
        ],
        [
          'another',
          {
            name: 'another',
            isNamespace: true,
            highlight: null,
            namespaces: ['another'],
            map: new Map([
              [
                'space',
                {
                  name: 'space',
                  isNamespace: true,
                  highlight: null,
                  namespaces: ['another', 'space'],
                  map: new Map([
                    [
                      '20',
                      {
                        kind: 'another.space.20',
                        name: '20',
                        namespaces: ['another', 'space', '20'],
                        isNamespace: true,
                        highlight: null,
                        map: new Map(),
                        stories: [{ name: 'b1', highlight: null }, { name: 'b2', highlight: null }],
                      },
                    ],
                  ]),
                },
              ],
            ]),
          },
        ],
      ]);

      expect(result).toHaveLength(1);
      expect(result[0].map).toEqual(expected);
    });

    test('should return multiple roots with main root first when different root names are given', () => {
      const stories = [
        {
          kind: 'second|some.name.item1',
          rootName: 'second',
          namespaces: ['some.name.item1'],
          stories: ['a1', 'a2'],
        },
        {
          kind: 'another.space.20',
          rootName: '', // main
          namespaces: ['another.space.20'],
          stories: ['b1', 'b2'],
        },
      ];

      const result = createHierarchies(stories);

      const expectedMain = [
        [
          'another.space.20',
          {
            kind: 'another.space.20',
            name: 'another.space.20',
            namespaces: ['another.space.20'],
            highlight: null,
            isNamespace: true,
            map: new Map(),
            stories: [{ name: 'b1', highlight: null }, { name: 'b2', highlight: null }],
          },
        ],
      ];

      const expectedSecond = [
        [
          'some.name.item1',
          {
            kind: 'second|some.name.item1',
            name: 'some.name.item1',
            namespaces: ['some.name.item1'],
            highlight: null,
            isNamespace: true,
            map: new Map(),
            stories: [{ name: 'a1', highlight: null }, { name: 'a2', highlight: null }],
          },
        ],
      ];

      expect(result).toHaveLength(2);
      expect(result[0].map).toEqual(new Map(expectedMain));
      expect(result[1].map).toEqual(new Map(expectedSecond));
    });
  });

  describe('resolveStoryHierarchy', () => {
    test('should return array with initial namespace when hierarchySeparator is undefined', () => {
      const result = resolveStoryHierarchy('some.name.item1');

      expect(result).toEqual(['some.name.item1']);
    });

    test('should return array with separated namespaces when hierarchySeparator is defined', () => {
      const result = resolveStoryHierarchy('some/name.item1', '\\.|\\/');

      expect(result).toEqual(['some', 'name', 'item1']);
    });
  });

  describe('resolveStoryHierarchyRoots', () => {
    test('should return empty root name when hierarchyRootSeparator is undefined', () => {
      const { rootName, storyName } = resolveStoryHierarchyRoots('some|name.item1');

      expect(rootName).toEqual('');
      expect(storyName).toEqual('some|name.item1');
    });

    test('should return array with separated root name and story name when hierarchyRootSeparator is defined', () => {
      const { rootName, storyName } = resolveStoryHierarchyRoots('some|name.item1', '\\|');

      expect(rootName).toEqual('some');
      expect(storyName).toEqual('name.item1');
    });

    test('should throw error when hierarchyRootSeparator is found multiple times', () => {
      expect(() => {
        resolveStoryHierarchyRoots('some|name|item1', '\\|');
      }).toThrow();
    });
  });

  describe('prepareStoriesForHierarchy', () => {
    test('should return null when nothing provided', () => {
      const result = prepareStoriesForHierarchy();

      expect(result).toBe(null);
    });

    test('should return kind in namespaces when separator is not provided', () => {
      const stories = [{ kind: 'some.name.item1' }, { kind: 'another.space.20' }];

      const result = prepareStoriesForHierarchy(stories);

      expect(result).toEqual([
        { kind: 'some.name.item1', namespaces: ['some.name.item1'], rootName: '' },
        { kind: 'another.space.20', namespaces: ['another.space.20'], rootName: '' },
      ]);
    });

    test('should return separated namespaces when separator is provided', () => {
      const stories = [{ kind: 'some.name.item1' }, { kind: 'another.space.20' }];

      const result = prepareStoriesForHierarchy(stories, '\\.');

      expect(result).toEqual([
        { kind: 'some.name.item1', namespaces: ['some', 'name', 'item1'], rootName: '' },
        { kind: 'another.space.20', namespaces: ['another', 'space', '20'], rootName: '' },
      ]);
    });

    test('should return filled root name when root separator is provided', () => {
      const stories = [{ kind: 'some.name.item1' }, { kind: 'another|space.20' }];

      const result = prepareStoriesForHierarchy(stories, '\\.', '\\|');

      expect(result).toEqual([
        { kind: 'some.name.item1', namespaces: ['some', 'name', 'item1'], rootName: '' },
        { kind: 'another|space.20', namespaces: ['space', '20'], rootName: 'another' },
      ]);
    });
  });
});
