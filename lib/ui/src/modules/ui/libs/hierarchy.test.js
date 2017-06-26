import { createHierarchy, isSelectedHierarchy, resolveStoryHierarchy } from './hierarchy';

describe('manager.ui.libs.hierarchy', () => {
  describe('createHierarchy', () => {
    test('should return root hierarchy node if stories are undefined', () => {
      const result = createHierarchy();

      expect(result).toEqual({
        namespaces: [],
        current: '',
        map: new Map(),
      });
    });

    test('should return root hierarchy node if stories are empty', () => {
      const result = createHierarchy([]);

      expect(result).toEqual({
        namespaces: [],
        current: '',
        map: new Map(),
      });
    });

    test('should return flat hierarchy if hierarchySeparator is undefined', () => {
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

    test('should return hierarchy if hierarchySeparator is defined', () => {
      const stories = [
        { kind: 'some.name.item1', stories: ['a1', 'a2'] },
        { kind: 'another.space.20', stories: ['b1', 'b2'] },
      ];

      const result = createHierarchy(stories, '\\.');

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

  describe('isSelectedHierarchy', () => {
    test('no parameters', () => {
      const result = isSelectedHierarchy();

      expect(result).toBeFalsy();
    });

    test('namespaces array is bigger then selectedHierarchy array', () => {
      const namespaces = ['some', 'namespace', 'here', 'it', 'is'];
      const selectedHierarchy = ['some', 'namespace'];

      const result = isSelectedHierarchy(namespaces, selectedHierarchy);

      expect(result).toBeFalsy();
    });

    test('namespaces array is not matching selectedHierarchy array', () => {
      const namespaces = ['some', 'namespace'];
      const selectedHierarchy = ['some', 'namespace2'];

      const result = isSelectedHierarchy(namespaces, selectedHierarchy);

      expect(result).toBeFalsy();
    });

    test('namespaces array is matching selectedHierarchy array', () => {
      const namespaces = ['some', 'namespace'];
      const selectedHierarchy = ['some', 'namespace'];

      const result = isSelectedHierarchy(namespaces, selectedHierarchy);

      expect(result).toBeTruthy();
    });

    test('namespaces array is matching selectedHierarchy array when selectedHierarchy is bigger', () => {
      const namespaces = ['some', 'namespace'];
      const selectedHierarchy = ['some', 'namespace', 'here', 'it', 'is'];

      const result = isSelectedHierarchy(namespaces, selectedHierarchy);

      expect(result).toBeTruthy();
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
});
