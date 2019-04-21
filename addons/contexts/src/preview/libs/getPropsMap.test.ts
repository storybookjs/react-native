import { _getPropsByParamName, getPropsMap } from './getPropsMap';
import { OPT_OUT } from '../../constants';

describe('Test on behaviors from collecting the propsMap', () => {
  const someParams = [{ name: 'A', props: {} }, { name: 'B', props: {} }];

  it('should return "null" when params in 0 length', () => {
    const result = _getPropsByParamName([]);
    expect(result).toBe(null);
  });

  it('should return "OPT_OUT" token when the context being opted out', () => {
    const result = _getPropsByParamName(someParams, OPT_OUT);
    expect(result).toBe(OPT_OUT);
  });

  it('should return the props from params when the name existed', () => {
    const target = {};
    const result = _getPropsByParamName([...someParams, { name: 'C', props: target }], 'C');
    expect(result).toBe(target);
  });

  it('should otherwise fallback to default props in params for a bad name', () => {
    const target = {};
    const result = _getPropsByParamName(
      [...someParams, { name: 'C', props: target, default: true }],
      'X'
    );
    expect(result).toBe(target);
  });

  it('should otherwise fallback to the first props in params for a bad name, if no marked default props', () => {
    const result = _getPropsByParamName(someParams, 'A');
    expect(result).toBe(someParams[0].props);
  });
});

describe('Test on the integrity of the method to get the propMaps', () => {
  it('should return the correct propsMap from the specified selectionState', () => {
    // setup
    const someContextNodes = [
      {
        components: ['div'],
        icon: 'box' as const,
        nodeId: 'Some Context',
        options: { cancelable: false, deep: false, disable: false },
        params: [{ name: 'A1', props: { a: 1 } }, { name: 'A2', props: { a: 2 }, default: true }],
        title: 'Some Context',
      },
      {
        components: ['div'],
        icon: 'box' as const,
        nodeId: 'Another Context',
        options: { cancelable: false, deep: false, disable: false },
        params: [{ name: 'B', props: { b: 1 } }],
        title: 'Another Context',
      },
      {
        components: ['span'],
        icon: 'box' as const,
        nodeId: 'Other Contexts',
        options: { cancelable: false, deep: false, disable: false },
        params: [{ name: 'C', props: { c: 1 } }],
        title: 'Other Contexts',
      },
    ];
    const someSelectionState = {
      'Some Context': 'A1',
      'Another Context': OPT_OUT,
    };

    // exercise
    const result = getPropsMap(someContextNodes, someSelectionState);

    // assertion
    expect(result).toEqual({
      'Some Context': { a: 1 },
      'Another Context': OPT_OUT,
      'Other Contexts': { c: 1 },
    });
  });
});
