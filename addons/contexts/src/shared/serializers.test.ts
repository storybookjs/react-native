import { deserialize, serialize } from './serializers';

describe('Test on serializers', () => {
  // given
  const someContextsQueryParam = 'CSS Themes=Forests,Languages=Fr';
  const someSelectionState = {
    'CSS Themes': 'Forests',
    Languages: 'Fr',
  };

  it('Should deserialize a string representation into the represented selection state', () => {
    expect(deserialize('')).toEqual(null);
    expect(deserialize('An invalid string=')).toEqual(null);
    expect(deserialize(someContextsQueryParam)).toEqual(someSelectionState);
  });

  it('Should serialize selection state into its string representation', () => {
    expect(serialize(null)).toEqual(null);
    expect(serialize(someSelectionState)).toEqual(someContextsQueryParam);
  });
});
