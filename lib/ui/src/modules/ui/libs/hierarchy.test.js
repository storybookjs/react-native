import createHierarchy from './hierarchy';

describe('manager.ui.libs.hierarchy', () => {
  describe('should return root hierarchy node if stories are undefined', () => {
    test('', () => {
      const result = createHierarchy();

      expect(result).toEqual({
        namespaces: [],
        current: '',
        map: new Map(),
      });
    });
  });

  describe('should return root hierarchy node if stories are empty', () => {
    test('', () => {
      const result = createHierarchy([]);

      expect(result).toEqual({
        namespaces: [],
        current: '',
        map: new Map(),
      });
    });
  });

  describe('should return flat hierarchy if resolve function is undefined', () => {
    test('', () => {
      const stories = [
        { kind: 'some.name.item1', stories: ['a1', 'a2'] },
        { kind: 'another.space.20', stories: ['b1', 'b2'] },
      ];

      const result = createHierarchy(stories);

      const expected = [
        [
          'some.name.item1',
          [
            {
              kind: 'some.name.item1',
              name: 'some.name.item1',
              namespaces: ['some.name.item1'],
              stories: ['a1', 'a2'],
            },
          ],
        ],
        [
          'another.space.20',
          [
            {
              kind: 'another.space.20',
              name: 'another.space.20',
              namespaces: ['another.space.20'],
              stories: ['b1', 'b2'],
            },
          ],
        ],
      ];

      expect(result.map).toEqual(new Map(expected));
    });
  });

  describe('should return hierarchy if resolve function is defined', () => {
    test('', () => {
      const stories = [
        { kind: 'some.name.item1', stories: ['a1', 'a2'] },
        { kind: 'another.space.20', stories: ['b1', 'b2'] },
      ];

      const result = createHierarchy(stories, name => name.split('.'));

      const expected = new Map([
        [
          'some',
          [
            {
              current: 'some',
              firstKind: 'some.name.item1',
              isNamespace: true,
              namespaces: ['some'],
              map: new Map([
                [
                  'name',
                  [
                    {
                      current: 'name',
                      firstKind: 'some.name.item1',
                      isNamespace: true,
                      namespaces: ['some', 'name'],
                      map: new Map([
                        [
                          'item1',
                          [
                            {
                              kind: 'some.name.item1',
                              name: 'item1',
                              namespaces: ['some', 'name', 'item1'],
                              stories: ['a1', 'a2'],
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
              current: 'another',
              firstKind: 'another.space.20',
              isNamespace: true,
              namespaces: ['another'],
              map: new Map([
                [
                  'space',
                  [
                    {
                      current: 'space',
                      firstKind: 'another.space.20',
                      isNamespace: true,
                      namespaces: ['another', 'space'],
                      map: new Map([
                        [
                          '20',
                          [
                            {
                              kind: 'another.space.20',
                              name: '20',
                              namespaces: ['another', 'space', '20'],
                              stories: ['b1', 'b2'],
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
});
