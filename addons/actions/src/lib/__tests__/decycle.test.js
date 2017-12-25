import decycle from '../decycle';
import example from '../__mocks__/example';

describe('Decycle', () => {
  it('can handle cyclic object', () => {
    expect(decycle(example.input)).toEqual(example.output);
  });
});
