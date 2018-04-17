import { config } from '../configureActions';
import { configureActions } from '../../';

describe('Configure Actions', () => {
  it('can configure actions', () => {
    const depth = 100;

    configureActions({
      depth,
    });

    expect(config).toEqual({
      depth,
    });
  });
});
