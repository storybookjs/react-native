import muteProperty from '../muteProperty';

describe('muteProperty', () => {
  it('mutes property', () => {
    expect(Object.keys(muteProperty('key', { key: 1 }))).toEqual([]);
  });
});
