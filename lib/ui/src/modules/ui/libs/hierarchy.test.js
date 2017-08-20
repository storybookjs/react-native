import { createHierarchy, resolveStoryHierarchy, prepareStoriesForHierarchy } from './hierarchy';

describe('manager.ui.libs.hierarchy', () => {
  describe('createHierarchy', () => {
    test('should return root hierarchy node if stories are undefined', () => {
      const result = createHierarchy();

      expect(result).toEqual({
        namespaces: [],
        name: '',
        isNamespace: true,
        map: new Map(),
      });
    });

    test('should return root hierarchy node if stories are empty', () => {
      const result = createHierarchy([]);

      expect(result).toEqual({
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

      const result = createHierarchy(stories);

      const expected = [
        [
          'some.name.item1',
          [
            {
              kind: 'some.name.item1',
              name: 'some.name.item1',
              highlight: null,
              namespaces: ['some.name.item1'],
              stories: [{ name: 'a1', highlight: null }, { name: 'a2', highlight: null }],
            },
          ],
        ],
        [
          'another.space.20',
          [
            {
              kind: 'another.space.20',
              name: 'another.space.20',
              highlight: null,
              namespaces: ['another.space.20'],
              stories: [{ name: 'b1', highlight: null }, { name: 'b2', highlight: null }],
            },
          ],
        ],
      ];

      expect(result.map).toEqual(new Map(expected));
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

      const result = createHierarchy(stories, '\\.');

      const expected = new Map([
        [
          'some',
          [
            {
              name: 'some',
              isNamespace: true,
              highlight: null,
              namespaces: ['some'],
              map: new Map([
                [
                  'name',
                  [
                    {
                      name: 'name',
                      isNamespace: true,
                      highlight: null,
                      namespaces: ['some', 'name'],
                      map: new Map([
                        [
                          'item1',
                          [
                            {
                              kind: 'some.name.item1',
                              name: 'item1',
                              highlight: null,
                              namespaces: ['some', 'name', 'item1'],
                              stories: [
                                { name: 'a1', highlight: null },
                                { name: 'a2', highlight: null },
                              ],
                            },
                          ],
                        ],
                      ]),
                    },
                  ],
                ],
              ]),
            },
          ],
        ],
        [
          'another',
          [
            {
              name: 'another',
              isNamespace: true,
              highlight: null,
              namespaces: ['another'],
              map: new Map([
                [
                  'space',
                  [
                    {
                      name: 'space',
                      isNamespace: true,
                      highlight: null,
                      namespaces: ['another', 'space'],
                      map: new Map([
                        [
                          '20',
                          [
                            {
                              kind: 'another.space.20',
                              name: '20',
                              highlight: null,
                              namespaces: ['another', 'space', '20'],
                              stories: [
                                { name: 'b1', highlight: null },
                                { name: 'b2', highlight: null },
                              ],
                            },
                          ],
                        ],
                      ]),
                    },
                  ],
                ],
              ]),
            },
          ],
        ],
      ]);

      expect(result.map).toEqual(expected);
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

  describe('prepareStoriesForHierarchy', () => {
    test('should return null when nothing provided', () => {
      const result = prepareStoriesForHierarchy();

      expect(result).toBe(null);
    });

    test('should return kind in namespaces when separator is not provided', () => {
      const stories = [{ kind: 'some.name.item1' }, { kind: 'another.space.20' }];

      const result = prepareStoriesForHierarchy(stories);

      expect(result).toEqual([
        { kind: 'some.name.item1', namespaces: ['some.name.item1'] },
        { kind: 'another.space.20', namespaces: ['another.space.20'] },
      ]);
    });

    test('should return separated namespaces when separator is provided', () => {
      const stories = [{ kind: 'some.name.item1' }, { kind: 'another.space.20' }];

      const result = prepareStoriesForHierarchy(stories, '\\.');

      expect(result).toEqual([
        { kind: 'some.name.item1', namespaces: ['some', 'name', 'item1'] },
        { kind: 'another.space.20', namespaces: ['another', 'space', '20'] },
      ]);
    });
  });
});
