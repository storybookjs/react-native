import { config } from '../configureActions';
import { configureActions } from '../../';

describe('Configure Actions', () => {
  it('can configure actions', () => {
    const depth = 100;
    const clearActionLogger = true;

    configureActions({
      depth,
      clearActionLogger,
    });

    expect(config).toEqual({
      depth,
      clearActionLogger,
    });
  });
});
