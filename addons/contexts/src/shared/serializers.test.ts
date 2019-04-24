import { deserialize, serialize } from './serializers';

describe('Test on serializers', () => {
  const someContextsQueryParam = 'CSS Themes=Forests,Languages=Fr';
  const someSelectionState = {
    'CSS Themes': 'Forests',
    Languages: 'Fr',
  };

  it('Should serialize selection state into its string representation', () => {
    expect(serialize(null)).toEqual(null);
    expect(serialize(someSelectionState)).toEqual(someContextsQueryParam);
  });

  it('Should deserialize a string representation into the represented selection state', () => {
    expect(deserialize('')).toEqual(undefined);
    expect(deserialize(someContextsQueryParam)).toEqual(someSelectionState);
  });
});
